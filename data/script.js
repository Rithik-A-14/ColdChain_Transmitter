// Cold Chain Telemetry System Logic & Chart Controller
// Uses Inter & JetBrains Mono typography and semantic telemetry color palette

const profiles = {
    vaccine:  { min: 2, max: 8, name: "Vaccine Storage", target: 5.0 },
    milk:     { min: 0, max: 4, name: "Milk Storage (Raw)", target: 2.0 },
    food:     { min: 0, max: 5, name: "Food Cold Room", target: 3.0 },
    frozen:   { min: -30, max: -15, name: "Frozen Food", target: -20.0 },
    pharma:   { min: 2, max: 8, name: "Pharma Medicines", target: 4.5 },
    blood:    { min: 2, max: 6, name: "Blood Bank", target: 4.0 },
    icecream: { min: -30, max: -18, name: "Ice Cream Storage", target: -22.0 }
};

let activeProfile = profiles.vaccine;
let isSimulationMode = false;
let simHistory = [4.5, 4.8, 5.1, 4.9, 4.6, 4.3, 4.7, 5.0, 5.2, 4.8, 4.6, 4.4, 4.5, 4.7, 4.9, 5.1, 4.8, 4.6, 4.5, 4.4, 4.7, 4.9, 5.0, 4.8, 4.6, 4.5, 4.3, 4.6, 4.8, 5.0];

// Configure Chart.js Global Typography & Themes
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
Chart.defaults.color = '#94A3B8'; // Text neutral muted gray

// Custom Canvas Canvas Gradient Helper
function createGradient(ctx, colorStart, colorEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
}

// Initialize Charts
const ctxHistory = document.getElementById('historyChart').getContext('2d');
const ctxZone = document.getElementById('zoneChart').getContext('2d');
const ctxBar = document.getElementById('barChart').getContext('2d');

const gradientBlue = createGradient(ctxHistory, 'rgba(59, 130, 246, 0.35)', 'rgba(59, 130, 246, 0.0)');
const gradientRed = createGradient(ctxHistory, 'rgba(239, 68, 68, 0.35)', 'rgba(239, 68, 68, 0.0)');

// 1. Telemetry History Line Chart
const historyChart = new Chart(ctxHistory, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature °C',
            data: [],
            borderColor: '#3B82F6',
            borderWidth: 2.5,
            pointBackgroundColor: '#06B6D4',
            pointBorderColor: '#1E293B',
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true,
            backgroundColor: gradientBlue
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1E293B',
                titleColor: '#F8FAFC',
                bodyColor: '#3B82F6',
                bodyFont: { family: "'JetBrains Mono', monospace", weight: 'bold' },
                borderColor: '#334155',
                borderWidth: 1,
                padding: 10,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
                ticks: { font: { family: "'JetBrains Mono', monospace", size: 11 } }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.06)', drawBorder: false },
                ticks: { font: { family: "'JetBrains Mono', monospace", size: 11 }, callback: value => `${value}°C` }
            }
        }
    }
});

// 2. Zone Stability Doughnut Chart
const zoneChart = new Chart(ctxZone, {
    type: 'doughnut',
    data: {
        labels: ['Too Cold (< Min)', 'Safe Range', 'Too Hot (> Max)'],
        datasets: [{
            data: [0, 30, 0],
            backgroundColor: ['#3B82F6', '#10B981', '#EF4444'],
            borderColor: '#1E293B',
            borderWidth: 3,
            hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    font: { size: 11, family: "'Inter', sans-serif" },
                    padding: 12
                }
            }
        },
        cutout: '72%'
    }
});

// 3. Threshold Comparison Bar Chart
const barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: ['Min Limit', 'Current Temp', 'Max Limit'],
        datasets: [{
            label: 'Temperature °C',
            data: [2.0, 4.5, 8.0],
            backgroundColor: ['#06B6D4', '#10B981', '#F59E0B'],
            borderRadius: 6,
            borderSkipped: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1E293B',
                bodyFont: { family: "'JetBrains Mono', monospace" }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: "'Inter', sans-serif", size: 11, weight: '500' } }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { font: { family: "'JetBrains Mono', monospace", size: 11 } }
            }
        }
    }
});

