// --- 1. KESİNTİSİZ SAYAÇ (Siteden çıksan bile arka planda akar) ---
// İstediğin 1 yıl 12 gün kriterine göre sabit başlangıç tarihi (23 Eylül 2025)
const startDate = new Date("2025-09-23T00:00:00");

function updateCounter() {
    const now = new Date();
    let diff = now - startDate;

    if (diff < 0) diff = 0;

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const daysTotal = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(daysTotal / 365);
    const days = daysTotal % 365;

    document.getElementById("years").innerText = years;
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("mins").innerText = minutes;
    document.getElementById("secs").innerText = seconds;
}
setInterval(updateCounter, 1000);
updateCounter();

// --- 2. SPOTIFY KUTULARI ---
function updateSpotify(user) {
    const url = document.getElementById(`${user}-spotify-url`).value;
    const container = document.getElementById(`${user}-player-container`);
    
    let trackId = "";
    if (url.includes("track/")) {
        trackId = url.split("track/")[1].split("?")[0];
    }
    
    if (trackId) {
        container.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${trackId}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
        localStorage.setItem(`${user}-spotify`, trackId);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ['adda', 'nuriş'].forEach(user => {
        const savedTrack = localStorage.getItem(`${user}-spotify`);
        if (savedTrack) {
            document.getElementById(`${user}-spotify-url`).value = `https://open.spotify.com/track/${savedTrack}`;
            document.getElementById(`${user}-player-container`).innerHTML = `<iframe src="https://open.spotify.com/embed/track/${savedTrack}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
        }
    });
    loadTodos();
    loadMemories();
    loadCapsules();
});

// --- 3. CHECKLIST ---
function addTodo(user) {
    const input = document.getElementById(`${user}-todo-input`);
    const text = input.value.trim();
    if (!text) return;

    let todos = JSON.parse(localStorage.getItem(`${user}-todos`) || "[]");
    todos.push({ text, completed: false });
    localStorage.setItem(`${user}-todos`, JSON.stringify(todos));
    
    input.value = "";
    loadTodos();
}

function loadTodos() {
    ['adda', 'nuriş'].forEach(user => {
        const list = document.getElementById(`${user}-todo-list`);
        const todos = JSON.parse(localStorage.getItem(`${user}-todos`) || "[]");
        list.innerHTML = "";
        todos.forEach((todo, index) => {
            list.innerHTML += `<li>
                <span style="${todo.completed ? 'text-decoration: line-through; color: #999;' : ''}">${todo.text}</span>
                <button onclick="toggleTodo('${user}', ${index})" style="padding: 2px 6px; font-size:0.8rem;">✓</button>
            </li>`;
        });
    });
}

function toggleTodo(user, index) {
    let todos = JSON.parse(localStorage.getItem(`${user}-todos`) || "[]");
    todos[index].completed = !todos[index].completed;
    localStorage.setItem(`${user}-todos`, JSON.stringify(todos));
    loadTodos();
}

// --- 4. TAŞ KAĞIT MAKAS ---
function playRPS(playerChoice) {
    const choices = ['taş', 'kağıt', 'makas'];
    const nurişChoice = choices[Math.floor(Math.random() * choices.length)];
    let resultText = `Nuriş'in seçimi: ${nurişChoice.toUpperCase()}. `;

    if (playerChoice === nurişChoice) {
        resultText += "🤝 Berabere!";
    } else if (
        (playerChoice === 'taş' && nurişChoice === 'makas') ||
        (playerChoice === 'kağıt' && nurişChoice === 'taş') ||
        (playerChoice === 'makas' && nurişChoice === 'kağıt')
    ) {
        resultText += "🎉 Sen Kazandın!";
    } else {
        resultText += "😢 Nuriş Kazandı!";
    }
    document.getElementById("rps-result").innerText = resultText;
}

// --- 5. RUH HALLERİ ---
function updateMood(user) {
    const mood = document.getElementById(`${user}-mood`).value;
    localStorage.setItem(`${user}-mood`, mood);
}

// --- 6. ÇARK ---
const sectors = [
    { color: "#ff7f50", text: "Film İzle 🎬" },
    { color: "#e86333", text: "Kahve İç ☕" },
    { color: "#ffb380", text: "Yürüyüşe Çık 🌳" },
    { color: "#ff9966", text: "Şarkı Söyle 🎤" },
    { color: "#ff6633", text: "Soru Sor 💬" },
    { color: "#ffad33", text: "Tatlı Ye 🍩" }
];

const canvas = document.getElementById("canvas-wheel");
const ctx = canvas.getContext("2d");
const rad = 150;
let angle = 0;
let isSpinning = false;

function drawWheel() {
    const arc = Math.PI / (sectors.length / 2);
    sectors.forEach((sector, i) => {
        ctx.beginPath();
        ctx.fillStyle = sector.color;
        ctx.moveTo(rad, rad);
        ctx.arc(rad, rad, rad, i * arc, (i + 1) * arc);
        ctx.lineTo(rad, rad);
        ctx.fill();
        ctx.save();
        ctx.translate(rad, rad);
        ctx.rotate(i * arc + arc / 2);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Poppins";
        ctx.fillText(sector.text, 50, 10);
        ctx.restore();
    });
}
drawWheel();

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    document.getElementById("wheel-result").innerText = "Çark dönüyor... 🎡";
    
    const randomDegree = Math.floor(Math.random() * 3600) + 720;
    angle += randomDegree;
    canvas.style.transform = `rotate(${angle}deg)`;

    setTimeout(() => {
        isSpinning = false;
        const actualDegree = angle % 360;
        const index = Math.floor((360 - (actualDegree % 360)) / (360 / sectors.length)) % sectors.length;
        document.getElementById("wheel-result").innerText = `🎯 Çıkan Sonuç: ${sectors[index].text}`;
    }, 4000);
}

// --- 7. ZAMAN KAPSÜLÜ ---
function saveCapsule() {
    const date = document.getElementById("capsule-date").value;
    const text = document.getElementById("capsule-text").value;
    if (!date || !text) return;

    let capsules = JSON.parse(localStorage.getItem("capsules") || "[]");
    capsules.push({ date, text });
    localStorage.setItem("capsules", JSON.stringify(capsules));
    
    document.getElementById("capsule-date").value = "";
    document.getElementById("capsule-text").value = "";
    loadCapsules();
}

function loadCapsules() {
    const container = document.getElementById("capsules-list");
    const capsules = JSON.parse(localStorage.getItem("capsules") || "[]");
    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = "";
    capsules.forEach((c, index) => {
        const isUnlocked = today >= c.date;
        container.innerHTML += `<div style="background: var(--light-orange); padding: 10px; border-radius: 8px; margin-top: 10px; border: 1px dashed var(--primary-orange);">
            <small>Açılacağı Tarih: ${c.date}</small>
            <p><strong>${isUnlocked ? c.text : '🔒 Bu not kilitli, tarihi gelince açılacak!'}</strong></p>
        </div>`;
    });
}

// --- 8. ANILAR (PRATİK NOTLAR) ---
function addMemory() {
    const title = document.getElementById("memory-title").value;
    const desc = document.getElementById("memory-desc").value;
    if (!title || !desc) return;

    let memories = JSON.parse(localStorage.getItem("memories") || "[]");
    memories.push({ title, desc });
    localStorage.setItem("memories", JSON.stringify(memories));

    document.getElementById("memory-title").value = "";
    document.getElementById("memory-desc").value = "";
    loadMemories();
}

function loadMemories() {
    const container = document.getElementById("memories-container");
    const memories = JSON.parse(localStorage.getItem("memories") || "[]");
    container.innerHTML = "";

    memories.forEach((m, index) => {
        container.innerHTML += `<div class="memory-card">
            <button class="delete-btn" onclick="deleteMemory(${index})">X</button>
            <h4>${m.title}</h4>
            <p>${m.desc}</p>
        </div>`;
    });
}

function deleteMemory(index) {
    let memories = JSON.parse(localStorage.getItem("memories") || "[]");
    memories.splice(index, 1);
    localStorage.setItem("memories", JSON.stringify(memories));
    loadMemories();
}
