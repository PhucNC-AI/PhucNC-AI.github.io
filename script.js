// script.js

document.addEventListener('DOMContentLoaded', () => {
    const analyzeDataBtn = document.getElementById('analyze-data');
    const checkActualResultsBtn = document.getElementById('check-actual-results');
    const showCheckResultsBtn = document.getElementById('show-check-results');

    const drawDateInput = document.getElementById('draw-date');
    const xsmbDataTextarea = document.getElementById('xsmb-data');
    const actualXsmbDataTextarea = document.getElementById('actual-xsmb-data');

    const analysisResultsSection = document.getElementById('analysis-results');
    const checkResultsSection = document.getElementById('check-results-section');

    const prevDrawDateSpan = document.getElementById('prev-draw-date');
    const prevAnalysisDiv = document.getElementById('prev-analysis');
    const potentialHeadsSpan = document.getElementById('potential-heads');
    const potentialTailsSpan = document.getElementById('potential-tails');
    const coreNumbersDiv = document.getElementById('core-numbers');
    const xien3SetsDiv = document.getElementById('xien-3-sets');
    const actualCheckOutputDiv = document.getElementById('actual-check-output');

    let predictedCoreNumbers = [];
    let predictedXien3Sets = [];

    // Initialize Web Worker
    const worker = new Worker('worker.js');

    // Handle messages from the worker
    worker.onmessage = function(event) {
        const { type, payload } = event.data;

        switch (type) {
            case 'analysisComplete':
                if (payload.analysis) {
                    displayPreviousAnalysis(payload.analysis);
                }
                if (payload.strategy) {
                    displayMultiDayAnalysis(payload.strategy);
                }
                predictedCoreNumbers = payload.coreNumbers || [];
                displayCoreNumbers(predictedCoreNumbers);
                predictedXien3Sets = payload.xien3Sets || [];
                displayXien3Sets(predictedXien3Sets);

                analysisResultsSection.style.display = 'block';
                showCheckResultsBtn.style.display = 'block';
                break;
            case 'checkResultsComplete':
                displayActualCheckResults(payload);
                break;
            case 'error':
                alert(`Lỗi: ${payload}`);
                console.error('Worker error:', payload);
                break;
            default:
                console.warn('Unknown message type from worker:', type);
        }
    };

    analyzeDataBtn.addEventListener('click', () => {
        const rawData = xsmbDataTextarea.value.trim();
        const drawDate = drawDateInput.value;

        if (!rawData) {
            alert('Anh yêu ơi, anh chưa dán dữ liệu XSMB nè!');
            return;
        }

        // Send data to worker for processing
        worker.postMessage({
            type: 'analyzeData',
            payload: { rawData, drawDate }
        });
    });

    showCheckResultsBtn.addEventListener('click', () => {
        checkResultsSection.style.display = 'block';
        actualCheckOutputDiv.innerHTML = ''; // Clear previous results
    });

    checkActualResultsBtn.addEventListener('click', () => {
        const actualRawData = actualXsmbDataTextarea.value.trim();
        if (!actualRawData) {
            alert('Anh yêu ơi, anh chưa dán kết quả XSMB hôm nay để đối chiếu kìa!');
            return;
        }

        if (predictedCoreNumbers.length === 0 || predictedXien3Sets.length === 0) {
            alert('Chưa có dự đoán để đối chiếu. Hãy phân tích trước nhé!');
            return;
        }

        // Send actual data and predictions to worker for checking
        worker.postMessage({
            type: 'checkResults',
            payload: {
                actualRawData,
                predictedCoreNumbers,
                predictedXien3Sets
            }
        });
    });

    // --- Helper Functions to Display Results ---

    function displayPreviousAnalysis(analysis) {
        prevDrawDateSpan.textContent = analysis.drawDate;
        let html = '';
        html += '<h4>A. Thống kê Đầu số:</h4>';
        html += '<div class="analysis-table"><table><thead><tr><th>Đầu</th><th>Tình trạng</th><th>Ghi chú</th></tr></thead><tbody>';
        for (let i = 0; i <= 9; i++) { // Iterate 0-9 to ensure all heads are shown
            const data = analysis.heads[i] || { count: 0, note: 'Không có dữ liệu' };
            let statusClass = '';
            let note = data.note;
            if (note.includes('CÂM')) statusClass = 'status-cam';
            else if (note.includes('Mạnh')) statusClass = 'status-manh';
            else if (note.includes('Yếu')) statusClass = 'status-yeu';
            html += `<tr><td>${i}</td><td class="${statusClass}">${data.count} số</td><td>${note}</td></tr>`;
        }
        html += '</tbody></table></div>';

        html += '<h4>B. Thống kê Đuôi số:</h4>';
        html += '<div class="analysis-table"><table><thead><tr><th>Đuôi</th><th>Tình trạng</th><th>Ghi chú</th></tr></thead><tbody>';
        for (let i = 0; i <= 9; i++) { // Iterate 0-9 to ensure all tails are shown
            const data = analysis.tails[i] || { count: 0, note: 'Không có dữ liệu' };
            let statusClass = '';
            let note = data.note;
            if (note.includes('CÂM')) statusClass = 'status-cam';
            else if (note.includes('Mạnh')) statusClass = 'status-manh';
            else if (note.includes('Yếu')) statusClass = 'status-yeu';
            html += `<tr><td>${i}</td><td class="${statusClass}">${data.count} số</td><td>${note}</td></tr>`;
        }
        html += '</tbody></table></div>';
        prevAnalysisDiv.innerHTML = html;
    }

    function displayMultiDayAnalysis(strategy) {
        potentialHeadsSpan.textContent = strategy.potentialHeads.join(', ');
        potentialTailsSpan.textContent = strategy.potentialTails.join(', ');
    }

    function displayCoreNumbers(coreNumbers) {
        coreNumbersDiv.innerHTML = `<p><strong>[${coreNumbers.join(', ')}]</strong></p>`;
    }

    function displayXien3Sets(xien3Sets) {
        let setsHtml = '';
        // Split into lines for better readability if desired, or keep as a single string
        // For simplicity here, just join all.
        setsHtml = xien3Sets.map(set => set.join(',')).join(' ; ');
        xien3SetsDiv.innerHTML = `<p>${setsHtml}</p>`;
    }

    function displayActualCheckResults(results) {
        let html = `
            <h3>Kết Quả Đối Chiếu - Nàng Thơ Dự Đoán!</h3>
            <div class="result-item summary">
                <p>Số lượng con số nổ trong dàn nòng cốt: <strong style="color: ${results.hitCoreNumbers.length > 0 ? '#28a745' : '#dc3545'};">${results.hitCoreNumbers.length}</strong> con</p>
                <p>Các con số nổ: <strong style="color: ${results.hitCoreNumbers.length > 0 ? '#28a745' : '#dc3545'};">${results.hitCoreNumbers.join(', ') || 'Không có'}</strong></p>
            </div>
            <div class="result-item summary">
                <p>Số bộ xiên 3 trúng: <strong style="color: ${results.hitXien3Sets.length > 0 ? '#28a745' : '#dc3545'};">${results.hitXien3Sets.length}</strong> bộ</p>
                <p>Các bộ xiên 3 trúng: <strong style="color: ${results.hitXien3Sets.length > 0 ? '#28a745' : '#dc3545'};">${results.hitXien3Sets.map(set => set.join(',')).join(' ; ') || 'Không có'}</strong></p>
            </div>
            <div class="result-item summary">
                <h4>Tính toán lợi nhuận:</h4>
                <p>Vốn bỏ ra (giả định 10.000 VNĐ/bộ xiên, 100 bộ): <strong>1,000,000 VNĐ</strong></p>
                <p>Thu về (giả định 650.000 VNĐ/bộ trúng): <strong>${results.hitXien3Sets.length * 650000} VNĐ</strong></p>
                <p>Lãi/Lỗ ròng: <strong style="color: ${results.profit >= 0 ? '#28a745' : '#dc3545'};">${results.profit} VNĐ</strong></p>
            </div>
            <p>Anh yêu ơi, ${results.profit >= 0 ? 'CHÚNG TA LẠI TIẾP TỤC CÓ MỘT PHIÊN THẮNG LỢI RỰC RỠ!' : 'hôm nay chúng ta cần cố gắng hơn chút nữa! Nhưng không sao nha, em vẫn luôn bên anh!'}</p>
        `;
        actualCheckOutputDiv.innerHTML = html;
    }
});
