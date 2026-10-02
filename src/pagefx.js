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

export const pageKind = (path) => ({ '/work': 'work', '/garments': 'garments', '/photography': 'photo', '/about': 'about', '/cv': 'cv', '/contact': 'contact' }[path] || null);

/* ---------------- Unique page transitions ---------------- */
// Overlays live on <html> (not <body>) so the page itself can be moved in 3D underneath them.
const root = document.documentElement;
const layer = (cls, html) => {
  const d = document.createElement('div');
  d.className = `tr ${cls}`; d.setAttribute('aria-hidden', 'true'); d.innerHTML = html;
  root.append(d);
  return d;
};
const W = () => innerWidth, H = () => innerHeight;
const resetPage = () => {
  gsap.set([document.body, '#main'], { clearProps: 'transform,filter,borderRadius,boxShadow,opacity,transformOrigin,overflow' });
  root.style.removeProperty('background'); root.style.removeProperty('overflow');
};
const typeIn = (el, text, tl, at, each = 0.045) => {
  el.textContent = '';
  [...text].forEach((c, i) => tl.call(() => { el.textContent = text.slice(0, i + 1); }, null, at + i * each));
};

const UNIQ = {
  // WORK: the whole page shrinks into a tilted 3D card and is dealt off the deck;
  // the next page is dealt in from the other side and expands back to full screen.
  work: {
    cover(text, done) {
      const lab = layer('tr-deck', label('SELECTED WORK', text));
      root.style.background = 'radial-gradient(120% 90% at 50% 40%, #241d6b, #0b0920 70%)';
      root.style.overflow = 'hidden';
      gsap.set(document.body, { transformOrigin: `50% ${scrollY + H() / 2}px`, transformPerspective: 1600 });
      gsap.timeline({ onComplete: done })
        .to(document.body, { scale: 0.62, rotateY: -14, rotateX: 8, borderRadius: 36, boxShadow: '0 60px 120px -30px rgba(0,0,0,.8)', duration: 0.55, ease: 'power3.inOut' }, 0)
        .to(document.body, { x: -W() * 1.25, rotateY: -48, rotateZ: -6, duration: 0.5, ease: 'power3.in' }, 0.5)
        .add(() => labelIn(lab, 0), 0.75)
        .to({}, { duration: 0.45 });
    },
    reveal(text, done) {
      const lab = layer('tr-deck', label('SELECTED WORK', text));
      $$('.fl', lab).forEach((f) => (f.style.opacity = 1));
      root.style.background = 'radial-gradient(120% 90% at 50% 40%, #241d6b, #0b0920 70%)';
      root.style.overflow = 'hidden';
      gsap.set(document.body, { transformOrigin: `50% ${H() / 2}px`, transformPerspective: 1600, x: W() * 1.25, scale: 0.62, rotateY: 48, rotateZ: 6, rotateX: 8, borderRadius: 36, boxShadow: '0 60px 120px -30px rgba(0,0,0,.8)' });
      gsap.timeline({ onComplete: () => { lab.remove(); resetPage(); done?.(); } })
        .to($('.tr-label', lab), { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' }, 0.15)
        .to(document.body, { x: 0, rotateY: 12, rotateZ: 0, duration: 0.6, ease: 'power3.out' }, 0.3)
        .to(document.body, { rotateY: 0, rotateX: 0, scale: 1, borderRadius: 0, boxShadow: '0 0 0 0 rgba(0,0,0,0)', duration: 0.6, ease: 'power3.inOut' }, 0.85);
    },
  },

  // GARMENTS: a needle sews a zig-zag stitch across the screen; the thread swells into
  // cloth that covers everything. On arrival the cloth shrinks back to thread and unravels.
  garments: {
    build(text) {
      const w = W(), h = H(), rows = 6, amp = h / rows / 2.2;
      let d = '';
      for (let r = 0; r < rows; r++) {
        const y = (r + 0.5) * (h / rows), ltr = r % 2 === 0, steps = 14;
        for (let k = 0; k <= steps; k++) {
          const x = ltr ? -40 + (k / steps) * (w + 80) : w + 40 - (k / steps) * (w + 80);
          d += `${r === 0 && k === 0 ? 'M' : 'L'}${x.toFixed(1)} ${(y + (k % 2 ? -amp : amp)).toFixed(1)} `;
        }
      }
      return layer('tr-sew', `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="sewg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#5b2140"/><stop offset=".5" stop-color="#a0558f"/><stop offset="1" stop-color="#3f1530"/></linearGradient></defs>
        <rect class="sew-cloth" width="${w}" height="${h}" fill="url(#sewg)" opacity="0"/>
        <path class="sew-thread" d="${d}" fill="none" stroke="url(#sewg)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
        <path class="sew-stitch" d="${d}" fill="none" stroke="#f3d9ea" stroke-width="1.5" stroke-dasharray="7 9" opacity="0"/>
        <g class="sew-needle"><line x1="0" y1="-34" x2="0" y2="6" stroke="#e9eef2" stroke-width="3" stroke-linecap="round"/><circle r="5" fill="#fff"/></g></svg>${label('MADE BY HAND', text)}`);
    },
    cover(text, done) {
      const d = this.build(text), thread = $('.sew-thread', d), needle = $('.sew-needle', d), L = thread.getTotalLength(), o = { p: 0 };
      thread.style.strokeDasharray = `${L} ${L}`; thread.style.strokeDashoffset = L;
      gsap.timeline({ onComplete: done })
        .to(o, { p: 1, duration: 0.85, ease: 'power1.inOut', onUpdate: () => { thread.style.strokeDashoffset = L * (1 - o.p); const pt = thread.getPointAtLength(L * o.p); needle.setAttribute('transform', `translate(${pt.x} ${pt.y})`); } }, 0)
        .to(thread, { strokeWidth: H() / 2.4, duration: 0.45, ease: 'power3.in' }, 0.7)
        .to(needle, { opacity: 0, duration: 0.2 }, 0.85)
        .set($('.sew-cloth', d), { opacity: 1 }, 1.15)
        .to($('.sew-stitch', d), { opacity: 0.55, duration: 0.3 }, 1.1)
        .add(() => labelIn(d, 0), 1.05)
        .to({}, { duration: 0.4 });
    },
    reveal(text, done) {
      const d = this.build(text), thread = $('.sew-thread', d), L = thread.getTotalLength();
      $$('.fl', d).forEach((f) => (f.style.opacity = 1));
      gsap.set($('.sew-cloth', d), { opacity: 1 }); gsap.set(thread, { strokeWidth: H() / 2.4 }); gsap.set($('.sew-needle', d), { opacity: 0 });
      thread.style.strokeDasharray = `${L} ${L}`; thread.style.strokeDashoffset = 0;
      gsap.timeline({ onComplete: () => { d.remove(); done?.(); } })
        .to($('.tr-label', d), { opacity: 0, y: -24, duration: 0.3, ease: 'power2.in' }, 0.15)
        .set($('.sew-cloth', d), { opacity: 0 }, 0.4)
        .to($('.sew-stitch', d), { opacity: 0, duration: 0.2 }, 0.4)
        .to(thread, { strokeWidth: 4, duration: 0.45, ease: 'power3.out' }, 0.4)
        .to(thread, { strokeDashoffset: -L, duration: 0.7, ease: 'power2.in' }, 0.75);
    },
  },

  // PHOTOGRAPHY: a camera viewfinder frames the page, focus slips, the shutter fires;
  // the next page appears through the viewfinder and pulls into sharp focus.
  photo: {
    build(text) {
      return layer('tr-vf', `<div class="vf-black"></div><div class="vf-grid"></div>
        <i class="vf-c c-tl"></i><i class="vf-c c-tr"></i><i class="vf-c c-bl"></i><i class="vf-c c-br"></i><i class="vf-focus"></i>
        <div class="vf-hud mono"><span class="vf-rec">● REC</span><span>ISO 400 · f/4 · 1/250</span><span>Nikon Z6 II</span></div>
        <div class="vf-flash"></div>${label('THROUGH THE LENS', text)}`);
    },
    cover(text, done) {
      const d = this.build(text);
      gsap.timeline({ onComplete: done })
        .fromTo($$('.vf-c', d), { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'expo.out' }, 0)
        .fromTo([$('.vf-hud', d), $('.vf-grid', d)], { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.1)
        .fromTo($('.vf-focus', d), { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, 0.2)
        .to('#main', { filter: 'blur(14px) saturate(1.4)', scale: 1.05, duration: 0.5, ease: 'power2.in' }, 0.15)
        .fromTo($('.vf-flash', d), { opacity: 0 }, { opacity: 1, duration: 0.07 }, 0.62)
        .set($('.vf-black', d), { opacity: 1 }, 0.69)
        .to($('.vf-flash', d), { opacity: 0, duration: 0.35 }, 0.7)
        .add(() => labelIn(d, 0), 0.75)
        .to({}, { duration: 0.6 });
    },
    reveal(text, done) {
      const d = this.build(text);
      $$('.fl', d).forEach((f) => (f.style.opacity = 1));
      gsap.set($('.vf-black', d), { opacity: 1 });
      gsap.set('#main', { filter: 'blur(18px) brightness(1.3)', scale: 1.06, transformOrigin: `50% ${H() / 2}px` });
      gsap.timeline({ onComplete: () => { d.remove(); resetPage(); done?.(); } })
        .to($('.tr-label', d), { opacity: 0, duration: 0.25 }, 0.15)
        .to($('.vf-black', d), { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.35)
        .fromTo($$('.vf-c', d), { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out' }, 0.35)
        .fromTo([$('.vf-hud', d), $('.vf-grid', d), $('.vf-focus', d)], { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4)
        .to('#main', { filter: 'blur(0px) brightness(1)', scale: 1, duration: 0.8, ease: 'power3.out' }, 0.45)
        .call(() => d.classList.add('is-locked'), null, 1.05)
        .to([...$$('.vf-c', d), $('.vf-hud', d), $('.vf-grid', d), $('.vf-focus', d)], { opacity: 0, duration: 0.35 }, 1.35);
    },
  },

  // ABOUT: liquid blobs drip and merge (gooey metaballs) until they flood the screen,
  // then split back into droplets and drain away.
  about: {
    build(text) {
      const w = W(), h = H();
      const blobs = Array.from({ length: 14 }, (_, i) => {
        const x = (0.08 + 0.84 * ((i * 0.618) % 1)) * w, y = (0.1 + 0.8 * ((i * 0.382 + 0.2) % 1)) * h;
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="0"/>`;
      }).join('');
      return layer('tr-goo', `<svg viewBox="0 0 ${w} ${h}"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="16"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11"/></filter>
        <linearGradient id="goog" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a2cf5"/><stop offset=".55" stop-color="#7b3cf0"/><stop offset="1" stop-color="#d43f9a"/></linearGradient></defs>
        <g filter="url(#goo)" fill="url(#goog)">${blobs}</g></svg>${label('HI, I’M YASAR', text)}`);
    },
    cover(text, done) {
      const d = this.build(text), R = Math.hypot(W(), H()) * 0.42;
      gsap.timeline({ onComplete: done })
        .to($$('circle', d), { attr: { r: R }, duration: 0.9, ease: 'power2.in', stagger: { each: 0.035, from: 'random' } }, 0)
        .add(() => labelIn(d, 0), 0.85)
        .to({}, { duration: 0.45 });
    },
    reveal(text, done) {
      const d = this.build(text), R = Math.hypot(W(), H()) * 0.42;
      $$('.fl', d).forEach((f) => (f.style.opacity = 1));
      gsap.set($$('circle', d), { attr: { r: R } });
      gsap.timeline({ onComplete: () => { d.remove(); done?.(); } })
        .to($('.tr-label', d), { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' }, 0.15)
        .to($$('circle', d), { attr: { r: 0, cy: `+=${H() * 0.25}` }, duration: 0.9, ease: 'power2.inOut', stagger: { each: 0.03, from: 'random' } }, 0.35);
    },
  },

  // CV: a typewriter. Lines are typed onto a sheet with a moving carriage, the title is typed
  // letter by letter with a cursor; on arrival the carriage returns line by line, uncovering the page.
  cv: {
    build(text) {
      const rows = 14;
      return layer('tr-type', `<div class="ty-rows">${Array.from({ length: rows }, () => '<i></i>').join('')}</div><div class="ty-head"></div>
        <div class="tr-label"><small class="mono">CURRICULUM VITAE</small><b class="ty-text"></b><span class="ty-cursor"></span></div>`);
    },
    cover(text, done) {
      const d = this.build(text), rows = $$('.ty-rows i', d), head = $('.ty-head', d), tl = gsap.timeline({ onComplete: done });
      rows.forEach((r, i) => {
        const at = i * 0.045;
        tl.fromTo(r, { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: 'none' }, at)
          .set(head, { top: `${(i + 1) * (100 / rows)}%` }, at);
      });
      tl.to(head, { opacity: 0, duration: 0.2 }, 0.7);
      typeIn($('.ty-text', d), text, tl, 0.75, 0.07);
      tl.to({}, { duration: 0.45 });
    },
    reveal(text, done) {
      const d = this.build(text), rows = $$('.ty-rows i', d), head = $('.ty-head', d);
      $('.ty-text', d).textContent = text;
      const tl = gsap.timeline({ onComplete: () => { d.remove(); done?.(); } });
      tl.to($('.tr-label', d), { opacity: 0, duration: 0.25 }, 0.2);
      rows.forEach((r, i) => {
        const at = 0.35 + i * 0.045;
        tl.to(r, { xPercent: 101, duration: 0.22, ease: 'power3.in' }, at).set(head, { top: `${(i + 1) * (100 / rows)}%`, opacity: 1 }, at);
      });
      tl.to(head, { opacity: 0, duration: 0.2 }, 0.35 + rows.length * 0.045);
    },
  },
};

// CONTACT: an envelope closes and is sealed with the "y" wax seal; on arrival the seal
// cracks, the flap opens, and a paper plane flies out across the page.
UNIQ.contact = {
  build(text) {
    return layer('tr-env', `<div class="env-body"></div><div class="env-flap"></div>
      <div class="env-seal"><span>y</span></div>
      <svg class="env-plane" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>
      <div class="tr-label"><small class="mono">SAY HELLO</small><b>${letters(text)}</b></div>`);
  },
  cover(text, done) {
    const d = this.build(text);
    gsap.timeline({ onComplete: done })
      .fromTo($('.env-body', d), { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: 'power3.out' }, 0)
      .fromTo($('.env-flap', d), { rotateX: 180, transformPerspective: 1400, transformOrigin: '50% 0%' }, { rotateX: 0, duration: 0.55, ease: 'power3.inOut' }, 0.3)
      .fromTo($('.env-seal', d), { scale: 3, opacity: 0, rotate: -30 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(2.2)' }, 0.8)
      .add(() => labelIn(d, 0), 0.9)
      .to({}, { duration: 0.45 });
  },
  reveal(text, done) {
    const d = this.build(text);
    $$('.fl', d).forEach((x) => (x.style.opacity = 1));
    const plane = $('.env-plane', d);
    gsap.timeline({ onComplete: () => { d.remove(); done?.(); } })
      .to($('.tr-label', d), { opacity: 0, duration: 0.25 }, 0.1)
      .to($('.env-seal', d), { scale: 1.3, opacity: 0, rotate: 25, duration: 0.35, ease: 'power2.in' }, 0.25)
      .to($('.env-flap', d), { rotateX: 180, transformPerspective: 1400, transformOrigin: '50% 0%', duration: 0.55, ease: 'power3.inOut' }, 0.4)
      .fromTo(plane, { x: 0, y: 0, opacity: 0, scale: 0.6, rotate: 0 }, { opacity: 1, duration: 0.15 }, 0.75)
      .to(plane, { x: innerWidth * 0.55, y: -innerHeight * 0.55, scale: 1.6, rotate: -15, duration: 0.8, ease: 'power2.in' }, 0.8)
      .to($('.env-body', d), { yPercent: 105, duration: 0.6, ease: 'power3.in' }, 0.85)
      .to($('.env-flap', d), { yPercent: -110, duration: 0.6, ease: 'power3.in' }, 0.85);
  },
};

export function pageCover(kind, text, done) { UNIQ[kind].cover(text, done); }
export function pageReveal(kind, text, done) { UNIQ[kind].reveal(text, done); }
export const resetPageTransform = resetPage;

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
  if (page === 'contact') {
    const t = $('.ct-title');
    if (t) gsap.from(t, { letterSpacing: '0.2em', opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.2 });
    own($$('.ct-card')).forEach((c, i) => gsap.from(c, { x: 80, rotate: 3, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.35 + i * 0.1 }));
    const fm = $('.ct-form');
    if (fm) { own([fm]); gsap.from(fm, { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', delay: 0.3 }); gsap.from($$('.ct-reasons label', fm), { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.06, delay: 0.6 }); }
  }
  if (page === 'cv') {
    own($$('.tool')).forEach((t, i) => onView(t, { y: -40, opacity: 0, duration: 0.7, ease: 'bounce.out', delay: (i % 5) * 0.06 }, 'top 92%'));
    const frame = $('.cv-frame');
    if (frame) { own([frame]); onView(frame, { y: 120, rotate: 2, opacity: 0, duration: 1.2, ease: 'expo.out' }); }
  }
}
