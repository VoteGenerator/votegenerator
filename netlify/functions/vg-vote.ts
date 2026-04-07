import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

interface VoteRequest {
    pollId: string;
    rankedOptionIds?: string[];
    selectedOptionIds?: string[];
    voterName?: string;
    code?: string;
    comment?: string;
    choicesMaybe?: string[];
    matrixVotes?: Record<string, { x: number; y: number }>;
    pairwiseVotes?: { winnerId: string; loserId: string }[];
    ratingVotes?: Record<string, number>;
    // Survey mode
    surveyAnswers?: Record<string, any>;
    startedAt?: string;
    completionTime?: number;
    // Anti-bot fields
    _hp?: string; // Honeypot - should be empty
    _t?: number;  // Page load timestamp - for timing validation
}

interface VoteAnalytics {
    device: 'mobile' | 'desktop' | 'tablet' | 'unknown';
    country?: string;
    region?: string;
    referrerDomain?: string;
    utmSource?: string;
    timestamp: string;
}

interface Vote {
    id: string;
    rankedOptionIds?: string[];
    selectedOptionIds?: string[];
    voterName?: string;
    usedCode?: string;
    comment?: string;
    choicesMaybe?: string[];
    matrixVotes?: Record<string, { x: number; y: number }>;
    pairwiseVotes?: { winnerId: string; loserId: string }[];
    ratingVotes?: Record<string, number>;
    // Survey mode
    surveyAnswers?: Record<string, any>;
    startedAt?: string;       // When survey was started
    completionTime?: number;  // Seconds to complete
    timestamp: string;
    analytics?: VoteAnalytics;
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    pollType: string;
    options: { id: string; text: string; cost?: number }[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
        requireNames?: boolean;
        security?: 'none' | 'browser' | 'pin' | 'code';
        allowComments?: boolean;
        anonymousMode?: boolean;
    };
    votes: Vote[];
    createdAt: string;
    voteCount: number;
    tier?: string;
    maxResponses?: number;
    status?: 'draft' | 'live' | 'paused' | 'closed';
    expiresAt?: string;
    // Survey mode
    isSurvey?: boolean;
    sections?: any[];
    surveySettings?: {
        allowBack?: boolean;
        showProgress?: boolean;
        showSummary?: boolean;
        completionMessage?: string;
        anonymousMode?: boolean;
    };
    // Security
    pin?: string;
    allowedCodes?: string[];
    usedCodes?: string[];
    notificationSettings?: {
        enabled: boolean;
        emails: Array<{
            email: string;
            verified: boolean;
            addedAt?: string;
            verifiedAt?: string;
        }>;
        skipFirstVotes: number;
        notifyOn: {
            milestones: boolean;
            dailyDigest: boolean;
            pollClosed: boolean;
            limitReached: boolean;
            newComment: boolean;
        };
    };
    // Analytics tracking
    blockedVotes?: {
        honeypot: number;
        timing: number;
        rateLimit: number;
        total: number;
        lastBlocked?: string;
    };
}

// Milestone points for notifications
const MILESTONE_POINTS = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

// Check if vote count hit a milestone
function checkMilestone(voteCount: number): number | null {
    return MILESTONE_POINTS.includes(voteCount) ? voteCount : null;
}

// Check if approaching response limit
function checkLimitApproaching(voteCount: number, maxResponses: number): number | null {
    const percent80 = Math.floor(maxResponses * 0.8);
    const percent100 = maxResponses;
    
    if (voteCount === percent100) return 100;
    if (voteCount === percent80) return 80;
    return null;
}

// Detect suspicious activity patterns
interface SuspiciousActivityResult {
    isSuspicious: boolean;
    reason?: string;
    severity?: 'low' | 'medium' | 'high';
    details?: Record<string, any>;
}

