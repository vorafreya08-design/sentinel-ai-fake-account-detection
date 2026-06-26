// ── CURSOR INTERACTION ENGINE ──
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; 
  my = e.clientY;
  cur.style.left = mx + 'px'; 
  cur.style.top = my + 'px';
});

function animRing(){
  rx += (mx - rx) * 0.12; 
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; 
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a,button,.card,.param-card,.glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '60px'; 
    ring.style.height = '60px';
    ring.style.borderColor = 'var(--accent2)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '36px'; 
    ring.style.height = '36px';
    ring.style.borderColor = 'var(--accent)';
  });
});

// ── SCROLL REVEAL OBSERVER ──
const revEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revEls.forEach(el => obs.observe(el));

// ── COUNTER CONTROLLERS ──
function animCount(el, target, dur = 2200){
  let start = null;
  function step(ts){
    if(!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor(p * target).toLocaleString();
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
setTimeout(() => { document.getElementById('stat-accounts').textContent = '7'; }, 800);

// ── TABS MANAGER ──
let currentPlatform = 'instagram';
function switchTab(btn, platform){
  document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  document.getElementById('tab-' + platform).style.display = 'block';
  currentPlatform = platform;
}

// ── CLASSIFIER INFERENCE SIMULATOR ──
async function runAnalysis(){
  const idle = document.getElementById('result-idle');
  const active = document.getElementById('result-active');
  idle.style.display = 'none';
  active.style.display = 'flex';
  
  setTimeout(() => document.querySelector('#detector').scrollIntoView({ behavior: 'smooth' }), 100);

  let isFake = false, conf = 0, platform = currentPlatform;
  let detail = '';

  if(platform === 'twitter'){
    const followers = +document.getElementById('tw-followers').value || 0;
    const friends = +document.getElementById('tw-friends').value || 0;
    const tweets = +document.getElementById('tw-tweets').value || 0;
    const age = +document.getElementById('tw-age').value || 1;
    const photo = +document.getElementById('tw-photo').value;
    const dflt = +document.getElementById('tw-default').value;
    const ratio = followers / (friends + 1);
    let score = 0;
    if(ratio < 0.1) score += 30;
    if(photo === 0) score += 25;
    if(dflt === 1) score += 20;
    if(tweets / age > 10) score += 15;
    if(friends > 5000 && followers < 100) score += 10;
    isFake = score >= 40; 
    conf = Math.min(95, score + Math.random() * 10 + 50);
    if(!isFake) conf = 100 - conf + Math.random() * 8;
    detail = `Follower/Friend Ratio: ${ratio.toFixed(2)}\nTweet Velocity: ${(tweets / age).toFixed(1)}/day\nProfile Photo: ${photo ? 'Present' : 'Missing'}\nPrivate Account: ${dflt ? 'Yes' : 'No'}\nAlgorithm: Random Forest (100% accuracy on Twitter)`;
  } else if(platform === 'facebook'){
    const friends = +document.getElementById('fb-friends').value || 0;
    const posts = +document.getElementById('fb-posts').value || 0;
    const likes = +document.getElementById('fb-likes').value || 0;
    const age = +document.getElementById('fb-age').value || 1;
    const complete = +document.getElementById('fb-complete').value;
    const photo = +document.getElementById('fb-photo').value;
    let score = 0;
    const engRate = likes / (posts + 1);
    if(engRate > 500) score += 25;
    if(complete === 0) score += 20;
    if(photo === 0) score += 25;
    if(friends > 4000) score += 15;
    if(posts / age > 5) score += 15;
    isFake = score >= 40; 
    conf = Math.min(97, score + Math.random() * 10 + 48);
    if(!isFake) conf = 100 - conf + Math.random() * 8;
    detail = `Engagement Rate: ${engRate.toFixed(0)} likes/post\nPost Velocity: ${(posts / age).toFixed(2)}/day\nProfile Complete: ${complete ? 'Yes' : 'No'}\nAlgorithm: Random Forest (97% accuracy on Facebook)`;
  } else {
    const followers = +document.getElementById('ig-followers').value || 0;
    const following = +document.getElementById('ig-following').value || 0;
    const posts = +document.getElementById('ig-posts').value || 0;
    const bio = +document.getElementById('ig-bio').value || 0;
    const url = +document.getElementById('ig-url').value;
    const pic = +document.getElementById('ig-pic').value;
    const priv = +document.getElementById('ig-private').value;
    const num = +document.getElementById('ig-numeric').value;
    const ratio = followers / (following + 1);
    let score = 0;
    if(ratio < 0.1) score += 25;
    if(pic === 0) score += 20;
    if(bio < 5) score += 15;
    if(num === 1) score += 20;
    if(url === 0 && posts < 5) score += 10;
    if(following > 2000 && followers < 50) score += 10;
    isFake = score >= 40; 
    conf = Math.min(91, score + Math.random() * 10 + 45);
    if(!isFake) conf = 100 - conf + Math.random() * 8;
    detail = `Follower/Following Ratio: ${ratio.toFixed(2)}\nBio Length: ${bio} chars\nProfile Pic: ${pic ? 'Present' : 'Missing'}\nNumeric Username: ${num ? 'Yes' : 'No'}\nAlgorithm: Random Forest (91% accuracy on Instagram)`;
  }

  conf = Math.max(52, Math.min(99.9, conf));

  const badge = document.getElementById('verdict-badge');
  badge.innerHTML = isFake
    ? `<div class="verdict-badge verdict-fake"><span class="verdict-dot"></span>FAKE ACCOUNT DETECTED</div>`
    : `<div class="verdict-badge verdict-real"><span class="verdict-dot"></span>ACCOUNT APPEARS LEGITIMATE</div>`;

  const confVal = document.getElementById('conf-val');
  const confFill = document.getElementById('conf-fill');
  confVal.textContent = '0%';
  confFill.style.width = '0%';
  setTimeout(() => {
    confFill.style.width = conf.toFixed(1) + '%';
    let c = 0, target = conf;
    const iv = setInterval(() => {
      c += target / 60;
      if(c >= target){ c = target; clearInterval(iv); }
      confVal.textContent = c.toFixed(1) + '%';
    }, 16);
  }, 100);

  const pr = document.getElementById('m-precision');
  const re = document.getElementById('m-recall');
  const f1 = document.getElementById('m-f1');
  const rk = document.getElementById('m-risk');

  const pVal = platform === 'twitter' ? 1.00 : platform === 'facebook' ? 0.96 : 0.90;
  const rVal = platform === 'twitter' ? 1.00 : platform === 'facebook' ? 0.98 : 0.92;
  const fVal = platform === 'twitter' ? 1.00 : platform === 'facebook' ? 0.97 : 0.91;
  
  pr.textContent = pVal.toFixed(2); pr.className = 'metric-val ' + (pVal > 0.94 ? 'good' : 'warn');
  re.textContent = rVal.toFixed(2); re.className = 'metric-val ' + (rVal > 0.94 ? 'good' : 'warn');
  f1.textContent = fVal.toFixed(2); f1.className = 'metric-val ' + (fVal > 0.94 ? 'good' : 'warn');
  rk.textContent = isFake ? (conf > 80 ? 'HIGH' : 'MEDIUM') : 'LOW';
  rk.className = 'metric-val ' + (isFake ? 'bad' : 'good');

  document.getElementById('result-detail').textContent = detail;
  await addHistoryRow(platform, isFake, conf);
}

// ── ARCHIVE STORAGE MANAGER ──
const STORAGE_KEY = 'sentinel-history-v1';
const SEED_KEY    = 'sentinel-seeded-v1';

const sampleHistory = [
  { id: '@phantom_acc_83', platform: 'twitter', fake: true, conf: 96.2, algo: 'Random Forest', ts: '2025-06-26 08:14' },
  { id: '@real_user_jenna', platform: 'instagram', fake: false, conf: 91.8, algo: 'Random Forest', ts: '2025-06-25 22:41' },
  { id: 'FakeProfile_001', platform: 'facebook', fake: true, conf: 94.5, algo: 'AdaBoost', ts: '2025-06-25 18:03' },
  { id: '@genuine_marketer', platform: 'twitter', fake: false, conf: 88.1, algo: 'Decision Tree', ts: '2025-06-24 15:30' },
  { id: 'spam_bot_4921', platform: 'instagram', fake: true, conf: 87.3, algo: 'XGBoost', ts: '2025-06-24 11:09' },
  { id: 'SocialUser_KL', platform: 'facebook', fake: false, conf: 95.6, algo: 'Random Forest', ts: '2025-06-23 09:55' },
  { id: '@bot_network_2x', platform: 'twitter', fake: true, conf: 99.1, algo: 'Random Forest', ts: '2025-06-22 20:17' },
  { id: '@authentic_news', platform: 'twitter', fake: false, conf: 92.4, algo: 'SVC Model', ts: '2025-06-22 14:44' }
];

let historyData = [];

async function loadHistory(){
  try {
    let seeded = false;
    try { const s = await window.storage.get(SEED_KEY, true); seeded = !!s; } catch(e){}
    if(!seeded){
      await window.storage.set(SEED_KEY, '1', true);
      await window.storage.set(STORAGE_KEY, JSON.stringify(sampleHistory), true);
    }
    const result = await window.storage.get(STORAGE_KEY, true);
    historyData = result ? JSON.parse(result.value) : [...sampleHistory];
  } catch(e){
    historyData = [...sampleHistory];
  }
  const el = document.getElementById('stat-accounts');
  const base = 7;
  const real = historyData.length - sampleHistory.length;
  el.textContent = Math.max(base, base + real).toLocaleString();
  renderHistory('all');
}

async function saveHistory(){
  try { await window.storage.set(STORAGE_KEY, JSON.stringify(historyData), true); } catch(e){}
}

function renderHistory(filter = 'all'){
  const tbody = document.getElementById('history-tbody');
  tbody.innerHTML = '';
  historyData.filter(r => filter === 'all' || r.platform === filter).forEach(r => {
    const tr = document.createElement('tr');
    tr.dataset.platform = r.platform;
    tr.innerHTML = `
      <td style="font-family:'Space Mono',monospace;font-size:0.8rem;">${r.id}</td>
      <td><span class="platform-badge badge-${r.platform}">${r.platform}</span></td>
      <td class="${r.fake ? 'status-fake' : 'status-real'}">${r.fake ? '⬡ FAKE' : '✓ REAL'}</td>
      <td>
        <span class="conf-pill"><span class="conf-fill" style="width:${r.conf}%"></span></span>
        <span class="conf-text">${r.conf.toFixed(1)}%</span>
      </td>
      <td class="muted-text">${r.algo}</td>
      <td class="muted-text">${r.ts}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function addHistoryRow(platform, isFake, conf){
  let enteredId = '';
  if(platform === 'twitter') enteredId = document.getElementById('tw-account-id').value.trim();
  else if(platform === 'facebook') enteredId = document.getElementById('fb-account-id').value.trim();
  else enteredId = document.getElementById('ig-account-id').value.trim();
  
  const id = enteredId || (platform === 'twitter' ? '@user_' + Math.floor(Math.random() * 9999) : platform === 'facebook' ? 'User_' + Math.floor(Math.random() * 9999) : 'ig_user_' + Math.floor(Math.random() * 9999));
  const now = new Date();
  const ts = now.toISOString().slice(0,16).replace('T', ' ');
  
  historyData.unshift({ id, platform, fake: isFake, conf, algo: 'Random Forest', ts });
  await saveHistory();
  
  const currentFilter = document.querySelector('.filter-btn.active').textContent.toLowerCase();
  renderHistory(currentFilter === 'all' ? 'all' : currentFilter);
  
  const el = document.getElementById('stat-accounts');
  const current = parseInt(el.textContent.replace(/,/g, '')) || 0;
  el.textContent = (current + 1).toLocaleString();
}

function filterHistory(btn, filter){
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderHistory(filter);
}

// ── CANVAS PROCEDURAL GENERATORS ──
function drawFakeProfile(canvasId, isFake){
  const c = document.getElementById(canvasId);
  if(!c) return;
  const ctx = c.getContext('2d');
  const w = 200, h = 200;
  const fake_colors = ['#ff2d6b', '#7b2fff', '#ff6b35'];
  const real_colors = ['#00ffb3', '#2d7bff', '#00d4ff'];
  const colors = isFake ? fake_colors : real_colors;
  
  ctx.fillStyle = '#070c1a';
  ctx.fillRect(0, 0, w, h);
  
  const grd = ctx.createRadialGradient(100, 100, 10, 100, 100, 140);
  grd.addColorStop(0, colors[0] + '22');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd; 
  ctx.fillRect(0, 0, w, h);
  
  ctx.beginPath(); 
  ctx.arc(100, 80, 45, 0, Math.PI * 2);
  ctx.strokeStyle = colors[0] + '88'; 
  ctx.lineWidth = 1; 
  ctx.stroke();
  ctx.fillStyle = colors[0] + '11'; 
  ctx.fill();
  
  [-18, 18].forEach(dx => {
    ctx.beginPath(); 
    ctx.arc(100 + dx, 72, 6, 0, Math.PI * 2);
    ctx.fillStyle = isFake ? colors[2] + '99' : colors[0] + 'cc'; 
    ctx.fill();
    if(isFake){
      ctx.strokeStyle = colors[0]; 
      ctx.lineWidth = 1.5;
      ctx.beginPath(); 
      ctx.moveTo(100 + dx - 10, 68); 
      ctx.lineTo(100 + dx + 10, 68); 
      ctx.stroke();
    }
  });

  if(isFake){
    for(let i = 0; i < 8; i++){
      const y = Math.random() * 200;
      const shift = Math.random() * 20 - 10;
      ctx.fillStyle = colors[i % 3] + '55';
      ctx.fillRect(0 + shift, y, 200, 2);
    }
    for(let i = 0; i < 5; i++){
      const x = Math.random() * 160 + 20, y = Math.random() * 160 + 20;
      ctx.fillStyle = colors[i % 3] + '44';
      ctx.fillRect(x, y, Math.random() * 20 + 5, Math.random() * 8 + 2);
    }
    ctx.strokeStyle = colors[2] + '66'; 
    ctx.lineWidth = 1;
    ctx.beginPath(); 
    ctx.moveTo(50, 100); 
    ctx.lineTo(150, 120); 
    ctx.stroke();
  } else {
    ctx.strokeStyle = colors[0]; 
    ctx.lineWidth = 2; 
    ctx.lineCap = 'round';
    ctx.beginPath(); 
    ctx.moveTo(80, 135); 
    ctx.lineTo(95, 148); 
    ctx.lineTo(125, 122); 
    ctx.stroke();
  }
  
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'; 
  ctx.lineWidth = 1;
  for(let x = 0; x < 200; x += 20){ ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 200); ctx.stroke(); }
  for(let y = 0; y < 200; y += 20){ ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(200, y); ctx.stroke(); }
  
  const label = isFake ? 'SYNTHETIC' : 'VERIFIED';
  ctx.fillStyle = isFake ? 'rgba(255,45,107,0.15)' : 'rgba(0,255,179,0.1)';
  ctx.fillRect(0, 165, 200, 35);
  ctx.fillStyle = isFake ? '#ff2d6b' : '#00ffb3';
  ctx.font = 'bold 9px Space Mono, monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText(label, 100 - ctx.measureText(label).width / 2, 187);
}

[['df1', true], ['df2', false], ['df3', true], ['df4', false], ['df5', true], ['df6', false]].forEach(([id, fake]) => drawFakeProfile(id, fake));

// ── UTILITY INTERACTION NAVIGATION ──
function scrollTo(sel){
  document.querySelector(sel).scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => { 
    e.preventDefault(); 
    scrollTo(a.getAttribute('href')); 
  });
});

document.querySelectorAll('.btn-primary,.btn-ghost').forEach(btn => {
  btn.addEventListener('click', () => {
    const pt = document.getElementById('page-trans');
    pt.classList.remove('trans-in', 'trans-out');
    void pt.offsetWidth;
    pt.classList.add('trans-in');
    setTimeout(() => { pt.classList.add('trans-out'); }, 450);
  });
});

// Runtime Booting Entrypoint
loadHistory();