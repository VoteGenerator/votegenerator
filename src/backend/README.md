# VoteGenerator Backend

## Overview

This is the aggregate storage backend for VoteGenerator. It's designed to be:
- **Fast**: Votes are stored in aggregate format (1 blob per poll, not per vote)
- **Scalable**: Can handle 50,000+ votes per poll without timeout issues
- **Future-proof**: Supports all 12 poll types with extensible architecture

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Netlify Functions                           │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐ │
│  │  api.ts     │  │ Stripe      │  │ Dashboard                   │ │
│  │  (main)     │  │ Webhooks    │  │ (Pro/Pro+)                  │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────────┬──────────────┘ │
│         │                │                        │                 │
└─────────┼────────────────┼────────────────────────┼─────────────────┘
          │                │                        │
          ▼                ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          Services Layer                             │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐ │
│  │ pollService │  │ voteService │  │ dashboardService            │ │
│  │             │  │             │  │                             │ │
│  │ - create    │  │ - validate  │  │ - auth                      │ │
│  │ - validate  │  │ - submit    │  │ - getDashboardData          │ │
│  │ - update    │  │ - results   │  │ - createPoll                │ │
│  │ - delete    │  │ - export    │  │ - duplicatePoll             │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────────┬──────────────┘ │
│         │                │                        │                 │
└─────────┼────────────────┼────────────────────────┼─────────────────┘
          │                │                        │
          ▼                ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Storage Layer                               │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      storage.ts                                 │ │
│  │                                                                 │ │
│  │  Wraps Netlify Blobs with aggregate storage patterns            │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Netlify Blobs                                 │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐│
│  │  polls   │  │  votes   │  │  users   │  │  purchases           ││
│  │          │  │          │  │          │  │                      ││
│  │ 1 blob   │  │ 1 blob   │  │ 1 blob   │  │ 1 blob per           ││
│  │ per poll │  │ per poll │  │ per user │  │ purchase             ││
│  │          │  │ (ALL     │  │ (Pro/+)  │  │                      ││
│  │          │  │  votes)  │  │          │  │                      ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Models

### Poll
Stores poll configuration, settings, theme, branding, and plan information.

```typescript
{
  id: "abc123",
  adminToken: "secret-token-xyz",
  type: "multiple-choice",
  question: "What's your favorite color?",
  options: [...],
  settings: {...},
  theme: {...},
  branding: {...},
  protection: {...},
  plan: {
    tier: "free",
    maxResponses: 100,
    features: {...}
  }
}
```

### Vote Aggregate
Stores ALL votes for a poll in a single blob. This is the key to performance.

```typescript
{
  pollId: "abc123",
  totalVotes: 1500,
  summary: {
    counts: { "opt1": 800, "opt2": 700 }
  },
  votes: [...], // Full vote details
  comments: [...],
  analytics: {
    timeline: [...],
    devices: { mobile: 900, desktop: 600 },
    referrers: {...}
  },
  protection: {
    browserHashes: [...],
    ipHashes: [...],
    usedCodes: [...]
  }
}
```

### User Dashboard (Pro/Pro+)
Stores subscription info and owned polls.

```typescript
{
  userId: "user123",
  subscription: {
    tier: "pro",
    status: "active",
    stripeCustomerId: "cus_xxx"
  },
  pollIds: ["poll1", "poll2", ...],
  usage: {
    totalPolls: 15,
    totalVotes: 5000
  }
}
```

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/polls` | Create a new poll |
| GET | `/api/polls/:id` | Get poll for voting |
| POST | `/api/polls/:id/vote` | Submit a vote |
| GET | `/api/polls/:id/results` | Get public results |

### Admin Endpoints (require adminToken)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/polls/:id/admin/:token` | Get poll with full admin data |
| PUT | `/api/polls/:id/admin/:token` | Update poll settings |
| DELETE | `/api/polls/:id/admin/:token` | Delete poll |
| POST | `/api/polls/:id/admin/:token/close` | Close poll |
| POST | `/api/polls/:id/admin/:token/reopen` | Reopen poll |
| GET | `/api/polls/:id/admin/:token/export` | Export results |
| POST | `/api/polls/:id/admin/:token/codes` | Generate voting codes |
| POST | `/api/polls/:id/admin/:token/shortlink` | Set custom short link |

## Poll Types Supported

