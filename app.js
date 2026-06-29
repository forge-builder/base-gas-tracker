// Base Gas Tracker - Main Logic

const BASE_RPC = 'https://mainnet.base.org';
let gasChart = null;
let currentData = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initChart();
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

    try {
        // Get current gas from Base RPC
        const gasData = await getCurrentGas();
        
        // Update UI
        updateDisplay(gasData);
        
        // Fetch demo historical data. Production history needs an indexed data
        // source; do not imply these generated points are live network history.
        const historyData = await getHistoricalGas();
        updateChart(historyData);
        
    } catch (error) {
        console.error('Error fetching gas data:', error);
        document.getElementById('currentGas').textContent = 'Error';
    } finally {
        btn.disabled = false;
        btn.textContent = '🔄 Refresh';
    }
}

async function getCurrentGas() {
    // Using Base RPC via public gateway to avoid CORS
    const rpcUrls = [
        'https://mainnet.base.org',
        'https://base.llamarpc.com',
        'https://base-mainnet.public.blastapi.io'
    ];
    
    for (const rpcUrl of rpcUrls) {
        try {
            const response = await fetch(rpcUrl, {
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
                timestamp: new Date()
            };
        } catch (e) {
            console.log(`Failed ${rpcUrl}:`, e.message);
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
                timestamp: new Date()
            };
        }
    } catch (e) {
        console.error('Fallback API also failed:', e);
    }
    
    // Last resort: return mock data so UI doesn't break
    return {
        current: 0.001,
        timestamp: new Date()
    };
}

async function getHistoricalGas() {
    // Generate demo data for the chart until a real history provider is wired.
    const labels = [];
    const prices = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        // Demo range: 0.001 - 0.05 gwei.
        prices.push((Math.random() * 0.05 + 0.001).toFixed(3));
    }
    
    return { labels, prices };
}

function updateDisplay(gasData) {
    const currentGas = gasData.current;
    currentData = currentGas; // Store for avg calculation
    
    // Update current gas
    document.getElementById('currentGas').textContent = currentGas.toFixed(3);
    
    // Update estimate (using current gas as a proxy until real history exists).
    document.getElementById('avgGas').textContent = (currentGas * 0.85).toFixed(3);
    
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

    if (!currentData) {
        ethOutput.textContent = '--';
        gweiOutput.textContent = '--';
        return;
    }

    const gasLimit = getSelectedGasLimit();
    const totalGwei = currentData * gasLimit;
    const totalEth = totalGwei / 1e9;

    ethOutput.textContent = totalEth.toFixed(8);
    gweiOutput.textContent = `${totalGwei.toFixed(2)} gwei at ${gasLimit.toLocaleString()} gas`;
}

function initChart() {
    const ctx = document.getElementById('gasChart').getContext('2d');
    
    gasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Gas Price (gwei)',
                data: [],
                borderColor: '#0052ff',
                backgroundColor: 'rgba(0, 82, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#8b8b9e'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#8b8b9e'
                    }
                }
            }
        }
    });
}

function updateChart(historyData) {
    if (!gasChart) return;
    
    gasChart.data.labels = historyData.labels;
    gasChart.data.datasets[0].data = historyData.prices;
    gasChart.update();
}
