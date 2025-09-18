# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Project overview
- Stack: Vite + React + TypeScript + Tailwind CSS + shadcn-ui + Radix UI + TanStack Query + next-themes
- Dev server: Vite on port 8080 (configured in vite.config.ts), host "::" (IPv6). Path alias '@' resolves to ./src

Quick commands
- Install deps: npm i
- Start dev server (http://localhost:8080): npm run dev
- Production build: npm run build
- Development-mode build: npm run build:dev
- Preview local build (serves dist): npm run preview
- Lint: npm run lint
Notes
- No test runner is configured in this repo (no Jest/Vitest/Cypress/Playwright). Running a single test is not applicable until a test framework is added.
- ESLint script exists but no explicit ESLint config file is present; it may rely on defaults. If linting fails due to missing config, add an ESLint config before relying on the lint script.

Architecture and structure
- Entry point: src/main.tsx mounts the React root and renders <App />. Global styles come from src/index.css (Tailwind layers, CSS variables, theme tokens, animations, and utility classes for the gaming theme). Public assets live under public/assets
- App shell and providers: src/App.tsx creates a TanStack QueryClient and wraps the app with providers in this order: QueryClientProvider → ThemeProvider (next-themes, class-based dark mode) → TooltipProvider → Toasters (shadcn + sonner) → BrowserRouter. Routes:
  - / → src/pages/Index.tsx (marketing/landing composition)
  - /games → src/pages/Games.tsx (search/filter/browse games)
  - * → src/pages/NotFound.tsx
- Pages
  - Index.tsx composes sections: Header, HeroSection, TopHitsSection, AboutSection, GameAcquisitionSection, ContactSection, Footer
  - Games.tsx is the interactive catalogue. Local UI state toggles filter visibility. It consumes the useGames() hook for data, passes filters to components (GameSearch, GameFilters), and renders results with GameGrid (includes skeletons and empty states)
  - NotFound.tsx reports 404 to console and links back home
- Data and domain types
  - src/types/Game.ts defines Game, GameCategory, SortOption, and GameFilters
  - src/data/mockGames.ts provides a static array of Game items used as the data source
  - src/hooks/useGames.ts is the local data layer: holds filters in state, derives filtered/sorted results via useMemo, and exposes featured/popular subsets alongside simple stats (total, filtered count). It’s structured to be replaced later with a real API while keeping the component API stable
- UI system
  - shadcn-derived primitives under src/components/ui (button, select, badge, etc.). Button variants include project-specific styles like gaming, gaming-outline, gaming-neon, gaming-purple, and nav-link
  - Domain components (Header, HeroSection, GameGrid, GameFilters, GameSearch, etc.) compose these primitives. GameGrid provides skeleton loading and search-aware empty states
- Styling and theming
  - Tailwind configured in tailwind.config.ts with class-based dark mode, extended colors mapped to CSS variables, animations, and shadows tailored for a “gaming” look
  - src/index.css defines the design tokens in CSS variables for light/dark themes, gradient helpers, glass effects, shadows, custom components (gaming-card), and utility classes (text-gradient, hero-bg, hover-lift)
  - next-themes applies the theme by toggling a class on the root, aligning with Tailwind’s darkMode: "class"
- Tooling
  - Vite config (vite.config.ts): React SWC plugin; dev server on 8080; alias @ → ./src; optional lovable-tagger plugin active only in development mode
  - TypeScript configs (tsconfig.json, tsconfig.app.json, tsconfig.node.json) define strictness, bundler resolution, and the @/* path alias
  - PostCSS (postcss.config.js) and Tailwind are wired up. No Prettier config is present

Operational notes for Warp
- When starting the dev server, bind runs on port 8080 by default. If the port is occupied, either stop the other process or run: vite --port 0 (or set VITE_PORT) and update commands accordingly
- The data shown in /games is fully local (mockGames). Network requests are not involved, so failures there won’t be due to API connectivity
- If you need to import from src anywhere, prefer the @ alias (e.g., import X from "@/lib/utils"). This works in both Vite and TypeScript via matching alias configs

External docs and repo readme
- README.md includes local development steps (npm i; npm run dev), stack summary, and Lovable deployment notes (Share → Publish in Lovable). Follow those when deploying via Lovable