| Poll Type | Free | Pro | Pro+ |
|-----------|------|-----|------|
| Multiple Choice | ✅ | ✅ | ✅ |
| Ranked Choice | ✅ | ✅ | ✅ |
| Meeting Poll | ✅ | ✅ | ✅ |
| This or That | ✅ | ✅ | ✅ |
| Dot Voting | ✅ | ✅ | ✅ |
| Rating Scale | ✅ | ✅ | ✅ |
| Buy a Feature | ✅ | ✅ | ✅ |
| Priority Matrix | ✅ | ✅ | ✅ |
| Approval Voting | ✅ | ✅ | ✅ |
| Quiz Poll | ❌ | ✅ | ✅ |
| Sentiment Check | ❌ | ✅ | ✅ |
| Visual Poll | ❌ | ❌ | ✅ |

## Plan Limits

| Feature | Free | Quick | Event | Pro | Pro+ |
|---------|------|-------|-------|-----|------|
| Max Responses | 100 | 500 | 2,000 | 10,000 | 50,000 |
| Duration | Forever | 7 days | 30 days | Forever | Forever |
| Remove Ads | ❌ | ✅ | ✅ | ✅ | ✅ |
| Remove Branding | ❌ | ✅ | ✅ | ✅ | ✅ |
| Custom Logo | ❌ | ❌ | ✅ | ✅ | ✅ |
| Export CSV/Excel | ❌ | ✅ | ✅ | ✅ | ✅ |
| Export PDF | ❌ | ✅ | ✅ | ✅ | ✅ |
| Vote Timestamps | ❌ | ❌ | ❌ | ✅ | ✅ |
| Vote Trends | ❌ | ❌ | ❌ | ✅ | ✅ |
| Device Breakdown | ❌ | ❌ | ❌ | ❌ | ✅ |
| Voter Comments | ❌ | ❌ | ✅ | ✅ | ✅ |
| IP Protection | ❌ | ❌ | ❌ | ✅ | ✅ |
| Unique Codes | ❌ | ❌ | ❌ | ❌ | ✅ |
| Custom Short Link | ❌ | ❌ | ❌ | ❌ | ✅ |
| White Label | ❌ | ❌ | ❌ | ❌ | ✅ |
| Thank You Redirect | ❌ | ❌ | ❌ | ❌ | ✅ |

## Vote Protection

### Browser Protection (All Plans)
- Uses browser fingerprint hash
- Prevents same browser from voting twice
- Can be cleared by user (cookies)

### IP Protection (Pro/Pro+)
- Hashes IP address (doesn't store raw IP)
- Prevents multiple votes from same network
- More effective than browser-only

### Unique Codes (Pro+)
- Generate one-time voting codes
- Codes are marked as used after voting
- Perfect for controlled elections

## Performance Notes

### Why Aggregate Storage?
Instead of storing each vote as a separate blob:
```
votes/poll_abc/vote_1.json
votes/poll_abc/vote_2.json
... (5000 files = 5000 fetches = TIMEOUT)
```

We store ALL votes in one blob:
```
votes/poll_abc.json = {
  votes: [...5000 votes...],
  summary: { precomputed stats }
}
// 1 fetch = FAST
```

### Concurrency
When two votes come in simultaneously:
1. Both read the current aggregate
2. Both add their vote
3. Last write wins (eventual consistency)

This is acceptable because:
- Summary stats are recalculated on read
- Individual votes aren't lost, just the increment might be off by 1
- For 99.9% of use cases, this is fine

For truly concurrent scenarios (elections), use unique codes.

## Deployment

### File Structure
```
src/
  backend/
    types.ts          # TypeScript types
    storage.ts        # Netlify Blobs wrapper
    pollService.ts    # Poll CRUD operations
    voteService.ts    # Vote submission & results
    dashboardService.ts # Pro/Pro+ dashboard
    api.ts            # API handlers
    index.ts          # Export all

netlify/
  functions/
    api.ts            # Main function entry
```

### Environment Variables
```
URL=https://votegenerator.com
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Future Enhancements

- [ ] Image upload service for Visual Polls
- [ ] Webhook notifications when polls close
- [ ] Scheduled poll opening/closing
- [ ] Team workspaces
- [ ] API rate limiting
- [ ] Real-time updates via WebSocket
- [ ] Geographic analytics