async function detectSuspiciousActivity(
    poll: Poll,
    ipHash: string,
    device: string
): Promise<SuspiciousActivityResult> {
    const votes = poll.votes || [];
    const now = Date.now();
    const last5Minutes = now - 5 * 60 * 1000;
    const lastHour = now - 60 * 60 * 1000;
    
    const votesLast5Min = votes.filter((v: Vote) => 
        new Date(v.timestamp).getTime() > last5Minutes
    ).length;
    
    const votesLastHour = votes.filter((v: Vote) => 
        new Date(v.timestamp).getTime() > lastHour
    ).length;
    
    if (votesLast5Min > 20 && votes.length < 50) {
        return {
            isSuspicious: true,
            reason: 'Unusual vote spike detected',
            severity: 'high',
            details: { votesLast5Min, totalVotes: votes.length, pattern: 'spike' }
        };
    }
    
    if (votesLastHour > 100 && votes.length < 200) {
        return {
            isSuspicious: true,
            reason: 'Unusually high voting activity',
            severity: 'medium',
            details: { votesLastHour, totalVotes: votes.length, pattern: 'sustained_activity' }
        };
    }
    
    if (votes.length >= 20) {
        const last20Votes = votes.slice(-20);
        const deviceCounts: Record<string, number> = {};
        last20Votes.forEach((v: Vote) => {
            const dev = v.analytics?.device || 'unknown';
            deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
        });
        
        const maxDeviceCount = Math.max(...Object.values(deviceCounts));
        if (maxDeviceCount > 16) {
            return {
                isSuspicious: true,
                reason: 'Unusual device pattern detected',
                severity: 'low',
                details: { deviceDistribution: deviceCounts, pattern: 'device_uniformity' }
            };
        }
    }
    
    return { isSuspicious: false };
}

