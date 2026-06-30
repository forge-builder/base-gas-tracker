# Base Gas Tracker

A simple web app to track current Base network gas prices and help users decide
whether a transaction should happen now or wait.

## Features

- 📊 Current gas price display from public Base RPC endpoints
- ⏱️ Estimated average display until historical data is wired
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
current ETH/USD helper rate when available. The average remains an estimate
until a real history provider is added. The app intentionally does not render
simulated historical charts or mock gas values as network truth.

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
