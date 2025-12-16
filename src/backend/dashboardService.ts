// ============================================================================
// VoteGenerator - Dashboard Service
// Handles multi-poll dashboard for Pro/Pro+ users
// ============================================================================

import type { Poll, UserDashboard, PollResults } from './types';
import { storage } from './storage';
import { voteService } from './voteService';

// ----------------------------------------------------------------------------
// Dashboard Authentication
// ----------------------------------------------------------------------------

export interface DashboardAuthResult {
  success: boolean;
  user?: UserDashboard;
  error?: string;
}

/**
 * Authenticate user by Stripe customer ID
 * Called after successful Stripe webhook
 */
export async function authenticateByStripe(
  stripeCustomerId: string
): Promise<DashboardAuthResult> {
  const user = await storage.getUserByStripeCustomer(stripeCustomerId);
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  if (user.subscription.status !== 'active' && user.subscription.status !== 'trialing') {
    return { success: false, error: 'Subscription not active' };
  }
  
  return { success: true, user };
}

/**
 * Create a simple session token for dashboard access
 * In production, use proper JWT or session management
 */
export function createSessionToken(userId: string): string {
  const timestamp = Date.now();
  const data = `${userId}:${timestamp}`;
  // Simple encoding - in production use proper JWT
  return Buffer.from(data).toString('base64');
}

/**
 * Validate session token
 */
export function validateSessionToken(token: string): { valid: boolean; userId?: string } {
  try {
    const data = Buffer.from(token, 'base64').toString('utf8');
    const [userId, timestamp] = data.split(':');
    
    // Check if token is less than 24 hours old
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (tokenAge > maxAge) {
      return { valid: false };
    }
    
    return { valid: true, userId };
  } catch {
    return { valid: false };
  }
}

// ----------------------------------------------------------------------------
// Dashboard Data
// ----------------------------------------------------------------------------

export interface DashboardPollSummary {
  id: string;
  question: string;
  type: string;
  status: 'active' | 'closed' | 'draft' | 'archived';
  createdAt: string;
  totalVotes: number;
  maxResponses: number;
  expiresAt?: string;
}

export interface DashboardData {
  user: {
    email?: string;
    tier: string;
    status: string;
    currentPeriodEnd?: string;
  };
  stats: {
    totalPolls: number;
    totalVotes: number;
    activePolls: number;
    thisMonth: {
      polls: number;
      votes: number;
    };
  };
  polls: DashboardPollSummary[];
  recentActivity: Array<{
    pollId: string;
    pollQuestion: string;
    action: string;
    timestamp: string;
  }>;
}

export async function getDashboardData(userId: string): Promise<DashboardData | null> {
  const user = await storage.getUser(userId);
  if (!user) return null;
  
  // Get all polls
  const polls: DashboardPollSummary[] = [];
  let totalVotes = 0;
  let activePolls = 0;
  
  for (const pollId of user.pollIds) {
    const poll = await storage.getPoll(pollId);
    if (!poll) continue;
    
    const aggregate = await storage.getVoteAggregate(pollId);
    const voteCount = aggregate?.totalVotes || 0;
    
    totalVotes += voteCount;
    if (poll.status === 'active') activePolls++;
    
    polls.push({
      id: poll.id,
      question: poll.question,
      type: poll.type,
      status: poll.status as any,
      createdAt: poll.createdAt,
      totalVotes: voteCount,
      maxResponses: poll.plan.maxResponses,
      expiresAt: poll.plan.expiresAt,
    });
  }
  
  // Sort by created date (newest first)
  polls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Build recent activity from latest votes
  const recentActivity: DashboardData['recentActivity'] = [];
  for (const pollSummary of polls.slice(0, 5)) {
    const aggregate = await storage.getVoteAggregate(pollSummary.id);
    if (aggregate && aggregate.votes.length > 0) {
      const latestVote = aggregate.votes[aggregate.votes.length - 1];
      recentActivity.push({
        pollId: pollSummary.id,
        pollQuestion: pollSummary.question,
        action: 'New vote received',
        timestamp: latestVote.timestamp,
      });
    }
  }
  
  // Sort by timestamp and limit
  recentActivity.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return {
    user: {
      email: user.email,
      tier: user.subscription.tier,
      status: user.subscription.status,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
    },
    stats: {
      totalPolls: polls.length,
      totalVotes,
      activePolls,
      thisMonth: user.usage.thisMonth,
    },
    polls,
    recentActivity: recentActivity.slice(0, 10),
  };
}

