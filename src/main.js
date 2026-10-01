import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  person, projects, garments, photos, photoCategories, camera,
  education, experience, events, certificates, recommendations, skills,
} from './data.js';

gsap.registerPlugin(ScrollTrigger);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
if (reduce) document.documentElement.classList.add('reduced');
const page = document.body.dataset.page;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, '0');

/* ---------- Icons ---------- */
const sv = (d, w = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const icon = {
  arrow: sv('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowL: sv('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  out: sv('<path d="M7 17 17 7M9 7h8v8"/>'),
  chev: sv('<path d="m9 6 6 6-6 6"/>'),
  close: sv('<path d="M6 6l12 12M18 6 6 18"/>'),
  camera: sv('<path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.6l1.4-2h7l1.4 2h2.6A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.6"/>', 1.5),
  award: sv('<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5 7 21l5-2.6 5 2.6-1.5-7.5"/>', 1.6),
  github: sv('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>', 1.6),
  linkedin: sv('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>', 1.6),
  instagram: sv('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>', 1.6),
};

/* ---------- Media with graceful placeholder ---------- */
function media(src, { ratio, alt = '', eager = false, cls = '' } = {}) {
  const file = src.split('/').pop();
  return `<figure class="media is-loading ${cls}" style="margin:0;${ratio ? `--ratio:${ratio}` : ''}">
    <img src="${src}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    <div class="ph-slot">${icon.camera}<span>${file}</span></div>
  </figure>`;
}
function wireMedia(root = document) {
  $$('.media.is-loading img', root).forEach((img) => {
    const f = img.closest('.media');
    const ok = () => f.classList.remove('is-loading');
    const bad = () => { f.classList.remove('is-loading'); f.classList.add('is-empty'); };
    if (img.complete) (img.naturalWidth ? ok : bad)();
    else { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', bad, { once: true }); }
  });
}

/* ---------- Shared chrome ---------- */
const links = [['Work', '/work'], ['Garments', '/garments'], ['Photography', '/photography'], ['About', '/about']];
const here = (h) => {
  const p = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  return p === h || (h === '/work' && page === 'project');
};
const socialIcon = { GitHub: icon.github, LinkedIn: icon.linkedin, Instagram: icon.instagram };

function chrome() {
  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML = `<div class="wrap">
    <a class="brand" href="/" aria-label="Yasar C H — home"><span class="brand-mark">y</span>Yasar C H</a>
    <nav aria-label="Main"><ul class="nav-links">${links.map(([l, h]) => `<li><a href="${h}"${here(h) ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul></nav>
    <a class="btn nav-cta" href="#contact">Get in touch</a>
    <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span></button>
  </div>`;
  const drawer = document.createElement('div');
  drawer.className = 'drawer'; drawer.id = 'drawer';
  drawer.innerHTML = `<ol>${[['Home', '/'], ...links, ['Contact', '#contact']].map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ol>
    <div class="drawer-foot">${person.socials.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`).join('')}</div>`;
  const thread = document.createElement('div');
  thread.className = 'thread'; thread.setAttribute('aria-hidden', 'true');
  thread.innerHTML = '<span class="track"></span><span class="sewn"></span><span class="needle"></span>';
  document.body.prepend(thread, drawer, nav);

  const btn = $('.menu-btn', nav);
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  btn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', drawer).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  const foot = document.createElement('footer');
  foot.className = 'on-night contact'; foot.id = 'contact';
  foot.innerHTML = `<div class="wrap">
    <h2 class="t-hero" data-reveal>Let's make<br>something <span class="serif">good.</span></h2>
    <p class="lede" data-reveal>Internships, collaborations, shoots or a factory floor that still runs on paper — I'd love to hear about it.</p>
    <div class="ctas" data-reveal><a class="btn" href="${person.socials[1].href}" target="_blank" rel="noopener">Message me on LinkedIn ${icon.out}</a></div>
    <div class="socials" data-reveal>${person.socials.map((s) => `<a class="social" href="${s.href}" target="_blank" rel="noopener"><i>${socialIcon[s.label]}</i><span><b>${s.label}</b><span>@${s.handle}</span></span></a>`).join('')}</div>
    <div class="foot-base"><span>© ${new Date().getFullYear()} Yasar C H · ${person.signoff}</span><a href="#top">Back to top ↑</a></div>
  </div>`;
  document.body.append(foot);
}

/* ---------- Building blocks ---------- */
const crumbs = (...parts) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${parts.map((p) => `${icon.chev}${Array.isArray(p) ? `<a href="${p[1]}">${p[0]}</a>` : `<span>${p}</span>`}`).join('')}</nav>`;
const tags = (list) => `<ul class="tags">${list.map((t) => `<li class="tag">${t}</li>`).join('')}</ul>`;
const words = (html) => html.replace(/(<span class="serif">.*?<\/span>)|([^\s<]+)/g, (m, ser) => (ser ? `<span class="w">${ser}</span>` : `<span class="w">${m}</span>`));
const qms = projects[1];

/* ---------- Pages ---------- */
function home() {
  const [apms, , tedx, mon] = projects;
  return `
  <section class="hero" id="top">
    <div class="wrap">
      <div class="who" data-reveal><span class="avatar">y<img src="${person.portrait}" alt="" onerror="this.remove()"></span><span><b>Yasar C H</b> · BFT, ${person.school}</span></div>
      <h1 class="t-hero" data-reveal>Fashion, <span class="serif">engineered.</span></h1>
      <p class="lede" data-reveal>I build real-time systems for apparel factories, make garments by hand, and photograph the people who wear them.</p>
      <div class="ctas" data-reveal><a class="btn" href="/work">See my work ${icon.arrow}</a><a class="link" href="#contact"><span>Get in touch</span>${icon.arrow}</a></div>
    </div>
    <div class="wrap hero-stage">
      <div class="inner" data-reveal>
        <div class="grow">${media('/images/hero.jpg', { ratio: '16/9', alt: 'Yasar C H at work', eager: true })}</div>
        <div class="floating f1"><b data-count="1486">1,486</b><span>machines on APMS</span></div>
        <div class="floating f2"><b>0</b><span>paper sheets per shift</span></div>
      </div>
    </div>
  </section>

  <section class="on-night sec" style="margin-top:clamp(96px,12vw,160px)">
    <div class="wrap narrow">
      <p class="statement" data-scrub>${words('Every shift, 70–80 sheets of paper. Hours of re-typing. Reports six hours late. So I built a system that made it all <span class="serif">disappear.</span>')}</p>
    </div>
    <div class="wrap">
      <div class="metrics">
        <div class="metric" data-reveal><div class="num" data-count="1486">1,486</div><p>machines tracked by APMS across 32 production modules.</p></div>
        <div class="metric" data-reveal><div class="num">70–80<small>→</small><span class="to">0</span></div><p>paper inspection sheets per shift with GarmentFix QMS.</p></div>
        <div class="metric" data-reveal><div class="num">3–4h<small>→</small><span class="to">0</span></div><p>of manual data re-entry removed every day.</p></div>
        <div class="metric" data-reveal><div class="num">6h<small>→</small><span class="to">Live</span></div><p>quality reporting delay, now real-time.</p></div>
      </div>
      <div class="ctas" style="margin-top:44px" data-reveal><a class="link" href="/project?id=${qms.id}"><span>How GarmentFix QMS works</span>${icon.arrow}</a></div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="head"><div><h2 class="t-1" data-reveal>Selected <span class="serif">work.</span></h2><p class="lede" data-reveal>Software that runs on a real factory floor, and a platform that ran a TEDx event.</p></div>
        <a class="link" href="/work" data-reveal><span>All projects</span>${icon.arrow}</a></div>
      <div class="bento">
        ${tile(apms, 'tile--wide')}
        <a class="tile tile--thread tile--narrow" href="/project?id=${qms.id}" data-reveal>
          <div class="txt"><span class="kicker-num">02 · Impact</span><h3 class="t-2">${qms.title}</h3><p class="dim">Paper sheets per shift, before and after.</p></div>
          <div class="big-num">70–80 → 0</div><span class="go">${icon.arrow}</span></a>
        ${tile(qms, '', 'Real-time quality, zero paper.')}
        ${tile(tedx, '')}
        ${tile(mon, 'tile--wide tile--night')}
        <a class="tile tile--narrow" href="/work" data-reveal><div class="txt"><span class="kicker-num">All work</span><h3 class="t-2">Every project, in detail.</h3><p class="dim">Problem, build, features and results for each.</p></div><div class="big-num">${pad(projects.length)}</div><span class="go">${icon.arrow}</span></a>
      </div>
    </div>
  </section>

  <section class="sec on-white">
    <div class="wrap">
      <div class="head"><div><h2 class="t-1" data-reveal>Beyond the <span class="serif">screen.</span></h2><p class="lede" data-reveal>Garments I made from sketch to stitch, photography, and the people I lead.</p></div></div>
      <div class="bento">
        <a class="tile" href="/garments" data-reveal style="background:var(--bg)"><div class="txt"><span class="kicker-num">Garments</span><h3 class="t-2">Cut, sewn, styled.</h3><p class="dim">${garments.length} garments developed completely, pattern to presentation.</p></div><div class="tile-media">${media(garments[0].cover, { ratio: '4/3', alt: garments[0].title })}</div><span class="go">${icon.arrow}</span></a>
        <a class="tile" href="/photography" data-reveal style="background:var(--bg)"><div class="txt"><span class="kicker-num">Photography</span><h3 class="t-2">Fashion, portrait, event, travel.</h3><p class="dim">Shot on ${camera.body}.</p></div><div class="tile-media">${media(photos[0].src, { ratio: '4/3', alt: 'Fashion photograph' })}</div><span class="go">${icon.arrow}</span></a>
        <a class="tile tile--narrow tile--night" href="/about" data-reveal><div class="txt"><span class="kicker-num">Internship</span><h3 class="t-2">Brandix Apparel India</h3><p class="dim">8 weeks at Unit-III, Visakhapatnam. Built QMS, APMS and HRMMS.</p></div><div class="big-num">8 wks</div><span class="go">${icon.arrow}</span></a>
        <a class="tile tile--narrow" href="/about" data-reveal style="background:var(--bg)"><div class="txt"><span class="kicker-num">Leadership</span><h3 class="t-2">President, Adventure & Photography Club</h3><p class="dim">NIFT Jodhpur, 2026–27.</p></div><div class="big-num">26–27</div><span class="go">${icon.arrow}</span></a>
        <a class="tile tile--narrow" href="/about" data-reveal style="background:var(--bg)"><div class="txt"><span class="kicker-num">Service</span><h3 class="t-2">National Service Scheme</h3><p class="dim">Two years of service.</p></div><div class="big-num"><span data-count="240">240</span> h</div><span class="go">${icon.arrow}</span></a>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap"><div class="head"><div><h2 class="t-1" data-reveal>Through the <span class="serif">lens.</span></h2><p class="lede" data-reveal>A few frames. Drag, or use the arrows.</p></div>
      <div class="rail-ctrl" data-reveal><button class="rail-prev" aria-label="Previous photos">${icon.arrowL}</button><button class="rail-next" aria-label="Next photos">${icon.arrow}</button></div></div></div>
    <div class="rail" data-reveal>${photos.slice(0, 10).map((p) => `<a href="/photography" aria-label="${p.cat} photograph">${media(p.src, { ratio: p.ratio === '3/2' ? '3/2' : '4/5', cls: p.ratio === '3/2' ? 'wide' : '', alt: `${p.cat} photograph` })}</a>`).join('')}</div>
    <div class="wrap center" style="margin-top:28px"><a class="link" href="/photography" data-reveal><span>Open the full gallery</span>${icon.arrow}</a></div>
  </section>`;
}

function tile(p, cls, sub) {
  const i = projects.indexOf(p);
  return `<a class="tile ${cls}" href="/project?id=${p.id}" data-reveal>
    <div class="txt"><span class="kicker-num">${pad(i + 1)} · ${p.where}</span><h3 class="t-2">${p.title}</h3><p class="dim">${sub || p.full}</p></div>
    <div class="tile-media">${media(p.images[0], { ratio: '16/10', alt: `${p.title} screen` })}</div>
    <span class="go">${icon.arrow}</span></a>`;
}

function work() {
  return `
  <section class="page-hero"><div class="wrap">
    ${crumbs('Work')}
    <h1 class="t-hero" data-reveal>The <span class="serif">work.</span></h1>
    <p class="lede" data-reveal>Systems built for a working apparel factory, a full event platform for TEDx, and machines that report on themselves.</p>
  </div></section>
  <section style="padding-bottom:clamp(96px,12vw,160px)"><div class="wrap"><div class="work-stack">
    ${projects.map((p, i) => `<a class="work-card" href="/project?id=${p.id}" data-reveal>
      ${media(p.images[0], { ratio: '4/3', alt: `${p.title} screen` })}
      <div class="info"><span class="mono accent">${pad(i + 1)} / ${pad(projects.length)} · ${p.where}</span>
        <h2 class="t-1">${p.title}</h2><p class="role">${p.role}</p><p>${p.summary}</p>
        ${tags(p.stack.slice(0, 5))}
        <span class="link" style="margin-top:26px"><span>Read the case study</span>${icon.arrow}</span></div>
    </a>`).join('')}
  </div></div></section>`;
}

function project() {
  const id = new URLSearchParams(location.search).get('id');
  const i = Math.max(0, projects.findIndex((p) => p.id === id));
  const p = projects[i], next = projects[(i + 1) % projects.length];
  document.title = `${p.title} — Yasar C H`;
  return `
  <section class="p-hero"><div class="wrap">
    ${crumbs(['Work', '/work'], p.title)}
    <h1 class="t-hero" data-reveal>${p.title}</h1>
    <p class="lede" data-reveal>${p.summary}</p>
  </div>
  <div class="wrap p-stage" data-reveal><div class="grow">${media(p.images[0], { ratio: '16/9', alt: `${p.title} main screen`, eager: true })}</div></div></section>

  <section class="sec-s"><div class="wrap">
    <dl class="facts">
      <div class="fact" data-reveal><dt>Role</dt><dd>${p.role}</dd></div>
      <div class="fact" data-reveal><dt>Where</dt><dd>${p.where}</dd></div>
      <div class="fact" data-reveal><dt>Built with</dt><dd>${p.stack.join(' · ')}</dd></div>
    </dl>
  </div></section>

  <section class="sec-s" style="padding-top:clamp(24px,4vw,48px)"><div class="wrap story">
    <div data-reveal><h2 class="t-2">The <span class="serif">problem.</span></h2><p>${p.problem}</p></div>
    <div data-reveal><h2 class="t-2">What I <span class="serif">built.</span></h2><p>${p.solution}</p></div>
  </div></section>

  ${p.scale ? `<section class="on-night sec-s"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Built for <span class="serif">scale.</span></h2></div>
    <div class="scale-grid">${p.scale.map((s) => `<div class="metric" data-reveal><div class="num" data-count="${s.value.replace(/,/g, '')}">${s.value}</div><p>${s.label}</p></div>`).join('')}</div>
  </div></section>` : ''}

  ${p.impact ? `<section class="on-night sec-s"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Before <span class="serif">&amp;</span> after.</h2></div>
    <div class="compare">${p.impact.map((m) => `<div class="compare-row" data-reveal>
      <span class="lbl">${m.label[0].toUpperCase() + m.label.slice(1)}</span>
      <span class="before"><small>Before</small>${m.from}</span><span class="arrow">${icon.arrow}</span>
      <span class="after"><small>After</small>${m.to}</span></div>`).join('')}</div>
  </div></section>` : ''}

  <section class="sec"><div class="wrap">
    <div class="head"><div><h2 class="t-1" data-reveal>What's <span class="serif">inside.</span></h2><p class="lede" data-reveal>${p.features.length} parts, one system.</p></div></div>
    <div class="feat-grid">${p.features.map(([t, d], k) => `<div class="feat" data-reveal><span class="ico">${pad(k + 1)}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div></section>

  <section style="padding-bottom:clamp(48px,6vw,80px)">
    <div class="wrap"><div class="head"><h2 class="t-1" data-reveal>In <span class="serif">pictures.</span></h2>
      <div class="rail-ctrl" data-reveal><button class="rail-prev" aria-label="Previous images">${icon.arrowL}</button><button class="rail-next" aria-label="Next images">${icon.arrow}</button></div></div></div>
    <div class="rail" data-reveal>${p.images.map((s) => media(s, { ratio: '3/2', cls: 'wide', alt: `${p.title} screen` })).join('')}</div>
  </section>

  <div class="wrap"><a class="next" href="/project?id=${next.id}">
    <span><span class="dim">Next project</span><span class="t-1" style="display:block;margin-top:8px">${next.title}</span></span>
    <span class="go">${icon.arrow}</span></a></div>`;
}

function garmentsPage() {
  return `
  <section class="page-hero"><div class="wrap">
    ${crumbs('Garments')}
    <h1 class="t-hero" data-reveal>Made by <span class="serif">hand.</span></h1>
    <p class="lede" data-reveal>Two garments I developed completely — from the first sketch and pattern to the last stitch and the styled shoot.</p>
  </div></section>
  ${garments.map((g, i) => `<section class="garment${i % 2 ? ' on-white' : ''}"><div class="wrap">
    <div class="g-top">
      <div class="g-cover" data-reveal>${media(g.cover, { ratio: '4/5', alt: g.title })}</div>
      <div>
        <span class="mono accent" data-reveal>Garment ${pad(i + 1)} · ${g.note}</span>
        <h2 class="t-1" data-reveal style="margin-top:14px">${g.title}</h2>
        <ol class="process"><span class="fill" aria-hidden="true"></span>${g.steps.map((s) => `<li><b>${s}</b></li>`).join('')}</ol>
      </div>
    </div>
    <div class="g-gallery">${g.images.map((s) => `<div data-reveal>${media(s, { ratio: '3/4', alt: `${g.title} detail` })}</div>`).join('')}</div>
  </div></section>`).join('')}`;
}

function photography() {
  const cats = ['All', ...photoCategories];
  return `
  <section class="page-hero"><div class="wrap">
    ${crumbs('Photography')}
    <h1 class="t-hero" data-reveal>Through the <span class="serif">lens.</span></h1>
    <p class="lede" data-reveal>Fashion, portrait, event, travel and creative work — shot and edited by me.</p>
  </div></section>
  <section style="padding-bottom:clamp(96px,12vw,160px)"><div class="wrap">
    <div class="photo-bar" data-reveal>
      <div class="seg" role="tablist" aria-label="Filter photos">${cats.map((c, i) => `<button role="tab" aria-selected="${i === 0}" data-cat="${c}">${c}</button>`).join('')}<span class="pill" aria-hidden="true"></span></div>
      <div class="tags"><span class="tag" style="background:var(--surface)">${camera.body}</span><span class="tag" style="background:var(--surface)">${camera.lens}</span></div>
    </div>
    <div class="masonry">${photos.map((ph, i) => `<button class="shot" data-cat="${ph.cat}" data-i="${i}" aria-label="Open ${ph.cat} photo">${media(ph.src, { ratio: ph.ratio, alt: `${ph.cat} photograph` })}<span class="cap">${ph.cat}</span></button>`).join('')}</div>
  </div></section>
  <div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
    <div class="lb-bar"><span class="mono lb-count"></span><button class="lb-btn lb-close" aria-label="Close">${icon.close}</button></div>
    <div class="lb-stage"></div>
    <div class="lb-bar"><span class="lb-cat"></span><div class="lb-nav"><button class="lb-btn lb-prev" aria-label="Previous photo">${icon.arrowL}</button><button class="lb-btn lb-next" aria-label="Next photo">${icon.arrow}</button></div></div>
  </div>`;
}

function about() {
  return `
  <section class="page-hero"><div class="wrap">
    ${crumbs('About')}
    <h1 class="t-hero" data-reveal>Hi, I'm <span class="serif">Yasar.</span></h1>
  </div></section>
  <section style="padding-bottom:clamp(80px,10vw,140px)"><div class="wrap about-top">
    <div data-reveal>${media(person.portraitAlt, { ratio: '4/5', alt: 'Yasar C H' })}</div>
    <div>
      <p class="bio" data-reveal>${person.about}</p>
      <dl class="kv" data-reveal>
        <div><dt>Programme</dt><dd>${person.degree}</dd></div>
        <div><dt>Minor</dt><dd>${person.minor}</dd></div>
        <div><dt>Institute</dt><dd>${person.school}, ${person.years}</dd></div>
        <div><dt>Currently</dt><dd>${person.semester}</dd></div>
      </dl>
    </div>
  </div></section>

  <section class="sec on-white"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Experience.</h2></div>
    <ol class="timeline">${experience.map((x) => `<li data-reveal><div><span class="when">${x.when}</span><h3>${x.org}</h3><p class="role">${x.role}</p></div>
      <div><p>${x.body}</p>${tags(x.tags)}</div></li>`).join('')}</ol>
  </div></section>

  <section class="on-night sec-s center"><div class="wrap">
    <h2 class="t-1" data-reveal>Leadership <span class="serif">&amp;</span> events.</h2>
    <div class="events" data-reveal>${events.map((e) => `<span>${e}</span>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Education.</h2></div>
    <ol class="timeline">${education.map((e) => `<li data-reveal><div>${e.years ? `<span class="when">${e.years}</span>` : ''}<h3>${e.place}</h3></div>
      <div><p style="margin:0">${e.what}</p>${e.now ? `<p class="dim" style="margin:6px 0 0">${e.now}</p>` : ''}</div></li>`).join('')}</ol>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Letters of <span class="serif">recommendation.</span></h2></div>
    <div class="lor-grid">${recommendations.map((r) => `<article class="lor" data-reveal><span class="label">Letter of recommendation</span><p>${r.about}</p>
      <div class="by"><i>${r.name.replace('Mr. ', '')[0]}</i><span><b>${r.name}</b><span>${r.title}</span></span></div></article>`).join('')}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Certificates.</h2></div>
    <div class="cert-grid">${certificates.map((c) => `<div class="cert" data-reveal><span class="ico">${icon.award}</span><div><h3>${c.title}</h3><p>${c.detail}</p></div></div>`).join('')}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Expertise.</h2></div>
    <div class="skills">${skills.map((s) => `<div class="skill-row" data-reveal><h3>${s.group}</h3>${tags(s.items)}</div>`).join('')}</div>
  </div></section>`;
}

/* ---------- Render ---------- */
const views = { home, work, project, garments: garmentsPage, photography, about };
$('#main').innerHTML = views[page]?.() ?? '';
let lenis = null;
chrome();
wireMedia();

/* ---------- Smooth scroll ---------- */
if (!reduce) {
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  const target = id === '#top' ? 0 : $(id);
  if (target === null) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(target, { duration: 1.4 });
  else target === 0 ? scrollTo(0, 0) : target.scrollIntoView();
}));

/* ---------- Nav + thread ---------- */
const navEl = $('.nav'), sewn = $('.thread .sewn'), needle = $('.thread .needle'), threadEl = $('.thread');
let lastY = 0;
function onScroll() {
  const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
  navEl.classList.toggle('is-scrolled', y > 10);
  navEl.classList.toggle('is-hidden', y > 400 && y > lastY + 2 && !document.body.classList.contains('menu-open'));
  if (y < lastY - 2) navEl.classList.remove('is-hidden');
  lastY = y;
  const p = max > 0 ? Math.min(1, y / max) : 0;
  sewn.style.transform = `scaleY(${p})`;
  needle.style.transform = `translateY(${p * threadEl.clientHeight}px)`;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Rails (drag + arrows) ---------- */
$$('.rail').forEach((rail) => {
  const sec = rail.closest('section');
  const prev = $('.rail-prev', sec), next = $('.rail-next', sec);
  const step = () => Math.max(280, rail.clientWidth * 0.7);
  const sync = () => {
    if (!prev) return;
    prev.disabled = rail.scrollLeft < 8;
    next.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 8;
  };
  prev?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
  rail.addEventListener('scroll', sync, { passive: true });
  sync();
  let down = false, sx = 0, sl = 0, moved = false;
  rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); }
    rail.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', () => { down = false; rail.classList.remove('is-drag'); });
  rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
  rail.setAttribute('data-lenis-prevent-wheel', '');
});

/* ---------- Photography: filter + lightbox ---------- */
if (page === 'photography') {
  const seg = $('.seg'), pill = $('.pill', seg), items = $$('.masonry .shot');
  const movePill = (b) => { pill.style.width = `${b.offsetWidth}px`; pill.style.transform = `translateX(${b.offsetLeft - 4}px)`; pill.style.left = '4px'; };
  $$('button', seg).forEach((b) => b.addEventListener('click', () => {
    $$('button', seg).forEach((x) => x.setAttribute('aria-selected', x === b));
    movePill(b);
    const c = b.dataset.cat;
    gsap.to(items, { opacity: 0, duration: 0.18, onComplete: () => {
      items.forEach((it) => (it.hidden = c !== 'All' && it.dataset.cat !== c));
      gsap.fromTo(items.filter((it) => !it.hidden), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'expo.out' });
      ScrollTrigger.refresh();
    } });
  }));
  document.fonts.ready.then(() => movePill($('button', seg)));
  addEventListener('resize', () => movePill($('[aria-selected="true"]', seg)));

  const lb = $('.lightbox'), stage = $('.lb-stage', lb);
  let idx = 0, last;
  const visible = () => items.filter((it) => !it.hidden).map((it) => +it.dataset.i);
  const show = (i) => {
    idx = i; const ph = photos[i], list = visible();
    stage.innerHTML = media(ph.src, { ratio: ph.ratio, alt: `${ph.cat} photograph`, eager: true });
    wireMedia(stage);
    $('.lb-count', lb).textContent = `${list.indexOf(i) + 1} / ${list.length}`;
    $('.lb-cat', lb).textContent = ph.cat;
  };
  const step = (d) => { const list = visible(); show(list[(list.indexOf(idx) + d + list.length) % list.length]); };
  const open = (i) => { last = document.activeElement; show(i); lb.classList.add('is-open'); lenis?.stop(); $('.lb-close', lb).focus(); };
  const close = () => { lb.classList.remove('is-open'); lenis?.start(); last?.focus(); };
  items.forEach((it) => it.addEventListener('click', () => open(+it.dataset.i)));
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-prev', lb).addEventListener('click', () => step(-1));
  $('.lb-next', lb).addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target === stage) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
}

/* ---------- Motion ---------- */
if (!reduce) {
  // Hero entrance, staggered
  const heroBits = $$('.hero [data-reveal], .page-hero [data-reveal], .p-hero [data-reveal]');
  gsap.to(heroBits, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, delay: 0.1 });

  ScrollTrigger.batch($$('[data-reveal]').filter((el) => !heroBits.includes(el)), {
    start: 'top 90%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  // Stage media grows to full size as it scrolls into place
  $$('.grow').forEach((g) => {
    gsap.fromTo(g, { scale: 0.86, borderRadius: 48 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: g, start: 'top 95%', end: 'top 25%', scrub: 0.6 },
    });
    const img = $('img', g);
    if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: g, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.floating').forEach((f, i) => gsap.fromTo(f, { y: 40 }, { y: i ? -60 : -20, ease: 'none', scrollTrigger: { trigger: '.hero-stage', start: 'top bottom', end: 'bottom top', scrub: true } }));

  // Statement lights up word by word
  $$('[data-scrub]').forEach((el) => {
    gsap.to($$('.w', el), { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 } });
  });

  // Counters
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, o = { v: 0 };
    gsap.to(o, { v: end, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' },
      onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('en-IN')) });
  });

  // Strike the "before" values
  $$('.compare-row .before').forEach((b) => gsap.fromTo(b, { '--strike': 0 }, { '--strike': 1, duration: 0.8, ease: 'power3.inOut', scrollTrigger: { trigger: b, start: 'top 80%' }, delay: 0.3 }));

  // Garment process: the thread sews down the steps
  $$('.process').forEach((list) => {
    const fill = $('.fill', list), steps = $$('li', list);
    ScrollTrigger.create({
      trigger: list, start: 'top 70%', end: 'bottom 55%', scrub: true,
      onUpdate: (st) => {
        fill.style.setProperty('--p', st.progress);
        steps.forEach((li, k) => li.classList.toggle('is-on', st.progress >= k / (steps.length - 1) - 0.001));
      },
    });
  });
} else {
  $$('.process li').forEach((li) => li.classList.add('is-on'));
  $$('.process .fill').forEach((f) => f.style.setProperty('--p', 1));
}

addEventListener('load', () => ScrollTrigger.refresh());
