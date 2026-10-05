// Sayaç Mantığı (Belirtilen başlangıç tarihinden itibaren akış)
// Başlangıç baz tarihi: 1 yıl 11 gün 22 saat geriye ayarlandı
const startDate = new Date();
startDate.setFullYear(startDate.getFullYear() - 1);
startDate.setDate(startDate.getDate() - 11);
startDate.setHours(startDate.getHours() - 22);

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('mins').innerText = mins;
    document.getElementById('secs').innerText = secs;
}
setInterval(updateCounter, 1000);
updateCounter();

// Spotify Bağlantı Dönüştürücü
function setupSpotify(inputId, containerId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);

    input.addEventListener('input', () => {
        let url = input.value;
        if (url.includes('spotify.com')) {
            // Normal track linkini embed formatına çevir
            let trackId = url.split('track/')[1]?.split('?')[0];
            if (trackId) {
                container.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${trackId}" width="100%" height="152" frameBorder="0" allow="encrypted-media"></iframe>`;
            }
        }
    });
}
setupSpotify('adda-spotify-url', 'adda-player-container');
setupSpotify('nuriş-spotify-url', 'nuriş-player-container');

// Checklist Fonksiyonları
window.addTodo = function(user) {
    const input = document.getElementById(`${user}-todo-input`);
    const list = document.getElementById(`${user}-todo-list`);
    if(!input.value.trim()) return;

    const li = document.createElement('li');
    li.innerHTML = `<span>${input.value}</span> <button onclick="this.parentElement.remove()" style="padding: 2px 6px; font-size:0.7rem;">Sil</button>`;
    list.appendChild(li);
    input.value = '';
}

// Taş Kağıt Makas
window.playRPS = function(choice) {
    const choices = ['taş', 'kağıt', 'makas'];
    const nurişChoice = choices[Math.floor(Math.random() * choices.length)];
    let result = '';

    if (choice === nurişChoice) {
        result = `🤝 Berabere! İkiniz də ${choice} seçtiniz.`;
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

// Ruh Hali Güncelleyici
window.updateMood = function(user) {
    const val = document.getElementById(`${user}-mood`).value;
    localStorage.setItem(`${user}-mood`, val);
}

// Ne Yapalım Çarkı
window.spinWheel = function() {
    const activities = [
        "🎬 Birlikte film izleyip mısır patlatmak!",
        "☕ Online kahve buluşması yapıp sohbet etmek.",
        "🎮 Birlikte interaktif bir mobil oyun oynamak.",
        "🎧 Karşılıklı birbirimize şarkı açıp dinlemek.",
        "🗺️ Gelecekte birlikte gideceğimiz yerleri haritadan seçmek.",
        "📸 Eski fotoğraflara bakıp anıları tazelemek."
    ];
    const picked = activities[Math.floor(Math.random() * activities.length)];
    document.getElementById('wheel-result').innerText = picked;
}

// Zaman Kapsülü
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

// Anı Defteri ve Otomatik Fotoğraf Sıkıştırıcı (Base64 Kompresyon)
window.addMemory = function() {
    const title = document.getElementById('memory-title').value;
    const desc = document.getElementById('memory-desc').value;
    const fileInput = document.getElementById('memory-img');
    const container = document.getElementById('memories-container');

    if(!title || !fileInput.files[0]) return;

    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = function(e) {
        // Görsel boyutunu otomatik optimize eden (sıkıştıran) canvas işlemi
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
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // Kaliteyi koruyarak boyutu küçültür

            const card = document.createElement('div');
            card.className = 'memory-card';
            card.innerHTML = `
                <h3>${title}</h3>
                <p style="margin-top:5px; font-size:0.9rem;">${desc}</p>
                <img src="${compressedDataUrl}">
            `;
            container.prepend(card);

            // Formu temizle
            document.getElementById('memory-title').value = '';
            document.getElementById('memory-desc').value = '';
            document.getElementById('memory-img').value = '';
        }
    }
}
