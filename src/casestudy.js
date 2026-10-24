// Case-study chapters for project pages: the four stages a reviewer looks for
// (brief, audience & research, ideation & process, execution & impact),
// a hand-drawn concept sketch, the options I weighed, and a chapter bar that follows the scroll.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, '0');

export const chapters = [
  ['cs-brief', 'Problem & brief'],
  ['cs-research', 'Audience & research'],
  ['cs-ideation', 'Ideation & process'],
  ['cs-impact', 'Execution & impact'],
];

export const eyebrow = (n) => `<span class="cs-eyebrow mono" data-reveal><b>${pad(n)}</b>${chapters[n - 1][1]}</span>`;

export function chapterBar() {
  return `<nav class="cs-bar" aria-label="Case study chapters"><ol>${chapters.map(([id, label], k) =>
    `<li><a href="#${id}" data-cs="${id}"><b class="mono">${pad(k + 1)}</b><span>${label}</span></a></li>`).join('')}</ol><i class="cs-bar-fill" aria-hidden="true"></i></nav>`;
}

// Small seeded wobble so every redraw of the sketch looks the same
function rng(seed) {
  let s = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32) - 0.5;
}
const wobblyBox = (x, y, w, h, r) => {
  const j = (v) => v + r() * 3;
  return `M${j(x + 6)} ${j(y)} Q${j(x + w / 2)} ${j(y - 1.5)} ${j(x + w - 6)} ${j(y)} Q${j(x + w)} ${j(y)} ${j(x + w)} ${j(y + 6)} L${j(x + w)} ${j(y + h - 6)} Q${j(x + w)} ${j(y + h)} ${j(x + w - 6)} ${j(y + h)} Q${j(x + w / 2)} ${j(y + h + 1.5)} ${j(x + 6)} ${j(y + h)} Q${j(x)} ${j(y + h)} ${j(x)} ${j(y + h - 6)} L${j(x)} ${j(y + 6)} Q${j(x)} ${j(y)} ${j(x + 6)} ${j(y)}`;
};

// Concept sketch: the first idea as boxes and arrows, drawn like a notebook page
function sketchSVG(steps, id, vertical) {
  const r = rng(id + (vertical ? 'v' : 'h'));
  const n = steps.length;
  const W = vertical ? 360 : 1240, bw = vertical ? 200 : 170, bh = 60;
  const gap = vertical ? 54 : (W - 40 - n * bw) / (n - 1);
  const H = vertical ? 30 + n * bh + (n - 1) * gap + 30 : 150;
  const pos = steps.map((_, k) => (vertical ? [80, 30 + k * (bh + gap)] : [20 + k * (bw + gap), 30 + (k % 2 ? 26 : 0)]));
  const boxes = steps.map(([t, note], k) => {
    const [x, y] = pos[k];
    const hub = steps.some((st) => st[2]) ? !!steps[k][2] : k === Math.floor((n - 1) / 2);
    return `<g class="sk-node${hub ? ' is-hub' : ''}">
      <path class="sk-line" d="${wobblyBox(x, y, bw, bh, r)}"/>
      ${hub ? `<path class="sk-line sk-2" d="${wobblyBox(x + 3, y + 3, bw - 2, bh - 2, r)}"/>` : ''}
      <text class="sk-t" x="${x + bw / 2}" y="${y + (note ? 27 : 36)}">${t}</text>
      ${note ? `<text class="sk-n" x="${x + bw / 2}" y="${y + 47}">${note}</text>` : ''}
    </g>`;
  }).join('');
  const arrows = pos.slice(0, -1).map(([x, y], k) => {
    const [x2, y2] = pos[k + 1];
    if (vertical) {
      const ax = x + bw / 2 + r() * 6, s = y + bh + 6, e = y2 - 8;
      return `<path class="sk-line sk-arrow" d="M${ax} ${s} Q${ax + 14 + r() * 6} ${(s + e) / 2} ${ax} ${e}"/><path class="sk-line sk-arrow" d="M${ax - 7} ${e - 9} L${ax} ${e} L${ax + 7} ${e - 9}"/>`;
    }
    const s = [x + bw + 6, y + bh / 2], e = [x2 - 8, y2 + bh / 2];
    const mx = (s[0] + e[0]) / 2, my = (s[1] + e[1]) / 2 - 16 + r() * 8;
    return `<path class="sk-line sk-arrow" d="M${s[0]} ${s[1]} Q${mx} ${my} ${e[0]} ${e[1]}"/><path class="sk-line sk-arrow" d="M${e[0] - 9} ${e[1] - 7} L${e[0]} ${e[1]} L${e[0] - 9} ${e[1] + 6}"/>`;
  }).join('');
  return `<svg class="sk-svg ${vertical ? 'sk-v' : 'sk-h'}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Concept sketch: ${steps.map((s) => s[0]).join(', then ')}">${arrows}${boxes}</svg>`;
}

