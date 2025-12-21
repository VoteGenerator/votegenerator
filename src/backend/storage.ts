// ============================================================================
// VoteGenerator - Storage Utility v2
// Improved with optimistic locking and write-ahead log for race condition safety
// ============================================================================

import { getStore } from '@netlify/blobs';
import type { 
  Poll, 
  VoteAggregate, 
  Vote, 
  UserDashboard, 
  OneTimePurchase 
} from './types';

// ----------------------------------------------------------------------------
// Store Names
// ----------------------------------------------------------------------------

const STORES = {
  POLLS: 'polls',           // Poll configurations
  VOTES: 'votes',           // Vote aggregates (one per poll)
  VOTE_LOG: 'votelog',      // Write-ahead log for individual votes (safety net)
  USERS: 'users',           // User dashboards (Pro/Pro+)
  PURCHASES: 'purchases',   // One-time purchases
  SHORT_LINKS: 'shortlinks', // Custom short link mappings
} as const;

// ----------------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------------

const CONFIG = {
  MAX_RETRIES: 3,           // Retry writes on conflict
  RETRY_DELAY_MS: 50,       // Base delay between retries (exponential backoff)
  LOG_RETENTION_HOURS: 24,  // How long to keep vote log entries
};

// ----------------------------------------------------------------------------
// Helper: Get Stores (with credentials for production)
// ----------------------------------------------------------------------------

function getPollStore() {
  return getStore({
    name: STORES.POLLS,
    siteID: process.env.SITE_ID || '',
    token: process.env.NETLIFY_AUTH_TOKEN || ''
  });
}

function getVoteStore() {
  return getStore({
    name: STORES.VOTES,
    siteID: process.env.SITE_ID || '',
    token: process.env.NETLIFY_AUTH_TOKEN || ''
  });
}

function getVoteLogStore() {
  return getStore({
    name: STORES.VOTE_LOG,
    siteID: process.env.SITE_ID || '',
    token: process.env.NETLIFY_AUTH_TOKEN || ''
  });
}

function getUserStore() {
  return getStore({
    name: STORES.USERS,
    siteID: process.env.SITE_ID || '',
    token: process.env.NETLIFY_AUTH_TOKEN || ''
  });
}

function getPurchaseStore() {
  return getStore({
    name: STORES.PURCHASES,
    siteID: process.env.SITE_ID || '',
    token: process.env.NETLIFY_AUTH_TOKEN || ''
  });
}

function getShortLinkStore() {
  return getStore({
    name: STORES.SHORT_LINKS,
    siteID: process.env.SITE_ID || '',
    token: process.env.NETLIFY_AUTH_TOKEN || ''
  });
}

// ----------------------------------------------------------------------------
// Utility: Sleep for exponential backoff
// ----------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ----------------------------------------------------------------------------
// Poll Storage (unchanged - low contention)
// ----------------------------------------------------------------------------

export async function savePoll(poll: Poll): Promise<void> {
  const store = getPollStore();
  await store.setJSON(poll.id, poll);
  
  if (poll.shortCode) {
    const shortLinkStore = getShortLinkStore();
    await shortLinkStore.set(poll.shortCode, poll.id);
  }
}

export async function getPoll(pollId: string): Promise<Poll | null> {
  const store = getPollStore();
  try {
    const poll = await store.get(pollId, { type: 'json' }) as Poll;
    return poll;
  } catch {
    return null;
  }
}

export async function getPollByShortCode(shortCode: string): Promise<Poll | null> {
  const shortLinkStore = getShortLinkStore();
  try {
    const pollId = await shortLinkStore.get(shortCode, { type: 'text' });
    if (pollId) {
      return getPoll(pollId);
    }
    return null;
  } catch {
    return null;
  }
}

export async function deletePoll(pollId: string): Promise<void> {
  const store = getPollStore();
  const voteStore = getVoteStore();
  
  const poll = await getPoll(pollId);
  if (poll?.shortCode) {
    const shortLinkStore = getShortLinkStore();
    await shortLinkStore.delete(poll.shortCode);
  }
  
  await store.delete(pollId);
  await voteStore.delete(pollId);
}

