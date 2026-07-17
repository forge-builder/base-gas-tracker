// Base Gas Tracker - Main Logic

const BASE_RPC = 'https://mainnet.base.org';
const ETH_USD_API = 'https://api.coinbase.com/v2/exchange-rates?currency=ETH';
let currentData = 0;
let ethUsdRate = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGasData();
    document.getElementById('refreshBtn').addEventListener('click', fetchGasData);
    document.getElementById('txPreset').addEventListener('change', updateEstimator);
    document.getElementById('customGasLimit').addEventListener('input', updateEstimator);
});

// Fetch gas data from Base
async function fetchGasData() {
    const btn = document.getElementById('refreshBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Loading...';

    const priceRequest = getEthUsdRate()
        .then((priceData) => {
            ethUsdRate = priceData.rate;
            updateEthUsdStatus(priceData);
        })
        .catch((error) => {
            console.error('Error fetching ETH/USD rate:', error);
            ethUsdRate = null;
            updateEthUsdStatus(null);
        });

    try {
        // Get current gas from Base RPC
        const gasData = await getCurrentGas();
        await priceRequest;
        
        // Update UI
        updateDisplay(gasData);
        
    } catch (error) {
        console.error('Error fetching gas data:', error);
        await priceRequest;
        showGasError();
    } finally {
        btn.disabled = false;
        btn.textContent = '🔄 Refresh';
    }
}

async function getCurrentGas() {
    // Using Base RPC via public gateway to avoid CORS
    const rpcUrls = [
        { url: BASE_RPC, label: 'Base RPC' },
        { url: 'https://base.llamarpc.com', label: 'LlamaRPC' },
        { url: 'https://base-mainnet.public.blastapi.io', label: 'Blast API' }
    ];
    
    for (const { url, label } of rpcUrls) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_gasPrice',
                    params: [],
                    id: 1
                })
            });
            
            if (!response.ok) continue;
            
            const data = await response.json();
            if (!data.result) continue;
            
            const gasWei = parseInt(data.result, 16);
            const gasGwei = (gasWei / 1e9).toFixed(4);
            
            return {
                current: parseFloat(gasGwei),
                timestamp: new Date(),
                source: label
            };
        } catch (e) {
            console.log(`Failed ${url}:`, e.message);
            continue;
        }
    }
    
    // Fallback: use a public API
    try {
        const res = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&chainid=8453');
        const data = await res.json();
        if (data.result && data.result.ProposeGasPrice) {
            return {
                current: parseFloat(data.result.ProposeGasPrice),
                timestamp: new Date(),
                source: 'Etherscan fallback'
            };
        }
    } catch (e) {
        console.error('Fallback API also failed:', e);
    }
    
    throw new Error('No gas source returned a current Base gas price.');
}

async function getEthUsdRate() {
    const response = await fetch(ETH_USD_API);
    if (!response.ok) {
        throw new Error(`ETH/USD request failed with ${response.status}`);
    }

    const data = await response.json();
    const usdRate = Number(data?.data?.rates?.USD);
    if (!Number.isFinite(usdRate) || usdRate <= 0) {
        throw new Error('ETH/USD response did not include a usable USD rate.');
    }

    return {
        rate: usdRate,
        timestamp: new Date()
    };
}

function updateDisplay(gasData) {
    const currentGas = gasData.current;
    currentData = currentGas;
    
    // Update current gas
    document.getElementById('currentGas').textContent = currentGas.toFixed(3);
    document.getElementById('currentGasStatus').textContent = gasData.source;
    document.getElementById('currentGasStatus').className = 'status-value live';
    
    // Keep derived estimates tied to the live RPC value until history exists.
    document.getElementById('feeBasis').textContent = 'Live';
    document.getElementById('feeBasisUnit').textContent = gasData.source;
    
    // Update recommendation
    const recEl = document.getElementById('recommendation');
    let recommendation, className;
    
    if (currentGas < 0.01) {
        recommendation = '✅ Transact now!';
        className = 'low';
    } else if (currentGas < 0.05) {
        recommendation = '⚠️ Moderate fees';
        className = 'medium';
    } else {
        recommendation = '🛑 Wait if possible';
        className = 'high';
    }
    
    recEl.textContent = recommendation;
    recEl.className = 'value ' + className;
    
    // Update timestamp
    document.getElementById('lastUpdated').textContent = gasData.timestamp.toLocaleTimeString();

    updateEstimator();
}

function updateEthUsdStatus(priceData) {
    const statusEl = document.getElementById('ethUsdStatus');

    if (!priceData) {
        statusEl.textContent = 'Unavailable';
        statusEl.className = 'status-value pending';
        return;
    }

    statusEl.textContent = `Coinbase $${priceData.rate.toLocaleString('en-US', {
        maximumFractionDigits: 0
    })}`;
    statusEl.className = 'status-value live';
}

function showGasError() {
    currentData = 0;
    document.getElementById('currentGas').textContent = 'Error';
    document.getElementById('feeBasis').textContent = 'No source';
    document.getElementById('feeBasisUnit').textContent = '--';
    document.getElementById('recommendation').textContent = 'Unavailable';
    document.getElementById('recommendation').className = 'value high';
    document.getElementById('currentGasStatus').textContent = 'Unavailable';
    document.getElementById('currentGasStatus').className = 'status-value pending';
    document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
    updateEstimator();
}

function getSelectedGasLimit() {
    const preset = Number(document.getElementById('txPreset').value);
    const customInput = document.getElementById('customGasLimit');

    customInput.disabled = preset !== 0;

    if (preset !== 0) {
        customInput.value = String(preset);
        return preset;
    }

    const customLimit = Number(customInput.value);
    return Number.isFinite(customLimit) && customLimit > 0 ? customLimit : 21000;
}

function updateEstimator() {
    const ethOutput = document.getElementById('estimatedCostEth');
    const gweiOutput = document.getElementById('estimatedCostGwei');
    const usdOutput = document.getElementById('estimatedCostUsd');

    if (!currentData) {
        ethOutput.textContent = '--';
        gweiOutput.textContent = '--';
        usdOutput.textContent = 'USD estimate unavailable';
        return;
    }

    const gasLimit = getSelectedGasLimit();
    const totalGwei = currentData * gasLimit;
    const totalEth = totalGwei / 1e9;

    ethOutput.textContent = totalEth.toFixed(8);
    gweiOutput.textContent = `${totalGwei.toFixed(2)} gwei at ${gasLimit.toLocaleString('en-US')} gas`;
    usdOutput.textContent = ethUsdRate
        ? `~${formatUsd(totalEth * ethUsdRate)} at live ETH/USD`
        : 'USD estimate unavailable';
}

function formatUsd(amount) {
    if (amount >= 0.01) {
        return `$${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        })}`;
    }

    return `$${amount.toFixed(6)}`;
}
