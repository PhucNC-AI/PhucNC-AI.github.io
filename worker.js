/**
 * Worker PhucNC AI 3.0 - Chiến Lược Gia Tự Động
 * Tác giả: AI của anh ❤️
 * Logic: Tự động hóa hệ thống phương pháp luận do anh đề ra.
 * 1. Phân tích Pattern Đầu số từ ngày gần nhất.
 * 2. Tính Lô Gan từ toàn bộ lịch sử.
 * 3. Chấm điểm từng số dựa trên hệ thống quy tắc.
 * 4. Xây dựng và đề xuất Dàn 6+8 theo điểm số.
 */

// --- CÁC HÀM CÔNG CỤ ---
function parseData(rawData) {
    const dailyResults = [];
    const blocks = rawData.trim().split(/\n\s*\n/);
    for (const block of blocks) {
        const lines = block.trim().split('\n');
        if (lines.length < 2) continue;
        let numbers = new Set();
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

// --- MODULE LOGIC CHÍNH ---
self.onmessage = function(e) {
    const { rawData } = e.data;

    try {
        const allDaysData = parseData(rawData);
        if (allDaysData.length < 1) throw new Error("Dữ liệu không đủ để phân tích.");

        // --- GIAI ĐOẠN 1: XÁC ĐỊNH ĐẦU SỐ MỤC TIÊU (từ ngày gần nhất) ---
        const latestDay = allDaysData[0];
        const headCounts = Array(10).fill(0);
        latestDay.numbers.forEach(num => {
            const head = parseInt(num[0], 10);
            headCounts[head]++;
        });

        const headStatus = headCounts.map((count, head) => {
            if (count === 0) return { head, status: 'CÂM', priority: 10 };
            if (count === 1) return { head, status: 'RẤT YẾU', priority: 5 };
            if (count >= 5) return { head, status: 'RẤT MẠNH', priority: -99 }; // Điểm trừ để loại bỏ
            return { head, status: 'BÌNH THƯỜNG', priority: 1 };
        });
        
        const analysisSummaryText = `Phân tích dựa trên kết quả ngày: ${latestDay.date}. Trạng thái các đầu: ${headStatus.map(h => `Đầu ${h.head} (${h.status})`).join(', ')}.`;

        // --- GIAI ĐOẠN 2: TÍNH LÔ GAN & CÁC YẾU TỐ BỔ TRỢ ---
        const ganMap = {};
        for(let i=0; i<=99; i++) ganMap[i.toString().padStart(2, '0')] = allDaysData.length; // Mặc định gan = tổng số ngày
        allDaysData.forEach((day, index) => {
            day.numbers.forEach(num => {
                if (ganMap[num] === allDaysData.length) ganMap[num] = index;
            });
        });

        // --- GIAI ĐOẠN 3: CHẤM ĐIỂM TỪNG SỐ ---
        const numberScores = [];
        for (let i = 0; i <= 99; i++) {
            const numStr = i.toString().padStart(2, '0');
            const head = parseInt(numStr[0], 10);
            let score = 0;
            let reason = [];

            // 1. Điểm từ Pattern Đầu số (quan trọng nhất)
            const currentHeadStatus = headStatus.find(h => h.head === head);
            if(currentHeadStatus.priority < 0) continue; // Bỏ qua các số của Đầu Mạnh
            
            score += currentHeadStatus.priority;
            if (currentHeadStatus.priority > 1) reason.push(currentHeadStatus.status);


            // 2. Điểm từ Lô Gan (bổ trợ)
            const ganDays = ganMap[numStr];
            if (ganDays >= 10) { // Có thể điều chỉnh ngưỡng gan ở đây
                score += 3;
                reason.push(`Gan ${ganDays} ngày`);
            }
            
            // Nếu có điểm, thêm vào danh sách
            if(score > 0) {
                numberScores.push({
                    number: numStr,
                    score: score,
                    reason: reason.join(' + ')
                });
            }
        }

        // --- GIAI ĐOẠN 4: XÂY DỰNG DÀN SỐ CHIẾN LƯỢC ---
        numberScores.sort((a, b) => b.score - a.score); // Sắp xếp điểm từ cao đến thấp
        
        const highStakeNumbers = numberScores.slice(0, 6);
        const lowStakeNumbers = numberScores.slice(6, 14);

        // Gửi kết quả cuối cùng về cho script chính
        self.postMessage({
            analysisSummary: analysisSummaryText,
            highStake: highStakeNumbers,
            lowStake: lowStakeNumbers
        });

    } catch (error) {
        self.postMessage({ error: error.message });
    }
};
