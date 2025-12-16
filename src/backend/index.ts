// ============================================================================
// VoteGenerator - Backend Index
// Export all modules for easy importing
// ============================================================================

// Types
export * from './types';

// Storage
export { storage, generateId, generateAdminToken, generateShortCode, hashForProtection } from './storage';

// Services
export { pollService } from './pollService';
export { voteService } from './voteService';
export { dashboardService } from './dashboardService';

// API Handlers
export * from './api';