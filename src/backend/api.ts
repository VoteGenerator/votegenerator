// ============================================================================
// VoteGenerator - Netlify Functions API
// Main API endpoints for polls and voting
// ============================================================================

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { pollService } from './pollService';
import { voteService } from './voteService';
import { storage } from './storage';
import type { CreatePollRequest, SubmitVoteRequest, PlanTier } from './types';

// ----------------------------------------------------------------------------
// CORS Headers
// ----------------------------------------------------------------------------

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

function jsonResponse(statusCode: number, body: any) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

// ----------------------------------------------------------------------------
// Helper: Parse Request
// ----------------------------------------------------------------------------

function parseBody(event: HandlerEvent): any {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

function getClientInfo(event: HandlerEvent) {
  return {
    ip: event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
        event.headers['client-ip'] ||
        undefined,
    userAgent: event.headers['user-agent'],
    referrer: event.headers['referer'] || event.headers['referrer'],
  };
}

// ----------------------------------------------------------------------------
// API: Create Poll
// POST /api/polls
// ----------------------------------------------------------------------------

export const createPoll: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const body = parseBody(event) as CreatePollRequest;
    
    // Determine tier (default to free, can be upgraded via purchaseId)
    let tier: PlanTier = 'free';
    
    if (body.purchaseId) {
      const purchase = await storage.getPurchase(body.purchaseId);
      if (purchase && purchase.status === 'completed' && !purchase.pollId) {
        tier = purchase.tier;
        // Mark purchase as used
        await storage.savePurchase({
          ...purchase,
          pollId: 'pending', // Will be updated with actual pollId
          usedAt: new Date().toISOString(),
        });
      }
    }
    
    if (body.ownerId) {
      const user = await storage.getUser(body.ownerId);
      if (user && user.subscription.status === 'active') {
        tier = user.subscription.tier;
      }
    }
    
    const result = await pollService.createPoll(body, tier);
    
    if (!result.success) {
      return jsonResponse(400, { 
        success: false, 
        errors: result.errors 
      });
    }
    
    // If purchase was used, update it with pollId
    if (body.purchaseId && result.poll) {
      const purchase = await storage.getPurchase(body.purchaseId);
      if (purchase) {
        await storage.savePurchase({
          ...purchase,
          pollId: result.poll.id,
        });
      }
    }
    
    return jsonResponse(201, {
      success: true,
      poll: {
        id: result.poll!.id,
        type: result.poll!.type,
        question: result.poll!.question,
        status: result.poll!.status,
      },
      voterUrl: result.voterUrl,
      adminUrl: result.adminUrl,
      adminToken: result.poll!.adminToken, // Only returned on creation
    });
    
  } catch (error) {
    console.error('Create poll error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Get Poll (Public)
// GET /api/polls/:id
// ----------------------------------------------------------------------------

export const getPoll: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pollId = event.path.split('/').pop();
    if (!pollId) {
      return jsonResponse(400, { error: 'Poll ID required' });
    }
    
    const result = await pollService.getPollForVoting(pollId);
    
    if (!result.success) {
      return jsonResponse(404, { error: result.error });
    }
    
    // Get current vote count
    const aggregate = await storage.getVoteAggregate(pollId);
    
    return jsonResponse(200, {
      success: true,
      poll: {
        id: result.poll!.id,
        type: result.poll!.type,
        question: result.poll!.question,
        description: result.poll!.description,
        options: result.poll!.options,
        settings: result.poll!.settings,
        theme: result.poll!.theme,
        branding: result.poll!.branding,
        status: result.poll!.status,
        requiresCode: result.poll!.protection.uniqueCodes.enabled,
      },
      voteCount: aggregate?.totalVotes || 0,
    });
    
  } catch (error) {
    console.error('Get poll error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Get Poll (Admin)
// GET /api/polls/:id/admin/:token
// ----------------------------------------------------------------------------

export const getPollAdmin: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pathParts = event.path.split('/');
    const tokenIndex = pathParts.indexOf('admin') + 1;
    const pollId = pathParts[tokenIndex - 2];
    const adminToken = pathParts[tokenIndex];
    
    if (!pollId || !adminToken) {
      return jsonResponse(400, { error: 'Poll ID and admin token required' });
    }
    
    const result = await pollService.getPollForAdmin(pollId, adminToken);
    
    if (!result.success) {
      return jsonResponse(result.error === 'Invalid admin token' ? 403 : 404, { 
        error: result.error 
      });
    }
    
    // Get full results
    const results = await voteService.getAdminResults(pollId, adminToken);
    
    return jsonResponse(200, {
      success: true,
      poll: result.poll,
      results,
    });
    
  } catch (error) {
    console.error('Get poll admin error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Update Poll
// PUT /api/polls/:id/admin/:token
// ----------------------------------------------------------------------------

export const updatePoll: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'PUT') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pathParts = event.path.split('/');
    const tokenIndex = pathParts.indexOf('admin') + 1;
    const pollId = pathParts[tokenIndex - 2];
    const adminToken = pathParts[tokenIndex];
    
    if (!pollId || !adminToken) {
      return jsonResponse(400, { error: 'Poll ID and admin token required' });
    }
    
    const body = parseBody(event);
    
    const result = await pollService.updatePollSettings(pollId, adminToken, body);
    
    if (!result.success) {
      return jsonResponse(result.error === 'Invalid admin token' ? 403 : 404, { 
        error: result.error 
      });
    }
    
    return jsonResponse(200, {
      success: true,
      poll: result.poll,
    });
    
  } catch (error) {
    console.error('Update poll error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Delete Poll
// DELETE /api/polls/:id/admin/:token
// ----------------------------------------------------------------------------

export const deletePoll: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'DELETE') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pathParts = event.path.split('/');
    const tokenIndex = pathParts.indexOf('admin') + 1;
    const pollId = pathParts[tokenIndex - 2];
    const adminToken = pathParts[tokenIndex];
    
    if (!pollId || !adminToken) {
      return jsonResponse(400, { error: 'Poll ID and admin token required' });
    }
    
    const result = await pollService.deletePoll(pollId, adminToken);
    
    if (!result.success) {
      return jsonResponse(result.error === 'Invalid admin token' ? 403 : 404, { 
        error: result.error 
      });
    }
    
    return jsonResponse(200, { success: true });
    
  } catch (error) {
    console.error('Delete poll error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Close/Reopen Poll
// POST /api/polls/:id/admin/:token/close
// POST /api/polls/:id/admin/:token/reopen
// ----------------------------------------------------------------------------

export const togglePollStatus: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pathParts = event.path.split('/');
    const action = pathParts.pop(); // 'close' or 'reopen'
    const adminToken = pathParts.pop();
    pathParts.pop(); // 'admin'
    const pollId = pathParts.pop();
    
    if (!pollId || !adminToken) {
      return jsonResponse(400, { error: 'Poll ID and admin token required' });
    }
    
    let result;
    if (action === 'close') {
      result = await pollService.closePoll(pollId, adminToken);
    } else if (action === 'reopen') {
      result = await pollService.reopenPoll(pollId, adminToken);
    } else {
      return jsonResponse(400, { error: 'Invalid action' });
    }
    
    if (!result.success) {
      return jsonResponse(result.error === 'Invalid admin token' ? 403 : 400, { 
        error: result.error 
      });
    }
    
    return jsonResponse(200, { success: true });
    
  } catch (error) {
    console.error('Toggle poll status error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Submit Vote
// POST /api/polls/:id/vote
// ----------------------------------------------------------------------------

export const submitVote: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pollId = event.path.split('/').slice(-2)[0];
    if (!pollId) {
      return jsonResponse(400, { error: 'Poll ID required' });
    }
    
    const body = parseBody(event) as Omit<SubmitVoteRequest, 'pollId'>;
    const clientInfo = getClientInfo(event);
    
    const result = await voteService.submitVote(
      { ...body, pollId },
      clientInfo
    );
    
    if (!result.success) {
      return jsonResponse(400, {
        success: false,
        error: result.error,
        errors: result.errors,
      });
    }
    
    return jsonResponse(200, {
      success: true,
      voteId: result.voteId,
      results: result.results,
      quizScore: result.quizScore,
    });
    
  } catch (error) {
    console.error('Submit vote error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Get Results (Public)
// GET /api/polls/:id/results
// ----------------------------------------------------------------------------

export const getResults: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pollId = event.path.split('/').slice(-2)[0];
    if (!pollId) {
      return jsonResponse(400, { error: 'Poll ID required' });
    }
    
    const results = await voteService.getPublicResults(pollId);
    
    if (!results) {
      return jsonResponse(404, { error: 'Results not available' });
    }
    
    return jsonResponse(200, {
      success: true,
      results,
    });
    
  } catch (error) {
    console.error('Get results error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Export Results
// GET /api/polls/:id/admin/:token/export?format=csv
// ----------------------------------------------------------------------------

export const exportResults: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pathParts = event.path.split('/');
    const pollId = pathParts[pathParts.indexOf('polls') + 1];
    const adminToken = pathParts[pathParts.indexOf('admin') + 1];
    
    if (!pollId || !adminToken) {
      return jsonResponse(400, { error: 'Poll ID and admin token required' });
    }
    
    const params = event.queryStringParameters || {};
    const format = (params.format as 'csv' | 'json') || 'csv';
    
    const result = await voteService.exportResults(pollId, adminToken, {
      format,
      includeTimestamps: params.timestamps === 'true',
      includeComments: params.comments === 'true',
      includeAnalytics: params.analytics === 'true',
    });
    
    if (!result.success) {
      return jsonResponse(400, { error: result.error });
    }
    
    const contentType = format === 'json' ? 'application/json' : 'text/csv';
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      },
      body: result.data!,
    };
    
  } catch (error) {
    console.error('Export results error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Generate Voting Codes (Pro+)
// POST /api/polls/:id/admin/:token/codes
// ----------------------------------------------------------------------------

export const generateCodes: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pathParts = event.path.split('/');
    const pollId = pathParts[pathParts.indexOf('polls') + 1];
    const adminToken = pathParts[pathParts.indexOf('admin') + 1];
    
    if (!pollId || !adminToken) {
      return jsonResponse(400, { error: 'Poll ID and admin token required' });
    }
    
    const body = parseBody(event);
    const count = body.count || 10;
    
    const result = await pollService.generateVotingCodes(pollId, adminToken, count);
    
    if (!result.success) {
      return jsonResponse(400, { error: result.error });
    }
    
    return jsonResponse(200, {
      success: true,
      codes: result.codes,
    });
    
  } catch (error) {
    console.error('Generate codes error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// API: Set Custom Short Link (Pro+)
// POST /api/polls/:id/admin/:token/shortlink
// ----------------------------------------------------------------------------

export const setShortLink: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pathParts = event.path.split('/');
    const pollId = pathParts[pathParts.indexOf('polls') + 1];
    const adminToken = pathParts[pathParts.indexOf('admin') + 1];
    
    if (!pollId || !adminToken) {
      return jsonResponse(400, { error: 'Poll ID and admin token required' });
    }
    
    const body = parseBody(event);
    const shortCode = body.shortCode;
    
    if (!shortCode) {
      return jsonResponse(400, { error: 'Short code required' });
    }
    
    const result = await pollService.setCustomShortLink(pollId, adminToken, shortCode);
    
    if (!result.success) {
      return jsonResponse(400, { error: result.error });
    }
    
    const baseUrl = process.env.URL || 'https://votegenerator.com';
    
    return jsonResponse(200, {
      success: true,
      shortUrl: `${baseUrl}/v/${shortCode}`,
    });
    
  } catch (error) {
    console.error('Set short link error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

// ----------------------------------------------------------------------------
// Default Export for single-file deployment
// ----------------------------------------------------------------------------

export const handler: Handler = async (event, context) => {
  const path = event.path;
  const method = event.httpMethod;
  
  // Route to appropriate handler
  if (path.match(/\/api\/polls\/[^/]+\/vote$/)) {
    return submitVote(event, context);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/results$/)) {
    return getResults(event, context);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+\/export$/)) {
    return exportResults(event, context);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+\/codes$/)) {
    return generateCodes(event, context);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+\/shortlink$/)) {
    return setShortLink(event, context);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+\/(close|reopen)$/)) {
    return togglePollStatus(event, context);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+$/)) {
    if (method === 'GET') return getPollAdmin(event, context);
    if (method === 'PUT') return updatePoll(event, context);
    if (method === 'DELETE') return deletePoll(event, context);
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  if (path.match(/\/api\/polls\/[^/]+$/)) {
    return getPoll(event, context);
  }
  
  if (path === '/api/polls' && method === 'POST') {
    return createPoll(event, context);
  }
  
  return jsonResponse(404, { error: 'Not found' });
};