// ============================================================================
// VoteGenerator - Vote Service
// Handles vote submission, validation, and results retrieval
// ============================================================================

import {
  Vote,
  Poll,
  VoteAggregate,
  SubmitVoteRequest,
  PollResults,
  MultipleChoiceVote,
  RankedVote,
  MeetingVote,
  DotVote,
  RatingVote,
  MatrixVote,
  QuizVote,
  SentimentVote,
  VisualVote,
  DeviceType,
} from './types';
import { storage, generateId, hashForProtection } from './storage';

// ----------------------------------------------------------------------------
// Vote Validation
// ----------------------------------------------------------------------------

export interface VoteValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateVote(
  request: SubmitVoteRequest,
  poll: Poll
): VoteValidationResult {
  const errors: string[] = [];
  
  // Check poll status
  if (poll.status !== 'active') {
    errors.push('Poll is not accepting votes');
    return { valid: false, errors };
  }
  
  // Check expiration
  if (poll.plan.expiresAt && new Date(poll.plan.expiresAt) < new Date()) {
    errors.push('Poll has expired');
    return { valid: false, errors };
  }
  
  // Validate based on poll type
  switch (poll.type) {
    case 'multiple-choice':
    case 'this-or-that':
    case 'visual-poll': {
      if (!request.selectedOptions || request.selectedOptions.length === 0) {
        errors.push('Please select at least one option');
      }
      
      const settings = poll.settings as any;
      if (!settings.allowMultiple && request.selectedOptions && request.selectedOptions.length > 1) {
        errors.push('Only one selection allowed');
      }
      
      if (settings.maxSelections && request.selectedOptions && 
          request.selectedOptions.length > settings.maxSelections) {
        errors.push(`Maximum ${settings.maxSelections} selections allowed`);
      }
      
      // Validate option IDs exist
      const optionIds = new Set(poll.options.map(o => o.id));
      for (const id of request.selectedOptions || []) {
        if (!optionIds.has(id)) {
          errors.push('Invalid option selected');
          break;
        }
      }
      break;
    }
    
    case 'approval-voting': {
      if (!request.selectedOptions || request.selectedOptions.length === 0) {
        errors.push('Please select at least one option');
      }
      
      // Validate option IDs exist
      const optionIds = new Set(poll.options.map(o => o.id));
      for (const id of request.selectedOptions || []) {
        if (!optionIds.has(id)) {
          errors.push('Invalid option selected');
          break;
        }
      }
      break;
    }
    
    case 'ranked-choice': {
      if (!request.rankings || request.rankings.length === 0) {
        errors.push('Please rank at least one option');
      }
      
      const settings = poll.settings as any;
      if (settings.minRankings && request.rankings && 
          request.rankings.length < settings.minRankings) {
        errors.push(`Please rank at least ${settings.minRankings} options`);
      }
      
      // Check for duplicates
      if (request.rankings) {
        const seen = new Set<string>();
        for (const id of request.rankings) {
          if (seen.has(id)) {
            errors.push('Cannot rank the same option twice');
            break;
          }
          seen.add(id);
        }
      }
      
      // Validate option IDs exist
      const optionIds = new Set(poll.options.map(o => o.id));
      for (const id of request.rankings || []) {
        if (!optionIds.has(id)) {
          errors.push('Invalid option in rankings');
          break;
        }
      }
      break;
    }
    
    case 'meeting-poll': {
      if (!request.availability || Object.keys(request.availability).length === 0) {
        errors.push('Please indicate your availability');
      }
      
      // Validate responses
      const validResponses = ['yes', 'no', 'maybe'];
      for (const response of Object.values(request.availability || {})) {
        if (!validResponses.includes(response)) {
          errors.push('Invalid availability response');
          break;
        }
      }
      break;
    }
    
    case 'dot-voting':
    case 'buy-a-feature': {
      if (!request.allocations || Object.keys(request.allocations).length === 0) {
        errors.push('Please allocate your points/budget');
      }
      
      const settings = poll.settings as any;
      const totalAllocated = Object.values(request.allocations || {})
        .reduce((sum, val) => sum + val, 0);
      const maxTotal = poll.type === 'dot-voting' 
        ? settings.totalPoints 
        : settings.totalBudget;
      
      if (totalAllocated > maxTotal) {
        errors.push(`You can only allocate ${maxTotal} ${poll.type === 'dot-voting' ? 'points' : settings.currency}`);
      }
      
      // Check for negative values
      for (const val of Object.values(request.allocations || {})) {
        if (val < 0) {
          errors.push('Cannot allocate negative values');
          break;
        }
      }
      
      // Check max per option
      if (settings.maxPointsPerOption) {
        for (const val of Object.values(request.allocations || {})) {
          if (val > settings.maxPointsPerOption) {
            errors.push(`Maximum ${settings.maxPointsPerOption} per option`);
            break;
          }
        }
      }
      break;
    }
    
    case 'rating-scale': {
      if (!request.ratings || Object.keys(request.ratings).length === 0) {
        errors.push('Please provide ratings');
      }
      
      const settings = poll.settings as any;
      for (const rating of Object.values(request.ratings || {})) {
        if (rating < settings.minRating || rating > settings.maxRating) {
          errors.push(`Ratings must be between ${settings.minRating} and ${settings.maxRating}`);
          break;
        }
      }
      break;
    }
    
    case 'priority-matrix': {
      if (!request.positions || Object.keys(request.positions).length === 0) {
        errors.push('Please position at least one item');
      }
      
      for (const pos of Object.values(request.positions || {})) {
        if (pos.x < 0 || pos.x > 100 || pos.y < 0 || pos.y > 100) {
          errors.push('Positions must be between 0 and 100');
          break;
        }
      }
      break;
    }
    
    case 'quiz-poll': {
      if (!request.answers || Object.keys(request.answers).length === 0) {
        errors.push('Please answer at least one question');
      }
      break;
    }
    
    case 'sentiment-check': {
      if (!request.sentiment) {
        errors.push('Please select a sentiment');
      }
      
      // Validate sentiment is a valid option
      const validSentiments = poll.options.map(o => (o as any).emoji || o.id);
      if (request.sentiment && !validSentiments.includes(request.sentiment)) {
        errors.push('Invalid sentiment selected');
      }
      break;
    }
  }
  
  // Validate comment if provided
  if (request.comment) {
    if (!poll.settings.allowComments) {
      errors.push('Comments are not enabled for this poll');
    }
    if (request.comment.length > 1000) {
      errors.push('Comment must be 1000 characters or less');
    }
  }
  
  // Validate unique code if required
  if (poll.protection.uniqueCodes.enabled) {
    if (!request.uniqueCode) {
      errors.push('A voting code is required for this poll');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// ----------------------------------------------------------------------------
// Vote Submission
// ----------------------------------------------------------------------------

export interface SubmitVoteResult {
  success: boolean;
  voteId?: string;
  results?: PollResults;
  quizScore?: number;
  error?: string;
  errors?: string[];
}

export async function submitVote(
  request: SubmitVoteRequest,
  clientInfo: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  }
): Promise<SubmitVoteResult> {
  // Get poll
  const poll = await storage.getPoll(request.pollId);
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  // Validate vote
  const validation = validateVote(request, poll);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }
  
  // Create vote object
  const voteId = generateId();
  const timestamp = new Date().toISOString();
  const device = detectDevice(clientInfo.userAgent);
  
  // Create browser hash from various factors
  const browserHash = request.browserHash || hashForProtection(
    `${clientInfo.userAgent}-${clientInfo.ip}`
  );
  
  // Create IP hash if provided
  const ipHash = clientInfo.ip ? hashForProtection(clientInfo.ip) : undefined;
  
  // Build vote based on type
  let vote: Vote;
  
  const baseVote = {
    id: voteId,
    pollId: request.pollId,
    timestamp,
    browserHash,
    ipHash,
    codeUsed: request.uniqueCode,
    device,
    userAgent: clientInfo.userAgent,
    referrer: clientInfo.referrer,
    comment: request.comment,
  };
  
  switch (poll.type) {
    case 'multiple-choice':
    case 'this-or-that':
    case 'approval-voting':
      vote = {
        ...baseVote,
        type: poll.type,
        selectedOptions: request.selectedOptions!,
      } as MultipleChoiceVote;
      break;
      
    case 'visual-poll':
      vote = {
        ...baseVote,
        type: 'visual-poll',
        selectedOptions: request.selectedOptions!,
      } as VisualVote;
      break;
      
    case 'ranked-choice':
      vote = {
        ...baseVote,
        type: 'ranked-choice',
        rankings: request.rankings!,
      } as RankedVote;
      break;
      
    case 'meeting-poll':
      vote = {
        ...baseVote,
        type: 'meeting-poll',
        availability: request.availability!,
      } as MeetingVote;
      break;
      
    case 'dot-voting':
    case 'buy-a-feature':
      vote = {
        ...baseVote,
        type: poll.type,
        allocations: request.allocations!,
      } as DotVote;
      break;
      
    case 'rating-scale':
      vote = {
        ...baseVote,
        type: 'rating-scale',
        ratings: request.ratings!,
      } as RatingVote;
      break;
      
    case 'priority-matrix':
      vote = {
        ...baseVote,
        type: 'priority-matrix',
        positions: request.positions!,
      } as MatrixVote;
      break;
      
    case 'quiz-poll': {
      // Calculate score
      let correctCount = 0;
      const totalQuestions = poll.options.length;
      
      for (const [questionId, answerId] of Object.entries(request.answers || {})) {
        const option = poll.options.find(o => o.id === questionId) as any;
        if (option?.isCorrect && answerId === questionId) {
          correctCount++;
        }
      }
      
      const score = (correctCount / totalQuestions) * 100;
      
      vote = {
        ...baseVote,
        type: 'quiz-poll',
        answers: request.answers!,
        score,
      } as QuizVote;
      break;
    }
      
    case 'sentiment-check':
      vote = {
        ...baseVote,
        type: 'sentiment-check',
        sentiment: request.sentiment!,
      } as SentimentVote;
      break;
      
    default:
      return { success: false, error: 'Unknown poll type' };
  }
  
  // Add vote to aggregate
  const result = await storage.addVoteToAggregate(request.pollId, vote, poll);
  
  if (!result.success) {
    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      'RESPONSE_LIMIT_REACHED': 'This poll has reached its maximum number of responses',
      'DUPLICATE_BROWSER': 'You have already voted in this poll',
      'DUPLICATE_IP': 'A vote has already been submitted from your location',
      'CODE_ALREADY_USED': 'This voting code has already been used',
      'INVALID_CODE': 'Invalid voting code',
    };
    
    return { 
      success: false, 
      error: errorMessages[result.error!] || 'Failed to submit vote' 
    };
  }
  
  // Get results to return
  let results: PollResults | undefined;
  if (poll.settings.showResults === 'always' || poll.settings.showResults === 'after_vote') {
    results = await getPublicResults(request.pollId);
  }
  
  // For quiz, return score
  const quizScore = poll.type === 'quiz-poll' ? (vote as QuizVote).score : undefined;
  
  return {
    success: true,
    voteId,
    results,
    quizScore,
  };
}

