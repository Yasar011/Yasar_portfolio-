// Themed page transitions, one per project. Each kind has a cover (leaving)
// and a reveal (arriving). Everything else uses the default silk veil.
import gsap from 'gsap';

const letters = (t) => t.split(' ').map((w) => `<span class="flw">${[...w].map((c) => `<span class="fl">${c}</span>`).join('')}</span>`).join(' ');
const el = (cls, html) => {
  const d = document.createElement('div');
  d.className = `tr ${cls}`; d.setAttribute('aria-hidden', 'true'); d.innerHTML = html;
  document.body.append(d);
  return d;
};
const labelIn = (root, at = 0.35) => gsap.fromTo(root.querySelectorAll('.fl'), { yPercent: 70, opacity: 0, filter: 'blur(10px)' },
  { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'expo.out', stagger: 0.025, delay: at });

export const projectKind = (id) => ({ apms: 'apms', 'garmentfix-qms': 'qms', 'tedx-nift-jodhpur': 'tedx', 'smart-monitoring': 'mon' }[id] || null);

const build = {
  // TEDx: red theatre curtains
  tedx: (label) => el('tr-curtain', `<div class="cur l"></div><div class="cur r"></div><div class="tr-label"><small>TEDx<b>NIFT Jodhpur</b></small><b>${letters(label)}</b></div>`),
  // APMS: a scanner beam sweeping a dark screen
  apms: (label) => el('tr-scan', `<div class="sc-fill"></div><div class="sc-beam"></div><div class="tr-label"><small class="mono">SCAN · MACHINE QR</small><b>${letters(label)}</b></div>`),
  // QMS: inspection grid tiles
  qms: (label) => el('tr-grid', `<div class="gr">${Array.from({ length: 60 }, () => '<i></i>').join('')}</div><div class="tr-label"><small class="mono">INSPECTION · LIVE</small><b>${letters(label)}</b></div>`),
  // Smart Monitoring: the andon lamp opens like an iris
  mon: (label) => el('tr-iris', `<div class="ir-fill"></div><div class="ir-ring"></div><div class="tr-label"><small class="mono">● RUNNING</small><b>${letters(label)}</b></div>`),
};

// Leaving: cover the page, then call done()
export function cover(kind, label, done) {
  const d = build[kind](label);
  const tl = gsap.timeline({ onComplete: done });
  if (kind === 'tedx') {
    tl.fromTo(d.querySelector('.l'), { xPercent: -101 }, { xPercent: 0, duration: 0.7, ease: 'power3.inOut' }, 0)
      .fromTo(d.querySelector('.r'), { xPercent: 101 }, { xPercent: 0, duration: 0.7, ease: 'power3.inOut' }, 0)
      .fromTo(d.querySelector('small'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5);
    labelIn(d, 0.45);
  } else if (kind === 'apms') {
    tl.fromTo(d.querySelector('.sc-fill'), { scaleY: 0 }, { scaleY: 1, duration: 0.65, ease: 'power2.inOut' }, 0)
      .fromTo(d.querySelector('.sc-beam'), { top: '0%' }, { top: '100%', duration: 0.65, ease: 'power2.inOut' }, 0)
      .fromTo(d.querySelector('small'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4);
    labelIn(d, 0.4);
  } else if (kind === 'qms') {
    tl.fromTo(d.querySelectorAll('.gr i'), { scale: 0, rotate: -45 }, { scale: 1.02, rotate: 0, duration: 0.45, ease: 'back.out(1.4)', stagger: { each: 0.008, grid: [6, 10], from: 'center' } }, 0)
      .fromTo(d.querySelector('small'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.45);
    labelIn(d, 0.45);
  } else {
    tl.fromTo(d.querySelector('.ir-fill'), { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 0.75, ease: 'expo.inOut' }, 0)
      .fromTo(d.querySelector('.ir-ring'), { scale: 0, opacity: 1 }, { scale: 2.6, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0)
      .fromTo(d.querySelector('small'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5);
    labelIn(d, 0.45);
  }
  tl.to({}, { duration: 0.25 });
  return d;
}

// Arriving: start covered, then open onto the new page
export function reveal(kind, label, done) {
  const d = build[kind](label);
  const lab = d.querySelector('.tr-label');
  const tl = gsap.timeline({ onComplete: () => { d.remove(); done?.(); } });
  tl.fromTo(d.querySelectorAll('.fl'), { yPercent: 25, filter: 'blur(4px)' }, { yPercent: 0, filter: 'blur(0px)', duration: 0.35, stagger: 0.012 }, 0)
    .to(lab, { opacity: 0, y: -30, duration: 0.35, ease: 'power2.in' }, 0.3);
  if (kind === 'tedx') {
    tl.to(d.querySelector('.l'), { xPercent: -101, duration: 0.9, ease: 'power3.inOut' }, 0.45)
      .to(d.querySelector('.r'), { xPercent: 101, duration: 0.9, ease: 'power3.inOut' }, 0.45);
  } else if (kind === 'apms') {
    tl.set(d.querySelector('.sc-fill'), { transformOrigin: '50% 100%' }, 0)
      .to(d.querySelector('.sc-fill'), { scaleY: 0, duration: 0.75, ease: 'power2.inOut' }, 0.45)
      .fromTo(d.querySelector('.sc-beam'), { top: '0%' }, { top: '100%', duration: 0.75, ease: 'power2.inOut' }, 0.45);
  } else if (kind === 'qms') {
    tl.to(d.querySelectorAll('.gr i'), { scale: 0, rotate: 45, duration: 0.4, ease: 'power2.in', stagger: { each: 0.008, grid: [6, 10], from: 'edges' } }, 0.45);
  } else {
    tl.set(d.querySelector('.ir-fill'), { clipPath: 'circle(75% at 50% 50%)' }, 0)
      .set(d.querySelector('.ir-ring'), { scale: 0.2, opacity: 0 }, 0)
      .to(d.querySelector('.ir-fill'), { clipPath: 'circle(0% at 50% 50%)', duration: 0.8, ease: 'expo.inOut' }, 0.45)
      .to(d.querySelector('.ir-ring'), { scale: 2.6, opacity: 1, duration: 0.4, ease: 'expo.out' }, 0.45)
      .to(d.querySelector('.ir-ring'), { opacity: 0, duration: 0.5 }, 0.8);
  }
  return d;
}
