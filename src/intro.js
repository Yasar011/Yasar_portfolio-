// Cinematic intro: a film title sequence. Letterbox bars, a short countdown leader,
// an anamorphic light streak, the name tracking in, a fast montage of the work,
// then the frame opens onto the site. Plays once per visit; "Skip intro" fast-forwards it.
import gsap from 'gsap';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const REEL = [
  ['/images/projects/qms-floor-2.jpg', 'Sc. 01 · GarmentFix QMS · Brandix Unit 3'],
  ['/images/projects/monitoring-build-1.jpg', 'Sc. 02 · Smart Monitoring · IoT'],
  ['/images/garments/duo-1.jpg', 'Sc. 03 · Garment development'],
  ['/images/photography/runway-03.jpg', 'Sc. 04 · Runway photography'],
  ['/images/projects/apms-1.jpg', 'Sc. 05 · APMS · 1,486 machines'],
  ['/images/projects/tedx-1.jpg', 'Sc. 06 · TEDxNIFT Jodhpur'],
];

export const INTRO_HOLD = 3.5; // seconds before the page's own entrance animations start

export function cinematicIntro({ lenis }) {
  const NAME = 'YASAR C H';
  const el = document.createElement('div');
  el.className = 'ci';
  el.innerHTML = `
    <div class="ci-stage">
      <div class="ci-reel">${REEL.map(([src]) => `<img src="${src}" alt="" decoding="async">`).join('')}</div>
      <div class="ci-vignette"></div>
      <div class="ci-leader" aria-hidden="true"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="78"/><circle class="ci-sweep" cx="100" cy="100" r="78"/><path d="M100 10V190M10 100H190"/></svg><b>3</b></div>
      <div class="ci-flare" aria-hidden="true"></div>
      <div class="ci-title">
        <span class="ci-pre">A portfolio by</span>
        <h2 aria-label="Yasar C H">${[...NAME].map((c) => (c === ' ' ? '<span class="ci-sp"></span>' : `<span class="ci-ch">${c}</span>`)).join('')}</h2>
        <p class="ci-line">where fashion <span class="serif">meets the machine.</span></p>
        <p class="ci-bill"><em>Featuring</em> GarmentFix QMS · APMS · Smart Monitoring · TEDxNIFT Jodhpur</p>
      </div>
      <div class="ci-grain" aria-hidden="true"></div>
    </div>
    <div class="ci-bar ci-top"><span>A Yasar C H portfolio</span><span>NIFT Jodhpur · 2026</span></div>
    <div class="ci-bar ci-bot"><span class="ci-slate">Fashion Technology · Automation · Photography</span><button type="button" class="ci-skip">Skip intro</button></div>`;
  document.body.append(el);
  lenis?.stop();

  const stage = $('.ci-stage', el), imgs = $$('.ci-reel img', el), leader = $('.ci-leader', el), num = $('b', leader);
  const sweep = $('.ci-sweep', el), flare = $('.ci-flare', el), chars = $$('.ci-ch', el);
  const pre = $('.ci-pre', el), line = $('.ci-line', el), bill = $('.ci-bill', el), slate = $('.ci-slate', el);
  const bars = $$('.ci-bar', el), title = $('.ci-title', el);
  const setSlate = (t) => () => { slate.textContent = t; };

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: done });
  // 1. Countdown leader: 3, 2, 1
  tl.set(sweep, { strokeDasharray: 490, strokeDashoffset: 490 })
    .to(sweep, { strokeDashoffset: 0, duration: 0.85, ease: 'none' }, 0)
    .call(() => { num.textContent = '2'; }, null, 0.28)
    .call(() => { num.textContent = '1'; }, null, 0.56)
    .to(leader, { opacity: 0, scale: 1.4, duration: 0.18, ease: 'power2.in' }, 0.82)
  // 2. Anamorphic streak crosses the frame
    .fromTo(flare, { xPercent: -120, opacity: 0 }, { xPercent: 120, opacity: 1, duration: 1.1, ease: 'power2.inOut' }, 0.9)
    .to(flare, { opacity: 0, duration: 0.3 }, 1.75)
  // 3. Title tracks in from a blur
    .fromTo(pre, { opacity: 0, letterSpacing: '0.8em' }, { opacity: 1, letterSpacing: '0.42em', duration: 1.1, ease: 'expo.out' }, 1.0)
    .fromTo(chars, { opacity: 0, filter: 'blur(14px)', x: (i) => (i - 4) * 26 }, { opacity: 1, filter: 'blur(0px)', x: 0, duration: 1.2, ease: 'expo.out', stagger: { each: 0.05, from: 'center' } }, 1.1)
    .fromTo(line, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 1.75);
  // 4. Montage: quick cuts behind the title, the bottom bar reads like a slate
  imgs.forEach((img, i) => {
    const at = 2.05 + i * 0.22;
    tl.set(img, { opacity: 0.42 }, at).fromTo(img, { scale: 1.12 }, { scale: 1.02, duration: 0.5, ease: 'none' }, at)
      .call(setSlate(REEL[i][1]), null, at).set(img, { opacity: 0 }, at + 0.22);
  });
  tl.fromTo(bill, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.25)
  // 5. Title lifts away, the frame closes to a line of light and opens onto the site
    .to(title, { opacity: 0, scale: 1.04, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in' }, 3.4)
    .to(stage, { clipPath: 'inset(50% 0% 50% 0%)', duration: 0.55, ease: 'expo.in' }, 3.55)
    .to(bars[0], { yPercent: -100, duration: 0.7, ease: 'expo.inOut' }, 3.85)
    .to(bars[1], { yPercent: 100, duration: 0.7, ease: 'expo.inOut' }, 3.85);

  function done() { el.remove(); lenis?.start(); }

  // Skip: fast-forward everything (the page's own entrance tweens are timed to the intro)
  const skip = () => {
    if (tl.progress() > 0.92) return;
    const left = tl.duration() - tl.time();
    gsap.globalTimeline.timeScale(12);
    gsap.delayedCall(left, () => gsap.globalTimeline.timeScale(1));
  };
  $('.ci-skip', el).addEventListener('click', skip);
  addEventListener('keydown', function k(e) { if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') { skip(); removeEventListener('keydown', k); } });
  return tl;
}