// Helper Function: Append Log to Monospace Console
function addConsoleLog(message, type = 'info') {
    const consoleEl = document.getElementById('consoleLog');
    if (!consoleEl) return;

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const logDiv = document.createElement('div');
    logDiv.className = 'log-entry';

    let typeClass = 'log-ok';
    if (type === 'warn') typeClass = 'log-warn';
    if (type === 'err') typeClass = 'log-err';

    logDiv.innerHTML = `<span class="log-time">[${timeStr}]</span> <span class="${typeClass}">${message}</span>`;
    
    consoleEl.insertBefore(logDiv, consoleEl.firstChild);

    // Keep max 25 logs
    while (consoleEl.children.length > 25) {
        consoleEl.removeChild(consoleEl.lastChild);
    }
}

// Handle Active Profile Switch
document.getElementById('appSelect').addEventListener('change', async (e) => {
    activeProfile = profiles[e.target.value];
    document.getElementById('barTitle').innerText = `${activeProfile.name.toUpperCase()} THRESHOLDS`;
    document.getElementById('kpiProfileName').innerText = activeProfile.name;
    document.getElementById('kpiRange').innerText = `${activeProfile.min > 0 ? '+' : ''}${activeProfile.min.toFixed(1)}° to ${activeProfile.max > 0 ? '+' : ''}${activeProfile.max.toFixed(1)}°`;
    document.getElementById('metaMin').innerText = `${activeProfile.min > 0 ? '+' : ''}${activeProfile.min.toFixed(1)} °C`;
    document.getElementById('metaMax').innerText = `${activeProfile.max > 0 ? '+' : ''}${activeProfile.max.toFixed(1)} °C`;

    addConsoleLog(`Profile switched to: <strong>${activeProfile.name}</strong> [Limits: ${activeProfile.min}°C .. ${activeProfile.max}°C]`, 'info');

    // Send threshold update to hardware
    try {
        await fetch(`/api/setThreshold?min=${activeProfile.min}&max=${activeProfile.max}`, { method: 'POST' });
        addConsoleLog(`Hardware LED Threshold Synced -> Min: ${activeProfile.min}°C, Max: ${activeProfile.max}°C`, 'ok');
    } catch (err) {
        // Soft fallback for offline browser testing
        addConsoleLog(`Simulated Hardware Threshold Sync -> Min: ${activeProfile.min}°C, Max: ${activeProfile.max}°C`, 'warn');
    }

    updateData(); // Refresh visuals immediately
});

