// Page-level themes: a transition for each main page (Work, Garments, Photography,
// About, CV) and an entrance animation that matches it.
import gsap from 'gsap';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const letters = (t) => t.split(' ').map((w) => `<span class="flw">${[...w].map((c) => `<span class="fl">${c}</span>`).join('')}</span>`).join(' ');
const mk = (cls, html) => {
  const d = document.createElement('div');
  d.className = `tr ${cls}`; d.setAttribute('aria-hidden', 'true'); d.innerHTML = html;
  document.body.append(d);
  return d;
};
const label = (small, text) => `<div class="tr-label"><small class="mono">${small}</small><b>${letters(text)}</b></div>`;
const labelIn = (d, at) => gsap.fromTo($$('.fl', d), { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.025, delay: at });
const labelOut = (tl, d, at) => tl.to($('.tr-label', d), { opacity: 0, y: -30, duration: 0.35, ease: 'power2.in' }, at);

export const pageKind = (path) => ({ '/work': 'work', '/garments': 'garments', '/photography': 'photo', '/about': 'about', '/cv': 'cv' }[path] || null);

// Octagon used by the camera aperture
const octagon = (r) => Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2 + Math.PI / 8; return `${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`; }).join(' ');

const THEMES = {
  // Work: stacked panels rise like project cards
  work: {
    build: (t) => mk('tr-panels', `${Array.from({ length: 6 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}${label('SELECTED WORK', t)}`),
    cover: (tl, d) => tl.fromTo($$('i', d), { yPercent: 101 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut', stagger: 0.05 }, 0),
    reveal: (tl, d) => tl.to($$('i', d), { yPercent: -101, duration: 0.65, ease: 'power3.inOut', stagger: 0.05 }, 0.45),
  },
  // Garments: a satin drape falls, its hem stitched as it lands
  garments: {
    build: (t) => mk('tr-drape', `<svg class="dr-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="drg" x1="0" x2="1"><stop offset="0" stop-color="#5b2140"/><stop offset=".25" stop-color="#9b5d8f"/><stop offset=".5" stop-color="#6e2a55"/><stop offset=".75" stop-color="#a873a0"/><stop offset="1" stop-color="#5b2140"/></linearGradient></defs>
      <path class="dr-cloth" fill="url(#drg)" d="M0 0 H100 V0 Q75 0 50 0 Q25 0 0 0 Z"/><path class="dr-hem" fill="none" stroke="#f3d9ea" stroke-width=".5" stroke-dasharray="1.6 1.2" vector-effect="non-scaling-stroke" d="M0 0 Q25 0 50 0 Q75 0 100 0"/></svg>
      ${label('MADE BY HAND', t)}`),
    cover: (tl, d) => {
      const cloth = $('.dr-cloth', d), hem = $('.dr-hem', d);
      tl.to(cloth, { attr: { d: 'M0 0 H100 V70 Q75 92 50 80 Q25 68 0 88 Z' }, duration: 0.45, ease: 'power2.in' }, 0)
        .to(hem, { attr: { d: 'M0 86 Q25 66 50 78 Q75 90 100 68' }, duration: 0.45, ease: 'power2.in' }, 0)
        .to(cloth, { attr: { d: 'M0 0 H100 V100 Q75 100 50 100 Q25 100 0 100 Z' }, duration: 0.4, ease: 'power2.out' }, 0.45)
        .to(hem, { attr: { d: 'M0 98 Q25 98 50 98 Q75 98 100 98' }, duration: 0.4, ease: 'power2.out' }, 0.45);
    },
    reveal: (tl, d) => {
      const cloth = $('.dr-cloth', d), hem = $('.dr-hem', d);
      tl.set(cloth, { attr: { d: 'M0 0 H100 V100 Q75 100 50 100 Q25 100 0 100 Z' } }, 0).set(hem, { attr: { d: 'M0 98 Q25 98 50 98 Q75 98 100 98' } }, 0)
        .to(cloth, { attr: { d: 'M0 0 H100 V30 Q75 12 50 26 Q25 40 0 18 Z' }, duration: 0.45, ease: 'power2.in' }, 0.45)
        .to(hem, { attr: { d: 'M0 16 Q25 38 50 24 Q75 10 100 28' }, duration: 0.45, ease: 'power2.in' }, 0.45)
        .to(cloth, { attr: { d: 'M0 0 H100 V0 Q75 0 50 0 Q25 0 0 0 Z' }, duration: 0.35, ease: 'power2.out' }, 0.9)
        .to(hem, { attr: { d: 'M0 0 Q25 0 50 0 Q75 0 100 0' }, opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.9);
    },
  },
  // Photography: a camera aperture closes, then opens with a flash
  photo: {
    build: (t) => mk('tr-shutter', `<svg class="sh-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><defs><mask id="sh-m"><rect width="100" height="100" fill="#fff"/><polygon class="sh-hole" fill="#000" points="${octagon(80)}"/></mask></defs>
      <rect width="100" height="100" fill="#0b0b0f" mask="url(#sh-m)"/>
      <g class="sh-blades">${Array.from({ length: 8 }, (_, k) => `<line x1="50" y1="50" x2="${50 + Math.cos(k * 0.785) * 80}" y2="${50 + Math.sin(k * 0.785) * 80}" stroke="#2a2a33" stroke-width=".35"/>`).join('')}</g></svg>
      <div class="sh-flash"></div>${label('THROUGH THE LENS', t)}`),
    cover: (tl, d) => {
      const hole = $('.sh-hole', d), o = { r: 80 };
      tl.to(o, { r: 0, duration: 0.6, ease: 'power3.in', onUpdate: () => hole.setAttribute('points', octagon(o.r)) }, 0)
        .fromTo($('.sh-blades', d), { rotate: 0, transformOrigin: '50% 50%' }, { rotate: 45, duration: 0.6, ease: 'power3.in' }, 0);
    },
    reveal: (tl, d) => {
      const hole = $('.sh-hole', d), o = { r: 0 };
      hole.setAttribute('points', octagon(0));
      tl.fromTo($('.sh-flash', d), { opacity: 0 }, { opacity: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, 0.45)
        .to(o, { r: 80, duration: 0.7, ease: 'power3.out', onUpdate: () => hole.setAttribute('points', octagon(o.r)) }, 0.55)
        .fromTo($('.sh-blades', d), { rotate: 45, transformOrigin: '50% 50%' }, { rotate: 0, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.55);
    },
  },
  // About: venetian blinds slide shut from alternating sides
  about: {
    build: (t) => mk('tr-blinds', `${Array.from({ length: 9 }, (_, i) => `<i class="${i % 2 ? 'r' : 'l'}"></i>`).join('')}${label('HI, I’M YASAR', t)}`),
    cover: (tl, d) => tl.fromTo($$('i', d), { xPercent: (i) => (i % 2 ? 101 : -101) }, { xPercent: 0, duration: 0.55, ease: 'power3.inOut', stagger: 0.04 }, 0),
    reveal: (tl, d) => tl.to($$('i', d), { xPercent: (i) => (i % 2 ? -101 : 101), duration: 0.6, ease: 'power3.inOut', stagger: 0.04 }, 0.45),
  },
  // CV: a sheet of paper prints up, its lines typing in
  cv: {
    build: (t) => mk('tr-paper', `<div class="pp-bg"></div><div class="pp-sheet"><div class="pp-head"><b>Yasar C H</b><span>Curriculum Vitae</span></div>${Array.from({ length: 11 }, (_, i) => `<i style="width:${[92, 70, 84, 60, 88, 76, 94, 66, 80, 58, 72][i]}%"></i>`).join('')}</div>${label('CURRICULUM VITAE', t)}`),
    cover: (tl, d) => tl.fromTo($('.pp-bg', d), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0)
      .fromTo($('.pp-sheet', d), { yPercent: 120, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 0.6, ease: 'power3.out' }, 0.05)
      .fromTo($$('.pp-sheet i', d), { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: 'power2.out', stagger: 0.03 }, 0.35),
    reveal: (tl, d) => tl.to($('.pp-sheet', d), { yPercent: -130, rotate: -2, duration: 0.6, ease: 'power3.in' }, 0.4)
      .to($('.pp-bg', d), { opacity: 0, duration: 0.4 }, 0.75),
  },
};

export function pageCover(kind, text, done) {
  const th = THEMES[kind], d = th.build(text);
  const tl = gsap.timeline({ onComplete: done });
  th.cover(tl, d);
  labelIn(d, 0.35);
  tl.to({}, { duration: 0.35 });
}

export function pageReveal(kind, text, done) {
  const th = THEMES[kind], d = th.build(text);
  const tl = gsap.timeline({ onComplete: () => { d.remove(); done?.(); } });
  labelOut(tl, d, 0.25);
  th.reveal(tl, d);
}

/* ---------------- Entrance animations per page ---------------- */
// Each takes elements out of the generic fade-up and gives them their own motion.
const own = (els) => { els.forEach((e) => e.removeAttribute('data-reveal')); return els; };
const onView = (el, vars, start = 'top 88%') => gsap.from(el, { ...vars, scrollTrigger: { trigger: el, start } });

export function initPageFx(page, reduce) {
  if (reduce) return;
  if (page === 'work') {
    own($$('.w-card')).forEach((c, i) => onView(c, { rotationX: -35, y: 80, opacity: 0, transformPerspective: 900, transformOrigin: '50% 100%', duration: 1.1, ease: 'expo.out', delay: (i % 2) * 0.12 }));
  }
  if (page === 'garments') {
    own($$('.g-cover')).forEach((c) => onView(c, { rotate: -4, y: 60, opacity: 0, transformOrigin: '50% 0%', duration: 1.3, ease: 'elastic.out(1, 0.6)' }));
    own($$('.g-shot')).forEach((s, i) => onView(s, { clipPath: 'inset(0 0 100% 0 round 28px)', y: 30, duration: 1.1, ease: 'expo.out', delay: (i % 3) * 0.1 }));
  }
  if (page === 'photography') {
    $$('.masonry .shot').forEach((s, i) => onView(s, { opacity: 0, scale: 1.08, filter: 'grayscale(1) brightness(1.8) blur(6px)', duration: 1.2, ease: 'power2.out', delay: (i % 3) * 0.08 }, 'top 92%'));
  }
  if (page === 'about' || page === 'cv') {
    own($$('.timeline > li')).forEach((li) => onView(li, { x: -60, opacity: 0, duration: 0.9, ease: 'expo.out' }));
    own($$('.skill-row')).forEach((r) => {
      gsap.from(r, { opacity: 0, y: 20, duration: 0.6, scrollTrigger: { trigger: r, start: 'top 90%' } });
      gsap.from($$('.tag', r), { scale: 0, opacity: 0, duration: 0.45, ease: 'back.out(2.5)', stagger: 0.03, scrollTrigger: { trigger: r, start: 'top 90%' } });
    });
    own($$('.cert')).forEach((c, i) => onView(c, { rotationY: 70, opacity: 0, transformPerspective: 900, transformOrigin: '0% 50%', duration: 1, ease: 'expo.out', delay: (i % 2) * 0.1 }));
    own($$('.lor')).forEach((l, i) => onView(l, { y: 80, rotate: i % 2 ? 3 : -3, opacity: 0, duration: 1.1, ease: 'expo.out' }));
  }
  if (page === 'cv') {
    own($$('.tool')).forEach((t, i) => onView(t, { y: -40, opacity: 0, duration: 0.7, ease: 'bounce.out', delay: (i % 5) * 0.06 }, 'top 92%'));
    const frame = $('.cv-frame');
    if (frame) { own([frame]); onView(frame, { y: 120, rotate: 2, opacity: 0, duration: 1.2, ease: 'expo.out' }); }
  }
}