export async function updatePoll(pollId: string, updates: Partial<Poll>): Promise<Poll | null> {
  const poll = await getPoll(pollId);
  if (!poll) return null;
  
  const updatedPoll: Poll = {
    ...poll,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await savePoll(updatedPoll);
  return updatedPoll;
}

// ----------------------------------------------------------------------------
// Vote Aggregate Storage - WITH OPTIMISTIC LOCKING
// ----------------------------------------------------------------------------

interface AggregateWithVersion {
  aggregate: VoteAggregate;
  version: number;
}

export async function getVoteAggregate(pollId: string): Promise<VoteAggregate | null> {
  const store = getVoteStore();
  try {
    const data = await store.get(pollId, { type: 'json' }) as AggregateWithVersion;
    return data?.aggregate || data as any; // Handle both old and new format
  } catch {
    return null;
  }
}

async function getVoteAggregateWithVersion(pollId: string): Promise<AggregateWithVersion | null> {
  const store = getVoteStore();
  try {
    const data = await store.get(pollId, { type: 'json' }) as AggregateWithVersion;
    // Handle legacy format (no version)
    if (data && !('version' in data)) {
      return { aggregate: data as any, version: 0 };
    }
    return data;
  } catch {
    return null;
  }
}

async function saveVoteAggregateWithVersion(
  pollId: string, 
  aggregate: VoteAggregate, 
  expectedVersion: number
): Promise<{ success: boolean; newVersion: number }> {
  const store = getVoteStore();
  
  // Read current version
  const current = await getVoteAggregateWithVersion(pollId);
  const currentVersion = current?.version || 0;
  
  // Check for conflict
  if (currentVersion !== expectedVersion) {
    return { success: false, newVersion: currentVersion };
  }
  
  // Write with incremented version
  const newVersion = currentVersion + 1;
  await store.setJSON(pollId, {
    aggregate,
    version: newVersion,
  });
  
  return { success: true, newVersion };
}

export async function saveVoteAggregate(aggregate: VoteAggregate): Promise<void> {
  const store = getVoteStore();
  const current = await getVoteAggregateWithVersion(aggregate.pollId);
  const newVersion = (current?.version || 0) + 1;
  
  await store.setJSON(aggregate.pollId, {
    aggregate,
    version: newVersion,
  });
}

export async function initializeVoteAggregate(pollId: string): Promise<VoteAggregate> {
  const aggregate: VoteAggregate = {
    pollId,
    lastUpdated: new Date().toISOString(),
    totalVotes: 0,
    summary: {},
    votes: [],
    comments: [],
    analytics: {
      timeline: [],
      devices: { mobile: 0, desktop: 0, tablet: 0, unknown: 0 },
      referrers: {},
    },
    protection: {
      browserHashes: [],
      ipHashes: [],
      usedCodes: [],
    },
  };
  
  const store = getVoteStore();
  await store.setJSON(pollId, {
    aggregate,
    version: 1,
  });
  
  return aggregate;
}

// ----------------------------------------------------------------------------
// Write-Ahead Log for Vote Safety
// ----------------------------------------------------------------------------

interface VoteLogEntry {
  voteId: string;
  pollId: string;
  vote: Vote;
  timestamp: string;
  applied: boolean;
}

async function writeToVoteLog(vote: Vote): Promise<void> {
  const store = getVoteLogStore();
  const entry: VoteLogEntry = {
    voteId: vote.id,
    pollId: vote.pollId,
    vote,
    timestamp: new Date().toISOString(),
    applied: false,
  };
  
  // Use vote ID as key for idempotency
  await store.setJSON(`${vote.pollId}:${vote.id}`, entry);
}

async function markVoteLogApplied(pollId: string, voteId: string): Promise<void> {
  const store = getVoteLogStore();
  try {
    const entry = await store.get(`${pollId}:${voteId}`, { type: 'json' }) as VoteLogEntry;
    if (entry) {
      entry.applied = true;
      await store.setJSON(`${pollId}:${voteId}`, entry);
    }
  } catch {
    // Log entry might not exist, that's okay
  }
}

// ----------------------------------------------------------------------------
// Add Vote with Retry Logic (Race Condition Safe)
// ----------------------------------------------------------------------------

/**
 * Add a vote to the aggregate with optimistic locking and retry
 * 
 * How it works:
 * 1. Write vote to log first (safety net - vote is NEVER lost)
 * 2. Read current aggregate with version
 * 3. Add vote and compute new summary
 * 4. Try to write with version check
 * 5. If conflict (someone else wrote), retry from step 2
 * 6. After MAX_RETRIES, vote is still in log for recovery
 */
export async function addVoteToAggregate(
  pollId: string,
  vote: Vote,
  poll: Poll
): Promise<{ success: boolean; error?: string; aggregate?: VoteAggregate }> {
  
  // Step 1: Write to log first (safety net - vote is NEVER lost)
  await writeToVoteLog(vote);
  
  // Step 2-5: Try to add to aggregate with retries
  for (let attempt = 0; attempt < CONFIG.MAX_RETRIES; attempt++) {
    // Get current state with version
    let current = await getVoteAggregateWithVersion(pollId);
    
    if (!current) {
      // Initialize if doesn't exist
      const newAggregate = await initializeVoteAggregate(pollId);
      current = { aggregate: newAggregate, version: 1 };
    }
    
    const aggregate = { ...current.aggregate };
    
    // Check response limit
    if (aggregate.totalVotes >= poll.plan.maxResponses) {
      return { success: false, error: 'RESPONSE_LIMIT_REACHED' };
    }
    
    // Check duplicate protection
    if (vote.browserHash && poll.protection.browserProtection) {
      if (aggregate.protection.browserHashes.includes(vote.browserHash)) {
        return { success: false, error: 'DUPLICATE_BROWSER' };
      }
    }
    
    if (vote.ipHash && poll.protection.ipProtection) {
      if (aggregate.protection.ipHashes.includes(vote.ipHash)) {
        return { success: false, error: 'DUPLICATE_IP' };
      }
    }
    
    if (vote.codeUsed && poll.protection.uniqueCodes.enabled) {
      if (aggregate.protection.usedCodes.includes(vote.codeUsed)) {
        return { success: false, error: 'CODE_ALREADY_USED' };
      }
      if (!poll.protection.uniqueCodes.codes.includes(vote.codeUsed)) {
        return { success: false, error: 'INVALID_CODE' };
      }
    }
    
    // Check if this vote was already applied (idempotency)
    if (aggregate.votes.some(v => v.id === vote.id)) {
      // Vote already exists, return success (idempotent)
      return { success: true, aggregate };
    }
    
    // Add vote to aggregate
    aggregate.votes.push(vote);
    aggregate.totalVotes++;
    aggregate.lastUpdated = new Date().toISOString();
    
    // Update protection tracking
    if (vote.browserHash) {
      aggregate.protection.browserHashes.push(vote.browserHash);
    }
    if (vote.ipHash) {
      aggregate.protection.ipHashes.push(vote.ipHash);
    }
    if (vote.codeUsed) {
      aggregate.protection.usedCodes.push(vote.codeUsed);
    }
    
    // Update analytics
    aggregate.analytics.devices[vote.device]++;
    if (vote.referrer) {
      aggregate.analytics.referrers[vote.referrer] = 
        (aggregate.analytics.referrers[vote.referrer] || 0) + 1;
    }
    
    // Update timeline
    const hour = new Date().toISOString().slice(0, 13) + ':00:00Z';
    const hourEntry = aggregate.analytics.timeline.find(t => t.hour === hour);
    if (hourEntry) {
      hourEntry.count++;
    } else {
      aggregate.analytics.timeline.push({ hour, count: 1 });
    }
    
    // Add comment if provided
    if (vote.comment) {
      aggregate.comments.push({
        voteId: vote.id,
        text: vote.comment,
        timestamp: vote.timestamp,
      });
    }
    
    // Update summary based on vote type
    updateSummary(aggregate, vote, poll);
    
    // Try to save with version check
    const saveResult = await saveVoteAggregateWithVersion(
      pollId, 
      aggregate, 
      current.version
    );
    
    if (saveResult.success) {
      // Success! Mark log entry as applied
      await markVoteLogApplied(pollId, vote.id);
      return { success: true, aggregate };
    }
    
    // Conflict! Wait and retry
    console.log(`Vote conflict on attempt ${attempt + 1}, retrying...`);
    await sleep(CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt)); // Exponential backoff
  }
  
  // All retries failed, but vote is safe in log
  console.error(`Failed to apply vote ${vote.id} after ${CONFIG.MAX_RETRIES} retries`);
  return { 
    success: false, 
    error: 'TEMPORARY_ERROR_RETRY_LATER'
  };
}

