// ============================
//  CONFIG
// ============================
const API_KEY = typeof GROQ_KEY !== "undefined" ? GROQ_KEY : null;
const chatLog = document.getElementById("chatLog");
const chatInput = document.getElementById("chatIn");
const aiStatus = document.getElementById("aiStatus");

// ============================
//  AI CHAT — REAL GROQ FINAL
// ============================
async function sendAIMessage(message) {
    if (!API_KEY) {
        aiStatus.textContent = "AI: KEY NOT FOUND";
        return "Error: GROQ_KEY belum diisi.";
    }

    aiStatus.textContent = "AI: thinking...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Error: empty response";

        aiStatus.textContent = "AI: online";
        return reply;

    } catch (e) {
        aiStatus.textContent = "AI: error";
        return "Gagal menghubungi AI.";
    }
}

// kirim pesan
document.getElementById("chatSend").onclick = async () => {
    const text = chatInput.value.trim();
    if (!text) return;

    chatLog.innerHTML += `<div class="user-msg">${text}</div>`;
    chatInput.value = "";

    const reply = await sendAIMessage(text);
    chatLog.innerHTML += `<div class="ai-msg">${reply}</div>`;

    chatLog.scrollTop = chatLog.scrollHeight;
};

// ============================
//  GAME SYSTEM — FINAL
// ============================
function setGame(src) {
    document.getElementById("gameFrame").src = src;
}

document.querySelectorAll(".gbtn").forEach(btn => {
    btn.addEventListener("click", () => {
        const src = btn.getAttribute("data-src");
        setGame(src);
    });
});

// ============================
//  QUOTE
// ============================
const quotes = [
    "Mulai sekarang, jangan tunggu sempurna.",
    "Konsisten lebih kuat dari berbakat.",
    "Sedikit demi sedikit menjadi bukit.",
    "Fokus pada progress, bukan hasil instan."
];

document.getElementById("nextQuote").onclick = () => {
    const r = Math.floor(Math.random() * quotes.length);
    document.getElementById("quoteText").textContent = quotes[r];
};

// ============================
//  YOUTUBE MINI PLAYER
// ============================
let player;
const videos = [
    { id: "dQw4w9WgXcQ", title: "Random 1" },
    { id: "kXYiU_JCYtU", title: "Random 2" },
    { id: "3JZ4pnNtyxQ", title: "Random 3" }
];
let index = 0;

function onYouTubeIframeAPIReady() {
    loadVideo(index);
}

function loadVideo(i) {
    player = new YT.Player("player", {
        height: "250",
        width: "100%",
        videoId: videos[i].id,
        events: {}
    });
    document.getElementById("ytTitle").textContent = videos[i].title;
}

document.getElementById("nextVid").onclick = () => {
    index = (index + 1) % videos.length;
    loadVideo(index);
};

document.getElementById("prevVid").onclick = () => {
    index = (index - 1 + videos.length) % videos.length;
    loadVideo(index);
};

document.getElementById("randomSmall").onclick = () => {
    index = Math.floor(Math.random() * videos.length);
    loadVideo(index);
};

// ============================
//  SEARCH
// ============================
document.getElementById("searchBtn").onclick = () => {
    const q = document.getElementById("gq").value.trim();
    if (q) window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`);
};
