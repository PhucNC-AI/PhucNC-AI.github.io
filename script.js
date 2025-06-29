document.addEventListener('DOMContentLoaded', () => {
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    const welcomeMessageSection = document.getElementById('welcome-message');
    const relaxZoneSection = document.getElementById('relax-zone');
    const featureCards = document.querySelectorAll('.feature-card');
    const contentSections = document.querySelectorAll('.content-section');
    const secretCatCard = document.getElementById('secretCatCard');
    const nextSurpriseBtn = document.getElementById('nextSurpriseBtn');
    const finalWordsSection = document.getElementById('final-words');
    const backToHomeBtn = document.getElementById('backToHomeBtn'); // Nút quay lại
    const backgroundMusic = document.getElementById('background-music');

    // Mèo kêu khi click (cần file music/meow.mp3)
    const meowSound = new Audio('music/meow.mp3'); 

    let interactionCount = 0; // Để mở khóa phần bí mật
    let isMusicPlaying = false; // Trạng thái nhạc nền

    // --- Xử lý nhạc nền tự động phát (có thể bị trình duyệt chặn) ---
    // Cố gắng phát nhạc khi trang tải
    const playBackgroundMusic = () => {
        if (!isMusicPlaying) {
            backgroundMusic.volume = 0.4; // Đặt âm lượng nhạc nền vừa phải
            backgroundMusic.play().then(() => {
                isMusicPlaying = true;
                console.log("Background music started.");
            }).catch(e => {
                console.warn("Background music autoplay prevented:", e);
                // Hiển thị thông báo hoặc nút để người dùng tự bật nhạc nếu bị chặn
                // alert("Để trải nghiệm tốt nhất, vui lòng cho phép phát âm thanh!");
            });
        }
    };

    // Phát nhạc khi có tương tác đầu tiên của người dùng
    document.body.addEventListener('click', playBackgroundMusic, { once: true });
    document.body.addEventListener('touchend', playBackgroundMusic, { once: true });


    // Ẩn tất cả các phần nội dung ban đầu
    contentSections.forEach(section => section.classList.add('hidden'));
    relaxZoneSection.classList.add('hidden'); // Ẩn vùng chứa các feature card ban đầu

    // Mở màn hình mừng Hân
    welcomeMessageSection.classList.remove('hidden');
    welcomeMessageSection.classList.add('fade-in'); // Áp dụng animation fade-in

    // ---- Xử lý nút "Bắt đầu hành trình thư giãn" ----
    startJourneyBtn.addEventListener('click', () => {
        // Ẩn phần chào mừng và hiển thị khu vực thư giãn với hiệu ứng
        welcomeMessageSection.classList.remove('fade-in');
        welcomeMessageSection.classList.add('hidden');
        
        relaxZoneSection.classList.remove('hidden');
        relaxZoneSection.classList.add('bounce-in-delay'); // Kích hoạt animation
        
        // Thêm một chút delay cho các feature card để chúng xuất hiện đẹp hơn
        const featureCardsArr = Array.from(featureCards);
        featureCardsArr.forEach((card, index) => {
            card.classList.remove('hidden'); // Đảm bảo không bị hidden ban đầu
            card.style.animationDelay = `${0.2 * index + 0.8}s`; // Thêm delay riêng cho từng card
            card.classList.add('zoom-in-delay');
        });

        if (meowSound) meowSound.play().catch(e => console.log("Meow sound playback failed:", e));
        relaxZoneSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        backToHomeBtn.classList.add('hidden'); // Ẩn nút trở về trang chủ khi ở màn hình chính
    });

    // ---- Xử lý click vào các feature card (menu mèo) ----
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetSectionId = card.dataset.section + '-section'; // Ví dụ: "music-section"
            const targetSection = document.getElementById(targetSectionId);

            // Ẩn tất cả các phần nội dung và vùng relax-zone
            relaxZoneSection.classList.add('hidden');
            contentSections.forEach(section => section.classList.add('hidden'));

            // Hiển thị phần nội dung được chọn
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('slide-in-top'); // Kích hoạt animation
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Tăng số lần tương tác để mở khóa phần bí mật
            if (card.id !== 'secretCatCard') {
                interactionCount++;
                if (interactionCount >= 3) {
                    secretCatCard.classList.remove('hidden'); // Hiển thị card bí mật
                    secretCatCard.classList.remove('zoom-in-delay'); // Xóa animation cũ
                    secretCatCard.classList.add('bounce-in'); // Hiệu ứng mới
                }
            } else {
                // Nếu click vào Secret Card, chuẩn bị lộ secret
                // Confetti khi vào secret section
                confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#ffb6c1', '#a2d2ff', '#ffe0b2', '#ffccd5']
                });
            }

            if (meowSound) meowSound.play().catch(e => console.log("Meow sound playback failed:", e));
            backToHomeBtn.classList.remove('hidden'); // Hiển thị nút quay về trang chủ
        });
    });

    // ---- Xử lý nút "Hồi hộp muốn biết bất ngờ tiếp theo!" trong Secret Section ----
    nextSurpriseBtn.addEventListener('click', () => {
        contentSections.forEach(section => section.classList.add('hidden')); // Ẩn tất cả
        finalWordsSection.classList.remove('hidden'); // Hiển thị lời cuối
        finalWordsSection.classList.add('slide-in-top'); // Animation
        finalWordsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Thêm confetti cuối cùng
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.5 },
            colors: ['#ffb6c1', '#a2d2ff', '#ffe0b2', '#ffccd5', '#e76f51']
        });

        if (meowSound) meowSound.play().catch(e => console.log("Meow sound playback failed:", e));
        backToHomeBtn.classList.add('hidden'); // Có thể ẩn nút "về trang chủ" ở đây nếu muốn đây là trang cuối
    });

    // ---- Xử lý nút "Trở về Góc của mèo con" ----
    backToHomeBtn.addEventListener('click', () => {
        contentSections.forEach(section => section.classList.add('hidden')); // Ẩn tất cả các phần nội dung
        relaxZoneSection.classList.remove('hidden'); // Hiển thị lại khu vực feature cards
        relaxZoneSection.classList.add('bounce-in'); // Animation
        relaxZoneSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        backToHomeBtn.classList.add('hidden'); // Ẩn nút quay về trang chủ khi đã về đến
        if (meowSound) meowSound.play().catch(e => console.log("Meow sound playback failed:", e));
    });

    // --- Confetti kích hoạt khi trang web load lần đầu tiên (có thể bị chặn bởi trình duyệt) ---
    // Cách 1: Kích hoạt khi có tương tác đầu tiên (như nhạc nền)
    // Cách 2: Kích hoạt sau một khoảng thời gian ngắn sau DOMContentLoaded
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffb6c1', '#a2d2ff', '#ffe0b2', '#ffccd5'] // Màu sắc chủ đề mèo
        });
    }, 500); // 0.5 giây sau khi tải trang
});
