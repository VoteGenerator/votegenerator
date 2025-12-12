# VoteGenerator 🗳️

**Free ranked-choice voting polls with no signup required.**

Create instant runoff voting polls in seconds. Share a link. Watch the consensus emerge.

---

## 🌟 Features

### Core Experience
- **Drag-to-Rank Voting** - Intuitive mobile-first interface. Users drag options to rank them from favorite to least favorite.
- **Instant Runoff Results** - Animated visualization shows how votes redistribute round-by-round until a majority winner emerges.
- **No Signup Required** - Zero friction. Create a poll, share a link, done.
- **Privacy-First** - No IP tracking. localStorage prevents duplicate votes from the same browser while allowing multiple voters on the same WiFi.

### For Poll Creators
- **Admin Dashboard** - View real-time vote counts, share links, and see detailed results.
- **Hidden Results Mode** - Keep results private until you're ready to reveal them.
- **Easy Sharing** - One-click share to WhatsApp, Twitter, Email, or copy link.
- **Vote Log** - See when votes came in and how people ranked.

### Technical Highlights
- **Netlify Functions** backend with Netlify Blobs storage
- **Framer Motion** animations throughout
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Mobile-optimized** drag and drop

---

## 📁 Project Structure

```
votegenerator/
├── src/
│   ├── components/
│   │   ├── VoteGeneratorApp.tsx      # Main app with routing
│   │   ├── VoteGeneratorCreate.tsx   # Poll creation form
│   │   ├── VoteGeneratorVote.tsx     # Drag-to-rank voting UI
│   │   ├── VoteGeneratorResults.tsx  # Animated runoff visualization
│   │   ├── VoteGeneratorAdmin.tsx    # Admin dashboard
│   │   └── VoteGeneratorConfirmation.tsx # Post-vote screen
│   ├── services/
│   │   ├── voteGeneratorService.ts   # API client
│   │   └── analyticsService.ts       # Event tracking
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Tailwind + custom styles
├── netlify/
│   └── functions/
│       ├── vg-create.ts              # Create poll API
│       ├── vg-get.ts                 # Get poll API
│       ├── vg-vote.ts                # Submit vote API
│       └── vg-results.ts             # Calculate runoff results API
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── netlify.toml
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Netlify CLI (for local development with functions)

### Installation

```bash
# Clone or copy the files
cd votegenerator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Local Development with Netlify Functions

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Run with functions
netlify dev
```

### Deploy to Netlify

1. Push to GitHub
2. Connect repo to Netlify
3. Build settings are in `netlify.toml`
4. Deploy!

---

## 🔧 URL Structure

| URL | View |
|-----|------|
| `/` or `/#` | Create new poll |
| `/#id=abc123` | Vote on poll |
| `/#id=abc123&admin=key` | Admin dashboard |
| `/vote/abc123` (redirect) | Nice URL → `/#id=abc123` |

---

## 📊 How Instant Runoff Voting Works

1. **Count first-choice votes** for each option
2. **Check for majority** (50%+) - if found, that option wins
3. **Eliminate lowest** - remove option with fewest votes
4. **Redistribute** - transfer eliminated votes to each voter's next choice
5. **Repeat** until someone wins

The results visualization animates this process, showing votes "flying" to their next choice when an option is eliminated.

---

## 💰 Future Monetization (Per-Poll Premium)

Since there are no accounts, premium features work per-poll using the admin key:

| Feature | Price |
|---------|-------|
| Remove Ads | $3 |
| Custom Logo | $7 |
| White Label (no branding) | $15 |

Implementation: Stripe Checkout → webhook updates poll's `premiumFeatures` field.

---

## 🔒 Security Approach

- **No IP logging** - Allows families on same WiFi to vote
- **localStorage token** - Prevents double-voting on same browser
- **Admin key** - Only way to access admin features, passed as URL param
- **No user accounts** - Nothing to hack, nothing to breach
- **CORS configured** - API only accepts requests from allowed origins

---

## 📈 Analytics Events

The app tracks these events (configure in `analyticsService.ts`):

- `votegenerator_poll_created`
- `votegenerator_vote_submitted`
- `votegenerator_link_copied`
- `votegenerator_share`
- `votegenerator_share_after_vote`
- `votegenerator_results_viewed`

---

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to add brand colors:

```js
theme: {
  extend: {
    colors: {
      'brand': {
        500: '#your-color',
      }
    }
  }
}
```

### Fonts
Fonts are loaded from Google Fonts in `index.css`. Change to your preferred fonts.

---

## 📝 License

MIT - Do whatever you want with it.

---

## 🙏 Credits

Built with:
- React + TypeScript
- Framer Motion
- Tailwind CSS
- Lucide Icons
- Netlify Functions + Blobs
- canvas-confetti 🎉

---

**Made with ❤️ for better group decisions**
