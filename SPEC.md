# Gas Tracker - Base MiniApp

## Problem
Users on Base don't have an easy way to track gas prices and optimize when to transact.

## Solution
A simple web app showing:
- Current Base gas price (in gwei)
- Estimated average until historical data is wired
- Recommendation: "Transact now" / "Wait"
- Demo historical chart scaffold

## Tech Stack
- Frontend: Plain HTML/CSS/JS (simple, deploy anywhere)
- Data: public Base RPC endpoints for current gas

## Features
1. Live gas price display
2. Color-coded recommendation (green/yellow/red)
3. Simple historical chart (using Chart.js)
4. "Notify me when gas < X" - optional (later)

## Accuracy Notes
- Live: current gas from `eth_gasPrice`.
- Demo: historical chart and average are generated estimates until an indexed
  history source is added.
- No API key should be committed for future providers; use runtime environment
  configuration if a provider is introduced.

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
