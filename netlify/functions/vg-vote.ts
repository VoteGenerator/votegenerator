import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface VoteRequest {
    pollId: string;
    rankedOptionIds?: string[];
    selectedOptionIds?: string[];
}

interface Vote {
    id: string;
    rankedOptionIds?: string[];
    selectedOptionIds?: string[];
    timestamp: string;
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    pollType: string;
    options: { id: string; text: string }[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
    };
    votes: Vote[];
    createdAt: string;
    voteCount: number;
}

const generateVoteId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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

        // Accept multiple field names for flexibility
        const selectedIds = body.selectedOptionIds || (body as any).optionIds || (body as any).selections || (body as any).options;
        const rankedIds = body.rankedOptionIds || (body as any).rankings || (body as any).ranked;
        
        console.log('vg-vote: Normalized selectedIds:', selectedIds);
        console.log('vg-vote: Normalized rankedIds:', rankedIds);

        const validOptionIds = new Set(poll.options.map(o => o.id));

        // Check for ranked polls (ranked, ranked_choice)
        if (poll.pollType === 'ranked' || poll.pollType === 'ranked_choice') {
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

        const vote: Vote = {
            id: generateVoteId(),
            timestamp: new Date().toISOString()
        };

        if (poll.pollType === 'ranked' || poll.pollType === 'ranked_choice') {
            vote.rankedOptionIds = body.rankedOptionIds;
        } else {
            vote.selectedOptionIds = body.selectedOptionIds;
        }

        poll.votes.push(vote);
        poll.voteCount = poll.votes.length;

        await store.setJSON(body.pollId, poll);

        console.log(`Vote recorded for poll ${body.pollId}. Total: ${poll.voteCount}`);

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