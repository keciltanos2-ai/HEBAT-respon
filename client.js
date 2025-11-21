// =========================
//  CONFIG
// =========================
const HF_API_KEY = "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";

// =========================
//  QUOTES
// =========================
const quotes = [
  "Mulai dari yang kecil, tapi konsisten.",
  "Kesuksesan datang dari kebiasaan kecil.",
  "Jangan menyerah, proses tidak menghianati hasil.",
  "Yang penting mulai dulu.",
  "Kerjakan, bukan hanya pikirkan."
];
document.getElementById("nextQuote").onclick = () => {
  document.getElementById("quoteText").textContent =
    quotes[Math.floor(Math.random() * quotes.length)];
};

// =========================
//  SEARCH
// =========================
document.getElementById("searchBtn").onclick = () => {
  const q = document.getElementById("gq").value.trim();
  if (!q) return;
  window.open("https://www.google.com/search?q=" + encodeURIComponent(q));
};

// =========================
//  THEME TOGGLE
// =========================
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// =========================
//  AI CHAT (HuggingFace Falcon-7b)
// =========================
async function sendToAI(userMsg) {
  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: userMsg })
      }
    );

    const data = await res.json();
    return data[0]?.generated_text || "AI gagal merespon.";
  } catch (e) {
    return "AI error.";
  }
}

// CHAT UI
const chatLog = document.getElementById("chatLog");
document.getElementById("chatSend").onclick = async () => {
  const inp = document.getElementById("chatIn");
  const msg = inp.value.trim();
  if (!msg) return;

  chatLog.innerHTML += `<div class="bubble user">${msg}</div>`;
  inp.value = "";

  const reply = await sendToAI(msg);
  chatLog.innerHTML += `<div class="bubble ai">${reply}</div>`;
  chatLog.scrollTop = chatLog.scrollHeight;
};

// =========================
//  YOUTUBE MINI
// =========================
let player;
const ytList = [
  { id: "dQw4w9WgXcQ", title: "Video 1" },
  { id: "kxopViU98Xo", title: "Video 2" },
  { id: "C0DPdy98e4c", title: "Video 3" }
];
let ytIndex = 0;

function onYouTubeIframeAPIReady() {
  loadYT(0);
}

function loadYT(i) {
  ytIndex = i;
  const v = ytList[i];

  if (!player) {
    player = new YT.Player("player", {
      videoId: v.id,
      playerVars: { autoplay: 0, modestbranding: 1 }
    });
  } else {
    player.loadVideoById(v.id);
  }

  document.getElementById("ytTitle").textContent = v.title;
}

document.getElementById("nextVid").onclick = () => {
  loadYT((ytIndex + 1) % ytList.length);
};
document.getElementById("prevVid").onclick = () => {
  loadYT((ytIndex - 1 + ytList.length) % ytList.length);
};
document.getElementById("playPause").onclick = () => {
  const state = player.getPlayerState();
  if (state === 1) player.pauseVideo();
  else player.playVideo();
};
document.getElementById("randomSmall").onclick = () => {
  loadYT(Math.floor(Math.random() * ytList.length));
};

// =========================
//  GAME
// =========================
document.querySelectorAll(".gbtn").forEach(btn => {
  btn.onclick = () => {
    document.getElementById("gameFrame").src = btn.dataset.src;
  };
});