export function researchHTML(p) {
  if (!p.audience && !p.research) return '';
  return `<section class="sec-s cs-research" id="cs-research"><div class="wrap">
    ${eyebrow(2)}
    <div class="head"><div><h2 class="t-1" data-reveal>Who it’s <span class="serif">for.</span></h2><p class="lede" data-reveal>The people who use it every day, and what each of them needs from it.</p></div></div>
    <div class="aud-grid">${p.audience.map(([who, need], k) => `<div class="aud" data-reveal><span class="aud-i mono">${pad(k + 1)}</span><h3>${who}</h3><p>${need}</p></div>`).join('')}</div>
    <div class="find">
      <div class="find-head" data-reveal><h3 class="t-2">What I <span class="serif">found.</span></h3><p class="dim">Research on the ground before anything was built.</p>${p.researchNote ? `<p class="find-note">${p.researchNote}</p>` : ''}</div>
      <ol class="find-list">${p.research.map(([t, d], k) => `<li data-reveal><span class="mono">${pad(k + 1)}</span><div><b>${t}</b><p>${d}</p></div></li>`).join('')}</ol>
    </div>
  </div></section>`;
}

export function ideationHTML(p) {
  if (!p.sketch && !p.options) return '';
  return `<section class="sec-s cs-ideation on-white" id="cs-ideation"><div class="wrap">
    ${eyebrow(3)}
    <div class="head"><div><h2 class="t-1" data-reveal>From idea to <span class="serif">system.</span></h2><p class="lede" data-reveal>The first concept, the options I weighed, and what changed along the way.</p></div></div>
    ${p.sketch ? `<figure class="sketch" data-reveal data-sketch>
      <span class="sk-tape" aria-hidden="true"></span>
      ${sketchSVG(p.sketch, p.id, false)}${sketchSVG(p.sketch, p.id, true)}
      <figcaption class="mono">First concept map · redrawn for this portfolio</figcaption>
    </figure>` : ''}
    ${p.options ? `<h3 class="t-2 cs-sub" data-reveal>Options I <span class="serif">weighed.</span></h3>
    <div class="opts${p.options.length === 3 ? ' is-3' : ''}">${p.options.map(([was, now, why]) => `<div class="opt" data-reveal>
      <div class="opt-was"><small class="mono">Considered</small><s>${was}</s></div>
      <div class="opt-now"><small class="mono">Chose</small><b>${now}</b></div>
      <p>${why}</p></div>`).join('')}</div>` : ''}
    ${p.testing ? `<div class="tested" data-reveal>
      <div><h3 class="t-2">What testing <span class="serif">changed.</span></h3><p>${p.testing.lede}</p><p class="tested-done mono">${p.testing.done}</p></div>
      <ul>${p.testing.items.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ul>
    </div>` : ''}
    ${p.process ? `<h3 class="t-2 cs-sub" data-reveal>How it <span class="serif">came together.</span></h3>
    <ol class="steps" data-steps>${p.process.map((s, k) => `<li data-reveal><span class="mono">${pad(k + 1)}</span><b>${s}</b></li>`).join('')}<i class="steps-fill" aria-hidden="true"></i></ol>` : ''}
  </div></section>`;
}

export function outcomeHTML(p) {
  if (!p.outcome) return '';
  return `<section class="on-night sec-s"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>The <span class="serif">outcome.</span></h2></div>
    <div class="lessons is-3">${p.outcome.map(([t, d]) => `<div class="lesson" data-reveal><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div></section>`;
}

export function initCaseStudy({ reduce, lenis }) {
  const bar = $('.cs-bar');
  if (!bar) return;
  const links = $$('a[data-cs]', bar), fill = $('.cs-bar-fill', bar);
  const targets = links.map((a) => document.getElementById(a.dataset.cs));

  links.forEach((a, k) => a.addEventListener('click', (e) => {
    e.preventDefault();
    if (!targets[k]) return;
    if (lenis) lenis.scrollTo(targets[k], { offset: -90, duration: 1.4 });
    else targets[k].scrollIntoView();
  }));

  // Show the bar once the reader is past the hero, hide it at the end
  const first = targets[0], last = $('.next');
  const setActive = () => {
    const y = innerHeight * 0.4;
    let cur = -1;
    targets.forEach((t, k) => { if (t && t.getBoundingClientRect().top < y) cur = k; });
    links.forEach((a, k) => { a.classList.toggle('is-on', k === cur); a.classList.toggle('is-done', k < cur); });
    const shown = first && first.getBoundingClientRect().top < innerHeight * 0.8 && (!last || last.getBoundingClientRect().top > innerHeight * 0.6);
    bar.classList.toggle('is-shown', !!shown);
    if (fill && cur >= 0) {
      const a = links[cur], ol = a.parentElement.parentElement;
      fill.style.transform = `translateX(${a.parentElement.offsetLeft}px)`;
      fill.style.width = `${a.parentElement.offsetWidth}px`;
      ol.dataset.cur = cur;
    }
  };
  addEventListener('scroll', setActive, { passive: true });
  addEventListener('resize', setActive);
  setActive();

  // Sketch draws itself in like a pen on paper
  $$('[data-sketch]').forEach((fig) => {
    const lines = $$('.sk-line', fig), text = $$('text', fig);
    lines.forEach((l) => { const len = l.getTotalLength?.() || 400; l.style.strokeDasharray = len; l.style.strokeDashoffset = reduce ? 0 : len; });
    if (reduce) return;
    gsap.set(text, { opacity: 0 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 75%' } });
    tl.to(lines, { strokeDashoffset: 0, duration: 0.7, ease: 'power1.inOut', stagger: 0.05 })
      .to(text, { opacity: 1, duration: 0.4, stagger: 0.04 }, 0.3);
  });

  // "Considered" ideas get crossed out as they arrive
  $$('.opt s').forEach((s) => {
    if (reduce) return s.style.setProperty('--strike', 1);
    gsap.fromTo(s, { '--strike': 0 }, { '--strike': 1, duration: 0.7, ease: 'power3.inOut', delay: 0.35, scrollTrigger: { trigger: s, start: 'top 85%' } });
  });

  // Process steps: a thread runs along them as you scroll
  $$('[data-steps]').forEach((ol) => {
    const items = $$('li', ol), line = $('.steps-fill', ol);
    if (reduce) { items.forEach((li) => li.classList.add('is-on')); line?.style.setProperty('--p', 1); return; }
    ScrollTrigger.create({
      trigger: ol, start: 'top 80%', end: 'bottom 55%', scrub: true,
      onUpdate: (st) => {
        line?.style.setProperty('--p', st.progress);
        items.forEach((li, k) => li.classList.toggle('is-on', st.progress >= k / (items.length - 1) - 0.001));
      },
    });
  });
}
