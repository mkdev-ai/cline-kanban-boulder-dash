# Boulder Dash × Worms

A Boulder Dash-style game with Worms-like destructible terrain, built with **Vite** and **TypeScript**.

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9 (bundled with Node)

## Getting started

```bash
npm install
npm run dev
```

Vite will start a dev server (default: http://localhost:3000) and open your browser automatically.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check + production bundle → `dist/` |
| `npm run preview` | Serve the production bundle locally |
| `npm run lint` | Run ESLint across `src/` |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format `src/` with Prettier |

## Project structure

```
src/
├── core/           # Engine subsystems (GameLoop, CanvasManager, GameConfig)
├── entities/       # Player, boulders, diamonds, enemies
├── physics/        # Collision detection, rigid-body helpers
├── terrain/        # Destructible terrain (pixel-map + chunk system)
├── assets/         # Sprite sheets, audio clips
├── ui/             # HUD, menus, overlays
└── utils/          # Pure utility functions (math, geometry, …)
```

## Architecture notes

- **Fixed timestep** — the game loop runs physics at exactly 60 Hz regardless of frame rate, using the "Fix Your Timestep" pattern.  The render callback receives an `alpha` interpolation factor for smooth visuals between steps.
- **HiDPI canvas** — `CanvasManager` scales the backing store by `window.devicePixelRatio` and keeps the CSS size at 100 vw × 100 vh.
- **No magic numbers** — all constants live in `src/core/GameConfig.ts`.
