// userSessionService.ts
// Manages the user's session and poll list in localStorage

export interface UserPoll {
  id: string;
  adminKey: string;
  title: string;
  type: string;
  createdAt: string;
  responseCount?: number;
  status?: 'active' | 'ended' | 'draft';
}

export interface UserSession {
  tier: 'free' | 'starter' | 'pro_event' | 'unlimited';
  expiresAt?: string;
  polls: UserPoll[];
  createdAt: string;
  stripeSessionId?: string;
}

const SESSION_KEY = 'vg_user_session';
const TIER_KEY = 'vg_purchased_tier';
const EXPIRES_KEY = 'vg_expires_at';

/**
 * Get the current user session from localStorage
 */
export function getUserSession(): UserSession | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      return JSON.parse(stored) as UserSession;
    }
    
    // Check for legacy storage (backward compatibility)
    const tier = localStorage.getItem(TIER_KEY);
    if (tier) {
      const session: UserSession = {
        tier: tier as UserSession['tier'],
        expiresAt: localStorage.getItem(EXPIRES_KEY) || undefined,
        polls: [],
        createdAt: new Date().toISOString(),
      };
      saveUserSession(session);
      return session;
    }
    
    return null;
  } catch (e) {
    console.error('Error loading session:', e);
    return null;
  }
}

/**
 * Save the user session to localStorage
 */
export function saveUserSession(session: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Also update legacy keys for backward compatibility
  localStorage.setItem(TIER_KEY, session.tier);
  if (session.expiresAt) {
    localStorage.setItem(EXPIRES_KEY, session.expiresAt);
  }
}

/**
 * Add a newly created poll to the user's session
 * This should be called AFTER successful poll creation
 */
export function addPollToSession(poll: UserPoll): UserSession {
  let session = getUserSession();
  
  if (!session) {
    // Create a free session if none exists
    session = {
      tier: 'free',
      polls: [],
      createdAt: new Date().toISOString(),
    };
  }
  
  // Check if poll already exists (avoid duplicates)
  const existingIndex = session.polls.findIndex(p => p.id === poll.id);
  if (existingIndex >= 0) {
    // Update existing poll
    session.polls[existingIndex] = poll;
  } else {
    // Add new poll to the beginning
    session.polls.unshift(poll);
  }
  
  saveUserSession(session);
  return session;
}

/**
 * Remove a poll from the user's session
 */
export function removePollFromSession(pollId: string): UserSession | null {
  const session = getUserSession();
  if (!session) return null;
  
  session.polls = session.polls.filter(p => p.id !== pollId);
  saveUserSession(session);
  return session;
}

/**
 * Update a poll in the user's session (e.g., update response count)
 */
export function updatePollInSession(pollId: string, updates: Partial<UserPoll>): UserSession | null {
  const session = getUserSession();
  if (!session) return null;
  
  const pollIndex = session.polls.findIndex(p => p.id === pollId);
  if (pollIndex >= 0) {
    session.polls[pollIndex] = { ...session.polls[pollIndex], ...updates };
    saveUserSession(session);
  }
  
  return session;
}

/**
 * Get the user's tier
 */
export function getUserTier(): UserSession['tier'] {
  const session = getUserSession();
  return session?.tier || 'free';
}

/**
 * Check if user can create more polls based on their tier
 */
export function canCreateMorePolls(): boolean {
  const session = getUserSession();
  if (!session) return true; // Free tier gets 1 poll
  
  const pollCount = session.polls.length;
  
  switch (session.tier) {
    case 'unlimited':
      return true;
    case 'pro_event':
      return pollCount < 3;
    case 'starter':
    case 'free':
    default:
      return pollCount < 1;
  }
}

/**
 * Check if user has a paid tier
 */
export function isPaidUser(): boolean {
  const tier = getUserTier();
  return tier !== 'free';
}

/**
 * Clear the user's session (for logout or reset)
 */
export function clearUserSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TIER_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

/**
 * Set up session after successful Stripe checkout
 */
export function initializeFromCheckout(
  tier: UserSession['tier'],
  expiresAt?: string,
  stripeSessionId?: string
): UserSession {
  const session: UserSession = {
    tier,
    expiresAt,
    stripeSessionId,
    polls: [],
    createdAt: new Date().toISOString(),
  };
  
  // Check if there's an existing session with polls to preserve
  const existing = getUserSession();
  if (existing?.polls?.length) {
    session.polls = existing.polls;
  }
  
  saveUserSession(session);
  return session;
}

/**
 * Get the admin dashboard URL
 */
export function getAdminDashboardUrl(): string {
  return `${window.location.origin}/admin`;
}

/**
 * Get the admin URL for a specific poll
 */
export function getPollAdminUrl(pollId: string, adminKey: string): string {
  return `${window.location.origin}/admin/${pollId}/${adminKey}`;
}

/**
 * Get the vote URL for a poll
 */
export function getPollVoteUrl(pollId: string): string {
  return `${window.location.origin}/vote/${pollId}`;
}