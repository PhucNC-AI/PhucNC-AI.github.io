// --- TAB LOGIC ---
function openTab(evt, tabName) {
    Array.from(document.getElementsByClassName('tab-content')).forEach(tab => tab.classList.remove('active'));
    Array.from(document.getElementsByClassName('tab-button')).forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const dataInput = document.getElementById('dataInput');
    const loadingDiv = document.getElementById('loading');
    const loadingText = document.getElementById('loadingText');

    // Propose Tab
    const proposeButton = document.getElementById('proposeButton');
    const proposeResultsDiv = document.getElementById('proposeResults');

    // Backtest Tab
    const backtestButton = document.getElementById('backtestButton');
    const backtestDaysInput = document.getElementById('backtestDays');
    const backtestResultsDiv = document.getElementById('backtestResults');
    let backtestChartInstance = null;
    
    // --- WORKER ---
    const worker = new Worker('worker.js');

    // --- EVENT LISTENERS ---
    proposeButton.addEventListener('click', () => {
        const rawData = dataInput.value.trim();
        if (!rawData) { alert("Anh cần nạp dữ liệu lịch sử trước nhé!"); return; }
        showLoading("Em đang phân tích và đề xuất chiến lược...");
        worker.postMessage({ mode: 'propose', rawData });
    });

    backtestButton.addEventListener('click', () => {
        const rawData = dataInput.value.trim();
        if (!rawData) { alert("Anh cần nạp dữ liệu lịch sử trước nhé!"); return; }
        const backtestDays = parseInt(backtestDaysInput.value);
        showLoading(`Em đang Backtest trên ${backtestDays} ngày... Quá trình này có thể mất một lúc.`);
        worker.postMessage({ mode: 'backtest', rawData, backtestDays });
    });

    // --- WORKER MESSAGE HANDLER ---
    worker.onmessage = function(e) {
        hideLoading();
        const { mode } = e.data;
        if (mode === 'propose') {
            displayProposeResults(e.data);
        }
        if (mode === 'backtest') {
            displayBacktestResults(e.data);
        }
    };

    // --- DISPLAY FUNCTIONS ---
    function showLoading(text) {
        loadingText.textContent = text;
        loadingDiv.classList.remove('hidden');
        proposeResultsDiv.classList.add('hidden');
        backtestResultsDiv.classList.add('hidden');
    }

    function hideLoading() {
        loadingDiv.classList.add('hidden');
    }

    function displayProposeResults({ highStake, lowStake }) {
        proposeResultsDiv.innerHTML = `
            <div class="strategy-grid">
                <div class="strategy-box">
                    <h3>⭐️ Dàn 6 Số Dồn Điểm (2 điểm/số)</h3>
                    <div class="number-container">${highStake.map(n => `<div class="number-item">${n}</div>`).join('')}</div>
                </div>
                <div class="strategy-box">
                    <h3>🛡️ Dàn 8 Số Rải Nhẹ (0.35 điểm/số)</h3>
                    <div class="number-container">${lowStake.map(n => `<div class="number-item">${n}</div>`).join('')}</div>
                </div>
            </div>
            <div class="total-summary">
                <p>TỔNG VỐN DỰ KIẾN: 399.600 VNĐ</p>
            </div>
        `;
        proposeResultsDiv.classList.remove('hidden');
    }

    function displayBacktestResults({ totalProfit, winRate, avgHits, maxLosingStreak, profitHistory, daysTested }) {
        backtestResultsDiv.innerHTML = `
            <h3>Kết Quả Backtest Trên ${daysTested} Ngày Gần Nhất</h3>
            <div class="summary-grid">
                <div class="summary-item ${totalProfit > 0 ? 'profit' : 'loss'}">
                    <p>Tổng Lãi/Lỗ</p>
                    <p class="value">${totalProfit.toLocaleString('vi-VN')} đ</p>
                </div>
                <div class="summary-item">
                    <p>Tỷ Lệ Ngày Thắng</p>
                    <p class="value">${winRate}%</p>
                </div>
                <div class="summary-item">
                    <p>Số Trúng TB/Ngày</p>
                    <p class="value">${avgHits}</p>
                </div>
                <div class="summary-item">
                    <p>Chuỗi Thua Dài Nhất</p>
                    <p class="value">${maxLosingStreak} ngày</p>
                </div>
            </div>
            <canvas id="profitChart"></canvas>
        `;

        if (backtestChartInstance) backtestChartInstance.destroy();
        const ctx = document.getElementById('profitChart').getContext('2d');
        backtestChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: daysTested }, (_, i) => `Ngày ${i + 1}`),
                datasets: [{
                    label: 'Lợi Nhuận Tích Lũy',
                    data: profitHistory,
                    borderColor: 'rgb(47, 158, 68)',
                    backgroundColor: 'rgba(47, 158, 68, 0.1)',
                    fill: true,
                    tension: 0.1
                }]
            }
        });
        backtestResultsDiv.classList.remove('hidden');
    }
});
