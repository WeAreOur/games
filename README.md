# WeAreOur Games Platform

A modular, scalable game platform built with TypeScript, Astro, and a three-domain scoring architecture. Designed to support multiple games with consistent storage, networking, and deployment patterns.

## Architecture

```
maths/
├── apps/
│   └── web/                  # Astro SSG shell (GitHub Pages)
├── packages/
│   ├── core/                 # Shared types, storage, networking
│   │   ├── game/            # Game lifecycle interface
│   │   ├── storage/         # Storage adapters (IndexedDB, etc)
│   │   ├── scores/          # Score domain model
│   │   └── networking/      # Network adapters (local, WebRTC, etc)
│   └── games-sum/           # Sum game module (first game)
├── package.json             # Monorepo root (pnpm workspaces)
├── tsconfig.json            # Root TypeScript config
└── astro.config.ts          # Root Astro config
```

## Setup

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development mode (watch)
pnpm dev

# Type checking
pnpm type-check
```

### Running the Web App

```bash
cd apps/web
pnpm dev   # Start development server (http://localhost:3000)
pnpm build # Build for GitHub Pages
pnpm build && pnpm preview  # Local preview of production build
```

## Three-Domain Scoring Model

### 1. **Player Score**
Cross-game lifetime statistics and achievements.
- Total points across all games
- Per-game statistics (highest level, best streak, etc)
- Achievement tracking

### 2. **Session Score**
Current play session cumulative points and progression.
- Score accumulated in current session
- Current streak and level
- Session duration and round count

### 3. **Game Score**
Per-round/match details and event timeline.
- Individual round results (correct/incorrect)
- Response time tracking
- Points delta per round
- Deterministic replay data

## Storage Architecture

**Primary**: IndexedDB (async, reliable, large capacity)
- Three-domain schema with proper indexing
- Eventual fallback to localStorage for compatibility

**Planned Future**: OPFS (Origin Private File System) for larger datasets

## Game Development

### Creating a New Game

1. Create a new package in `packages/games-yourname/`
2. Implement the `GameModule` interface from `@weareour/core`
3. Export `create{YourGame}Game()` factory function
4. Create React component in `apps/web/src/components/{YourGame}.tsx`
5. Add route in `apps/web/src/pages/games/yourname/index.astro`
6. Add to home page game grid

### Game Lifecycle

```typescript
// Initialize
const game = createYourGame();
const state = await game.init({ level: 1 });

// Handle commands
const events = await game.handleCommand(state, {
  type: "answer",
  timestamp: Date.now(),
  data: { answer: "user_input" }
});

// Get current state
const currentState = game.getState();

// Reset
await game.reset();
```

## Networking

### Current: Local Mode
Single-player mode with IndexedDB persistence.

### Planned: WebRTC P2P
- DataChannel for real-time multiplayer
- External stateless signaling (Cloudflare Workers or Supabase)
- Event-sourced game state for deterministic replay

## Deployment

Builds deploy to GitHub Pages as static files from `dist/` directory.

```bash
# Build static site
pnpm build

# Deploy to GitHub Pages
# Files in dist/ are served as static assets
```

## File Structure Reference

- **types.ts**: Core type definitions and interfaces
- **module.ts**: Game module implementation
- **indexeddb.ts**: IndexedDB storage adapter
- **local.ts**: Local network adapter for single-player
- **SumGame.tsx**: React UI wrapper for game

## Future Enhancements

- [ ] WebRTC P2P multiplayer support
- [ ] Cloudflare Workers signaling service
- [ ] Leaderboards and player profiles
- [ ] Mobile app using same core
- [ ] Analytics and progression tracking
- [ ] Game templates for rapid development
- [ ] Browser multiplayer lobbies

## License

MIT
