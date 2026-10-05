// --- 1. SAYAÇ (Site kapalıyken bile arka planda akar, sıfırlanmaz) ---
// Tam olarak 1 yıl, 11 gün, 22 saat, 15 dakika öncesini baz alır
const baseTimeKey = "așiyan_start_time";
let startDate;

if (localStorage.getItem(baseTimeKey)) {
    startDate = new Date(localStorage.getItem(baseTimeKey));
} else {
    startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setDate(startDate.getDate() - 11);
    startDate.setHours(startDate.getHours() - 22);
    startDate.setMinutes(startDate.getMinutes() - 15);
    localStorage.setItem(baseTimeKey, startDate.toISOString());
}

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 365);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById('years').innerText = years;
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('mins').innerText = mins;
    document.getElementById('secs').innerText = secs;
}
setInterval(updateCounter, 1000);
updateCounter();

// --- 2. SPOTIFY (Kalıcı hafızalı) ---
function setupSpotify(inputId, containerId, storageKey) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);

    // Kayıtlı şarkı varsa yükle
    const savedUrl = localStorage.getItem(storageKey);
    if (savedUrl) {
        input.value = savedUrl;
        renderEmbed(savedUrl, container);
    }

    input.addEventListener('input', () => {
        let url = input.value;
        localStorage.setItem(storageKey, url);
        renderEmbed(url, container);
    });
}

function renderEmbed(url, container) {
    if (url.includes('spotify.com')) {
        let trackId = url.split('track/')[1]?.split('?')[0];
        if (trackId) {
            container.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${trackId}" width="100%" height="152" frameBorder="0" allow="encrypted-media"></iframe>`;
        }
    }
}
setupSpotify('adda-spotify-url', 'adda-player-container', 'adda_spotify');
setupSpotify('nuriş-spotify-url', 'nuriş-player-container', 'nuriş_spotify');

// --- 3. RUH HALİ (Kalıcı hafızalı) ---
function initMood(user) {
    const select = document.getElementById(`${user}-mood`);
    const savedMood = localStorage.getItem(`${user}-mood-val`);
    if (savedMood) select.value = savedMood;
}
initMood('adda');
initMood('nuriş');

window.updateMood = function(user) {
    const val = document.getElementById(`${user}-mood`).value;
    localStorage.setItem(`${user}-mood-val`, val);
}

// --- 4. TAŞ KAĞIT MAKAS (Türkçe) ---
window.playRPS = function(choice) {
    const choices = ['taş', 'kağıt', 'makas'];
    const nurişChoice = choices[Math.floor(Math.random() * choices.length)];
    let result = '';

    if (choice === nurişChoice) {
        result = `🤝 Berabere! İkiniz de ${choice} seçtiniz.`;
    } else if (
        (choice === 'taş' && nurişChoice === 'makas') ||
        (choice === 'kağıt' && nurişChoice === 'taş') ||
        (choice === 'makas' && nurişChoice === 'kağıt')
    ) {
        result = `🎉 Kazandın! Nuriş ${nurişChoice} seçmişti.`;
    } else {
        result = `❤️ Nuriş kazandı! Nuriş ${nurişChoice} seçmişti.`;
    }
    document.getElementById('rps-result').innerText = result;
}

// --- 5. GERÇEK DÖNEN ÇARK ÇİZİMİ VE MEKANİĞİ ---
const activities = [
    "🎬 Film İzle",
    "☕ Kahve İç",
    "🎮 Oyun Oyna",
    "🎧 Şarkı Dinle",
    "🗺️ Plan Yap",
    "📸 Albüme Bak"
];
const colors = ["#ff7f50", "#ffb380", "#e86333", "#ffd1b3", "#ff9966", "#ffe6cc"];
const canvas = document.getElementById("canvas-wheel");
const ctx = canvas.getContext("2d");
let currentAngle = 0;

function drawWheel() {
    const numSegments = activities.length;
    const arc = (2 * Math.PI) / numSegments;
    ctx.clearRect(0, 0, 300, 300);

    for (let i = 0; i < numSegments; i++) {
        const angle = i * arc;
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 140, angle, angle + arc);
        ctx.lineTo(150, 150);
        ctx.fill();
        ctx.save();

        // Metinleri yerleştir
        ctx.translate(150, 150);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#4a3530";
        ctx.font = "bold 14px Poppins";
        ctx.fillText(activities[i], 125, 5);
        ctx.restore();
    }
}
drawWheel();

window.spinWheel = function() {
    const numSegments = activities.length;
    const randomDegree = Math.floor(Math.random() * 360) + 1440; // En az 4 tur atsın
    currentAngle += randomDegree;
    
    canvas.style.transform = `rotate(${currentAngle}deg)`;

    document.getElementById('wheel-result').innerText = "Çark dönüyor... 🌀";

    setTimeout(() => {
        const actualDegree = currentAngle % 360;
        const segmentAngle = 360 / numSegments;
        // Ok üstte olduğu için hesaplama
        const index = Math.floor((360 - (actualDegree % 360)) / segmentAngle) % numSegments;
        document.getElementById('wheel-result').innerText = `Seçilen Aktivite: ${activities[index]} ✨`;
    }, 4000);
}

// --- 6. CHECKLIST & ANILAR (Standart Fonksiyonlar) ---
window.addTodo = function(user) {
    const input = document.getElementById(`${user}-todo-input`);
    const list = document.getElementById(`${user}-todo-list`);
    if(!input.value.trim()) return;

    const li = document.createElement('li');
    li.innerHTML = `<span>${input.value}</span> <button onclick="this.parentElement.remove()" style="padding: 2px 6px; font-size:0.7rem;">Sil</button>`;
    list.appendChild(li);
    input.value = '';
}

window.saveCapsule = function() {
    const date = document.getElementById('capsule-date').value;
    const text = document.getElementById('capsule-text').value;
    const list = document.getElementById('capsules-list');
    if(!date || !text) return;

    const div = document.createElement('div');
    div.style.marginTop = '10px';
    div.style.padding = '10px';
    div.style.background = '#fff4f0';
    div.style.borderRadius = '8px';

    const today = new Date().toISOString().split('T')[0];
    if (today >= date) {
        div.innerHTML = `<strong>Açıldı (${date}):</strong> ${text}`;
    } else {
        div.innerHTML = `🔒 <strong>Kilitli Not (${date} tarihinde açılacak)</strong>`;
    }
    list.appendChild(div);
    document.getElementById('capsule-text').value = '';
}

window.addMemory = function() {
    const title = document.getElementById('memory-title').value;
    const desc = document.getElementById('memory-desc').value;
    const fileInput = document.getElementById('memory-img');
    const container = document.getElementById('memories-container');

    if(!title || !fileInput.files[0]) return;

    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 600;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

            const card = document.createElement('div');
            card.className = 'memory-card';
            card.innerHTML = `
                <h3>${title}</h3>
                <p style="margin-top:5px; font-size:0.9rem;">${desc}</p>
                <img src="${compressedDataUrl}">
            `;
            container.prepend(card);

            document.getElementById('memory-title').value = '';
            document.getElementById('memory-desc').value = '';
            document.getElementById('memory-img').value = '';
        }
    }
}