// Update Telemetry & Rendering
async function updateData() {
    let currentTemp = 4.5;
    let history = simHistory;

    try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        
        currentTemp = data.current;
        history = data.history;

        if (isSimulationMode) {
            isSimulationMode = false;
            document.getElementById('connectionStatus').innerText = 'ONLINE';
            document.getElementById('connectionStatus').style.color = 'var(--status-success)';
            addConsoleLog('Reconnected to ESP32 Hardware Endpoint /api/data', 'ok');
        }
    } catch (error) {
        if (!isSimulationMode) {
            isSimulationMode = true;
            document.getElementById('connectionStatus').innerText = 'SIMULATION MODE';
            document.getElementById('connectionStatus').style.color = 'var(--status-warning)';
            addConsoleLog('Running in Standalone Visualizer Mode (Hardware Disconnected)', 'warn');
        }

        // Generate smooth simulated random walk for browser testing
        const lastVal = simHistory[simHistory.length - 1] || activeProfile.target;
        const drift = (Math.random() - 0.48) * 0.4;
        currentTemp = parseFloat((lastVal + drift).toFixed(2));

        simHistory.push(currentTemp);
        if (simHistory.length > 30) simHistory.shift();
        history = simHistory;
    }

    // 1. KPI Primary Temperature Display
    const tempEl = document.getElementById('currentTemp');
    const badgeEl = document.getElementById('statusBadge');
    const ledStatusEl = document.getElementById('ledStatus');

    tempEl.innerText = `${currentTemp > 0 ? '+' : ''}${currentTemp.toFixed(1)}`;

    // Evaluate Status & Semantic Colors
    let isExcursion = false;
    let statusText = '';
    
    if (currentTemp < activeProfile.min) {
        isExcursion = true;
        badgeEl.className = 'badge danger';
        badgeEl.innerText = `CRITICAL LOW: Under Limit (< ${activeProfile.min}°C)`;
        tempEl.style.color = 'var(--status-critical)';
        ledStatusEl.innerText = 'GPIO 22 [ALARM ACTIVE]';
        ledStatusEl.style.color = 'var(--status-critical)';
        statusText = `ALERT: Low temp excursion detected (${currentTemp}°C < ${activeProfile.min}°C)`;
    } else if (currentTemp > activeProfile.max) {
        isExcursion = true;
        badgeEl.className = 'badge danger';
        badgeEl.innerText = `CRITICAL HIGH: Spoilage Risk (> ${activeProfile.max}°C)`;
        tempEl.style.color = 'var(--status-critical)';
        ledStatusEl.innerText = 'GPIO 22 [ALARM ACTIVE]';
        ledStatusEl.style.color = 'var(--status-critical)';
        statusText = `ALERT: High temp excursion detected (${currentTemp}°C > ${activeProfile.max}°C)`;
    } else {
        badgeEl.className = 'badge safe';
        badgeEl.innerText = `SAFE: Ideal ${activeProfile.name}`;
        tempEl.style.color = 'var(--text-primary)';
        ledStatusEl.innerText = 'GPIO 22 [NORMAL]';
        ledStatusEl.style.color = 'var(--status-success)';
        statusText = `Telemetry OK: ${currentTemp.toFixed(2)}°C inside standard range.`;
    }

    // Console Log output
    addConsoleLog(statusText, isExcursion ? 'err' : 'ok');

    // 2. History Line Chart Update
    const labels = history.map((_, idx) => `-${(history.length - idx - 1) * 5}s`);
    historyChart.data.labels = labels;
    historyChart.data.datasets[0].data = history;
    historyChart.data.datasets[0].borderColor = isExcursion ? '#EF4444' : '#3B82F6';
    historyChart.data.datasets[0].backgroundColor = isExcursion ? gradientRed : gradientBlue;
    historyChart.update();

    // 3. Thermal Stability Doughnut Chart
    let tooCold = 0, safe = 0, tooHot = 0;
    history.forEach(t => {
        if (t < activeProfile.min) tooCold++;
        else if (t > activeProfile.max) tooHot++;
        else safe++;
    });

    zoneChart.data.datasets[0].data = [tooCold, safe, tooHot];
    zoneChart.update();

    // Excursion Summary Counters
    const excursionCount = tooCold + tooHot;
    document.getElementById('excursionCount').innerText = excursionCount;
    document.getElementById('totalSamples').innerText = history.length;
    
    const compliancePercent = Math.round((safe / history.length) * 100);
    const compEl = document.getElementById('complianceRate');
    compEl.innerText = `${compliancePercent}% COMPLIANT (${safe}/${history.length})`;
    compEl.style.color = compliancePercent >= 90 ? 'var(--status-success)' : 'var(--status-warning)';

    // 4. Threshold Comparison Bar Chart
    barChart.data.datasets[0].data = [activeProfile.min, currentTemp, activeProfile.max];
    barChart.data.datasets[0].backgroundColor[1] = isExcursion ? '#EF4444' : '#10B981';
    barChart.update();
}

// Initial Console Boot Log
addConsoleLog('Cold Chain Transmitter Control Center initialized.', 'ok');
addConsoleLog('Default Profile Loaded: <strong>Vaccine Storage (+2.0°C to +8.0°C)</strong>', 'info');

// Poll every 5 seconds
setInterval(updateData, 5000);
updateData();