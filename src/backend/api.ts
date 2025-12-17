// ============================================================================
// VoteGenerator - Netlify Functions API
// Main API endpoints for polls and voting
// ============================================================================

import type { HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
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

function jsonResponse(statusCode: number, body: any): HandlerResponse {
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

async function createPoll(event: HandlerEvent): Promise<HandlerResponse> {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const body = parseBody(event) as CreatePollRequest;
    
    let tier: PlanTier = 'free';
    
    if (body.purchaseId) {
      const purchase = await storage.getPurchase(body.purchaseId);
      if (purchase && purchase.status === 'completed' && !purchase.pollId) {
        tier = purchase.tier;
        await storage.savePurchase({
          ...purchase,
          pollId: 'pending',
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
      adminToken: result.poll!.adminToken,
    });
    
  } catch (error) {
    console.error('Create poll error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
}

// ----------------------------------------------------------------------------
// API: Get Poll (Public)
// GET /api/polls/:id
// ----------------------------------------------------------------------------

async function getPoll(event: HandlerEvent): Promise<HandlerResponse> {
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
}

// ----------------------------------------------------------------------------
// API: Get Poll (Admin)
// GET /api/polls/:id/admin/:token
// ----------------------------------------------------------------------------

async function getPollAdmin(event: HandlerEvent): Promise<HandlerResponse> {
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
}

// ----------------------------------------------------------------------------
// API: Update Poll
// PUT /api/polls/:id/admin/:token
// ----------------------------------------------------------------------------

async function updatePoll(event: HandlerEvent): Promise<HandlerResponse> {
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
}

// ----------------------------------------------------------------------------
// API: Delete Poll
// DELETE /api/polls/:id/admin/:token
// ----------------------------------------------------------------------------

async function deletePoll(event: HandlerEvent): Promise<HandlerResponse> {
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
}

// ----------------------------------------------------------------------------
// API: Close/Reopen Poll
// POST /api/polls/:id/admin/:token/close
// POST /api/polls/:id/admin/:token/reopen
// ----------------------------------------------------------------------------

async function togglePollStatus(event: HandlerEvent): Promise<HandlerResponse> {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  try {
    const pathParts = event.path.split('/');
    const action = pathParts.pop();
    const adminToken = pathParts.pop();
    pathParts.pop();
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
}

// ----------------------------------------------------------------------------
// API: Submit Vote
// POST /api/polls/:id/vote
// ----------------------------------------------------------------------------

async function submitVote(event: HandlerEvent): Promise<HandlerResponse> {
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
}

// ----------------------------------------------------------------------------
// API: Get Results (Public)
// GET /api/polls/:id/results
// ----------------------------------------------------------------------------

async function getResults(event: HandlerEvent): Promise<HandlerResponse> {
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
}

// ----------------------------------------------------------------------------
// API: Export Results
// GET /api/polls/:id/admin/:token/export?format=csv
// ----------------------------------------------------------------------------

async function exportResults(event: HandlerEvent): Promise<HandlerResponse> {
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
}

// ----------------------------------------------------------------------------
// API: Generate Voting Codes (Pro+)
// POST /api/polls/:id/admin/:token/codes
// ----------------------------------------------------------------------------

async function generateCodes(event: HandlerEvent): Promise<HandlerResponse> {
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
}

// ----------------------------------------------------------------------------
// API: Set Custom Short Link (Pro+)
// POST /api/polls/:id/admin/:token/shortlink
// ----------------------------------------------------------------------------

async function setShortLink(event: HandlerEvent): Promise<HandlerResponse> {
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
}

// ----------------------------------------------------------------------------
// Main Handler - Default Export
// ----------------------------------------------------------------------------

export const handler = async (
  event: HandlerEvent,
  _context: HandlerContext
): Promise<HandlerResponse> => {
  const path = event.path;
  const method = event.httpMethod;

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/vote$/)) {
    return submitVote(event);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/results$/)) {
    return getResults(event);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+\/export$/)) {
    return exportResults(event);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+\/codes$/)) {
    return generateCodes(event);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+\/shortlink$/)) {
    return setShortLink(event);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+\/(close|reopen)$/)) {
    return togglePollStatus(event);
  }
  
  if (path.match(/\/api\/polls\/[^/]+\/admin\/[^/]+$/)) {
    if (method === 'GET') return getPollAdmin(event);
    if (method === 'PUT') return updatePoll(event);
    if (method === 'DELETE') return deletePoll(event);
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  
  if (path.match(/\/api\/polls\/[^/]+$/)) {
    return getPoll(event);
  }
  
  if (path === '/api/polls' && method === 'POST') {
    return createPoll(event);
  }
  
  return jsonResponse(404, { error: 'Not found' });
};