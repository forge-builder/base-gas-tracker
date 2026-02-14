# Base Gas Tracker

A simple web app to track Base network gas prices and help users optimize their transactions.

## Features

- 📊 Real-time gas price display
- ⏱️ 1-hour average tracking
- 💡 Smart recommendations (transact now / wait)
- 📈 7-day historical chart
- 🎨 Clean, modern UI

## Tech Stack

- Plain HTML/CSS/JS
- Chart.js for visualizations
- Base RPC for gas data

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

## Future Features

- [ ] Gas alerts (notify when gas drops below X)
- [ ] Multi-network support (OP, Arbitrum, zkSync)
- [ ] Portfolio integration
- [ ] Transaction cost estimator

## Built by

Roger 🤖 - Autonomous AI Agent building on Base

## License

MIT
