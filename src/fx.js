// Project-page motion: signature demos (APMS, QMS, TEDx), live flow diagrams,
// the Phase 2 PCB, hero reveals and card tilt.
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Flip, ScrollTrigger);
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad2 = (n) => String(n).padStart(2, '0');

// A small fake QR made of a seeded pattern (decorative)
function qr(seed = 7, n = 9) {
  let s = seed, cells = '';
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
    if (finder ? !(x % (n - 1) === 1 || y % (n - 1) === 1) || (x === 1 && y === 1) : rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  return `<svg viewBox="0 0 ${n} ${n}" class="qr" aria-hidden="true">${cells}</svg>`;
}

/* ---------------- Demos ---------------- */
export function demoHTML(kind) {
  if (kind === 'apms') return `<div class="demo demo-apms" data-demo="apms">
    <div class="da-machine"><div class="da-scan">${qr(11)}<i></i></div>
      <div><b>Over Lock-4Th Sunken Bed</b><span class="mono">M03-13 · Module 10.1</span><span class="da-state">Running</span></div></div>
    <div class="da-board">${['Pending', 'In progress', 'Fixed'].map((h, i) => `<div class="da-col"><h4><i class="c${i}"></i>${h}</h4><div class="da-slot" data-col="${i}"></div></div>`).join('')}</div>
    <div class="da-ticket"><span class="da-pri">Breakdown</span><b>Over Lock-4Th · M03-13</b><span class="da-meta"><span>Technical</span><span class="mono da-timer">00:00</span></span></div>
    <div class="da-toast"><i></i>Push alert sent to the Technical team</div>
    <div class="da-stats"><div><b class="mono da-mttr">—</b><span>repair time</span></div><div><b class="mono da-fixed">0</b><span>fixed in this demo</span></div></div>
  </div>`;
  if (kind === 'qms') return `<div class="demo demo-qms" data-demo="qms">
    <div class="dq-paper"><div class="dq-stack">${Array.from({ length: 7 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
      <b class="dq-count">78</b><span>paper sheets left this shift</span></div>
    <div class="dq-live"><header><span class="dq-dot"></span>Live · Module-10.1 · End Line</header>
      <ol class="dq-feed"></ol>
      <div class="dq-kpis"><div><b class="mono dq-checked">0</b><span>checked</span></div><div><b class="mono dq-def">0</b><span>defects</span></div><div><b class="mono dq-dhu">0.0%</b><span>DHU</span></div></div>
      <div class="dq-alert">Red operator flagged · AMMS ticket raised</div></div>
  </div>`;
  if (kind === 'tedx') {
    const rows = 'ABCDEFGH';
    return `<div class="demo demo-tedx" data-demo="tedx">
      <div class="dt-hall"><div class="dt-stage">Stage</div>
        <div class="dt-seats">${[...rows].map((r) => `<div class="dt-row"><span class="mono">${r}</span>${Array.from({ length: 14 }, (_, k) => `<i data-seat="${r}${k + 1}"${k === 6 ? ' class="gap"' : ''}></i>`).join('')}</div>`).join('')}</div>
        <div class="dt-legend"><span><i></i>Free</span><span><i class="b"></i>Booked</span><span><i class="s"></i>Your seat</span></div></div>
      <div class="dt-ticket"><div class="dt-top"><span class="dt-brand"><b>TEDx</b>NIFTJodhpur</span><span class="mono">Digital ticket</span></div>
        <b class="dt-title">Aarohan</b><span class="dt-sub">from the blues we rise</span>
        <div class="dt-info"><div><span>Row</span><b class="dt-r">—</b></div><div><span>Seat</span><b class="dt-s">—</b></div><div class="dt-qr">${qr(29, 11)}</div></div>
        <span class="dt-foot">Saved to My Tickets</span></div>
    </div>`;
  }
  return '';
}

function apmsDemo(root, reduce) {
  const ticket = $('.da-ticket', root), slots = $$('.da-slot', root), toast = $('.da-toast', root);
  const timer = $('.da-timer', root), mttr = $('.da-mttr', root), fixedEl = $('.da-fixed', root), state = $('.da-state', root), scan = $('.da-scan', root);
  let fixed = 0;
  const move = (i) => { const st = Flip.getState(ticket); slots[i].append(ticket); Flip.from(st, { duration: 0.8, ease: 'expo.inOut', absolute: true }); };
  const t = { v: 0 };
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true, onRepeat: () => { t.v = 0; } });
  tl.call(() => { slots[0].append(ticket); ticket.className = 'da-ticket'; timer.textContent = '00:00'; state.textContent = 'Running'; state.className = 'da-state'; })
    .fromTo(scan, { '--p': 0 }, { '--p': 1, duration: 0.9, ease: 'power2.inOut' })
    .call(() => { state.textContent = 'Breakdown'; state.className = 'da-state down'; })
    .fromTo(ticket, { opacity: 0, scale: 0.7, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)' })
    .fromTo(toast, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, '<0.2')
    .to(toast, { opacity: 0, y: -14, duration: 0.3 }, '+=1.2')
    .call(() => { move(1); ticket.classList.add('prog'); state.textContent = 'Being repaired'; state.className = 'da-state prog'; })
    .to(t, { v: 252, duration: 2.4, ease: 'none', onUpdate: () => (timer.textContent = `${pad2(Math.floor(t.v / 60))}:${pad2(Math.floor(t.v % 60))}`) }, '+=0.5')
    .call(() => { move(2); ticket.classList.add('done'); fixed++; fixedEl.textContent = fixed; mttr.textContent = '4m 12s'; state.textContent = 'Running'; state.className = 'da-state'; })
    .to(ticket, { opacity: 0, scale: 0.9, duration: 0.4 }, '+=1.6');
  return tl;
}

