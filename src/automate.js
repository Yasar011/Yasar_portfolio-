// "Automation playground": a toy sewing machine whose sensors visitors can play with.
// The rules are the same ones Yasar built (IoT thresholds, andon states, auto tickets);
// the hints are canned, rule-based text standing in for the AI layer.
import gsap from 'gsap';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

export function playgroundHTML() {
  return `<div class="pg" data-pg>
    <div class="pg-stage">
      <div class="pg-badge mono"><span class="pg-state-dot"></span><b class="pg-state">IDLE</b></div>
      <svg class="pg-machine" viewBox="0 0 320 220" aria-hidden="true">
        <defs><radialGradient id="pg-heat" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff5a2a" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"/></radialGradient></defs>
        <rect x="10" y="170" width="300" height="14" rx="4" fill="#2a2a33"/>
        <rect x="40" y="184" width="10" height="34" fill="#2a2a33"/><rect x="270" y="184" width="10" height="34" fill="#2a2a33"/>
        <g class="pg-body">
          <path d="M70 168 V70 Q70 50 92 50 H250 Q268 50 268 70 V168 Z" fill="#e7e9f0"/>
          <rect x="70" y="140" width="198" height="28" rx="4" fill="#cfd3de"/>
          <rect x="110" y="88" width="120" height="42" rx="8" fill="#0d0d12"/>
          <path d="M92 70 H130 V100 H92 Z" fill="#cfd3de"/>
          <g class="pg-needlebar"><rect x="106" y="98" width="6" height="34" rx="2" fill="#9aa3b5"/><rect x="108" y="130" width="2" height="14" fill="#c9cfdb"/></g>
          <text class="pg-lcd mono" x="170" y="105" text-anchor="middle">R:0</text>
          <text class="pg-lcd2 mono" x="170" y="121" text-anchor="middle">[LIVE] IDLE</text>
        </g>
        <g class="pg-motor"><circle cx="268" cy="104" r="40" fill="url(#pg-heat)" class="pg-glow" opacity="0"/>
          <circle cx="268" cy="104" r="26" fill="#3a3f52"/><g class="pg-wheel"><circle cx="268" cy="104" r="18" fill="#5c6278"/><rect x="266" y="88" width="4" height="32" fill="#8b91a8"/><rect x="252" y="102" width="32" height="4" fill="#8b91a8"/></g></g>
        <g class="pg-tower"><rect x="292" y="100" width="6" height="70" fill="#2a2a33"/>
          <rect x="284" y="40" width="22" height="18" rx="3" class="lmp r"/><rect x="284" y="60" width="22" height="18" rx="3" class="lmp y"/><rect x="284" y="80" width="22" height="18" rx="3" class="lmp g"/></g>
        <path class="pg-fabric" d="M60 166 H280" stroke="#7c6cff" stroke-width="5" stroke-dasharray="8 6" fill="none"/>
      </svg>
      <div class="pg-meters">
        <div><span>Speed</span><b class="mono pg-m-rpm">0</b><small>RPM</small></div>
        <div><span>Motor</span><b class="mono pg-m-temp">32</b><small>°C</small></div>
        <div><span>Vibration</span><b class="mono pg-m-vib">0.4</b><small>G</small></div>
        <div><span>Steps saved</span><b class="mono pg-m-saved">0</b><small>manual</small></div>
      </div>
    </div>

    <div class="pg-panel">
      <label class="pg-slider"><span>Speed <b class="mono pg-v-rpm">0 RPM</b></span><input type="range" min="0" max="4000" step="50" value="0" data-k="rpm"></label>
      <label class="pg-slider"><span>Motor temperature <b class="mono pg-v-temp">32 °C</b></span><input type="range" min="25" max="95" step="1" value="32" data-k="temp"></label>
      <label class="pg-slider"><span>Vibration <b class="mono pg-v-vib">0.4 G</b></span><input type="range" min="0" max="4" step="0.1" value="0.4" data-k="vib"></label>
      <div class="pg-btns">
        <button type="button" class="pg-b" data-act="needle">Needle change</button>
        <button type="button" class="pg-b pg-b-red" data-act="estop">E-stop</button>
        <button type="button" class="pg-b pg-b-chaos" data-act="chaos">Chaos mode</button>
        <button type="button" class="pg-b" data-act="reset">Reset</button>
      </div>
      <div class="pg-log-h"><span>Automation log</span><span class="pg-legend"><i class="iot"></i>IoT <i class="ai"></i>AI <i class="sw"></i>Software</span></div>
      <ol class="pg-log" aria-live="polite"></ol>
    </div>
    <p class="pg-note">Interactive simulation of the rules I built into GarmentFix, not live machine data. The AI hints are illustrative.</p>
  </div>`;
}

