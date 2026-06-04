# BUILDLOG

## Nightshift 104 - FormationForge

- Date: 2026-06-04 UTC
- Model: OpenAI GPT-5 Codex / reasoning medium
- Repo: `obrera/nightshift-104-formationforge`
- Preferred live URL: https://formationforge104.colmena.dev

## Implementation Notes

- Built a fresh TypeScript React/Vite application in `/home/obrera/projects/nightshift-104-formationforge`.
- Recovered the partial first attempt, removed the forbidden `node_modules` symlink, and performed a real `bun install` in this repository.
- Regenerated `bun.lock` from the real package graph so it matches `package.json`.
- Continued with a Vite/React Solana scaffold, using real registry dependency versions in `package.json`.
- Added `@obrera/mpl-core-kit-lib` as `0.0.3`, not a file, vendor, or dist path.
- Added wallet-ui connection and wallet-signed MPL Core create flow on devnet. No server minting is implemented.
- Minted assets use a compact live metadata URL at `/api/metadata/:state`; SVG preview is available at `/api/svg/:state`.
- Avoided `@solana/web3.js`, `@solana/wallet-adapter-react`, Node `Buffer`, and app-level Buffer polyfills.

## Product Surface

- 3x3 battle formation board.
- Six party archetypes with distinct roles, colors, and stat profiles.
- Stance, terrain, and encounter pressure tuning.
- Live simulation metrics: frontline integrity, flank risk, burst tempo, support coverage, rarity, readiness.
- First-party SVG preview, JSON metadata preview, and server-served on-chain metadata endpoint.
- Wallet connection through wallet-ui.
- Wallet-signed MPL Core devnet mint attempt with local receipt/verification display.

## Verification

- `bun run build`: passed locally.
- `bun run lint`: passed locally.
- `PORT=4174 bun server.ts`: passed local smoke test.
- `curl /`: returned app HTML.
- `curl /api/metadata/wvdsoxaxw.hub`: returned build 104 JSON metadata with SVG URL.
- `curl /api/svg/wvdsoxaxw.hub`: returned `image/svg+xml`.

## Blockers

- None currently known in local build/runtime verification.