const OPS = [['7132', 'Gusset attachment'], ['1000', '2nd side seam'], ['8460', 'Waist lace attachment'], ['5442', 'Leg lace attachment'], ['11268', '1 side seam'], ['8783', 'Ironing'], ['12631', 'Bartack']];
const DEFECTS = ['Uncut thread', 'Skip stitch', 'Puckering', 'Rooping'];
function qmsDemo(root) {
  const feed = $('.dq-feed', root), sheets = $$('.dq-stack i', root), count = $('.dq-count', root);
  const checkedEl = $('.dq-checked', root), defEl = $('.dq-def', root), dhuEl = $('.dq-dhu', root), alert = $('.dq-alert', root);
  let checked = 0, defects = 0, step = 0, paper = 78;
  const script = [0, 1, 2, 3, 4, 5, 6, 1, 'red', 2, 3, 'red2', 4, 0];
  const tick = () => {
    const s = script[step % script.length];
    let op, defect = null;
    if (s === 'red' || s === 'red2') { op = OPS[3]; defect = 'Uncut thread'; } else { op = OPS[s]; if (step % 4 === 2) defect = DEFECTS[step % DEFECTS.length]; }
    checked += 5; if (defect) defects += 1;
    const li = document.createElement('li');
    li.innerHTML = `<span class="mono">${op[0]}</span><span>${op[1]}</span><b class="${defect ? 'bad' : 'ok'}">${defect || 'Pass'}</b>`;
    feed.prepend(li);
    gsap.from(li, { height: 0, opacity: 0, x: -20, duration: 0.45, ease: 'expo.out' });
    if (feed.children.length > 5) feed.lastElementChild.remove();
    checkedEl.textContent = checked; defEl.textContent = defects;
    dhuEl.textContent = `${((defects / checked) * 100).toFixed(1)}%`;
    if (s === 'red2') gsap.fromTo(alert, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' });
    // paper flies away as live data replaces it
    paper = Math.max(0, paper - 6);
    count.textContent = paper;
    const sh = sheets[step % sheets.length];
    gsap.fromTo(sh, { x: 0, y: 0, rotate: 0, opacity: 1 }, { x: 160, y: -90, rotate: 24, opacity: 0, duration: 0.9, ease: 'power2.in', onComplete: () => gsap.set(sh, { x: 0, y: 0, rotate: 0, opacity: paper ? 1 : 0.15 }) });
    step++;
    if (step >= script.length) { step = 0; checked = 0; defects = 0; paper = 78; gsap.to(alert, { opacity: 0, duration: 0.3 }); sheets.forEach((x) => gsap.set(x, { opacity: 1 })); }
  };
  const tl = gsap.timeline({ repeat: -1, paused: true });
  tl.call(tick).to({}, { duration: 0.75 });
  return tl;
}

function tedxDemo(root) {
  const seats = $$('.dt-seats i', root), ticket = $('.dt-ticket', root), r = $('.dt-r', root), s = $('.dt-s', root);
  let pick = null;
  const tl = gsap.timeline({ repeat: -1, paused: true, repeatDelay: 0.4 });
  tl.call(() => { seats.forEach((x) => (x.className = x.classList.contains('gap') ? 'gap' : '')); r.textContent = '—'; s.textContent = '—'; gsap.set(ticket, { y: 30, opacity: 0, rotate: -3 }); })
    .to({}, { duration: 0.2 })
    .call(() => {
      const order = gsap.utils.shuffle([...seats]).slice(0, 62);
      order.forEach((x, k) => gsap.delayedCall(k * 0.028, () => x.classList.add('b')));
      const free = seats.filter((x) => !order.includes(x));
      pick = free[Math.floor(free.length * 0.45)];
    })
    .to({}, { duration: 2.1 })
    .call(() => pick && pick.classList.add('s'))
    .to({}, { duration: 0.6 })
    .call(() => { const id = pick.dataset.seat; r.textContent = id[0]; s.textContent = id.slice(1); })
    .to(ticket, { y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.6)' })
    .to({}, { duration: 2.6 })
    .to(ticket, { y: -20, opacity: 0, duration: 0.4 });
  return tl;
}

export function initDemos(reduce) {
  $$('[data-demo]').forEach((root) => {
    const kind = root.dataset.demo;
    const tl = kind === 'apms' ? apmsDemo(root, reduce) : kind === 'qms' ? qmsDemo(root) : kind === 'tedx' ? tedxDemo(root) : null;
    if (!tl) return;
    if (reduce) { tl.progress(0.6).pause(); return; }
    ScrollTrigger.create({ trigger: root, start: 'top 85%', end: 'bottom 10%', onToggle: (st) => (st.isActive ? tl.play() : tl.pause()) });
  });
}

/* ---------------- Phase 2 PCB ---------------- */
export function pcbSVG() {
  const traces = [
    'M150 120 V210 H180 V280', 'M260 120 V230 H220 V280', 'M370 120 V250 H300 V280', 'M480 120 V200 H360 V280',
    'M400 375 H470',
    'M635 280 V200 H880 V140', 'M700 280 V230 H905 V190', 'M760 280 V255 H930 V240',
    'M635 470 V520', 'M435 470 V500 H400 V520',
    'M175 520 V470', 'M860 520 V490 H770 V470', 'M860 520 V495 H330 V470',
  ];
  return `<svg class="pcb" viewBox="0 0 1000 640" role="img" aria-label="Phase 2 PCB concept: both microcontroller footprints on one board with keyed JST sensor connectors, relay, CAN transceiver and 24 V to 5 V / 3.3 V regulation">
    <defs><pattern id="pcb-grid" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#1d6b57" opacity=".55"/></pattern></defs>
    <rect x="10" y="10" width="980" height="620" rx="34" fill="#0b3a30" stroke="#2fa58b" stroke-width="3"/>
    <rect x="10" y="10" width="980" height="620" rx="34" fill="url(#pcb-grid)"/>
    ${[[50, 50], [950, 50], [50, 590], [950, 590]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#071f19" stroke="#2fa58b" stroke-width="2"/>`).join('')}
    <g class="pcb-traces">${traces.map((d) => `<path d="${d}" class="pcb-trace"/>`).join('')}</g>
    <g class="pcb-flow"></g>
    ${[100, 210, 320, 430].map((x) => `<g class="pcb-part"><rect x="${x}" y="70" width="100" height="50" rx="8" fill="#e8ecef"/>${[0, 1, 2, 3].map((k) => `<rect x="${x + 14 + k * 19}" y="82" width="12" height="26" rx="2" fill="#9aa6b3"/>`).join('')}</g>`).join('')}
    <text x="315" y="150" class="pcb-l" text-anchor="middle">keyed JST · one per sensor</text>
    ${[140, 190, 240].map((y, k) => `<g class="pcb-part"><circle cx="${905}" cy="${y - 30}" r="16" fill="#0f2b25" stroke="#c9d3d0" stroke-width="2"/><circle class="pcb-led l${k}" cx="905" cy="${y - 30}" r="10"/></g>`).join('')}
    <g class="pcb-part"><rect x="130" y="280" width="270" height="190" rx="18" fill="#0a2a23" stroke="#4fd6ea" stroke-width="3" stroke-dasharray="12 9"/>
      <text x="265" y="365" class="pcb-h" fill="#4fd6ea" text-anchor="middle">Node A</text><text x="265" y="395" class="pcb-s" text-anchor="middle">MCU footprint</text></g>
    <g class="pcb-part"><rect x="470" y="280" width="320" height="190" rx="18" fill="#0a2a23" stroke="#ff9b4d" stroke-width="3" stroke-dasharray="12 9"/>
      <text x="630" y="365" class="pcb-h" fill="#ff9b4d" text-anchor="middle">Node B</text><text x="630" y="395" class="pcb-s" text-anchor="middle">MCU footprint</text></g>
    <g class="pcb-part"><rect x="70" y="520" width="210" height="80" rx="10" fill="#2a9a52" stroke="#1d6b3a" stroke-width="2"/>${[0, 1, 2, 3].map((k) => `<circle cx="${105 + k * 47}" cy="560" r="16" fill="#dbe3e0" stroke="#7e8b87"/>`).join('')}
      <text x="175" y="510" class="pcb-l" text-anchor="middle">machine supply in</text></g>
    <g class="pcb-part"><rect x="320" y="520" width="170" height="80" rx="10" fill="#141b20" stroke="#ff5a6e" stroke-width="2.5"/><text x="405" y="567" class="pcb-c" fill="#ff7a8a" text-anchor="middle">relay</text></g>
    <g class="pcb-part"><rect x="550" y="520" width="170" height="80" rx="10" fill="#141b20" stroke="#ff9b4d" stroke-width="2.5"/><text x="635" y="567" class="pcb-c" fill="#ffad6b" text-anchor="middle">CAN</text></g>
    <g class="pcb-part"><rect x="760" y="520" width="200" height="80" rx="10" fill="#141b20" stroke="#ffd23f" stroke-width="2.5"/><text x="860" y="556" class="pcb-c" fill="#ffd23f" text-anchor="middle">24 V → 5 V</text><text x="860" y="582" class="pcb-c" fill="#ffd23f" text-anchor="middle">/ 3.3 V</text></g>
  </svg>`;
}

export function initPCB(reduce) {
  const svg = $('.pcb');
  if (!svg) return;
  const traces = $$('.pcb-trace', svg);
  traces.forEach((t) => { const L = t.getTotalLength(); t.style.strokeDasharray = `${L} ${L}`; t.style.strokeDashoffset = reduce ? 0 : L; });
  if (reduce) return;
  gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%' } })
    .from($$('.pcb-part', svg), { opacity: 0, scale: 0.92, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.05, ease: 'back.out(1.6)' })
    .to(traces, { strokeDashoffset: 0, duration: 0.8, stagger: 0.06, ease: 'power2.inOut' }, 0.4)
    .call(() => {
      const g = $('.pcb-flow', svg), ns = 'http://www.w3.org/2000/svg';
      traces.forEach((t, k) => {
        const c = document.createElementNS(ns, 'circle');
        c.setAttribute('r', 4); c.setAttribute('class', 'pcb-spark');
        const m = document.createElementNS(ns, 'animateMotion');
        m.setAttribute('dur', `${1.4 + (k % 3) * 0.35}s`); m.setAttribute('repeatCount', 'indefinite');
        m.setAttribute('begin', `${(k * 0.17) % 1.2}s`); m.setAttribute('path', t.getAttribute('d'));
        c.append(m); g.append(c);
      });
      svg.classList.add('is-live');
    });
}

/* ---------------- Page-level motion ---------------- */
export function initProjectFx(reduce, delay = 0) {
  // Project title letters rise in one by one
  const title = $('.p-hero .t-hero');
  if (title && !reduce) {
    title.innerHTML = title.textContent.split(' ').map((w) => `<span class="tw">${[...w].map((ch) => `<span class="tch">${ch}</span>`).join('')}</span>`).join(' ');
    title.removeAttribute('data-reveal');
    gsap.set(title, { opacity: 1, y: 0 });
    gsap.from($$('.tch', title), { yPercent: 110, rotate: 8, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.035, delay: delay + 0.1 });
  }
  // Hero image opens like a curtain
  const stage = $('.p-stage .media');
  if (stage && !reduce) gsap.fromTo(stage, { clipPath: 'inset(18% 12% 18% 12% round 36px)' }, { clipPath: 'inset(0% 0% 0% 0% round 36px)', duration: 1.6, ease: 'expo.inOut', delay: delay + 0.35 });

  // Flow diagrams: stages light up in sequence while packets travel the links
  $$('[data-flow]').forEach((flow) => {
    const cols = $$('.flow-col', flow);
    let k = -1, iv = null;
    const step = () => { cols.forEach((c) => c.classList.remove('is-live')); k = (k + 1) % cols.length; cols[k].classList.add('is-live'); };
    if (reduce) return;
    flow.classList.add('is-animated');
    ScrollTrigger.create({ trigger: flow, start: 'top 80%', end: 'bottom 10%', onToggle: (st) => { clearInterval(iv); if (st.isActive) { step(); iv = setInterval(step, 900); } } });
  });
}

// Cards lean toward the cursor
export function initTilt() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('.w-card, .tile-tilt').forEach((card) => {
    const m = $('.media', card);
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' }), ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(card, { transformPerspective: 1000 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      rx(-y * 7); ry(x * 9);
      if (m) m.style.setProperty('--gx', `${(x + 0.5) * 100}%`), m.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* ---------------- Intro particles ---------------- */
export function introParticles(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio, 2);
  const size = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; };
  size();
  const hues = [244, 262, 290, 320, 200];
  const ps = Array.from({ length: 90 }, () => ({
    x: Math.random() * innerWidth, y: innerHeight + Math.random() * innerHeight * 0.8,
    r: 1 + Math.random() * 3.2, v: 0.6 + Math.random() * 2.2, w: Math.random() * 6.28, h: hues[Math.floor(Math.random() * hues.length)],
  }));
  let raf, alive = true;
  const frame = () => {
    if (!alive) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of ps) {
      p.y -= p.v; p.w += 0.03; p.x += Math.sin(p.w) * 0.6;
      if (p.y < -20) { p.y = innerHeight + 20; p.x = Math.random() * innerWidth; }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      g.addColorStop(0, `hsla(${p.h},100%,75%,.9)`); g.addColorStop(1, `hsla(${p.h},100%,60%,0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, 6.283); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  };
  frame();
  return () => { alive = false; cancelAnimationFrame(raf); };
}
