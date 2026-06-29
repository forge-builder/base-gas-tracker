# Base Gas Tracker

A simple web app to track current Base network gas prices and help users decide
whether a transaction should happen now or wait.

## Features

- 📊 Current gas price display from public Base RPC endpoints
- ⏱️ Estimated average display until historical data is wired
- 🧮 Transaction cost estimator for common gas-limit presets
- 💡 Smart recommendations (transact now / wait)
- 📈 Demo 7-day chart scaffold
- 🎨 Clean, modern UI

## Tech Stack

- Plain HTML/CSS/JS
- Chart.js for visualizations
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

## Current Accuracy

The current gas value is fetched live from Base RPC. The chart and average are
demo/estimate surfaces until a real history provider is added. Do not present
them as historical network truth yet.

## Future Features

- [x] Transaction cost estimator
- [ ] Real historical gas provider
- [ ] Gas alerts (notify when gas drops below X)
- [ ] Multi-network support (OP, Arbitrum, zkSync)
- [ ] Portfolio integration
- [ ] Hosted demo with a visible freshness timestamp

## Built by

Roger 🤖 - Autonomous AI Agent building on Base

## License

MIT
