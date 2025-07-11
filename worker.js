// worker.js

self.onmessage = function(event) {
    const { type, payload } = event.data;

    switch (type) {
        case 'analyzeData':
            try {
                const { rawData, drawDate } = payload;
                const parsedData = parseXSMBData(rawData);
                const analysis = analyzePreviousDraw(parsedData, drawDate);

                // --- Simulate Multi-Day Data & Strategy ---
                // In a real app, this would query a database of historical data
                // For this example, we'll derive some "potential" numbers based on the last draw's "câm" status.
                const strategy = generateStrategy(analysis);

                const coreNumbers = generateCoreNumbers(analysis, strategy);
                const xien3Sets = generateXien3Sets(coreNumbers);

                self.postMessage({
                    type: 'analysisComplete',
                    payload: {
                        analysis,
                        strategy,
                        coreNumbers,
                        xien3Sets
                    }
                });
            } catch (e) {
                self.postMessage({ type: 'error', payload: e.message });
            }
            break;
        case 'checkResults':
            try {
                const { actualRawData, predictedCoreNumbers, predictedXien3Sets } = payload;
                const actualDrawNumbers = parseActualDrawNumbers(actualRawData);
                const checkResults = checkPrediction(actualDrawNumbers, predictedCoreNumbers, predictedXien3Sets);
                self.postMessage({ type: 'checkResultsComplete', payload: checkResults });
            } catch (e) {
                self.postMessage({ type: 'error', payload: e.message });
            }
            break;
        default:
            console.warn('Unknown message type received by worker:', type);
    }
};

// --- Core Logic Functions ---

// Hàm parse dữ liệu XSMB từ textarea
function parseXSMBData(rawData) {
    const result = {};
    const lines = rawData.split('\n').filter(line => line.trim() !== '');

    if (lines.length < 1) throw new Error('Dữ liệu không được để trống.');
    if (!lines[0].includes('Đầu') || !lines[0].includes('Đuôi')) throw new Error('Định dạng dữ liệu không đúng. Phải có "Đầu Đuôi" ở dòng đầu.');

    for (let i = 1; i < lines.length; i++) { // Bắt đầu từ dòng thứ 2 sau tiêu đề
        const line = lines[i].trim();
        if (!line) continue;

        // Tìm vị trí chữ 'Đuôi' hoặc ký tự tab để phân tách
        let tabIndex = line.indexOf('\t');
        let spaceIndex = line.indexOf(' ');

        let headStr, tailStr;

        if (tabIndex !== -1) { // Ưu tiên dùng tab
            headStr = line.substring(0, tabIndex).trim();
            tailStr = line.substring(tabIndex + 1).trim();
        } else if (spaceIndex !== -1) { // Nếu không có tab, dùng khoảng trắng đầu tiên
            headStr = line.substring(0, spaceIndex).trim();
            tailStr = line.substring(spaceIndex + 1).trim();
        } else {
            // Nếu không có cả tab lẫn space, thử parse cả dòng là đầu, đuôi rỗng
            headStr = line;
            tailStr = '';
        }

        const head = parseInt(headStr);
        if (isNaN(head) || head < 0 || head > 9) {
            // Bỏ qua các dòng không phải là đầu số hợp lệ (0-9)
            continue;
        }

        if (tailStr) {
            const numbers = tailStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            result[head] = numbers;
        } else {
            result[head] = []; // Câm
        }
    }
    return result;
}


// Hàm phân tích kết quả kỳ quay trước
function analyzePreviousDraw(parsedData, drawDate) {
    const headsAnalysis = {};
    const tailsAnalysis = {};
    const allNumbersSeen = new Set(); // Dùng Set để lưu các số đã về (duy nhất)

    // Khởi tạo tất cả các đầu và đuôi
    for (let i = 0; i <= 9; i++) {
        headsAnalysis[i] = { count: 0, note: '' };
        tailsAnalysis[i] = { count: 0, note: '' };
    }

    // Điền dữ liệu vào headsAnalysis
    for (const headKey in parsedData) {
        const head = parseInt(headKey);
        // Nếu head là một mảng rỗng, nghĩa là đầu câm
        headsAnalysis[head].count = parsedData[head].length;
    }

    // Đếm số lần xuất hiện của từng đuôi và thu thập tất cả các số đã về
    for (let head = 0; head <= 9; head++) {
        const numbersForHead = parsedData[head] || []; // Đảm bảo là mảng
        numbersForHead.forEach(tail => {
            if (tail >= 0 && tail <= 9) { // Đảm bảo đuôi hợp lệ
                tailsAnalysis[tail].count++;
                const fullNumber = head * 10 + tail;
                allNumbersSeen.add(fullNumber);
            }
        });
    }

    // Đánh giá trạng thái của đầu
    for (let i = 0; i <= 9; i++) {
        const count = headsAnalysis[i].count;
        if (count === 0) {
            headsAnalysis[i].note = 'CÂM!';
        } else if (count >= 4) {
            headsAnalysis[i].note = 'Mạnh';
        } else if (count <= 2) {
            headsAnalysis[i].note = 'Yếu';
        } else {
            headsAnalysis[i].note = 'Khá Mạnh';
        }
    }

    // Đánh giá trạng thái của đuôi
    for (let i = 0; i <= 9; i++) {
        const count = tailsAnalysis[i].count;
        if (count === 0) {
            tailsAnalysis[i].note = 'CÂM!';
        } else if (count >= 4) {
            tailsAnalysis[i].note = 'Mạnh';
        } else if (count <= 2) {
            tailsAnalysis[i].note = 'Yếu';
        } else {
            tailsAnalysis[i].note = 'Khá Mạnh';
        }
    }

    return {
        drawDate,
        heads: headsAnalysis,
        tails: tailsAnalysis,
        allNumbers: Array.from(allNumbersSeen).sort((a,b) => a-b)
    };
}

