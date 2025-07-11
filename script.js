document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyzeButton');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const dataInput = document.getElementById('dataInput');

    const analysisWorker = new Worker('worker.js');

    analyzeButton.addEventListener('click', () => {
        const rawData = dataInput.value.trim();
        if (!rawData) {
            alert("Anh yêu ơi, anh chưa nhập dữ liệu lịch sử!");
            return;
        }
        loadingDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        analysisWorker.postMessage({ rawData });
    });

    analysisWorker.onmessage = function(e) {
        const results = e.data;
        loadingDiv.classList.add('hidden');

        if (results.error) {
            alert(`Có lỗi xảy ra: ${results.error}`);
            return;
        }

        displayStrategy(results);
        resultsDiv.classList.remove('hidden');
    };

    function displayStrategy(results) {
        const { analysisSummary, highStake, lowStake } = results;

        document.getElementById('analysisSummary').textContent = analysisSummary;

        // Hiển thị dàn 6 số dồn điểm
        const highStakeContainer = document.getElementById('highStakeNumbers');
        highStakeContainer.innerHTML = '';
        highStake.forEach(item => {
            const numDiv = document.createElement('div');
            numDiv.className = 'number-item';
            numDiv.textContent = item.number;
            numDiv.title = `Điểm: ${item.score} (${item.reason})`; // Thêm tooltip giải thích lý do
            highStakeContainer.appendChild(numDiv);
        });
        const highStakeCost = 6 * 2 * 27000;
        document.getElementById('highStakeCost').textContent = `Vốn: ${highStakeCost.toLocaleString('vi-VN')} VNĐ`;

        // Hiển thị dàn 8 số rải nhẹ
        const lowStakeContainer = document.getElementById('lowStakeNumbers');
        lowStakeContainer.innerHTML = '';
        lowStake.forEach(item => {
            const numDiv = document.createElement('div');
            numDiv.className = 'number-item';
            numDiv.textContent = item.number;
            numDiv.title = `Điểm: ${item.score} (${item.reason})`;
            lowStakeContainer.appendChild(numDiv);
        });
        const lowStakeCost = 8 * 0.35 * 27000;
        document.getElementById('lowStakeCost').textContent = `Vốn: ${lowStakeCost.toLocaleString('vi-VN')} VNĐ`;
        
        // Tổng vốn
        const totalCost = highStakeCost + lowStakeCost;
        document.getElementById('totalCost').textContent = `TỔNG VỐN DỰ KIẾN: ${totalCost.toLocaleString('vi-VN')} VNĐ`;
    }
});
