/**
 * Worker PhucNC AI 4.0 - Phòng Thí Nghiệm Chiến Lược
 * Tác giả: AI của anh ❤️
 * Chức năng:
 * 1. Đề xuất chiến lược cho ngày mai.
 * 2. Backtest: Chạy chiến lược trên dữ liệu lịch sử để đo lường hiệu quả.
 */

// --- CÁC HÀM CÔNG CỤ ---
function parseData(rawData) {
    const dailyResults = [];
    const blocks = rawData.trim().split(/\n\s*\n/);
    for (const block of blocks) {
        const lines = block.trim().split('\n');
        if (lines.length < 2) continue;
        const numbers = new Set();
        for (let i = 2; i < lines.length; i++) {
            const parts = lines[i].trim().split(/\s+/);
            if (parts.length < 2 || !parts[1]) continue;
            const head = parts[0];
            const tails = parts[1].split(',');
            for (const tail of tails) {
                if (tail.trim()) numbers.add(head.padStart(1, '0') + tail.padStart(1, '0'));
            }
        }
        if (numbers.size > 0) dailyResults.push({ date: lines[0], numbers: Array.from(numbers) });
    }
    return dailyResults;
}

/**
 * Hàm cốt lõi: Áp dụng chiến lược để đề xuất số cho một ngày nhất định
 * @param {Array} history - Dữ liệu lịch sử TÍNH ĐẾN TRƯỚC ngày cần phân tích
 * @returns {object} - Gồm dàn 6 số và 8 số
 */
function getStrategyForDay(history) {
    if (history.length < 1) return { highStake: [], lowStake: [] };
    
    // 1. Phân tích Pattern Đầu số từ ngày gần nhất trong lịch sử
    const latestDay = history[0];
    const headCounts = Array(10).fill(0);
    latestDay.numbers.forEach(num => {
        headCounts[parseInt(num[0], 10)]++;
    });

    const headStatus = headCounts.map((count, head) => {
        if (count === 0) return { head, status: 'CÂM', priority: 10 };
        if (count === 1) return { head, status: 'RẤT YẾU', priority: 5 };
        if (count >= 5) return { head, status: 'RẤT MẠNH', priority: -99 };
        return { head, status: 'BÌNH THƯỜNG', priority: 1 };
    });

    // 2. Tính Lô Gan
    const ganMap = {};
    for (let i = 0; i <= 99; i++) ganMap[i.toString().padStart(2, '0')] = history.length;
    history.forEach((day, index) => {
        day.numbers.forEach(num => {
            if (ganMap[num] === history.length) ganMap[num] = index;
        });
    });

    // 3. Chấm điểm từng số
    const numberScores = [];
    for (let i = 0; i <= 99; i++) {
        const numStr = i.toString().padStart(2, '0');
        const head = parseInt(numStr[0], 10);
        let score = 0;
        const currentHeadStatus = headStatus.find(h => h.head === head);

        if (currentHeadStatus.priority < 0) continue;
        score += currentHeadStatus.priority;
        if (ganMap[numStr] >= 10) score += 3;

        if (score > 0) {
            numberScores.push({ number: numStr, score: score });
        }
    }

    // 4. Xây dựng dàn số
    numberScores.sort((a, b) => b.score - a.score);
    const highStake = numberScores.slice(0, 6).map(n => n.number);
    const lowStake = numberScores.slice(6, 14).map(n => n.number);
    return { highStake, lowStake };
}


// --- TRÌNH XỬ LÝ CHÍNH ---
self.onmessage = function(e) {
    const { mode, rawData, backtestDays } = e.data;
    const allDaysData = parseData(rawData);

    if (mode === 'propose') {
        const { highStake, lowStake } = getStrategyForDay(allDaysData);
        self.postMessage({ mode: 'propose', highStake, lowStake });
    }

    if (mode === 'backtest') {
        const results = [];
        let totalProfit = 0;
        const profitHistory = [];
        let winDays = 0;
        let maxLosingStreak = 0;
        let currentLosingStreak = 0;

        const daysToTest = Math.min(backtestDays, allDaysData.length - 1);

        for (let i = 0; i < daysToTest; i++) {
            const actualResultsDay = allDaysData[i];
            const historyForThisDay = allDaysData.slice(i + 1);
            
            const strategy = getStrategyForDay(historyForThisDay);
            
            let hits = 0;
            strategy.highStake.forEach(num => { if (actualResultsDay.numbers.includes(num)) hits++; });
            strategy.lowStake.forEach(num => { if (actualResultsDay.numbers.includes(num)) hits++; });
            
            const capital = (6 * 2 * 27000) + (8 * 0.35 * 27000);
            const revenue = hits * 99000;
            const profit = revenue - capital;

            totalProfit += profit;
            profitHistory.unshift(totalProfit); // Thêm vào đầu để biểu đồ đi từ trái sang phải
            
            if (profit > 0) {
                winDays++;
                currentLosingStreak = 0;
            } else {
                currentLosingStreak++;
                if (currentLosingStreak > maxLosingStreak) {
                    maxLosingStreak = currentLosingStreak;
                }
            }
            results.push({ date: actualResultsDay.date, hits, profit });
        }

        self.postMessage({
            mode: 'backtest',
            totalProfit,
            winRate: ((winDays / daysToTest) * 100).toFixed(1),
            avgHits: (results.reduce((sum, r) => sum + r.hits, 0) / daysToTest).toFixed(2),
            maxLosingStreak,
            profitHistory,
            daysTested: daysToTest
        });
    }
};
