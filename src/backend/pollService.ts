// ============================================================================
// VoteGenerator - Poll Service
// Handles poll creation, validation, and management
// ============================================================================

import { 
  Poll, 
  PollType, 
  PlanTier, 
  CreatePollRequest, 
  PollOption,
  PLAN_LIMITS,
  TextOption,
  ImageOption,
  DateOption,
  QuizOption,
  SentimentOption,
} from './types';
import { 
  storage, 
  generateId, 
  generateAdminToken, 
  generateShortCode 
} from './storage';

// ----------------------------------------------------------------------------
// Poll Validation
// ----------------------------------------------------------------------------

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePollType(type: PollType, tier: PlanTier): ValidationResult {
  const limits = PLAN_LIMITS[tier];
  const errors: string[] = [];
  
  if (!limits.pollTypes.includes(type)) {
    errors.push(`Poll type "${type}" is not available on the ${tier} plan`);
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateOptions(
  options: CreatePollRequest['options'],
  type: PollType
): ValidationResult {
  const errors: string[] = [];
  
  if (!options || options.length < 2) {
    errors.push('At least 2 options are required');
  }
  
  if (options && options.length > 20) {
    errors.push('Maximum 20 options allowed');
  }
  
  // Type-specific validation
  switch (type) {
    case 'this-or-that':
      if (options && options.length !== 2) {
        errors.push('This or That polls require exactly 2 options');
      }
      break;
      
    case 'visual-poll':
      if (options) {
        for (const opt of options) {
          if (!opt.imageUrl) {
            errors.push('Visual polls require an image for each option');
            break;
          }
        }
      }
      break;
      
    case 'quiz-poll':
      if (options) {
        const hasCorrect = options.some(o => o.isCorrect);
        if (!hasCorrect) {
          errors.push('Quiz polls require at least one correct answer');
        }
      }
      break;
      
    case 'sentiment-check':
      if (options) {
        for (const opt of options) {
          if (!opt.emoji) {
            errors.push('Sentiment polls require an emoji for each option');
            break;
          }
        }
      }
      break;
      
    case 'meeting-poll':
      if (options) {
        for (const opt of options) {
          if (!opt.date) {
            errors.push('Meeting polls require a date for each option');
            break;
          }
        }
      }
      break;
  }
  
  return { valid: errors.length === 0, errors };
}

export function validatePoll(request: CreatePollRequest, tier: PlanTier): ValidationResult {
  const errors: string[] = [];
  
  // Question validation
  if (!request.question || request.question.trim().length === 0) {
    errors.push('Question is required');
  }
  if (request.question && request.question.length > 500) {
    errors.push('Question must be 500 characters or less');
  }
  
  // Description validation
  if (request.description && request.description.length > 2000) {
    errors.push('Description must be 2000 characters or less');
  }
  
  // Type validation
  const typeValidation = validatePollType(request.type, tier);
  errors.push(...typeValidation.errors);
  
  // Options validation
  const optionsValidation = validateOptions(request.options, request.type);
  errors.push(...optionsValidation.errors);
  
  return { valid: errors.length === 0, errors };
}

// ----------------------------------------------------------------------------
// Poll Creation
// ----------------------------------------------------------------------------

export interface CreatePollResult {
  success: boolean;
  poll?: Poll;
  adminUrl?: string;
  voterUrl?: string;
  errors?: string[];
}

export async function createPoll(
  request: CreatePollRequest,
  tier: PlanTier = 'free'
): Promise<CreatePollResult> {
  // Validate
  const validation = validatePoll(request, tier);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }
  
  // Get plan limits
  const limits = PLAN_LIMITS[tier];
  
  // Generate IDs
  const pollId = generateId();
  const adminToken = generateAdminToken();
  
  // Create options with IDs
  const options: PollOption[] = request.options.map((opt, index) => {
    const baseOption = {
      id: generateId(),
      order: index,
    };
    
    switch (request.type) {
      case 'visual-poll':
        return {
          ...baseOption,
          text: opt.text,
          imageUrl: opt.imageUrl!,
        } as ImageOption;
        
      case 'meeting-poll':
        return {
          ...baseOption,
          date: opt.date!,
          startTime: opt.text?.split('-')[0]?.trim(),
          endTime: opt.text?.split('-')[1]?.trim(),
        } as DateOption;
        
      case 'quiz-poll':
        return {
          ...baseOption,
          text: opt.text,
          isCorrect: opt.isCorrect || false,
          explanation: opt.emoji, // Reusing emoji field for explanation
        } as QuizOption;
        
      case 'sentiment-check':
        return {
          ...baseOption,
          emoji: opt.emoji!,
          label: opt.text,
        } as SentimentOption;
        
      default:
        return {
          ...baseOption,
          text: opt.text,
        } as TextOption;
    }
  });
  
  // Calculate expiration
  let expiresAt: string | undefined;
  if (limits.durationDays) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + limits.durationDays);
    expiresAt = expDate.toISOString();
  }
  
  // Create poll object
  const poll: Poll = {
    id: pollId,
    adminToken,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    
    type: request.type,
    question: request.question.trim(),
    description: request.description?.trim(),
    options,
    
    settings: {
      showResults: request.settings?.showResults || 'after_vote',
      allowComments: request.settings?.allowComments || false,
      anonymousVoting: request.settings?.anonymousVoting ?? true,
      ...getDefaultSettingsForType(request.type, request.settings),
    },
    
    theme: {
      preset: request.theme?.preset || 'classic',
      customColor: request.theme?.customColor,
    },
    
    branding: {
      showAds: !limits.features.removeAds,
      showPoweredBy: !limits.features.removeBranding,
      thankYouMessage: request.branding?.thankYouMessage,
      thankYouRedirectUrl: limits.features.thankYouRedirect 
        ? request.branding?.thankYouRedirectUrl 
        : undefined,
    },
    
    protection: {
      browserProtection: true,
      ipProtection: limits.features.ipProtection && (request.settings as any)?.ipProtection,
      uniqueCodes: {
        enabled: false,
        codes: [],
        usedCodes: [],
      },
    },
    
    plan: {
      tier,
      maxResponses: limits.maxResponses,
      expiresAt,
      features: limits.features,
      purchaseId: request.purchaseId,
    },
    
    ownerId: request.ownerId,
    viewCount: 0,
    shareCount: 0,
  };
  
  // Save poll
  await storage.savePoll(poll);
  
  // Initialize vote aggregate
  await storage.initializeVoteAggregate(pollId);
  
  // Generate URLs
  const baseUrl = process.env.URL || 'https://votegenerator.com';
  const voterUrl = `${baseUrl}/v/${pollId}`;
  const adminUrl = `${baseUrl}/admin/${pollId}/${adminToken}`;
  
  return {
    success: true,
    poll,
    voterUrl,
    adminUrl,
  };
}

