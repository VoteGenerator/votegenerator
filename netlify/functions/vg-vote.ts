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
    surveySettings?: any;
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

// Fire notification (non-blocking)
async function triggerNotification(
    poll: Poll,
    type: 'milestone' | 'limit' | 'comment',
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
    
    // Check if we should skip (test votes)
    if (poll.voteCount <= settings.skipFirstVotes) {
        console.log(`Skipping notification - vote ${poll.voteCount} <= skipFirstVotes ${settings.skipFirstVotes}`);
        return;
    }
    
    // Check if this notification type is enabled
    if (type === 'milestone' && !settings.notifyOn.milestones) return;
    if (type === 'limit' && !settings.notifyOn.limitReached) return;
    if (type === 'comment' && !settings.notifyOn.newComment) return;
    
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
        // ANTI-BOT VALIDATION
        // ============================================
        
        // 1. Honeypot check - if _hp field has value, it's a bot
        if (body._hp && body._hp.length > 0) {
            console.log('vg-vote: Honeypot triggered, blocking bot');
            // Return success to not alert the bot, but don't save vote
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, voteId: 'blocked' })
            };
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
                // Return success to not alert the bot, but don't save vote
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true, voteId: 'blocked' })
                };
            }
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

        // Security: Validate PIN
        if (poll.settings.security === 'pin' && poll.pin) {
            if (!body.code || body.code !== poll.pin) {
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
        // ============================================
        const userAgent = event.headers['user-agent'];
        const referrer = event.headers['referer'] || event.headers['referrer'];
        // Netlify provides client IP in x-nf-client-connection-ip or x-forwarded-for
        const clientIP = event.headers['x-nf-client-connection-ip'] || 
                         (event.headers['x-forwarded-for']?.split(',')[0]?.trim());
        
        // Collect analytics data (IP is used for lookup only, NOT stored)
        const geoData = await getGeoFromIP(clientIP);
        
        const analytics: VoteAnalytics = {
            device: detectDevice(userAgent),
            country: geoData.country,
            region: geoData.region,
            referrerDomain: extractReferrerDomain(referrer),
            utmSource: extractUtmSource(referrer),
            timestamp: new Date().toISOString()
        };
        
        console.log('vg-vote: Analytics collected:', JSON.stringify(analytics));

        // ============================================
        // CREATE VOTE RECORD
        // ============================================
        const vote: Vote = {
            id: generateVoteId(),
            timestamp: new Date().toISOString(),
            analytics
        };

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
        if (body.voterName) vote.voterName = body.voterName;
        if (body.code) vote.usedCode = body.code;
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

        console.log(`Vote recorded for poll ${body.pollId}. Total: ${poll.voteCount}`);

        // ============================================
        // TRIGGER NOTIFICATIONS (non-blocking)
        // ============================================
        if (poll.tier === 'unlimited' && poll.notificationSettings?.enabled) {
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
                    commentAuthor: vote.voterName || 'Anonymous'
                });
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                voteCount: poll.voteCount
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