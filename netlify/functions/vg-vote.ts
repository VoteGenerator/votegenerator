import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
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
        // Phase 2: Anonymous mode can also be in settings
        anonymousMode?: boolean;
    };
    votes: Vote[];
    createdAt: string;
    voteCount: number;
    tier?: string;
    maxResponses?: number;
    status?: 'draft' | 'live' | 'paused' | 'closed';
    // Survey mode
    isSurvey?: boolean;
    sections?: any[];
    surveySettings?: {
        allowBack?: boolean;
        showProgress?: boolean;
        showSummary?: boolean;
        completionMessage?: string;
        // Phase 2: Anonymous mode setting
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
    
    // Count recent votes
    const votesLast5Min = votes.filter((v: Vote) => 
        new Date(v.timestamp).getTime() > last5Minutes
    ).length;
    
    const votesLastHour = votes.filter((v: Vote) => 
        new Date(v.timestamp).getTime() > lastHour
    ).length;
    
    // Check for vote spike (more than 20 votes in 5 minutes for a poll with < 50 total)
    if (votesLast5Min > 20 && votes.length < 50) {
        return {
            isSuspicious: true,
            reason: 'Unusual vote spike detected',
            severity: 'high',
            details: {
                votesLast5Min,
                totalVotes: votes.length,
                pattern: 'spike'
            }
        };
    }
    
    // Check for sustained high activity (more than 100 votes in last hour for small poll)
    if (votesLastHour > 100 && votes.length < 200) {
        return {
            isSuspicious: true,
            reason: 'Unusually high voting activity',
            severity: 'medium',
            details: {
                votesLastHour,
                totalVotes: votes.length,
                pattern: 'sustained_activity'
            }
        };
    }
    
    // Check for device uniformity (>80% same device type in last 20 votes)
    if (votes.length >= 20) {
        const last20Votes = votes.slice(-20);
        const deviceCounts: Record<string, number> = {};
        last20Votes.forEach((v: Vote) => {
            const dev = v.analytics?.device || 'unknown';
            deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
        });
        
        const maxDeviceCount = Math.max(...Object.values(deviceCounts));
        if (maxDeviceCount > 16) { // 80% of 20
            return {
                isSuspicious: true,
                reason: 'Unusual device pattern detected',
                severity: 'low',
                details: {
                    deviceDistribution: deviceCounts,
                    pattern: 'device_uniformity'
                }
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
    
    // Check if we have any VERIFIED emails
    const verifiedEmails = settings.emails.filter((e: any) => e.verified === true);
    if (verifiedEmails.length === 0) {
        console.log(`No verified emails for poll ${poll.id} - skipping notification`);
        return;
    }
    
    // Check if we should skip (test votes) - except for suspicious activity
    if (type !== 'suspicious' && poll.voteCount <= settings.skipFirstVotes) {
        console.log(`Skipping notification - vote ${poll.voteCount} <= skipFirstVotes ${settings.skipFirstVotes}`);
        return;
    }
    
    // Check if this notification type is enabled
    if (type === 'milestone' && !settings.notifyOn.milestones) return;
    if (type === 'limit' && !settings.notifyOn.limitReached) return;
    if (type === 'comment' && !settings.notifyOn.newComment) return;
    // Suspicious activity alerts are always sent if notifications are enabled
    
    try {
        // Fire and forget - don't wait for response
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
// Create hash of IP for GDPR-compliant rate limiting (no raw IP stored)
const createIpHash = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input + (process.env.VOTE_TOKEN_SECRET || 'salt'));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
};
// Detect device type from User-Agent (GDPR safe - no storage of full UA)
const detectDevice = (userAgent: string | undefined): 'mobile' | 'desktop' | 'tablet' | 'unknown' => {
    if (!userAgent) return 'unknown';
    const ua = userAgent.toLowerCase();
    
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
    if (/windows|macintosh|linux/i.test(ua)) return 'desktop';
    
    return 'unknown';
};
// Extract domain from referrer (GDPR safe - no storage of full URL)
const extractReferrerDomain = (referrer: string | undefined): string | undefined => {
    if (!referrer) return undefined;
    try {
        const url = new URL(referrer);
        return url.hostname;
    } catch {
        return undefined;
    }
};
// Get country from IP using ipinfo.io (GDPR safe - IP is not stored, only country)
const getGeoFromIP = async (ip: string | undefined): Promise<{ country?: string; region?: string }> => {
    if (!ip || !process.env.IPINFO_TOKEN) {
        return {};
    }
    
    // Skip local/private IPs
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
// Extract UTM source from referrer URL
const extractUtmSource = (referrer: string | undefined): string | undefined => {
    if (!referrer) return undefined;
    try {
        const url = new URL(referrer);
        return url.searchParams.get('utm_source') || undefined;
    } catch {
        return undefined;
    }
};
// ============================================
// PHASE 2: Check if anonymous mode is enabled
// ============================================
const isAnonymousMode = (poll: Poll): boolean => {
    // Check surveySettings first (for surveys)
    if (poll.surveySettings?.anonymousMode === true) {
        return true;
    }
    // Also check settings (fallback)
    if (poll.settings?.anonymousMode === true) {
        return true;
    }
    return false;
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
        // Get poll from storage with explicit config
        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        
        console.log('vg-vote: Looking for poll:', body.pollId);
        console.log('vg-vote: VG_SITE_ID configured:', !!process.env.VG_SITE_ID);
        
        const poll: Poll | null = await store.get(body.pollId, { type: 'json' });
        
        console.log('vg-vote: Poll found:', !!poll);
        console.log('vg-vote: Poll type:', poll?.pollType);
        console.log('vg-vote: selectedOptionIds:', body.selectedOptionIds);
        console.log('vg-vote: rankedOptionIds:', body.rankedOptionIds);
        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }
        // ============================================
        // PHASE 2: Check anonymous mode early
        // ============================================
        const anonymousMode = isAnonymousMode(poll);
        if (anonymousMode) {
            console.log('vg-vote: Anonymous mode ENABLED - will not store identifying data');
        }
        // ============================================
        // ANTI-BOT VALIDATION
        // ============================================
        
        // Initialize blocked votes tracking if not exists
        if (!poll.blockedVotes) {
            poll.blockedVotes = { honeypot: 0, timing: 0, rateLimit: 0, total: 0 };
        }
        
        // Helper to save blocked vote and return
        const blockVote = async (reason: 'honeypot' | 'timing' | 'rateLimit') => {
            poll.blockedVotes![reason]++;
            poll.blockedVotes!.total++;
            poll.blockedVotes!.lastBlocked = new Date().toISOString();
            await store.setJSON(body.pollId, poll);
            console.log(`vg-vote: Blocked (${reason}). Total blocked: ${poll.blockedVotes!.total}`);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, voteId: 'blocked' })
            };
        };
        
        // 1. Honeypot check - if _hp field has value, it's a bot
        if (body._hp && body._hp.length > 0) {
            console.log('vg-vote: Honeypot triggered, blocking bot');
            return await blockVote('honeypot');
        }
        
        // 2. Timing check - votes submitted too fast are likely bots
        // Minimum 2 seconds between page load and vote submission
        const MIN_VOTE_TIME_MS = 2000;
        if (body._t) {
            const pageLoadTime = body._t;
            const now = Date.now();
            const timeTaken = now - pageLoadTime;
            
            if (timeTaken < MIN_VOTE_TIME_MS) {
                console.log(`vg-vote: Vote too fast (${timeTaken}ms), likely bot`);
                return await blockVote('timing');
            }
        }
        
        // 3. Rate limiting - max 5 votes per minute from same IP
        const clientIp = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                         event.headers['client-ip'] || 
                         'unknown';
        
        // Create IP hash for GDPR compliance (don't store raw IP)
        const ipHash = await createIpHash(clientIp + body.pollId);
        
        const rateStore = getStore({
            name: 'rate-limits',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        
        const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
        const MAX_VOTES_PER_WINDOW = 5;
        
        try {
            const rateLimitKey = `vote_${ipHash}`;
            const existing = await rateStore.get(rateLimitKey, { type: 'json' }) as { timestamps: number[] } | null;
            const now = Date.now();
            
            // Filter to only timestamps within the window
            const recentTimestamps = (existing?.timestamps || []).filter(
                (ts: number) => now - ts < RATE_LIMIT_WINDOW_MS
            );
            
            if (recentTimestamps.length >= MAX_VOTES_PER_WINDOW) {
                console.log(`vg-vote: Rate limit exceeded for ${ipHash.slice(0, 8)}... (${recentTimestamps.length} votes in last minute)`);
                return await blockVote('rateLimit');
            }
            
            // Add current timestamp and save
            recentTimestamps.push(now);
            await rateStore.setJSON(rateLimitKey, { timestamps: recentTimestamps });
        } catch (rateLimitError) {
            // Don't block votes if rate limiting fails, just log
            console.error('Rate limiting check failed:', rateLimitError);
        }
        
        // ============================================
        // Check poll status - block voting on draft, paused or closed polls
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
        
        // Check response limit (enforced for free tier polls)
        if (poll.maxResponses && poll.voteCount >= poll.maxResponses) {
            const isFreeLimit = poll.tier === 'free';
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: isFreeLimit 
                        ? 'This poll has reached its free plan limit of 100 responses. Ask the poll creator to upgrade for unlimited responses!'
                        : 'This poll has reached its response limit',
                    code: 'RESPONSE_LIMIT_REACHED',
                    isFreeLimit
                })
            };
        }

        // Security: Validate Shared PIN (case-insensitive, alphanumeric)
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

        // Security: Validate unique access code
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
            
            // Check if code already used
            const usedCodes = poll.usedCodes || [];
            if (usedCodes.map((c: string) => c.toUpperCase()).includes(normalizedCode)) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'This access code has already been used' })
                };
            }
        }
        // Accept multiple field names for flexibility
        const selectedIds = body.selectedOptionIds || (body as any).choices || (body as any).optionIds || (body as any).selections || (body as any).options;
        const rankedIds = body.rankedOptionIds || (body as any).rankings || (body as any).ranked;
        
        console.log('vg-vote: Normalized selectedIds:', selectedIds);
        console.log('vg-vote: Normalized rankedIds:', rankedIds);
        const validOptionIds = new Set(poll.options.map(o => o.id));
        // ============================================
        // SURVEY MODE - Different validation
        // ============================================
        const isSurvey = poll.isSurvey || poll.pollType === 'survey';
        
        if (isSurvey) {
            console.log('vg-vote: Survey mode - validating survey answers');
            
            if (!body.surveyAnswers || typeof body.surveyAnswers !== 'object') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Survey answers are required' })
                };
            }
            
            // For surveys, we don't validate against poll.options
            // The surveyAnswers contain question IDs from sections
            console.log('vg-vote: Survey answers count:', Object.keys(body.surveyAnswers).length);
        }
        // Check for ranked polls (ranked, ranked_choice)
        else if (poll.pollType === 'ranked' || poll.pollType === 'ranked_choice') {
            if (!Array.isArray(rankedIds) || rankedIds.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Please rank your choices' })
                };
            }
            const invalidIds = rankedIds.filter((id: string) => !validOptionIds.has(id));
            if (invalidIds.length > 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid options selected' })
                };
            }
            
            // Use normalized field
            body.rankedOptionIds = rankedIds;
        } else {
            if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
                console.log('vg-vote: VALIDATION FAILED - no selections found');
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Please select at least one option' })
                };
            }
            const invalidIds = selectedIds.filter((id: string) => !validOptionIds.has(id));
            if (invalidIds.length > 0) {
                console.log('vg-vote: VALIDATION FAILED - invalid option IDs:', invalidIds);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid options selected' })
                };
            }
            // Use normalized field
            body.selectedOptionIds = selectedIds;
            if (!poll.settings.allowMultiple && body.selectedOptionIds.length > 1) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Only one selection allowed for this poll' })
                };
            }
        }
        // ============================================
        // COLLECT ANALYTICS (GDPR-COMPLIANT)
        // PHASE 2: Skip if anonymous mode
        // ============================================
        let analytics: VoteAnalytics | undefined;
        
        if (!anonymousMode) {
            // Normal mode: collect full analytics
            const userAgent = event.headers['user-agent'];
            const referrer = event.headers['referer'] || event.headers['referrer'];
            // Netlify provides client IP in x-nf-client-connection-ip or x-forwarded-for
            const clientIP = event.headers['x-nf-client-connection-ip'] || 
                             (event.headers['x-forwarded-for']?.split(',')[0]?.trim());
            
            // Collect analytics data (IP is used for lookup only, NOT stored)
            const geoData = await getGeoFromIP(clientIP);
            
            analytics = {
                device: detectDevice(userAgent),
                country: geoData.country,
                region: geoData.region,
                referrerDomain: extractReferrerDomain(referrer),
                utmSource: extractUtmSource(referrer),
                timestamp: new Date().toISOString()
            };
            
            console.log('vg-vote: Analytics collected:', JSON.stringify(analytics));
        } else {
            // PHASE 2: Anonymous mode - do NOT collect analytics
            console.log('vg-vote: Anonymous mode - skipping analytics collection');
            analytics = undefined;
        }
        // ============================================
        // CREATE VOTE RECORD
        // PHASE 2: Minimal data for anonymous mode
        // ============================================
        const vote: Vote = {
            id: generateVoteId(),
            // PHASE 2: For anonymous mode, use a generic timestamp (just the date, no time)
            // This prevents ordering/correlation of responses
            timestamp: anonymousMode 
                ? new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'  // Just the date
                : new Date().toISOString(),  // Full timestamp
        };
        // Only add analytics if not anonymous
        if (analytics && !anonymousMode) {
            vote.analytics = analytics;
        }
        // Add vote data based on poll type
        if (isSurvey) {
            // Survey mode - store survey answers
            vote.surveyAnswers = body.surveyAnswers;
            console.log('vg-vote: Storing survey answers');
        } else if (poll.pollType === 'ranked' || poll.pollType === 'ranked_choice') {
            vote.rankedOptionIds = body.rankedOptionIds;
        } else {
            vote.selectedOptionIds = body.selectedOptionIds;
        }
        // Add optional fields
        // PHASE 2: In anonymous mode, don't store voterName even if provided
        if (body.voterName && !anonymousMode) {
            vote.voterName = body.voterName;
        }
        if (body.code) vote.usedCode = body.code;
        // PHASE 2: Comments are allowed in anonymous mode (they're already anonymous)
        if (body.comment && poll.settings.allowComments) vote.comment = body.comment;
        if (body.choicesMaybe) vote.choicesMaybe = body.choicesMaybe;
        if (body.matrixVotes) vote.matrixVotes = body.matrixVotes;
        if (body.pairwiseVotes) vote.pairwiseVotes = body.pairwiseVotes;
        if (body.ratingVotes) vote.ratingVotes = body.ratingVotes;
        // Track used unique code (if applicable)
        if (poll.settings.security === 'code' && body.code) {
            poll.usedCodes = poll.usedCodes || [];
            poll.usedCodes.push(body.code.trim().toUpperCase());
        }
        poll.votes.push(vote);
        poll.voteCount = poll.votes.length;
        await store.setJSON(body.pollId, poll);
        console.log(`Vote recorded for poll ${body.pollId}. Total: ${poll.voteCount}${anonymousMode ? ' (anonymous)' : ''}`);
        // ============================================
        // TRIGGER NOTIFICATIONS (non-blocking)
        // PHASE 2: Still send notifications in anonymous mode
        // (they don't expose individual response data)
        // ============================================
        if (poll.tier === 'unlimited' && poll.notificationSettings?.enabled) {
            // Check for suspicious activity (always check, even without explicit setting)
            // PHASE 2: Still check for suspicious activity in anonymous mode
            // (this is for poll security, not respondent tracking)
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
            
            // Check for milestone
            const milestone = checkMilestone(poll.voteCount);
            if (milestone) {
                triggerNotification(poll, 'milestone', {
                    milestone,
                    voteCount: poll.voteCount
                });
            }
            
            // Check for response limit approaching
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
            
            // Check for new comment
            if (vote.comment && poll.notificationSettings.notifyOn.newComment) {
                triggerNotification(poll, 'comment', {
                    commentText: vote.comment,
                    // PHASE 2: Don't include author name in anonymous mode
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
                // PHASE 2: Let client know response was recorded anonymously
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