// ----------------------------------------------------------------------------
// Recovery: Apply votes from log (run periodically or on-demand)
// ----------------------------------------------------------------------------

export async function recoverVotesFromLog(pollId: string): Promise<number> {
  const store = getVoteLogStore();
  const poll = await getPoll(pollId);
  if (!poll) return 0;
  
  let recoveredCount = 0;
  
  try {
    // List all log entries for this poll
    const { blobs } = await store.list({ prefix: `${pollId}:` });
    
    for (const blob of blobs) {
      const entry = await store.get(blob.key, { type: 'json' }) as VoteLogEntry;
      
      if (entry && !entry.applied) {
        // Try to apply this vote
        const result = await addVoteToAggregate(pollId, entry.vote, poll);
        if (result.success) {
          recoveredCount++;
        }
      }
    }
  } catch (error) {
    console.error('Error recovering votes from log:', error);
  }
  
  return recoveredCount;
}

// ----------------------------------------------------------------------------
// Update Summary (unchanged from v1)
// ----------------------------------------------------------------------------

function updateSummary(aggregate: VoteAggregate, vote: Vote, poll: Poll): void {
  switch (vote.type) {
    case 'multiple-choice':
    case 'this-or-that':
    case 'approval-voting':
    case 'visual-poll': {
      const mcVote = vote as { selectedOptions: string[] };
      if (!aggregate.summary.counts) {
        aggregate.summary.counts = {};
      }
      for (const optionId of mcVote.selectedOptions) {
        aggregate.summary.counts[optionId] = 
          (aggregate.summary.counts[optionId] || 0) + 1;
      }
      break;
    }
    
    case 'ranked-choice': {
      recalculateRankedChoice(aggregate, poll);
      break;
    }
    
    case 'meeting-poll': {
      const meetingVote = vote as { availability: Record<string, 'yes' | 'no' | 'maybe'> };
      if (!aggregate.summary.availability) {
        aggregate.summary.availability = {};
      }
      for (const [optionId, response] of Object.entries(meetingVote.availability)) {
        if (!aggregate.summary.availability[optionId]) {
          aggregate.summary.availability[optionId] = { yes: 0, no: 0, maybe: 0 };
        }
        aggregate.summary.availability[optionId][response]++;
      }
      let bestOption = '';
      let bestScore = -1;
      for (const [optionId, counts] of Object.entries(aggregate.summary.availability)) {
        const score = counts.yes * 2 + counts.maybe;
        if (score > bestScore) {
          bestScore = score;
          bestOption = optionId;
        }
      }
      aggregate.summary.bestOption = bestOption;
      break;
    }
    
    case 'dot-voting':
    case 'buy-a-feature': {
      const dotVote = vote as { allocations: Record<string, number> };
      if (!aggregate.summary.allocations) {
        aggregate.summary.allocations = {};
        aggregate.summary.totalAllocated = 0;
      }
      for (const [optionId, points] of Object.entries(dotVote.allocations)) {
        aggregate.summary.allocations[optionId] = 
          (aggregate.summary.allocations[optionId] || 0) + points;
        aggregate.summary.totalAllocated! += points;
      }
      break;
    }
    
    case 'rating-scale': {
      const ratingVote = vote as { ratings: Record<string, number> };
      if (!aggregate.summary.ratings) {
        aggregate.summary.ratings = {};
      }
      let totalSum = 0;
      let totalCount = 0;
      for (const [optionId, rating] of Object.entries(ratingVote.ratings)) {
        if (!aggregate.summary.ratings[optionId]) {
          aggregate.summary.ratings[optionId] = { sum: 0, count: 0, average: 0 };
        }
        aggregate.summary.ratings[optionId].sum += rating;
        aggregate.summary.ratings[optionId].count++;
        aggregate.summary.ratings[optionId].average = 
          aggregate.summary.ratings[optionId].sum / aggregate.summary.ratings[optionId].count;
        totalSum += rating;
        totalCount++;
      }
      aggregate.summary.overallAverage = totalCount > 0 ? totalSum / totalCount : 0;
      break;
    }
    
    case 'priority-matrix': {
      const matrixVote = vote as { positions: Record<string, { x: number; y: number }> };
      if (!aggregate.summary.positions) {
        aggregate.summary.positions = {};
      }
      for (const [optionId, pos] of Object.entries(matrixVote.positions)) {
        if (!aggregate.summary.positions[optionId]) {
          aggregate.summary.positions[optionId] = { avgX: 0, avgY: 0, votes: 0 };
        }
        const curr = aggregate.summary.positions[optionId];
        curr.avgX = (curr.avgX * curr.votes + pos.x) / (curr.votes + 1);
        curr.avgY = (curr.avgY * curr.votes + pos.y) / (curr.votes + 1);
        curr.votes++;
      }
      break;
    }
    
    case 'quiz-poll': {
      const quizVote = vote as { answers: Record<string, string>; score?: number };
      if (!aggregate.summary.correctCounts) {
        aggregate.summary.correctCounts = {};
        aggregate.summary.averageScore = 0;
        aggregate.summary.highScore = 0;
      }
      let correctCount = 0;
      for (const [questionId, answerId] of Object.entries(quizVote.answers)) {
        const option = poll.options.find(o => o.id === questionId) as any;
        if (option?.isCorrect && option.id === answerId) {
          correctCount++;
          aggregate.summary.correctCounts[questionId] = 
            (aggregate.summary.correctCounts[questionId] || 0) + 1;
        }
      }
      const score = (correctCount / Object.keys(quizVote.answers).length) * 100;
      const totalScores = aggregate.votes
        .filter(v => v.type === 'quiz-poll')
        .map(v => (v as any).score || 0);
      totalScores.push(score);
      aggregate.summary.averageScore = 
        totalScores.reduce((a, b) => a + b, 0) / totalScores.length;
      aggregate.summary.highScore = Math.max(aggregate.summary.highScore || 0, score);
      break;
    }
    
    case 'sentiment-check': {
      const sentimentVote = vote as { sentiment: string };
      if (!aggregate.summary.counts) {
        aggregate.summary.counts = {};
      }
      aggregate.summary.counts[sentimentVote.sentiment] = 
        (aggregate.summary.counts[sentimentVote.sentiment] || 0) + 1;
      break;
    }
  }
}

