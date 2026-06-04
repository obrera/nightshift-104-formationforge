# FormationForge

FormationForge is Nightshift build 104: a dark-mode Solana game squad-formation mint forge.

Players compose a 3x3 battle formation, select party archetypes, tune stance/terrain/encounter pressure, simulate formation scores, preview first-party JSON/SVG metadata, connect with wallet-ui, and attempt a wallet-signed MPL Core devnet mint for the resulting formation asset.

## Capabilities

- 3x3 board placement with six party archetypes.
- Stance, terrain, and encounter pressure controls that alter simulation output.
- Formation scoring for frontline integrity, flank risk, burst tempo, support coverage, rarity, and readiness.
- First-party SVG and JSON metadata preview generated from the live formation.
- wallet-ui wallet connection with Solana devnet/localnet cluster context.
- Wallet-signed MPL Core create instruction using `@obrera/mpl-core-kit-lib`.
- Compact live metadata route for minted assets at `/api/metadata/:state`, with SVG at `/api/svg/:state`.
- Local mint receipt view showing asset address, owner, metadata URI, and signature after wallet confirmation.

## Development

```bash
bun install
bun run dev
bun run build
```

The app intentionally does not use `@solana/web3.js`, `@solana/wallet-adapter-react`, Node `Buffer`, or app-level Buffer polyfills. Solana access is through `@solana/kit`, `@solana/react`, `@wallet-ui/react`, and `@obrera/mpl-core-kit-lib`.

## Deployment

The repo includes a `Dockerfile`, `docker-compose.yml`, and `server.ts` Bun server for Colmena/Dokploy-style deployment. Preferred live URL:

https://formationforge104.colmena.dev