export function initPlayground(reduce) {
  const root = $('[data-pg]');
  if (!root) return;
  const s = { rpm: 0, temp: 32, vib: 0.4, needle: false, estop: false, cut: false };
  const fired = new Set();
  let saved = 0, lastState = '';
  const log = $('.pg-log', root);
  const say = (type, text) => {
    const li = document.createElement('li');
    li.className = type;
    const t = new Date();
    li.innerHTML = `<span class="mono">${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}</span><i></i><span>${text}</span>`;
    log.prepend(li);
    if (!reduce) gsap.from(li, { height: 0, opacity: 0, x: -16, duration: 0.4, ease: 'expo.out' });
    while (log.children.length > 6) log.lastElementChild.remove();
    if (type !== 'ai') { saved++; $('.pg-m-saved', root).textContent = saved; }
  };
  const once = (key, cond, fn) => { if (cond && !fired.has(key)) { fired.add(key); fn(); } if (!cond) fired.delete(key); };

  // Same priority ladder as the firmware: the first match wins
  const state = () => (s.cut ? 'MACHINE_OFF' : s.estop ? 'EMERGENCY' : s.needle ? 'NEEDLE_CHG' : s.rpm > 10 ? 'RUNNING' : 'IDLE');
  const lamps = { RUNNING: 'g', IDLE: 'y', NEEDLE_CHG: 'ry', EMERGENCY: 'r', MACHINE_OFF: '' };

  // Needle bar + wheel animation driven by speed
  const bar = $('.pg-needlebar', root), wheel = $('.pg-wheel', root), body = $('.pg-machine', root);
  const spin = gsap.to(wheel, { rotate: 360, transformOrigin: '268px 104px', svgOrigin: '268 104', repeat: -1, ease: 'none', duration: 1, paused: true });
  const bob = gsap.to(bar, { y: 10, yoyo: true, repeat: -1, ease: 'sine.inOut', duration: 0.2, paused: true });
  const fabric = gsap.to($('.pg-fabric', root), { strokeDashoffset: -140, repeat: -1, ease: 'none', duration: 1, paused: true });
  let shake = null;

  const render = () => {
    const live = !s.cut && !s.estop && !s.needle && s.rpm > 10;
    const st = state();
    root.dataset.state = st;
    $('.pg-state', root).textContent = st.replace('_', ' ');
    $('.pg-lcd', root).textContent = `R:${live ? s.rpm : 0}  T:${s.temp.toFixed(0)}C`;
    $('.pg-lcd2', root).textContent = `[LIVE] ${st === 'MACHINE_OFF' ? 'OFF' : st}`;
    $$('.lmp', root).forEach((l) => l.classList.toggle('on', lamps[st].includes([...l.classList].find((c) => c.length === 1))));
    $('.pg-m-rpm', root).textContent = live ? s.rpm : 0;
    $('.pg-m-temp', root).textContent = s.temp.toFixed(0);
    $('.pg-m-vib', root).textContent = s.vib.toFixed(1);
    $('.pg-glow', root).setAttribute('opacity', Math.max(0, (s.temp - 45) / 45).toFixed(2));
    root.classList.toggle('is-hot', s.temp > 75);
    if (!reduce) {
      const k = live ? Math.max(0.15, s.rpm / 4000) : 0;
      [spin, bob, fabric].forEach((a) => (k ? (a.timeScale(k * (a === bob ? 3 : 2.2)), a.play()) : a.pause()));
      shake?.kill();
      if (live && s.vib > 1) shake = gsap.to(body, { x: () => gsap.utils.random(-1, 1) * s.vib, y: () => gsap.utils.random(-1, 1) * s.vib * 0.5, duration: 0.05, repeat: -1, repeatRefresh: true });
      else gsap.set(body, { x: 0, y: 0 });
    }

    // ---- automation rules ----
    if (st !== lastState) {
      const msg = { RUNNING: 'Sewing detected (RPM above 10): state RUNNING, andon GREEN, shift timer started.', IDLE: 'Machine idle: andon YELLOW, idle time counted for OEE.', NEEDLE_CHG: 'Needle change logged as planned downtime, not a breakdown.', EMERGENCY: 'E-stop pressed: EMERGENCY, andon RED, supervisor alerted.', MACHINE_OFF: 'Power cut: machine OFF until it cools down.' }[st];
      say('iot', msg);
      lastState = st;
    }
    once('vib', s.vib > 2.5 && !s.cut, () => {
      say('iot', `Vibration ${s.vib.toFixed(1)} G crossed 2.5 G: CHECK TENSION flagged on the dashboard.`);
      say('sw', 'APMS ticket raised automatically and routed to the Mechanical team.');
      say('ai', 'Hint: steady high vibration at speed usually means a loose belt or a worn bearing.');
    });
    once('hot', s.temp > 75, () => {
      s.cut = true;
      say('iot', `Motor at ${s.temp.toFixed(0)} °C, above 75 °C: the relay cut power automatically.`);
      say('ai', 'Hint: sudden heat often comes from lint build-up. Clean the motor fan before restarting.');
      render();
    });
    if (s.cut && s.temp <= 60 && !s.estop) { s.cut = false; say('iot', 'Motor cooled below 60 °C: power restored.'); render(); }
    once('warm', s.temp > 65 && s.temp <= 75, () => say('ai', 'Hint: motor running warm. Worth a check before it trips.'));
  };

  $$('input[type=range]', root).forEach((inp) => inp.addEventListener('input', () => {
    s[inp.dataset.k] = +inp.value;
    $(`.pg-v-${inp.dataset.k}`, root).textContent = inp.dataset.k === 'rpm' ? `${inp.value} RPM` : inp.dataset.k === 'temp' ? `${inp.value} °C` : `${(+inp.value).toFixed(1)} G`;
    render();
  }));
  const setSlider = (k, v) => { const i = $(`input[data-k=${k}]`, root); i.value = v; i.dispatchEvent(new Event('input')); };

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const a = b.dataset.act;
    if (a === 'needle') { s.needle = !s.needle; s.estop = false; }
    if (a === 'estop') { s.estop = !s.estop; s.needle = false; }
    $('[data-act=needle]', root).classList.toggle('on', s.needle);
    $('[data-act=estop]', root).classList.toggle('on', s.estop);
    if (a === 'reset') { s.needle = s.estop = s.cut = false; fired.clear(); log.innerHTML = ''; saved = 0; $('.pg-m-saved', root).textContent = 0; setSlider('rpm', 0); setSlider('temp', 32); setSlider('vib', 0.4); lastState = ''; }
    if (a === 'chaos') {
      if (!reduce) gsap.fromTo(root, { rotate: -0.6 }, { rotate: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      const steps = [['rpm', 3600], ['vib', 3.1], ['temp', 82]];
      steps.forEach(([k, v], i) => setTimeout(() => setSlider(k, v), i * 650));
      return;
    }
    render();
  });

  // Start with the machine sewing so the demo is alive at first glance
  setTimeout(() => setSlider('rpm', 2200), 400);
  render();
}