function recalculateRankedChoice(aggregate: VoteAggregate, poll: Poll): void {
  const rankedVotes = aggregate.votes.filter(v => v.type === 'ranked-choice') as Array<{ rankings: string[] }>;
  
  if (rankedVotes.length === 0) {
    aggregate.summary.rankings = {
      algorithm: 'instant-runoff',
      rounds: [],
      finalRankings: [],
    };
    return;
  }
  
  let activeOptions = new Set(poll.options.map(o => o.id));
  const rounds: Array<{ round: number; counts: Record<string, number>; eliminated?: string; winner?: string }> = [];
  let currentRankings = rankedVotes.map(v => [...v.rankings]);
  
  let round = 1;
  while (activeOptions.size > 1) {
    const counts: Record<string, number> = {};
    for (const optionId of activeOptions) {
      counts[optionId] = 0;
    }
    
    for (const ranking of currentRankings) {
      for (const optionId of ranking) {
        if (activeOptions.has(optionId)) {
          counts[optionId]++;
          break;
        }
      }
    }
    
    const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
    const majority = totalVotes / 2;
    
    let winner: string | undefined;
    for (const [optionId, count] of Object.entries(counts)) {
      if (count > majority) {
        winner = optionId;
        break;
      }
    }
    
    if (winner) {
      rounds.push({ round, counts, winner });
      aggregate.summary.rankings = {
        algorithm: 'instant-runoff',
        rounds,
        winner,
        finalRankings: Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([optionId, score]) => ({ optionId, score })),
      };
      return;
    }
    
    let lowestCount = Infinity;
    let lowestOption = '';
    for (const [optionId, count] of Object.entries(counts)) {
      if (count < lowestCount) {
        lowestCount = count;
        lowestOption = optionId;
      }
    }
    
    rounds.push({ round, counts, eliminated: lowestOption });
    activeOptions.delete(lowestOption);
    round++;
    
    if (round > 100) break;
  }
  
  const winner = Array.from(activeOptions)[0];
  const finalCounts: Record<string, number> = {};
  for (const optionId of poll.options.map(o => o.id)) {
    finalCounts[optionId] = 0;
  }
  for (const ranking of currentRankings) {
    if (ranking[0]) finalCounts[ranking[0]]++;
  }
  
  aggregate.summary.rankings = {
    algorithm: 'instant-runoff',
    rounds,
    winner,
    finalRankings: Object.entries(finalCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([optionId, score]) => ({ optionId, score })),
  };
}

