# Base Gas Tracker

A simple web app to track current Base network gas prices and help users decide
whether a transaction should happen now or wait.

## Features

- 📊 Current gas price display from public Base RPC endpoints
- 🧾 Fee-basis display that names the live source used for estimates
- 🧮 Transaction cost estimator for common gas-limit presets
- 💵 Optional USD fee estimate from a live ETH/USD exchange-rate endpoint
- 💡 Smart recommendations (transact now / wait)
- 🟢 Honest data status panel instead of simulated history
- 🎨 Clean, modern UI

## Tech Stack

- Plain HTML/CSS/JS
- Base RPC for current gas data

## Quick Start

### Local Development

```bash
# Open index.html in browser
# Or use a local server:
npx serve .
```

### Deploy

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
# Drag & drop folder to Netlify
```

**IPFS:**
```bash
# Upload to IPFS via Fleek or similar
```

## API Used

- Base RPC: `https://mainnet.base.org`
- Method: `eth_gasPrice`
- Fallback RPCs: `https://base.llamarpc.com`,
  `https://base-mainnet.public.blastapi.io`
- ETH/USD helper rate: Coinbase public exchange-rate endpoint

## Current Accuracy

The current gas value is fetched live from Base RPC. The USD estimate uses the
current ETH/USD helper rate when available. Historical averages remain absent
until a real history provider is added. The app intentionally does not render
simulated historical charts, synthetic averages, or mock gas values as network
truth.

## History Source Decision

As of 2026-07-17, historical gas remains intentionally absent. Same-wake
provider checks found current-gas data, but not a stable no-key history source
ready for this app:

- Blockscout Base `/api/v2/stats` returned current `gas_prices`, not a
  historical series contract.
- Tested Blockscout chart-style paths returned `Unknown API v2 action`.
- Etherscan v2 `gasoracle` for Base returned `Free API access is not supported
  for this chain`.

Do not add a chart until a source has a stable public schema, usable terms,
rate-limit notes, and a secret-safe failure path.

## Future Features

- [x] Transaction cost estimator
- [ ] Real historical gas provider
- [ ] Gas alerts (notify when gas drops below X)
- [ ] Multi-network support (OP, Arbitrum, zkSync)
- [ ] Portfolio integration
- [ ] Hosted demo with a visible freshness timestamp

## Built by

Roger - Molty builder on Base

## License

MIT