// ----------------------------------------------------------------------------
// Default Settings by Poll Type
// ----------------------------------------------------------------------------

function getDefaultSettingsForType(
  type: PollType,
  customSettings?: Partial<any>
): Partial<any> {
  switch (type) {
    case 'multiple-choice':
    case 'approval-voting':
      return {
        allowMultiple: type === 'approval-voting',
        maxSelections: customSettings?.maxSelections,
      };
      
    case 'ranked-choice':
      return {
        algorithm: customSettings?.algorithm || 'instant-runoff',
        minRankings: customSettings?.minRankings,
        maxRankings: customSettings?.maxRankings,
      };
      
    case 'meeting-poll':
      return {
        timezone: customSettings?.timezone || 'UTC',
        allowMaybe: customSettings?.allowMaybe ?? true,
      };
      
    case 'dot-voting':
      return {
        totalPoints: customSettings?.totalPoints || 10,
        maxPointsPerOption: customSettings?.maxPointsPerOption,
      };
      
    case 'rating-scale':
      return {
        minRating: customSettings?.minRating || 1,
        maxRating: customSettings?.maxRating || 5,
        showLabels: customSettings?.showLabels ?? true,
        lowLabel: customSettings?.lowLabel || 'Poor',
        highLabel: customSettings?.highLabel || 'Excellent',
      };
      
    case 'buy-a-feature':
      return {
        totalBudget: customSettings?.totalBudget || 100,
        currency: customSettings?.currency || '$',
      };
      
    case 'priority-matrix':
      return {
        xAxisLabel: customSettings?.xAxisLabel || 'Effort',
        yAxisLabel: customSettings?.yAxisLabel || 'Impact',
        xAxisLow: customSettings?.xAxisLow || 'Low',
        xAxisHigh: customSettings?.xAxisHigh || 'High',
        yAxisLow: customSettings?.yAxisLow || 'Low',
        yAxisHigh: customSettings?.yAxisHigh || 'High',
      };
      
    case 'quiz-poll':
      return {
        showCorrectAfterVote: customSettings?.showCorrectAfterVote ?? true,
        showExplanations: customSettings?.showExplanations ?? true,
        trackScores: customSettings?.trackScores ?? true,
      };
      
    case 'sentiment-check':
      return {
        showPercentages: customSettings?.showPercentages ?? true,
      };
      
    default:
      return {};
  }
}