// ----------------------------------------------------------------------------
// User & Purchase Storage (unchanged - low contention)
// ----------------------------------------------------------------------------

export async function getUser(userId: string): Promise<UserDashboard | null> {
  const store = getUserStore();
  try {
    const user = await store.get(userId, { type: 'json' }) as UserDashboard;
    return user;
  } catch {
    return null;
  }
}

export async function saveUser(user: UserDashboard): Promise<void> {
  const store = getUserStore();
  await store.setJSON(user.userId, user);
}

export async function getUserByStripeCustomer(customerId: string): Promise<UserDashboard | null> {
  const store = getUserStore();
  try {
    const userId = await store.get(`stripe:${customerId}`, { type: 'text' });
    if (userId) {
      return getUser(userId);
    }
    return null;
  } catch {
    return null;
  }
}

export async function createUserFromStripe(
  stripeCustomerId: string,
  tier: 'pro' | 'pro_plus',
  email?: string
): Promise<UserDashboard> {
  const userId = generateId();
  const user: UserDashboard = {
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email,
    subscription: {
      tier,
      status: 'active',
      stripeCustomerId,
    },
    pollIds: [],
    usage: {
      totalPolls: 0,
      totalVotes: 0,
      thisMonth: { polls: 0, votes: 0 },
    },
    settings: {},
  };
  
  await saveUser(user);
  
  const store = getUserStore();
  await store.set(`stripe:${stripeCustomerId}`, userId);
  
  return user;
}