// ----------------------------------------------------------------------------
// Poll Management from Dashboard
// ----------------------------------------------------------------------------

export async function createPollFromDashboard(
  userId: string,
  pollData: any
): Promise<{ success: boolean; poll?: Poll; error?: string }> {
  const user = await storage.getUser(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  if (user.subscription.status !== 'active') {
    return { success: false, error: 'Subscription not active' };
  }
  
  // Import pollService here to avoid circular dependency
  const { pollService } = await import('./pollService');
  
  const result = await pollService.createPoll(
    { ...pollData, ownerId: userId },
    user.subscription.tier
  );
  
  if (result.success && result.poll) {
    // Add poll to user's list
    user.pollIds.push(result.poll.id);
    user.usage.totalPolls++;
    user.usage.thisMonth.polls++;
    user.updatedAt = new Date().toISOString();
    await storage.saveUser(user);
  }
  
  return {
    success: result.success,
    poll: result.poll,
    error: result.errors?.join(', '),
  };
}

export async function getUserPollResults(
  userId: string,
  pollId: string
): Promise<PollResults | null> {
  const user = await storage.getUser(userId);
  if (!user) return null;
  
  // Verify user owns this poll
  if (!user.pollIds.includes(pollId)) {
    return null;
  }
  
  const poll = await storage.getPoll(pollId);
  if (!poll) return null;
  
  // Get full admin results
  return voteService.getAdminResults(pollId, poll.adminToken);
}

export async function duplicatePoll(
  userId: string,
  pollId: string
): Promise<{ success: boolean; newPoll?: Poll; error?: string }> {
  const user = await storage.getUser(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  // Verify user owns this poll
  if (!user.pollIds.includes(pollId)) {
    return { success: false, error: 'Poll not found' };
  }
  
  const originalPoll = await storage.getPoll(pollId);
  if (!originalPoll) {
    return { success: false, error: 'Poll not found' };
  }
  
  // Import pollService
  const { pollService } = await import('./pollService');
  
  // Create new poll with same settings
  const result = await pollService.createPoll(
    {
      type: originalPoll.type,
      question: `${originalPoll.question} (Copy)`,
      description: originalPoll.description,
      options: originalPoll.options.map(o => ({
        text: (o as any).text,
        imageUrl: (o as any).imageUrl,
        date: (o as any).date,
        isCorrect: (o as any).isCorrect,
        emoji: (o as any).emoji,
      })),
      settings: originalPoll.settings as any,
      theme: originalPoll.theme,
      branding: originalPoll.branding,
      ownerId: userId,
    },
    user.subscription.tier
  );
  
  if (result.success && result.poll) {
    // Add to user's polls
    user.pollIds.push(result.poll.id);
    user.usage.totalPolls++;
    user.usage.thisMonth.polls++;
    await storage.saveUser(user);
  }
  
  return {
    success: result.success,
    newPoll: result.poll,
    error: result.errors?.join(', '),
  };
}

// ----------------------------------------------------------------------------
// Usage Tracking
// ----------------------------------------------------------------------------

export async function incrementVoteCount(userId: string): Promise<void> {
  const user = await storage.getUser(userId);
  if (!user) return;
  
  user.usage.totalVotes++;
  user.usage.thisMonth.votes++;
  user.updatedAt = new Date().toISOString();
  
  await storage.saveUser(user);
}

export async function resetMonthlyUsage(): Promise<void> {
  // This would be called by a scheduled function at the start of each month
  // For now, it's a placeholder
  console.log('Monthly usage reset would happen here');
}

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export const dashboardService = {
  authenticateByStripe,
  createSessionToken,
  validateSessionToken,
  getDashboardData,
  createPollFromDashboard,
  getUserPollResults,
  duplicatePoll,
  incrementVoteCount,
  resetMonthlyUsage,
};

export default dashboardService;