// ----------------------------------------------------------------------------
// Results Retrieval
// ----------------------------------------------------------------------------

export async function getPublicResults(pollId: string): Promise<PollResults | null> {
  const poll = await storage.getPoll(pollId);
  if (!poll) return null;
  
  // Check if results are visible
  if (poll.settings.showResults === 'admin_only') {
    return null;
  }
  
  if (poll.settings.showResults === 'after_close' && poll.status === 'active') {
    return null;
  }
  
  const aggregate = await storage.getVoteAggregate(pollId);
  if (!aggregate) {
    return {
      pollId,
      question: poll.question,
      type: poll.type,
      totalVotes: 0,
      status: poll.status as 'active' | 'closed',
      results: {},
    };
  }
  
  return {
    pollId,
    question: poll.question,
    type: poll.type,
    totalVotes: aggregate.totalVotes,
    status: poll.status as 'active' | 'closed',
    results: aggregate.summary,
  };
}

export async function getAdminResults(
  pollId: string,
  adminToken: string
): Promise<PollResults | null> {
  const poll = await storage.getPoll(pollId);
  if (!poll) return null;
  
  if (poll.adminToken !== adminToken) {
    return null;
  }
  
  const aggregate = await storage.getVoteAggregate(pollId);
  if (!aggregate) {
    return {
      pollId,
      question: poll.question,
      type: poll.type,
      totalVotes: 0,
      status: poll.status as 'active' | 'closed',
      results: {},
      analytics: {
        timeline: [],
        devices: { mobile: 0, desktop: 0, tablet: 0, unknown: 0 },
        referrers: {},
      },
      votes: [],
      comments: [],
    };
  }
  
  return {
    pollId,
    question: poll.question,
    type: poll.type,
    totalVotes: aggregate.totalVotes,
    status: poll.status as 'active' | 'closed',
    results: aggregate.summary,
    analytics: poll.plan.features.voteTimestamps ? aggregate.analytics : undefined,
    votes: poll.plan.features.voteTimestamps ? aggregate.votes : undefined,
    comments: poll.plan.features.voterComments ? aggregate.comments : undefined,
  };
}