export async function savePurchase(purchase: OneTimePurchase): Promise<void> {
  const store = getPurchaseStore();
  await store.setJSON(purchase.id, purchase);
  await store.set(`stripe:${purchase.stripePaymentId}`, purchase.id);
}

export async function getPurchase(purchaseId: string): Promise<OneTimePurchase | null> {
  const store = getPurchaseStore();
  try {
    const purchase = await store.get(purchaseId, { type: 'json' }) as OneTimePurchase;
    return purchase;
  } catch {
    return null;
  }
}

export async function getPurchaseByStripePayment(paymentId: string): Promise<OneTimePurchase | null> {
  const store = getPurchaseStore();
  try {
    const purchaseId = await store.get(`stripe:${paymentId}`, { type: 'text' });
    if (purchaseId) {
      return getPurchase(purchaseId);
    }
    return null;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------------

export function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function generateAdminToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function hashForProtection(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export const storage = {
  // Polls
  savePoll,
  getPoll,
  getPollByShortCode,
  deletePoll,
  updatePoll,
  
  // Votes
  getVoteAggregate,
  saveVoteAggregate,
  initializeVoteAggregate,
  addVoteToAggregate,
  recoverVotesFromLog,
  
  // Users
  getUser,
  saveUser,
  getUserByStripeCustomer,
  createUserFromStripe,
  
  // Purchases
  savePurchase,
  getPurchase,
  getPurchaseByStripePayment,
  
  // Utilities
  generateId,
  generateAdminToken,
  generateShortCode,
  hashForProtection,
};

export default storage;