// ----------------------------------------------------------------------------
// Poll Retrieval
// ----------------------------------------------------------------------------

export interface GetPollResult {
  success: boolean;
  poll?: Poll;
  error?: string;
}

export async function getPollForVoting(pollId: string): Promise<GetPollResult> {
  const poll = await storage.getPoll(pollId);
  
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  if (poll.status === 'closed') {
    return { success: false, error: 'Poll is closed' };
  }
  
  if (poll.status === 'archived') {
    return { success: false, error: 'Poll has been archived' };
  }
  
  // Check expiration
  if (poll.plan.expiresAt && new Date(poll.plan.expiresAt) < new Date()) {
    // Auto-close expired polls
    await storage.updatePoll(pollId, { status: 'closed' });
    return { success: false, error: 'Poll has expired' };
  }
  
  // Increment view count
  await storage.updatePoll(pollId, { viewCount: poll.viewCount + 1 });
  
  // Return poll without admin token
  const publicPoll = { ...poll };
  delete (publicPoll as any).adminToken;
  
  return { success: true, poll: publicPoll };
}

export async function getPollForAdmin(
  pollId: string,
  adminToken: string
): Promise<GetPollResult> {
  const poll = await storage.getPoll(pollId);
  
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  if (poll.adminToken !== adminToken) {
    return { success: false, error: 'Invalid admin token' };
  }
  
  return { success: true, poll };
}

// ----------------------------------------------------------------------------
// Poll Management
// ----------------------------------------------------------------------------

export async function closePoll(
  pollId: string,
  adminToken: string
): Promise<{ success: boolean; error?: string }> {
  const poll = await storage.getPoll(pollId);
  
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  if (poll.adminToken !== adminToken) {
    return { success: false, error: 'Invalid admin token' };
  }
  
  await storage.updatePoll(pollId, { status: 'closed' });
  return { success: true };
}

export async function reopenPoll(
  pollId: string,
  adminToken: string
): Promise<{ success: boolean; error?: string }> {
  const poll = await storage.getPoll(pollId);
  
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  if (poll.adminToken !== adminToken) {
    return { success: false, error: 'Invalid admin token' };
  }
  
  // Check if poll is expired
  if (poll.plan.expiresAt && new Date(poll.plan.expiresAt) < new Date()) {
    return { success: false, error: 'Cannot reopen expired poll' };
  }
  
  await storage.updatePoll(pollId, { status: 'active' });
  return { success: true };
}