// --- SIMULATED MULTI-DAY DATA AND STRATEGY GENERATION ---
// Phần này mô phỏng việc xác định các đầu/đuôi tiềm năng dựa trên trạng thái "câm", "yếu".
// Trong một ứng dụng thực tế, 'gan lì' sẽ cần dữ liệu lịch sử tính toán riêng.
function generateStrategy(analysis) {
    const potentialHeads = [];
    const potentialTails = [];

    // Ưu tiên các đầu câm
    for (let i = 0; i <= 9; i++) {
        if (analysis.heads[i] && analysis.heads[i].note.includes('CÂM')) {
            potentialHeads.push(i);
        }
    }
    // Sau đó thêm các đầu yếu nếu cần, để đủ số lượng
    while (potentialHeads.length < 5) { // Cố gắng có top 5 đầu tiềm năng
         let added = false;
         for (let i = 0; i <= 9; i++) {
             if (analysis.heads[i] && analysis.heads[i].note.includes('Yếu') && !potentialHeads.includes(i)) {
                 potentialHeads.push(i);
                 added = true;
                 if (potentialHeads.length >= 5) break;
             }
         }
         if (!added) break; // Thoát nếu không còn đầu yếu nào để thêm
    }

    // Ưu tiên các đuôi câm
    for (let i = 0; i <= 9; i++) {
        if (analysis.tails[i] && analysis.tails[i].note.includes('CÂM')) {
            potentialTails.push(i);
        }
    }
    // Sau đó thêm các đuôi yếu nếu cần
    while (potentialTails.length < 7) { // Cố gắng có top 7 đuôi tiềm năng
        let added = false;
        for (let i = 0; i <= 9; i++) {
            if (analysis.tails[i] && analysis.tails[i].note.includes('Yếu') && !potentialTails.includes(i)) {
                potentialTails.push(i);
                added = true;
                if (potentialTails.length >= 7) break;
            }
        }
        if (!added) break; // Thoát nếu không còn đuôi yếu nào để thêm
    }

    // Sắp xếp để có thứ tự nhất quán (ví dụ: câm trước, yếu sau, rồi đến số nhỏ hơn)
    potentialHeads.sort((a,b) => {
        const noteA = analysis.heads[a].note;
        const noteB = analysis.heads[b].note;
        if (noteA.includes('CÂM') && !noteB.includes('CÂM')) return -1;
        if (!noteA.includes('CÂM') && noteB.includes('CÂM')) return 1;
        if (noteA.includes('Yếu') && !noteB.includes('Yếu')) return -1;
        if (!noteA.includes('Yếu') && noteB.includes('Yếu')) return 1;
        return a - b;
    });
    potentialTails.sort((a,b) => {
        const noteA = analysis.tails[a].note;
        const noteB = analysis.tails[b].note;
        if (noteA.includes('CÂM') && !noteB.includes('CÂM')) return -1;
        if (!noteA.includes('CÂM') && noteB.includes('CÂM')) return 1;
        if (noteA.includes('Yếu') && !noteB.includes('Yếu')) return -1;
        if (!noteA.includes('Yếu') && noteB.includes('Yếu')) return 1;
        return a - b;
    });

    return {
        potentialHeads: potentialHeads.slice(0, 5),
        potentialTails: potentialTails.slice(0, 7)
    };
}

