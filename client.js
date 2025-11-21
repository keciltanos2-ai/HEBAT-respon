// client.js - full robust version
const cfg = window.APP_CONFIG || {};
const YT_LIST = cfg.YOUTUBE_LIST || [];

let currentIndex = 0;
let ytPlayer = null;

function onYouTubeIframeAPIReady() {
  const id = YT_LIST[0] || '';
  ytPlayer = new YT.Player('player', {
    height: '200',
    width: '100%',
    videoId: id,
    playerVars: { 'playsinline': 1, 'rel': 0, 'enablejsapi': 1 },
    events: { 'onReady': onPlayerReady }
  });
}

function onPlayerReady() { updateTitle(YT_LIST[currentIndex]); }

function updateTitle(id){ document.getElementById('ytTitle').textContent = id ? 'Video ID: ' + id : ''; }

function renderByIndex(i){
  if(!YT_LIST.length) return;
  currentIndex = (i + YT_LIST.length) % YT_LIST.length;
  const id = YT_LIST[currentIndex];
  if(ytPlayer && ytPlayer.loadVideoById) ytPlayer.loadVideoById(id);
  updateTitle(id);
}

function playPause(){ if(!ytPlayer) return; const state = ytPlayer.getPlayerState(); if(state === YT.PlayerState.PLAYING) ytPlayer.pauseVideo(); else ytPlayer.playVideo(); }
function nextVid(){ renderByIndex(currentIndex+1); }
function prevVid(){ renderByIndex(currentIndex-1); }
function playRandom(){ renderByIndex(Math.floor(Math.random()*YT_LIST.length)); }

document.addEventListener('DOMContentLoaded', ()=>{
  const randomBtn = document.getElementById('randomBtn');
  if(randomBtn) randomBtn.addEventListener('click', playRandom);
  const randomSmall = document.getElementById('randomSmall');
  if(randomSmall) randomSmall.addEventListener('click', playRandom);
  const nextBtn = document.getElementById('nextVid');
  if(nextBtn) nextBtn.addEventListener('click', nextVid);
  const prevBtn = document.getElementById('prevVid');
  if(prevBtn) prevBtn.addEventListener('click', prevVid);
  const playBtn = document.getElementById('playPause');
  if(playBtn) playBtn.addEventListener('click', playPause);

  const searchBtn = document.getElementById('searchBtn');
  if(searchBtn) searchBtn.addEventListener('click', ()=>{
    const q = document.getElementById('gq').value.trim();
    if(!q) return;
    window.open('https://www.google.com/search?q='+encodeURIComponent(q), '_blank');
  });

  const nextQuote = document.getElementById('nextQuote');
  if(nextQuote) nextQuote.addEventListener('click', ()=>{ const QUOTES = [
    "Sukses bukan kunci kebahagiaan — kebahagiaan adalah kunci sukses.",
    "Kerja keras hari ini, cerita sukses esok hari.",
    "Jangan takut gagal; takutlah jika tidak pernah mencoba.",
    "Mulailah dari yang kecil, konsistenlah, dan lihat perubahan."
  ]; document.getElementById('quoteText').textContent = QUOTES[Math.floor(Math.random()*QUOTES.length)]; });

  document.querySelectorAll('.gbtn').forEach(b=> b.addEventListener('click', ()=>{ const frame=document.getElementById('gameFrame'); if(frame) frame.src = b.getAttribute('data-src'); }));

  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle) themeToggle.addEventListener('click', ()=> document.body.classList.toggle('dark'));

  const chatSend = document.getElementById('chatSend');
  const chatIn = document.getElementById('chatIn');
  if(chatSend && chatIn){
    chatSend.addEventListener('click', sendChat);
    chatIn.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendChat(); });
  }

  playRandom();
});

async function sendChat(){
  const input = document.getElementById('chatIn');
  if(!input) return;
  const msg = input.value.trim();
  if(!msg) return;
  const log = document.getElementById('chatLog');
  const userDiv = document.createElement('div'); userDiv.innerHTML = '<b>You:</b> '+msg; if(log) log.appendChild(userDiv);
  input.value='';
  const aiDiv = document.createElement('div'); aiDiv.innerHTML = '<b>AI:</b> ...'; if(log) log.appendChild(aiDiv);
  if(log) log.scrollTop = log.scrollHeight;

  const proxyBase = cfg.PROXY_BASE || '';
  const url = (proxyBase ? proxyBase.replace(/\/$/, '') : '') + '/api/chat';
  try{
    const res = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ message: msg }) });
    if(res.ok){
      const j = await res.json();
      aiDiv.innerHTML = '<b>AI:</b> ' + (j.reply || j.error || 'No reply');
      const s = document.getElementById('aiStatus'); if(s) s.textContent = 'AI: done';
      return;
    } else {
      aiDiv.innerHTML = '<b>AI:</b> Mock reply: ' + msg.split('').reverse().join('');
      const s = document.getElementById('aiStatus'); if(s) s.textContent = 'AI: mock (proxy error)';
    }
  }catch(e){
    aiDiv.innerHTML = '<b>AI:</b> Mock reply: ' + msg.split('').reverse().join('');
    const s = document.getElementById('aiStatus'); if(s) s.textContent = 'AI: mock (no proxy)';
  }
}