export async function updatePollSettings(
  pollId: string,
  adminToken: string,
  updates: {
    question?: string;
    description?: string;
    settings?: Partial<any>;
    theme?: Partial<any>;
    branding?: Partial<any>;
  }
): Promise<{ success: boolean; poll?: Poll; error?: string }> {
  const poll = await storage.getPoll(pollId);
  
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  if (poll.adminToken !== adminToken) {
    return { success: false, error: 'Invalid admin token' };
  }
  
  const updatedPoll = await storage.updatePoll(pollId, {
    question: updates.question || poll.question,
    description: updates.description ?? poll.description,
    settings: { ...poll.settings, ...updates.settings },
    theme: { ...poll.theme, ...updates.theme },
    branding: { ...poll.branding, ...updates.branding },
  });
  
  return { success: true, poll: updatedPoll || undefined };
}

export async function deletePoll(
  pollId: string,
  adminToken: string
): Promise<{ success: boolean; error?: string }> {
  const poll = await storage.getPoll(pollId);
  
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  if (poll.adminToken !== adminToken) {
    return { success: false, error: 'Invalid admin token' };
  }
  
  await storage.deletePoll(pollId);
  return { success: true };
}

// ----------------------------------------------------------------------------
// Custom Short Links (Pro+)
// ----------------------------------------------------------------------------

export async function setCustomShortLink(
  pollId: string,
  adminToken: string,
  shortCode: string
): Promise<{ success: boolean; error?: string }> {
  const poll = await storage.getPoll(pollId);
  
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  if (poll.adminToken !== adminToken) {
    return { success: false, error: 'Invalid admin token' };
  }
  
  if (!poll.plan.features.customShortLink) {
    return { success: false, error: 'Custom short links require Pro+ plan' };
  }
  
  // Validate short code
  if (!/^[a-z0-9-]{3,30}$/.test(shortCode)) {
    return { success: false, error: 'Short code must be 3-30 lowercase letters, numbers, or hyphens' };
  }
  
  // Check if already taken
  const existing = await storage.getPollByShortCode(shortCode);
  if (existing && existing.id !== pollId) {
    return { success: false, error: 'Short code is already taken' };
  }
  
  await storage.updatePoll(pollId, { shortCode });
  return { success: true };
}

// ----------------------------------------------------------------------------
// Unique Voting Codes (Pro+)
// ----------------------------------------------------------------------------

export async function generateVotingCodes(
  pollId: string,
  adminToken: string,
  count: number
): Promise<{ success: boolean; codes?: string[]; error?: string }> {
  const poll = await storage.getPoll(pollId);
  
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  if (poll.adminToken !== adminToken) {
    return { success: false, error: 'Invalid admin token' };
  }
  
  if (!poll.plan.features.uniqueCodes) {
    return { success: false, error: 'Unique voting codes require Pro+ plan' };
  }
  
  if (count < 1 || count > 1000) {
    return { success: false, error: 'Can generate 1-1000 codes at a time' };
  }
  
  // Generate codes
  const codes: string[] = [];
  const existingCodes = new Set(poll.protection.uniqueCodes.codes);
  
  while (codes.length < count) {
    const code = generateShortCode().toUpperCase();
    if (!existingCodes.has(code)) {
      codes.push(code);
      existingCodes.add(code);
    }
  }
  
  // Update poll
  await storage.updatePoll(pollId, {
    protection: {
      ...poll.protection,
      uniqueCodes: {
        ...poll.protection.uniqueCodes,
        enabled: true,
        codes: [...poll.protection.uniqueCodes.codes, ...codes],
      },
    },
  });
  
  return { success: true, codes };
}

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export const pollService = {
  validatePoll,
  validatePollType,
  validateOptions,
  createPoll,
  getPollForVoting,
  getPollForAdmin,
  closePoll,
  reopenPoll,
  updatePollSettings,
  deletePoll,
  setCustomShortLink,
  generateVotingCodes,
};

export default pollService;