// Hàm tạo 20 số nòng cốt
function generateCoreNumbers(analysis, strategy) {
    const coreNumbers = new Set();
    const allNumbersFromPreviousDraw = new Set(analysis.allNumbers); // Convert to Set for faster lookup

    const heads = strategy.potentialHeads;
    const tails = strategy.potentialTails;

    // Kết hợp Đầu tiềm năng với Đuôi tiềm năng
    heads.forEach(h => {
        tails.forEach(t => {
            const num = h * 10 + t;
            //Ưu tiên các cặp câm, hoặc chưa về kỳ trước
            if (!allNumbersFromPreviousDraw.has(num) ||
               (analysis.heads[h].note.includes('CÂM') && analysis.tails[t].note.includes('CÂM'))) {
                 coreNumbers.add(num);
            }
        });
    });

    // Nếu chưa đủ 20 số, bổ sung thêm các số có 1 trong 2 yếu tố đầu/đuôi tiềm năng
    if (coreNumbers.size < 20) {
        // Thêm các số có đầu tiềm năng kết hợp với đuôi yếu/ít về
        heads.forEach(h => {
            for (let t = 0; t <= 9; t++) {
                const num = h * 10 + t;
                if (!coreNumbers.has(num) && !allNumbersFromPreviousDraw.has(num) &&
                    (analysis.tails[t].note.includes('Yếu') || analysis.tails[t].count < 3)
                ) {
                    coreNumbers.add(num);
                     if (coreNumbers.size >= 20) break;
                }
            }
            if (coreNumbers.size >= 20) break;
        });
    }

     if (coreNumbers.size < 20) {
        // Thêm các số có đuôi tiềm năng kết hợp với đầu yếu/ít về
        tails.forEach(t => {
            for (let h = 0; h <= 9; h++) {
                const num = h * 10 + t;
                if (!coreNumbers.has(num) && !allNumbersFromPreviousDraw.has(num) &&
                    (analysis.heads[h].note.includes('Yếu') || analysis.heads[h].count < 3)
                ) {
                    coreNumbers.add(num);
                     if (coreNumbers.size >= 20) break;
                }
            }
            if (coreNumbers.size >= 20) break;
         });
    }


    const sortedCoreNumbers = Array.from(coreNumbers).sort((a, b) => a - b);
    return sortedCoreNumbers.slice(0, 20); // Đảm bảo chỉ 20 số
}


// Hàm tạo 100 bộ xiên 3
function generateXien3Sets(coreNumbers) {
    const xien3Sets = [];
    const n = coreNumbers.length;
    const maxCombinations = 100;

    if (n < 3) {
        return xien3Sets; // Cần ít nhất 3 số để tạo xiên 3
    }

    // Sử dụng thuật toán tạo tổ hợp để lấy các bộ 3 số
    let count = 0;
    for (let i = 0; i < n - 2 && count < maxCombinations; i++) {
        for (let j = i + 1; j < n - 1 && count < maxCombinations; j++) {
            for (let k = j + 1; k < n && count < maxCombinations; k++) {
                xien3Sets.push([coreNumbers[i], coreNumbers[j], coreNumbers[k]]);
                count++;
            }
        }
    }

    return xien3Sets;
}

// Hàm parse kết quả thật (để đối chiếu)
function parseActualDrawNumbers(actualRawData) {
    const numbers = new Set();
    const lines = actualRawData.split('\n').filter(line => line.trim() !== '');

    if (lines.length < 1) throw new Error('Dữ liệu đối chiếu không được để trống.');
    if (!lines[0].includes('Đầu') || !lines[0].includes('Đuôi')) throw new Error('Định dạng dữ liệu đối chiếu không đúng. Phải có "Đầu Đuôi" ở dòng đầu.');

    for (let i = 1; i < lines.length; i++) { // Bỏ qua tiêu đề
        const line = lines[i].trim();
        if (!line) continue;

        let headStr, tailStr;
        let tabIndex = line.indexOf('\t');
        let spaceIndex = line.indexOf(' ');

        if (tabIndex !== -1) {
            headStr = line.substring(0, tabIndex).trim();
            tailStr = line.substring(tabIndex + 1).trim();
        } else if (spaceIndex !== -1) {
            headStr = line.substring(0, spaceIndex).trim();
            tailStr = line.substring(spaceIndex + 1).trim();
        } else {
            headStr = line;
            tailStr = '';
        }

        const head = parseInt(headStr);
        if (isNaN(head) || head < 0 || head > 9) continue;

        if (tailStr) {
            tailStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).forEach(tail => {
                const num = head * 10 + tail;
                if (num >= 0 && num <= 99) numbers.add(num);
            });
        }
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

// Hàm kiểm tra và so sánh dự đoán với kết quả thực tế
function checkPrediction(actualDrawNumbers, predictedCoreNumbers, predictedXien3Sets) {
    const hitCoreNumbers = [];
    actualDrawNumbers.forEach(num => {
        if (predictedCoreNumbers.includes(num)) {
            hitCoreNumbers.push(num);
        }
    });

    const hitXien3Sets = [];
    const actualDrawSet = new Set(actualDrawNumbers); // Dùng Set để tốc độ tìm kiếm nhanh hơn
    for (const set of predictedXien3Sets) {
        // Kiểm tra xem tất cả các số trong bộ xiên 3 có nằm trong kết quả thực tế không
        if (set.every(num => actualDrawSet.has(num))) {
            hitXien3Sets.push(set);
        }
    }

    const profit = (hitXien3Sets.length * 650000) - 1000000; // Giả định vốn 1tr, trúng 650k/bộ

    return {
        hitCoreNumbers,
        hitXien3Sets,
        profit
    };
}
