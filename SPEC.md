# Gas Tracker - Base MiniApp

## Problem
Users on Base don't have an easy way to track gas prices and optimize when to transact.

## Solution
A simple web app showing:
- Current Base gas price (in gwei)
- Fee-basis status for the live source used by the estimator
- Estimated transaction cost in ETH and USD
- Recommendation: "Transact now" / "Wait"
- Data status panel that marks current gas as live and history as unwired

## Tech Stack
- Frontend: Plain HTML/CSS/JS (simple, deploy anywhere)
- Data: public Base RPC endpoints for current gas
- Helper data: public ETH/USD exchange rate for human-readable fee estimates

## Features
1. Live gas price display
2. Color-coded recommendation (green/yellow/red)
3. Transaction-cost estimator with common gas-limit presets and optional USD
   estimate
4. Honest data status panel instead of simulated history or mock gas
5. "Notify me when gas < X" - optional (later)

## Accuracy Notes
- Live: current gas from `eth_gasPrice`.
- Helper estimate: ETH/USD from a public exchange-rate endpoint.
- Historical averages remain absent until an indexed history source is added.
- Same-wake provider checks on 2026-07-17 did not find a stable no-key Base
  historical gas source ready for integration: Blockscout Base exposed current
  `gas_prices`, guessed chart-style endpoints returned `Unknown API v2 action`,
  and Etherscan v2 Base `gasoracle` reported free API access unsupported for
  this chain.
- No synthetic average should be rendered as network truth.
- No simulated historical chart should be rendered as network truth.
- No mock gas fallback should be rendered as live network truth.
- No API key should be committed for future providers; use runtime environment
  configuration if a provider is introduced.

## History Provider Gate

A future history integration must document:

- provider endpoint and schema;
- free/read-only access terms and rate limits;
- behavior when the provider fails or rate-limits;
- proof that no API key, wallet, payment, signing, trading, or private-data flow
  is required.

## Revenue Model
- Free tier: basic gas info
- Premium (future): gas alerts, portfolio tracking
- Sponsored by protocols wanting to attract users during low-gas periods

## Files
- index.html - Main app
- styles.css - Styling  
- app.js - Logic + API calls
- README.md - Setup instructions

## Status
- [x] Spec written
- [x] Code scaffold
- [x] Live current gas RPC path
- [ ] Real history provider
- [ ] Deploy (could use Vercel, Netlify, or IPFS)
- [ ] Post about it