// ----------------------------------------------------------------------------
// Export Functions
// ----------------------------------------------------------------------------

export interface ExportOptions {
  format: 'csv' | 'json';
  includeTimestamps: boolean;
  includeComments: boolean;
  includeAnalytics: boolean;
}

export async function exportResults(
  pollId: string,
  adminToken: string,
  options: ExportOptions
): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
  const poll = await storage.getPoll(pollId);
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }
  
  if (poll.adminToken !== adminToken) {
    return { success: false, error: 'Invalid admin token' };
  }
  
  if (!poll.plan.features.exportCsv && options.format === 'csv') {
    return { success: false, error: 'CSV export requires a paid plan' };
  }
  
  const aggregate = await storage.getVoteAggregate(pollId);
  if (!aggregate) {
    return { success: false, error: 'No votes to export' };
  }
  
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `poll-${pollId}-results-${timestamp}`;
  
  if (options.format === 'json') {
    const exportData: any = {
      poll: {
        id: poll.id,
        question: poll.question,
        type: poll.type,
        createdAt: poll.createdAt,
        status: poll.status,
        options: poll.options,
      },
      results: {
        totalVotes: aggregate.totalVotes,
        summary: aggregate.summary,
      },
    };
    
    if (options.includeTimestamps && poll.plan.features.voteTimestamps) {
      exportData.votes = aggregate.votes;
    }
    
    if (options.includeComments && poll.plan.features.voterComments) {
      exportData.comments = aggregate.comments;
    }
    
    if (options.includeAnalytics && poll.plan.features.voteTrends) {
      exportData.analytics = aggregate.analytics;
    }
    
    return {
      success: true,
      data: JSON.stringify(exportData, null, 2),
      filename: `${filename}.json`,
    };
  }
  
  // CSV export
  let csv = '';
  
  // Build CSV based on poll type
  switch (poll.type) {
    case 'multiple-choice':
    case 'this-or-that':
    case 'approval-voting':
    case 'visual-poll':
    case 'sentiment-check': {
      csv = 'Option,Votes,Percentage\n';
      const counts = aggregate.summary.counts || {};
      const total = aggregate.totalVotes;
      
      for (const option of poll.options) {
        const count = counts[option.id] || 0;
        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
        const text = (option as any).text || (option as any).label || (option as any).emoji;
        csv += `"${text}",${count},${percentage}%\n`;
      }
      break;
    }
    
    case 'ranked-choice': {
      csv = 'Option,Final Score,Final Rank\n';
      const rankings = aggregate.summary.rankings?.finalRankings || [];
      
      rankings.forEach((r, index) => {
        const option = poll.options.find(o => o.id === r.optionId);
        const text = (option as any).text || r.optionId;
        csv += `"${text}",${r.score},${index + 1}\n`;
      });
      break;
    }
    
    case 'meeting-poll': {
      csv = 'Date/Time,Yes,No,Maybe,Total Score\n';
      const availability = aggregate.summary.availability || {};
      
      for (const option of poll.options) {
        const avail = availability[option.id] || { yes: 0, no: 0, maybe: 0 };
        const score = avail.yes * 2 + avail.maybe;
        const text = (option as any).date || (option as any).text;
        csv += `"${text}",${avail.yes},${avail.no},${avail.maybe},${score}\n`;
      }
      break;
    }
    
    case 'dot-voting':
    case 'buy-a-feature': {
      csv = 'Option,Points Allocated,Percentage\n';
      const allocations = aggregate.summary.allocations || {};
      const total = aggregate.summary.totalAllocated || 0;
      
      for (const option of poll.options) {
        const points = allocations[option.id] || 0;
        const percentage = total > 0 ? ((points / total) * 100).toFixed(1) : '0.0';
        const text = (option as any).text;
        csv += `"${text}",${points},${percentage}%\n`;
      }
      break;
    }
    
    case 'rating-scale': {
      csv = 'Option,Average Rating,Number of Ratings\n';
      const ratings = aggregate.summary.ratings || {};
      
      for (const option of poll.options) {
        const rating = ratings[option.id] || { average: 0, count: 0 };
        const text = (option as any).text;
        csv += `"${text}",${rating.average.toFixed(2)},${rating.count}\n`;
      }
      break;
    }
    
    case 'priority-matrix': {
      csv = 'Option,Average X (Effort),Average Y (Impact),Votes\n';
      const positions = aggregate.summary.positions || {};
      
      for (const option of poll.options) {
        const pos = positions[option.id] || { avgX: 50, avgY: 50, votes: 0 };
        const text = (option as any).text;
        csv += `"${text}",${pos.avgX.toFixed(1)},${pos.avgY.toFixed(1)},${pos.votes}\n`;
      }
      break;
    }
    
    case 'quiz-poll': {
      csv = 'Metric,Value\n';
      csv += `Total Responses,${aggregate.totalVotes}\n`;
      csv += `Average Score,${(aggregate.summary.averageScore || 0).toFixed(1)}%\n`;
      csv += `High Score,${(aggregate.summary.highScore || 0).toFixed(1)}%\n`;
      break;
    }
  }
  
  // Add votes detail if requested
  if (options.includeTimestamps && poll.plan.features.voteTimestamps) {
    csv += '\n\nDetailed Votes\n';
    csv += 'Timestamp,Device,Vote Data\n';
    
    for (const vote of aggregate.votes) {
      const voteData = JSON.stringify(vote).replace(/"/g, '""');
      csv += `${vote.timestamp},${vote.device},"${voteData}"\n`;
    }
  }
  
  // Add comments if requested
  if (options.includeComments && poll.plan.features.voterComments && aggregate.comments.length > 0) {
    csv += '\n\nComments\n';
    csv += 'Timestamp,Comment\n';
    
    for (const comment of aggregate.comments) {
      const text = comment.text.replace(/"/g, '""');
      csv += `${comment.timestamp},"${text}"\n`;
    }
  }
  
  return {
    success: true,
    data: csv,
    filename: `${filename}.csv`,
  };
}

// ----------------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------------

function detectDevice(userAgent?: string): DeviceType {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    return 'mobile';
  }
  
  if (/windows|macintosh|linux/i.test(ua)) {
    return 'desktop';
  }
  
  return 'unknown';
}

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export const voteService = {
  validateVote,
  submitVote,
  getPublicResults,
  getAdminResults,
  exportResults,
};

export default voteService;