// Fire notification (non-blocking)
async function triggerNotification(
    poll: Poll,
    type: 'milestone' | 'limit' | 'comment' | 'suspicious',
    data: Record<string, any>
): Promise<void> {
    if (!poll.notificationSettings?.enabled || !poll.notificationSettings?.emails?.length) {
        return;
    }
    
    const settings = poll.notificationSettings;
    const verifiedEmails = settings.emails.filter((e: any) => e.verified === true);
    if (verifiedEmails.length === 0) {
        console.log(`No verified emails for poll ${poll.id} - skipping notification`);
        return;
    }
    
    if (type !== 'suspicious' && poll.voteCount <= settings.skipFirstVotes) {
        console.log(`Skipping notification - vote ${poll.voteCount} <= skipFirstVotes ${settings.skipFirstVotes}`);
        return;
    }
    
    if (type === 'milestone' && !settings.notifyOn.milestones) return;
    if (type === 'limit' && !settings.notifyOn.limitReached) return;
    if (type === 'comment' && !settings.notifyOn.newComment) return;
    
    try {
        const baseUrl = process.env.URL || 'https://votegenerator.com';
        fetch(`${baseUrl}/.netlify/functions/vg-notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pollId: poll.id,
                adminKey: poll.adminKey,
                type,
                data
            })
        }).catch(err => console.error('Notification trigger failed:', err));
        
        console.log(`Notification triggered: ${type} for poll ${poll.id} to ${verifiedEmails.length} verified recipient(s)`);
    } catch (error) {
        console.error('Failed to trigger notification:', error);
    }
}

const generateVoteId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const createIpHash = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const secret = process.env.VOTE_TOKEN_SECRET;
if (!secret) throw new Error('VOTE_TOKEN_SECRET env var not set');
const data = encoder.encode(input + secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
};

const detectDevice = (userAgent: string | undefined): 'mobile' | 'desktop' | 'tablet' | 'unknown' => {
    if (!userAgent) return 'unknown';
    const ua = userAgent.toLowerCase();
    
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
    if (/windows|macintosh|linux/i.test(ua)) return 'desktop';
    
    return 'unknown';
};

const extractReferrerDomain = (referrer: string | undefined): string | undefined => {
    if (!referrer) return undefined;
    try {
        const url = new URL(referrer);
        return url.hostname;
    } catch {
        return undefined;
    }
};

const getGeoFromIP = async (ip: string | undefined): Promise<{ country?: string; region?: string }> => {
    if (!ip || !process.env.IPINFO_TOKEN) {
        return {};
    }
    
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
        return {};
    }
    
    try {
        const response = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`, {
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            console.log('ipinfo.io request failed:', response.status);
            return {};
        }
        
        const data = await response.json();
        return {
            country: data.country || undefined,
            region: data.region || undefined
        };
    } catch (error) {
        console.error('ipinfo.io error:', error);
        return {};
    }
};

const extractUtmSource = (referrer: string | undefined): string | undefined => {
    if (!referrer) return undefined;
    try {
        const url = new URL(referrer);
        return url.searchParams.get('utm_source') || undefined;
    } catch {
        return undefined;
    }
};

const isAnonymousMode = (poll: Poll): boolean => {
    if (poll.surveySettings?.anonymousMode === true) {
        return true;
    }
    if (poll.settings?.anonymousMode === true) {
        return true;
    }
    return false;
};

// ============================================================================
// POLL TYPE DEFINITIONS - Which data field each poll type uses
// ============================================================================
const POLL_TYPE_VALIDATION: Record<string, {
    field: string;
    errorMessage: string;
    validator: (body: VoteRequest) => boolean;
}> = {
    // Survey mode - multi-question surveys
    'survey': {
        field: 'surveyAnswers',
        errorMessage: 'Survey answers are required',
        validator: (body) => body.surveyAnswers && typeof body.surveyAnswers === 'object' && Object.keys(body.surveyAnswers).length > 0
    },
    // Rating polls (stars, emojis, etc.)
    'rating': {
        field: 'ratingVotes',
        errorMessage: 'Please provide a rating',
        validator: (body) => body.ratingVotes && typeof body.ratingVotes === 'object' && Object.keys(body.ratingVotes).length > 0
    },
    // Ranked choice voting
    'ranked': {
        field: 'rankedOptionIds',
        errorMessage: 'Please rank your choices',
        validator: (body) => Array.isArray(body.rankedOptionIds) && body.rankedOptionIds.length > 0
    },
    'ranked_choice': {
        field: 'rankedOptionIds',
        errorMessage: 'Please rank your choices',
        validator: (body) => Array.isArray(body.rankedOptionIds) && body.rankedOptionIds.length > 0
    },
    // Matrix/grid questions
    'matrix': {
        field: 'matrixVotes',
        errorMessage: 'Please complete the matrix',
        validator: (body) => body.matrixVotes && typeof body.matrixVotes === 'object' && Object.keys(body.matrixVotes).length > 0
    },
    // Pairwise comparisons
    'pairwise': {
        field: 'pairwiseVotes',
        errorMessage: 'Please complete the comparisons',
        validator: (body) => Array.isArray(body.pairwiseVotes) && body.pairwiseVotes.length > 0
    },
    // Standard selection-based polls (multiple_choice, image, yes_no, scheduling, checkbox, etc.)
    // These all use selectedOptionIds
    'multiple_choice': {
        field: 'selectedOptionIds',
        errorMessage: 'Please select at least one option',
        validator: (body) => {
            const ids = body.selectedOptionIds || (body as any).choices || (body as any).optionIds || (body as any).selections;
            return Array.isArray(ids) && ids.length > 0;
        }
    },
    'image': {
        field: 'selectedOptionIds',
        errorMessage: 'Please select an image',
        validator: (body) => {
            const ids = body.selectedOptionIds || (body as any).choices || (body as any).optionIds || (body as any).selections;
            return Array.isArray(ids) && ids.length > 0;
        }
    },
    'yes_no': {
        field: 'selectedOptionIds',
        errorMessage: 'Please select Yes or No',
        validator: (body) => {
            const ids = body.selectedOptionIds || (body as any).choices || (body as any).optionIds || (body as any).selections;
            return Array.isArray(ids) && ids.length > 0;
        }
    },
    'scheduling': {
        field: 'selectedOptionIds',
        errorMessage: 'Please select at least one time slot',
        validator: (body) => {
            const ids = body.selectedOptionIds || (body as any).choices || (body as any).optionIds || (body as any).selections;
            return Array.isArray(ids) && ids.length > 0;
        }
    },
    'meeting': {
        field: 'selectedOptionIds',
        errorMessage: 'Please select at least one time slot',
        validator: (body) => {
            const ids = body.selectedOptionIds || (body as any).choices || (body as any).optionIds || (body as any).selections;
            return Array.isArray(ids) && ids.length > 0;
        }
    },
    'checkbox': {
        field: 'selectedOptionIds',
        errorMessage: 'Please select at least one option',
        validator: (body) => {
            const ids = body.selectedOptionIds || (body as any).choices || (body as any).optionIds || (body as any).selections;
            return Array.isArray(ids) && ids.length > 0;
        }
    },
    'open_ended': {
        field: 'comment',
        errorMessage: 'Please provide a response',
        validator: (body) => typeof body.comment === 'string' && body.comment.trim().length > 0
    }
};

// Default validator for unknown poll types - try selectedOptionIds
const DEFAULT_VALIDATION = {
    field: 'selectedOptionIds',
    errorMessage: 'Please select at least one option',
    validator: (body: VoteRequest) => {
        const ids = body.selectedOptionIds || (body as any).choices || (body as any).optionIds || (body as any).selections;
        return Array.isArray(ids) && ids.length > 0;
    }
};

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-vote: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    try {
        const body: VoteRequest = JSON.parse(event.body || '{}');
        
        console.log('vg-vote: Received body:', JSON.stringify(body));
        console.log('vg-vote: Body keys:', Object.keys(body));

        if (!body.pollId || typeof body.pollId !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        // Get poll from storage
        const store = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });
        
        console.log('vg-vote: Looking for poll:', body.pollId);
        console.log('vg-vote: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');
        
        const poll: Poll | null = await store.get(body.pollId, { type: 'json' });
        
        console.log('vg-vote: Poll found:', !!poll);
        
        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        console.log('vg-vote: Poll type:', poll.pollType);
        console.log('vg-vote: isSurvey:', poll.isSurvey);

        const anonymousMode = isAnonymousMode(poll);
        if (anonymousMode) {
            console.log('vg-vote: Anonymous mode ENABLED');
        }

        // ============================================
        // ANTI-BOT VALIDATION
        // ============================================
        
        if (!poll.blockedVotes) {
            poll.blockedVotes = { honeypot: 0, timing: 0, rateLimit: 0, total: 0 };
        }
        
        const blockVote = async (reason: 'honeypot' | 'timing' | 'rateLimit') => {
            poll.blockedVotes![reason]++;
            poll.blockedVotes!.total++;
            poll.blockedVotes!.lastBlocked = new Date().toISOString();
            await store.setJSON(body.pollId, poll);
            console.log(`vg-vote: Blocked (${reason}). Total blocked: ${poll.blockedVotes!.total}`);
            
            if (reason === 'rateLimit') {
                return {
                    statusCode: 429,
                    headers: { ...headers, 'Retry-After': '60' },
                    body: JSON.stringify({ 
                        error: 'Whoa, slow down! Too many votes submitted. Please wait a minute and try again.',
                        code: 'RATE_LIMITED',
                        retryAfter: 60,
                        friendlyMessage: true
                    })
                };
            }
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, voteId: 'blocked' })
            };
        };
        
        // Honeypot check
        if (body._hp && body._hp.length > 0) {
            console.log('vg-vote: Honeypot triggered, blocking bot');
            return await blockVote('honeypot');
        }
        
        // Timing check
        const MIN_VOTE_TIME_MS = 2000;
        if (body._t) {
            const timeTaken = Date.now() - body._t;
            if (timeTaken < MIN_VOTE_TIME_MS) {
                console.log(`vg-vote: Vote too fast (${timeTaken}ms), likely bot`);
                return await blockVote('timing');
            }
        }
        
        // Rate limiting
        const clientIp = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                         event.headers['client-ip'] || 
                         'unknown';
        const ipHash = await createIpHash(clientIp + body.pollId);
        
        const rateStore = getStore({
            name: 'rate-limits',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });
        
        const RATE_LIMIT_WINDOW_MS = 60000;
        const MAX_VOTES_PER_WINDOW = 5;
        
        try {
            const rateLimitKey = `vote_${ipHash}`;
            const existing = await rateStore.get(rateLimitKey, { type: 'json' }) as { timestamps: number[] } | null;
            const now = Date.now();
            
            const recentTimestamps = (existing?.timestamps || []).filter(
                (ts: number) => now - ts < RATE_LIMIT_WINDOW_MS
            );
            
            if (recentTimestamps.length >= MAX_VOTES_PER_WINDOW) {
                console.log(`vg-vote: Rate limit exceeded for ${ipHash.slice(0, 8)}...`);
                return await blockVote('rateLimit');
            }
            
            recentTimestamps.push(now);
            await rateStore.setJSON(rateLimitKey, { timestamps: recentTimestamps });
        } catch (rateLimitError) {
            console.error('Rate limiting check failed:', rateLimitError);
        }
        
        // ============================================
        // POLL STATUS CHECKS
        // ============================================
        
        if (poll.status === 'draft') {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'This poll is not yet open for voting. The organizer is still setting it up.' })
            };
        }
        
        if (poll.status === 'paused') {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'This poll is currently paused' })
            };
        }
        
        if (poll.status === 'closed') {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'This poll has been closed' })
            };
        }
        
        if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'This poll has closed. Voting is no longer available.' })
            };
        }
        
        // Check response limit
        const currentVoteCount = poll.votes?.length || poll.voteCount || 0;
        if (poll.maxResponses && currentVoteCount >= poll.maxResponses) {
            const isFreeLimit = poll.tier === 'free';
            console.log('[vg-vote] Response limit reached:', currentVoteCount, '>=', poll.maxResponses);
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: isFreeLimit 
                        ? 'This poll has reached its free plan limit. Ask the poll creator to upgrade for more responses!'
                        : 'This poll has reached its response limit.',
                    code: 'RESPONSE_LIMIT_REACHED',
                    isFreeLimit
                })
            };
        }

        // ============================================
        // SECURITY VALIDATION (PIN / ACCESS CODE)
        // ============================================
        
        if (poll.settings.security === 'pin' && poll.pin) {
            const submittedPin = (body.code || '').toString().toUpperCase().trim();
            const storedPin = poll.pin.toUpperCase().trim();
            if (!submittedPin || submittedPin !== storedPin) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Invalid PIN. Please check with the poll organizer.' })
                };
            }
        }

        if (poll.settings.security === 'code' && poll.allowedCodes && poll.allowedCodes.length > 0) {
            if (!body.code) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Access code required' })
                };
            }
            
            const normalizedCode = body.code.trim().toUpperCase();
            const validCodes = poll.allowedCodes.map((c: string) => c.toUpperCase());
            
            if (!validCodes.includes(normalizedCode)) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Invalid access code' })
                };
            }
            
            const usedCodes = poll.usedCodes || [];
            if (usedCodes.map((c: string) => c.toUpperCase()).includes(normalizedCode)) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'This access code has already been used' })
                };
            }
        }

        // ============================================
        // POLL TYPE VALIDATION - Handle ALL poll types
        // ============================================
        
        // Determine the effective poll type
        const isSurvey = poll.isSurvey || poll.pollType === 'survey';
        const effectivePollType = isSurvey ? 'survey' : poll.pollType;
        
        console.log('vg-vote: Effective poll type:', effectivePollType);
        
        // Get validation config for this poll type
        const validation = POLL_TYPE_VALIDATION[effectivePollType] || DEFAULT_VALIDATION;
        
        console.log('vg-vote: Using validation for field:', validation.field);
        
        // Normalize selectedOptionIds from various field names
        if (validation.field === 'selectedOptionIds') {
            const selectedIds = body.selectedOptionIds || (body as any).choices || (body as any).optionIds || (body as any).selections || (body as any).options;
            if (Array.isArray(selectedIds)) {
                body.selectedOptionIds = selectedIds;
            }
        }
        
        // Normalize rankedOptionIds
        if (validation.field === 'rankedOptionIds') {
            const rankedIds = body.rankedOptionIds || (body as any).rankings || (body as any).ranked;
            if (Array.isArray(rankedIds)) {
                body.rankedOptionIds = rankedIds;
            }
        }
        
        // Validate the vote data
        if (!validation.validator(body)) {
            console.log(`vg-vote: VALIDATION FAILED for ${effectivePollType} - ${validation.field} missing or empty`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: validation.errorMessage })
            };
        }
        
        console.log('vg-vote: Validation PASSED for', effectivePollType);
        
        // Additional validation for selection-based polls - check option IDs exist
        if (validation.field === 'selectedOptionIds' && body.selectedOptionIds) {
            const validOptionIds = new Set(poll.options.map(o => o.id));
            const invalidIds = body.selectedOptionIds.filter((id: string) => !validOptionIds.has(id));
            if (invalidIds.length > 0) {
                console.log('vg-vote: Invalid option IDs:', invalidIds);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid options selected' })
                };
            }
            
            // Check multiple selection setting
            if (!poll.settings.allowMultiple && body.selectedOptionIds.length > 1) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Only one selection allowed for this poll' })
                };
            }
        }
        
        // Additional validation for ranked polls - check option IDs exist
        if (validation.field === 'rankedOptionIds' && body.rankedOptionIds) {
            const validOptionIds = new Set(poll.options.map(o => o.id));
            const invalidIds = body.rankedOptionIds.filter((id: string) => !validOptionIds.has(id));
            if (invalidIds.length > 0) {
                console.log('vg-vote: Invalid ranked option IDs:', invalidIds);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid options in ranking' })
                };
            }
        }

        // ============================================
        // COLLECT ANALYTICS (GDPR-COMPLIANT)
        // ============================================
        let analytics: VoteAnalytics | undefined;
        
        if (!anonymousMode) {
            const userAgent = event.headers['user-agent'];
            const referrer = event.headers['referer'] || event.headers['referrer'];
            const clientIP = event.headers['x-nf-client-connection-ip'] || 
                             (event.headers['x-forwarded-for']?.split(',')[0]?.trim());
            
            const geoData = await getGeoFromIP(clientIP);
            
            analytics = {
                device: detectDevice(userAgent),
                country: geoData.country,
                region: geoData.region,
                referrerDomain: extractReferrerDomain(referrer),
                utmSource: extractUtmSource(referrer),
                timestamp: new Date().toISOString()
            };
            
            console.log('vg-vote: Analytics collected');
        } else {
            console.log('vg-vote: Anonymous mode - skipping analytics');
        }

        // ============================================
        // CREATE VOTE RECORD
        // ============================================
        const vote: Vote = {
            id: generateVoteId(),
            timestamp: anonymousMode 
                ? new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'
                : new Date().toISOString(),
        };

        // Add analytics if not anonymous
        if (analytics && !anonymousMode) {
            vote.analytics = analytics;
        }

        // Add vote data based on poll type
        if (body.surveyAnswers) {
            vote.surveyAnswers = body.surveyAnswers;
            if (body.startedAt) vote.startedAt = body.startedAt;
            if (body.completionTime) vote.completionTime = body.completionTime;
            console.log('vg-vote: Storing survey answers');
        }
        if (body.ratingVotes) {
            vote.ratingVotes = body.ratingVotes;
            console.log('vg-vote: Storing rating votes');
        }
        if (body.rankedOptionIds) {
            vote.rankedOptionIds = body.rankedOptionIds;
            console.log('vg-vote: Storing ranked options');
        }
        if (body.selectedOptionIds) {
            vote.selectedOptionIds = body.selectedOptionIds;
            console.log('vg-vote: Storing selected options');
        }
        if (body.matrixVotes) {
            vote.matrixVotes = body.matrixVotes;
            console.log('vg-vote: Storing matrix votes');
        }
        if (body.pairwiseVotes) {
            vote.pairwiseVotes = body.pairwiseVotes;
            console.log('vg-vote: Storing pairwise votes');
        }
        if (body.choicesMaybe) {
            vote.choicesMaybe = body.choicesMaybe;
        }

        // Add optional fields
        if (body.voterName && !anonymousMode) {
            vote.voterName = body.voterName;
        }
        if (body.code) {
            vote.usedCode = body.code;
        }
        if (body.comment && poll.settings.allowComments) {
            vote.comment = body.comment;
        }

        // Track used unique code
        if (poll.settings.security === 'code' && body.code) {
            poll.usedCodes = poll.usedCodes || [];
            poll.usedCodes.push(body.code.trim().toUpperCase());
        }

        // Save vote
        poll.votes.push(vote);
        poll.voteCount = poll.votes.length;

        await store.setJSON(body.pollId, poll);
        console.log(`vg-vote: Vote recorded for poll ${body.pollId}. Total: ${poll.voteCount}${anonymousMode ? ' (anonymous)' : ''}`);

        // ============================================
        // TRIGGER NOTIFICATIONS (non-blocking)
        // ============================================
        if (poll.tier === 'unlimited' && poll.notificationSettings?.enabled) {
            const suspiciousResult = await detectSuspiciousActivity(
                poll,
                ipHash,
                analytics?.device || 'unknown'
            );
            
            if (suspiciousResult.isSuspicious) {
                console.log(`vg-vote: Suspicious activity detected - ${suspiciousResult.reason}`);
                triggerNotification(poll, 'suspicious', {
                    reason: suspiciousResult.reason,
                    severity: suspiciousResult.severity,
                    details: suspiciousResult.details,
                    voteCount: poll.voteCount
                });
            }
            
            const milestone = checkMilestone(poll.voteCount);
            if (milestone) {
                triggerNotification(poll, 'milestone', {
                    milestone,
                    voteCount: poll.voteCount
                });
            }
            
            if (poll.maxResponses) {
                const limitPercent = checkLimitApproaching(poll.voteCount, poll.maxResponses);
                if (limitPercent) {
                    triggerNotification(poll, 'limit', {
                        limitPercent,
                        currentVotes: poll.voteCount,
                        maxVotes: poll.maxResponses
                    });
                }
            }
            
            if (vote.comment && poll.notificationSettings.notifyOn.newComment) {
                triggerNotification(poll, 'comment', {
                    commentText: vote.comment,
                    commentAuthor: anonymousMode ? 'Anonymous' : (vote.voterName || 'Anonymous')
                });
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                voteCount: poll.voteCount,
                anonymous: anonymousMode || undefined
            })
        };
    } catch (error) {
        console.error('Error submitting vote:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
        };
    }
};