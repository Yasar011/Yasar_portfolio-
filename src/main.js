import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  person, projects, garments, photos, photoCategories, camera,
  education, experience, events, certificates, recommendations, skills,
  focusAreas, tools, languages,
} from './data.js';
import { mountAssistant } from './assistant.js';

gsap.registerPlugin(ScrollTrigger);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
if (reduce) document.documentElement.classList.add('reduced');
const page = document.body.dataset.page;

// Every fresh load or refresh plays the stitched loader; moving between pages plays a short cut transition.
let arrive = null;
try { arrive = sessionStorage.getItem('pt'); sessionStorage.removeItem('pt'); sessionStorage.removeItem('intro'); } catch (e) { /* storage blocked */ }
const showIntro = !reduce && !arrive;
const showArrive = !reduce && !!arrive;
const D = showIntro ? 2.8 : showArrive ? 0.55 : 0; // delay hero entrance until the curtain lifts
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, '0');

/* ---------- Icons ---------- */
const sv = (d, w = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const icon = {
  arrow: sv('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowL: sv('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  out: sv('<path d="M7 17 17 7M9 7h8v8"/>'),
  download: sv('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
  mail: sv('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>', 1.6),
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
const links = [['Work', '/work'], ['Garments', '/garments'], ['Photography', '/photography'], ['About', '/about'], ['CV', '/cv']];
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
    <a class="btn nav-cta" href="${person.cv}" download>${icon.download} Download CV</a>
    <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span></button>
  </div>`;
  const drawer = document.createElement('div');
  drawer.className = 'drawer'; drawer.id = 'drawer';
  drawer.innerHTML = `<ol>${[['Home', '/'], ...links, ['Contact', '#contact']].map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ol>
    <a class="btn" href="${person.cv}" download style="align-self:flex-start;margin-top:24px">${icon.download} Download CV</a>
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
    <div class="ctas" data-reveal><a class="btn" href="mailto:${person.email}">${icon.mail} ${person.email}</a><a class="link" href="${person.cv}" download><span>Download my CV</span>${icon.download}</a></div>
    <div class="socials" data-reveal>${person.socials.map((s) => `<a class="social" href="${s.href}" target="_blank" rel="noopener"><i>${socialIcon[s.label]}</i><span><b>${s.label}</b><span>@${s.handle}</span></span></a>`).join('')}</div>
    <div class="foot-base"><span>© ${new Date().getFullYear()} Yasar C H · ${person.signoff}</span><a href="#top">Back to top ↑</a></div>
  </div>`;
  document.body.append(foot);
}

/* ---------- Building blocks ---------- */
const crumbs = (...parts) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${parts.map((p) => `${icon.chev}${Array.isArray(p) ? `<a href="${p[1]}">${p[0]}</a>` : `<span>${p}</span>`}`).join('')}</nav>`;
const tags = (list) => `<ul class="tags">${list.map((t) => `<li class="tag">${t}</li>`).join('')}</ul>`;

/* ---------- Pages ---------- */
const roles = ['developer', 'photographer', 'garment maker', 'system designer', 'club president'];
const ticker = ['Web Development', 'Fashion Technology', 'UI/UX Design', 'Photography', 'Garment Development', 'Video Editing', 'Quality Systems', 'Creative Direction'];
const services = [
  { t: 'Digital systems', d: 'Web apps and real-time platforms that people on a factory floor or at an event actually use.', items: ['Web Development', 'Firebase', 'PWA', 'UI/UX', 'AI-assisted dev', 'n8n'] },
  { t: 'Fashion technology', d: 'Quality, maintenance and production systems for apparel manufacturing.', items: ['Quality Systems', 'Process Automation', 'Industrial IoT', 'TukaTech', 'FastReact'] },
  { t: 'Garment development', d: 'Taking a garment from concept and pattern through cutting, construction and finishing.', items: ['Pattern Making', 'Construction', 'Embellishment', 'Styling'] },
  { t: 'Photography & visuals', d: 'Fashion, portrait, event and travel photography, edited and graded myself.', items: ['Fashion', 'Portrait', 'Event', 'Lightroom', 'Premiere Pro'] },
];
const tickMark = '<svg class="tick-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

function home() {
  // Real photos lead (first one large), then a garment; more photos join as they are added
  const shots = photos.map((ph) => ({ src: ph.src, label: `${ph.cat} photography`, href: '/photography' }));
  const madeShot = [
    ...(shots[0] ? [{ ...shots[0], cls: 'big' }] : []),
    ...(shots[1] ? [{ ...shots[1], cls: 'tall' }] : []),
    { src: garments[0].cover, label: garments[0].title, href: '/garments', cls: 'tall' },
    ...shots.slice(2, 6),
  ];
  return `
  <section class="me" id="top"><div class="wrap me-grid">
    <div class="me-text">
      <p class="hello serif" data-reveal>Hi, I'm</p>
      <h1 class="me-name" aria-label="Yasar C H"><span class="ln"><span>Yasar</span></span><span class="ln"><span>C H<i class="accent">.</i></span></span></h1>
      <p class="me-role" data-reveal>Fashion Technology student at NIFT Jodhpur, and a <span class="rotator"><span class="rot-track">${[...roles, roles[0]].map((r) => `<span>${r}</span>`).join('')}</span></span></p>
      <div class="ctas" data-reveal><a class="btn" href="/work" data-cursor="Work">View my work ${icon.arrow}</a><a class="btn btn--line" href="${person.cv}" download>${icon.download} Download CV</a></div>
      <ul class="me-meta" data-reveal><li><span class="dot"></span>${person.degree} · ${person.semester}</li><li>Perinthalmanna, Kerala → Jodhpur</li></ul>
    </div>
    <div class="me-photo" data-reveal>
      <div class="me-frame">${media(person.portrait, { ratio: '4/5', alt: 'Portrait of Yasar C H', eager: true })}</div>
      <svg class="badge" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="circ" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs>
        <circle cx="100" cy="100" r="98"/><text class="badge-ring"><textPath href="#circ">FASHION · TECHNOLOGY · PHOTOGRAPHY · </textPath></text>
        <text x="100" y="122" text-anchor="middle" class="badge-y">y</text></svg>
    </div>
  </div></section>

  <div class="ticker" aria-hidden="true"><div class="ticker-track">${[0, 1].map(() => ticker.map((t) => `<span>${t}</span>${tickMark}`).join('')).join('')}</div></div>

  <section class="sec about-snip"><div class="wrap snip-grid">
    <h2 class="snip-label" data-reveal>About me</h2>
    <div>
      <p class="snip-big" data-reveal>I work where <span class="serif accent">fabric</span> meets <span class="serif accent">code</span> — building the systems a factory runs on, sewing garments by hand, and telling stories through a camera.</p>
      <p class="lede" data-reveal style="max-width:58ch">${person.about}</p>
      <div class="ctas" style="margin-top:32px" data-reveal><a class="link" href="/about"><span>More about me</span>${icon.arrow}</a><a class="link" href="/cv"><span>Read my CV</span>${icon.arrow}</a></div>
    </div>
  </div></section>

  <section class="sec on-white" style="padding-bottom:clamp(64px,8vw,110px)"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Selected <span class="serif">work.</span></h2><a class="link" href="/work" data-reveal><span>All projects</span>${icon.arrow}</a></div>
    <ol class="work-index">${projects.map((p, i) => `<li data-reveal><a class="work-row" href="/project?id=${p.id}" data-preview="${p.images[0]}" data-cursor="View">
      <span class="wr-num mono">${pad(i + 1)}</span>
      <span class="wr-thumb">${media(p.images[0], { ratio: '16/10', alt: '' })}</span>
      <span class="wr-title">${p.title}</span>
      <span class="wr-meta"><span>${p.role}</span><span class="dim">${p.where}</span></span>
      <span class="wr-go">${icon.arrow}</span></a></li>`).join('')}</ol>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="head"><div><h2 class="t-1" data-reveal>Made <span class="serif">&amp;</span> shot.</h2><p class="lede" data-reveal>Garments I designed and sewed, and frames from behind my ${camera.body}.</p></div>
      <div class="ctas" data-reveal><a class="link" href="/garments"><span>Garments</span>${icon.arrow}</a><a class="link" href="/photography"><span>Photography</span>${icon.arrow}</a></div></div>
    <div class="mosaic">${madeShot.map((m) => `<a class="mo ${m.cls || ''}" href="${m.href}" data-reveal data-cursor="Open">${media(m.src, { alt: m.label })}<span class="mo-cap">${m.label}</span></a>`).join('')}</div>
  </div></section>

  <section class="sec on-white"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>What I <span class="serif">do.</span></h2></div>
    <ol class="services">${services.map((x, i) => `<li data-reveal><span class="mono accent">${pad(i + 1)}</span><div><h3>${x.t}</h3><p>${x.d}</p></div>${tags(x.items)}</li>`).join('')}</ol>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Experience.</h2><a class="link" href="/cv" data-reveal><span>Full CV</span>${icon.arrow}</a></div>
    <ol class="exp-list">${experience.map((x) => `<li data-reveal><span class="mono dim">${x.when.split(' · ')[0]}</span><b>${x.org}</b><span class="dim">${x.role.split(' · ')[0]}</span></li>`).join('')}</ol>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Kind <span class="serif">words.</span></h2></div>
    <div class="lor-grid">${recommendations.map((r) => `<article class="lor" data-reveal><span class="label">Letter of recommendation</span><p>${r.about}</p>
      <div class="by"><i>${r.name.replace('Mr. ', '')[0]}</i><span><b>${r.name}</b><span>${r.title}</span></span></div></article>`).join('')}</div>
  </div></section>`;
}

function work() {
  return `
  <section class="page-hero"><div class="wrap">
    ${crumbs('Work')}
    <h1 class="t-hero" data-reveal>The <span class="serif">work.</span></h1>
    <p class="lede" data-reveal>Systems built for a working apparel factory, a full event platform for TEDx, and machines that report on themselves.</p>
  </div></section>
  <section style="padding-bottom:clamp(96px,12vw,160px)"><div class="wrap"><div class="w-grid">
    ${projects.map((p, i) => `<a class="w-card" href="/project?id=${p.id}" data-reveal data-cursor="View">
      ${media(p.images[0], { ratio: '4/3', alt: `${p.title} screen` })}
      <div class="w-info"><div><h2 class="t-2">${p.title}</h2><p class="dim">${p.role} · ${p.where}</p></div><span class="mono accent">${pad(i + 1)}</span></div>
      ${tags(p.stack.slice(0, 4))}
    </a>`).join('')}
    <a class="w-card w-more" href="/garments" data-reveal data-cursor="Open"><span class="t-2">Looking for garments<br>or photography?</span><span class="link"><span>See what I've made</span>${icon.arrow}</span></a>
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
    ${p.live || p.repo ? `<div class="ctas" style="margin-top:30px" data-reveal>${p.live ? `<a class="btn" href="${p.live}" target="_blank" rel="noopener">Visit live site ${icon.out}</a>` : ''}${p.repo ? `<a class="btn btn--line" href="${p.repo}" target="_blank" rel="noopener">${icon.github} View code</a>` : ''}</div>` : ''}
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

  ${p.flow ? `<section class="sec-s flow-sec"><div class="wrap">
    <div class="head"><div><h2 class="t-1" data-reveal>How it <span class="serif">works.</span></h2><p class="lede" data-reveal>The system as one flow, from the factory floor to the dashboard.</p></div></div>
    <div class="flow" data-flow>${p.flow.map((st, i) => `<div class="flow-col${st.hub ? ' is-hub' : ''}${st.nodes.length > 1 ? ' is-fork' : ''}" data-reveal>
      <span class="flow-label mono"><b>${pad(i + 1)}</b> ${st.label}</span>
      ${st.nodes.map((n) => `<div class="flow-node"><h3>${n.t}</h3>${n.d ? `<p>${n.d}</p>` : ''}</div>`).join('')}
    </div>${i < p.flow.length - 1 ? '<span class="flow-link" aria-hidden="true"><i></i></span>' : ''}`).join('')}</div>
  </div></section>` : ''}

  ${p.scale ? `<section class="on-night sec-s"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>${p.scaleTitle || 'Built for <span class="serif">scale.</span>'}</h2></div>
    <div class="scale-grid">${p.scale.map((s) => `<div class="metric" data-reveal><div class="num"${/^[\d,]+$/.test(s.value) ? ` data-count="${s.value.replace(/,/g, '')}"` : ''}>${s.value}</div><p>${s.label}</p></div>`).join('')}</div>
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
  const cats = ['All', ...photoCategories.filter((c) => photos.some((ph) => ph.cat === c))];
  return `
  <section class="page-hero"><div class="wrap">
    ${crumbs('Photography')}
    <h1 class="t-hero" data-reveal>Through the <span class="serif">lens.</span></h1>
    <p class="lede" data-reveal>Fashion, runway, brand and product work — shot and edited by me.</p>
  </div></section>
  <section style="padding-bottom:clamp(96px,12vw,160px)"><div class="wrap">
    <div class="photo-bar" data-reveal>
      <div class="seg" role="tablist" aria-label="Filter photos">${cats.map((c, i) => `<button role="tab" aria-selected="${i === 0}" data-cat="${c}">${c}</button>`).join('')}<span class="pill" aria-hidden="true"></span></div>
      <div class="tags"><span class="tag" style="background:var(--surface)">${camera.body}</span><span class="tag" style="background:var(--surface)">${camera.lens}</span></div>
    </div>
    <div class="masonry" style="columns:${Math.min(3, photos.length)} 300px">${photos.map((ph, i) => `<button class="shot" data-cat="${ph.cat}" data-i="${i}" aria-label="Open ${ph.cat} photo">${media(ph.src, { ratio: ph.ratio, alt: `${ph.cat} photograph` })}<span class="cap">${ph.cap ? `${ph.cat} · ${ph.cap}` : ph.cat}</span></button>`).join('')}</div>
  </div></section>
  <div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
    <div class="lb-bar"><span class="mono lb-count"></span><button class="lb-btn lb-close" aria-label="Close">${icon.close}</button></div>
    <div class="lb-stage"></div>
    <div class="lb-bar"><span class="lb-cat"></span><div class="lb-nav"><button class="lb-btn lb-prev" aria-label="Previous photo">${icon.arrowL}</button><button class="lb-btn lb-next" aria-label="Next photo">${icon.arrow}</button></div></div>
  </div>`;
}

const experienceList = () => `<ol class="timeline">${experience.map((x) => `<li data-reveal><div><span class="when">${x.when}</span><h3>${x.org}</h3><p class="role">${x.role}</p></div>
      <div><p>${x.body}</p>${tags(x.tags)}</div></li>`).join('')}</ol>`;
const educationList = () => `<ol class="timeline">${education.map((e) => `<li data-reveal><div>${e.years ? `<span class="when">${e.years}</span>` : ''}<h3>${e.place}</h3></div>
      <div><p style="margin:0">${e.what}</p>${e.now ? `<p class="dim" style="margin:6px 0 0">${e.now}</p>` : ''}</div></li>`).join('')}</ol>`;
const certList = () => `<div class="cert-grid">${certificates.map((c) => `<div class="cert" data-reveal><span class="ico">${icon.award}</span><div><h3>${c.title}</h3><p>${c.detail}</p></div></div>`).join('')}</div>`;
const skillList = () => `<div class="skills">${skills.map((s) => `<div class="skill-row" data-reveal><h3>${s.group}</h3>${tags(s.items)}</div>`).join('')}</div>`;

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
      <div class="ctas" style="margin-top:28px" data-reveal><a class="btn" href="${person.cv}" download>${icon.download} Download CV</a><a class="link" href="/cv"><span>Read the full CV</span>${icon.arrow}</a></div>
    </div>
  </div></section>

  <section class="sec on-white"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Experience.</h2></div>
    ${experienceList()}
  </div></section>

  <section class="on-night sec-s center"><div class="wrap">
    <h2 class="t-1" data-reveal>Leadership <span class="serif">&amp;</span> events.</h2>
    <div class="events" data-reveal>${events.map((e) => `<span>${e}</span>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Education.</h2></div>
    ${educationList()}
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Letters of <span class="serif">recommendation.</span></h2></div>
    <div class="lor-grid">${recommendations.map((r) => `<article class="lor" data-reveal><span class="label">Letter of recommendation</span><p>${r.about}</p>
      <div class="by"><i>${r.name.replace('Mr. ', '')[0]}</i><span><b>${r.name}</b><span>${r.title}</span></span></div></article>`).join('')}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Certificates.</h2></div>
    ${certList()}
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Expertise.</h2></div>
    ${skillList()}
  </div></section>`;
}

function cv() {
  return `
  <section class="page-hero"><div class="wrap">
    ${crumbs('CV')}
    <h1 class="t-hero" data-reveal>My <span class="serif">résumé.</span></h1>
    <p class="lede" data-reveal>Everything on one page: education, experience, skills and tools. Read it here, or take the PDF with you.</p>
    <div class="ctas" style="margin-top:36px" data-reveal>
      <a class="btn" href="${person.cv}" download>${icon.download} Download CV (PDF)</a>
      <a class="link" href="${person.cv}" target="_blank" rel="noopener"><span>Open in a new tab</span>${icon.out}</a>
    </div>
  </div></section>

  <section style="padding-bottom:clamp(80px,10vw,140px)"><div class="wrap">
    <dl class="kv cv-glance">
      <div data-reveal><dt>Programme</dt><dd>${person.degree} (BFT)</dd></div>
      <div data-reveal><dt>Institute</dt><dd>${person.school} · ${person.years}</dd></div>
      <div data-reveal><dt>Minor</dt><dd>${person.minor}</dd></div>
      <div data-reveal><dt>From</dt><dd>${person.location}</dd></div>
      <div data-reveal><dt>Languages</dt><dd>${languages.join(', ')}</dd></div>
      <div data-reveal><dt>Email</dt><dd><a class="accent" href="mailto:${person.email}">${person.email}</a></dd></div>
    </dl>
    <p class="bio cv-summary" data-reveal>${person.about}</p>
  </div></section>

  <section class="sec on-white"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Experience.</h2></div>
    ${experienceList()}
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Education.</h2></div>
    ${educationList()}
  </div></section>

  <section class="on-night sec center"><div class="wrap">
    <h2 class="t-1" data-reveal>What I <span class="serif">do.</span></h2>
    <div class="events" data-reveal>${focusAreas.map((f) => `<span>${f}</span>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Software <span class="serif">&amp;</span> tools.</h2></div>
    <div class="tool-grid">${tools.map((t) => `<div class="tool" data-reveal>${t}</div>`).join('')}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Skills.</h2></div>
    ${skillList()}
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="head"><h2 class="t-1" data-reveal>Certificates.</h2></div>
    ${certList()}
  </div></section>

  <section class="sec on-white cv-preview-sec"><div class="wrap">
    <div class="head"><div><h2 class="t-1" data-reveal>The one-page <span class="serif">version.</span></h2><p class="lede" data-reveal>The same CV as a PDF, ready to print or attach.</p></div>
      <a class="btn" href="${person.cv}" download data-reveal>${icon.download} Download CV</a></div>
    <div class="cv-frame" data-reveal><iframe src="${person.cv}#view=FitH&toolbar=0" title="Yasar C H — CV (PDF)" loading="lazy"></iframe></div>
  </div></section>`;
}

/* ---------- Render ---------- */
const views = { home, work, project, garments: garmentsPage, photography, about, cv };
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

mountAssistant({ lenis, reduce });

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
    $('.lb-cat', lb).textContent = ph.cap ? `${ph.cat} · ${ph.cap}` : ph.cat;
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
  const heroBits = $$('.me [data-reveal], .page-hero [data-reveal], .p-hero [data-reveal]');
  gsap.to(heroBits, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, delay: 0.1 + D });

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

  // Block diagram: the thread runs from stage to stage as it scrolls in
  $$('[data-flow]').forEach((flow) => {
    const vertical = matchMedia('(max-width: 1000px)').matches;
    gsap.fromTo($$('.flow-link i', flow), { [vertical ? 'scaleY' : 'scaleX']: 0 }, {
      [vertical ? 'scaleY' : 'scaleX']: 1, duration: 0.5, ease: 'power2.out', stagger: 0.18,
      scrollTrigger: { trigger: flow, start: 'top 75%' },
    });
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

/* ---------- Personality: name, roles, cursor, previews ---------- */
if (!reduce) {
  const nameLines = $$('.me-name .ln > span');
  if (nameLines.length) gsap.from(nameLines, { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.1, delay: 0.15 + D });
  const portrait = $('.me-frame');
  if (portrait) gsap.from(portrait, { y: 60, rotate: 8, opacity: 0, duration: 1.6, ease: 'expo.out', delay: 0.3 + D });

  // Rotating role word
  const track = $('.rot-track');
  if (track) {
    const n = track.children.length - 1;
    const tl = gsap.timeline({ repeat: -1, delay: 1.6 + D });
    for (let i = 1; i <= n; i++) tl.to(track, { yPercent: (-100 / (n + 1)) * i, duration: 0.7, ease: 'expo.inOut' }, '+=1.6');
    tl.set(track, { yPercent: 0 });
  }

  // Ticker and photo drift a little with scroll
  if (portrait) gsap.to('.me-photo', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.me', start: 'top top', end: 'bottom top', scrub: true } });
}

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (finePointer && !reduce) {
  // Custom cursor
  const cur = document.createElement('div');
  cur.className = 'cursor is-hidden';
  cur.innerHTML = '<span class="c-ring"><span></span></span><span class="c-dot"></span>';
  document.body.append(cur);
  const ring = $('.c-ring', cur), dot = $('.c-dot', cur), label = $('.c-ring span', cur);
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });

  // Floating project preview
  const pv = document.createElement('div');
  pv.className = 'preview';
  pv.innerHTML = '<div class="pv-in"></div>';
  document.body.append(pv);
  const pvIn = $('.pv-in', pv);
  const px = gsap.quickTo(pv, 'x', { duration: 0.6, ease: 'power3' }), py = gsap.quickTo(pv, 'y', { duration: 0.6, ease: 'power3' });

  addEventListener('pointermove', (e) => {
    cur.classList.remove('is-hidden');
    rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY);
    px(e.clientX + 28); py(e.clientY - 110);
  });
  document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));

  document.addEventListener('pointerover', (e) => {
    const lab = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button');
    cur.classList.toggle('is-label', !!lab);
    cur.classList.toggle('is-link', !lab && !!link);
    if (lab) label.textContent = lab.dataset.cursor;
    const row = e.target.closest('[data-preview]');
    if (row) {
      if (pv.dataset.src !== row.dataset.preview) {
        pv.dataset.src = row.dataset.preview;
        pvIn.innerHTML = media(row.dataset.preview, { ratio: '16/10', alt: '' });
        wireMedia(pvIn);
      }
      pv.classList.add('is-on');
    } else pv.classList.remove('is-on');
  });
}

/* ---------- Loader + page transitions: two layers of silk ---------- */
// Path shapes share one command structure so GSAP can flow smoothly between them.
// Covering (edge rises from the bottom, centre leading) and uncovering (edge lifts away, centre trailing).
const SILK = {
  below: 'M0 100 L0 100 Q50 100 100 100 L100 100 Z',
  rising: 'M0 100 L0 62 Q50 18 100 62 L100 100 Z',
  full: 'M0 100 L0 0 Q50 0 100 0 L100 100 Z',
  fullTop: 'M0 0 L0 100 Q50 100 100 100 L100 0 Z',
  lifting: 'M0 0 L0 38 Q50 86 100 38 L100 0 Z',
  gone: 'M0 0 L0 0 Q50 0 100 0 L100 0 Z',
};
function veil(content, covered) {
  const el = document.createElement('div');
  el.className = 'veil';
  el.setAttribute('aria-hidden', 'true');
  const d = covered ? SILK.fullTop : SILK.below;
  el.innerHTML = `<svg class="silk" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="silk-a" d="${d}"/><path class="silk-b" d="${d}"/></svg>
    <div class="veil-in">${content}</div>`;
  document.body.append(el);
  return el;
}
// Letters of a label flow in from a soft blur
const flowLetters = (text) => [...text].map((ch) => `<span class="fl">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
// Uncover the page: dark layer lifts first, the indigo layer trails it
function lift(el, at) {
  const [a, b] = $$('.silk path', el);
  return gsap.timeline({ onComplete: () => { el.remove(); lenis?.start(); } })
    .to($('.veil-in', el), { y: -60, opacity: 0, filter: 'blur(8px)', duration: 0.55, ease: 'power3.in' }, at)
    .to(b, { attr: { d: SILK.lifting }, duration: 0.45, ease: 'power2.in' }, at + 0.2)
    .to(b, { attr: { d: SILK.gone }, duration: 0.45, ease: 'power2.out' }, at + 0.65)
    .to(a, { attr: { d: SILK.lifting }, duration: 0.45, ease: 'power2.in' }, at + 0.34)
    .to(a, { attr: { d: SILK.gone }, duration: 0.5, ease: 'power2.out' }, at + 0.79);
}

if (showIntro) {
  // The full name is dyed: an outline first, then indigo rises through the letters with a moving wave on top
  const W = 1200, H = 260, NAME = 'Yasar C H';
  const wave = (() => {
    // A wave twice the width so it can slide sideways forever, closed down to well below the letters
    let d = `M0 0`;
    for (let x = 0; x <= W * 2; x += 60) d += ` Q${x + 30} ${(x / 60) % 2 ? 14 : -14} ${x + 60} 0`;
    return `${d} L${W * 2 + 60} ${H * 2} L0 ${H * 2} Z`;
  })();
  const ld = veil(`<div class="dye">
      <svg class="dye-svg" viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <defs><clipPath id="dye-clip"><path class="dye-wave" d="${wave}"/></clipPath>
          <linearGradient id="dye-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a91ff"/><stop offset="1" stop-color="#3a2cf5"/></linearGradient></defs>
        <text class="dye-outline" x="${W / 2}" y="${H * 0.78}" text-anchor="middle">${NAME}</text>
        <g clip-path="url(#dye-clip)"><text class="dye-fill" x="${W / 2}" y="${H * 0.78}" text-anchor="middle">${NAME}</text></g>
      </svg>
      <div class="ld-meta"><span class="ld-status">Weaving</span><span class="ld-count">000</span></div>
      <p class="ld-name">Fashion Technology · NIFT Jodhpur <span>· Portfolio ${new Date().getFullYear()}</span></p>
    </div>`, true);
  lenis?.stop();

  const svg = $('.dye-svg', ld), waveEl = $('.dye-wave', ld), status = $('.ld-status', ld), count = $('.ld-count', ld);
  // Fit the viewBox to the real text once the face is ready, so the name always fills the width
  const fit = () => {
    const b = $('.dye-outline', ld).getBBox();
    if (b.width) svg.setAttribute('viewBox', `${b.x - 10} ${b.y - 10} ${b.width + 20} ${b.height + 20}`);
  };
  fit();
  document.fonts?.ready.then(fit);

  const stages = [[0, 'Weaving'], [0.18, 'Dyeing'], [0.86, 'Finishing'], [0.98, 'Ready']];
  const prog = { p: 0 };
  const render = () => {
    const p = prog.p;
    // Dye level: from below the baseline to above the cap height
    const level = H * 0.92 - p * H * 0.92;
    const drift = -((performance.now() / 6) % 120);
    waveEl.setAttribute('transform', `translate(${drift} ${level})`);
    count.textContent = String(Math.round(p * 100)).padStart(3, '0');
    const st = stages.filter(([at]) => p >= at).pop()[1];
    if (status.textContent !== st) status.textContent = st;
  };
  render();

  lift(ld, 2.35)
    .from($('.dye', ld), { opacity: 0, y: 24, filter: 'blur(8px)', duration: 0.8, ease: 'expo.out' }, 0)
    .fromTo($('.dye-outline', ld), { strokeDasharray: '0 1200' }, { strokeDasharray: '1200 0', duration: 1.1, ease: 'power2.inOut' }, 0)
    .to(prog, { p: 1, duration: 1.95, ease: 'power1.inOut', onUpdate: render }, 0.3)
    .to($('.dye-fill', ld), { attr: { fill: '#ffffff' }, duration: 0.35, ease: 'power1.out' }, 2.05);
}

// Arriving from another page: the silk that covered the old page lifts off this one
if (showArrive) {
  const safe = arrive.replace(/[<>&"]/g, '');
  const el = veil(`<b class="pt-label">${flowLetters(safe)}</b>`, true);
  lenis?.stop();
  lift(el, 0.05);
}

// Leaving: silk flows up over the page, the destination's name flows in, then we navigate
const routeLabel = (url) => {
  const path = url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (path === '/project') return projects.find((p) => p.id === url.searchParams.get('id'))?.title || 'Project';
  return { '/': 'Home', '/work': 'Work', '/garments': 'Garments', '/photography': 'Photography', '/about': 'About', '/cv': 'CV' }[path] || 'Yasar C H';
};
let leaving = false;
if (!reduce) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || leaving || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || /\.(pdf|jpe?g|png)$/i.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // same page / hash links
    e.preventDefault();
    leaving = true;
    const label = routeLabel(url);
    try { sessionStorage.setItem('pt', label); } catch (err) { location.href = url.href; return; }
    document.body.classList.remove('menu-open');
    lenis?.stop();
    const el = veil(`<b class="pt-label">${flowLetters(label)}</b>`, false);
    const [sa, sb] = $$('.silk path', el);
    gsap.timeline({ onComplete: () => (location.href = url.href) })
      .to('#main', { y: -40, opacity: 0.6, duration: 0.8, ease: 'power2.in' }, 0)
      .to(sa, { attr: { d: SILK.rising }, duration: 0.32, ease: 'power2.in' }, 0)
      .to(sa, { attr: { d: SILK.full }, duration: 0.38, ease: 'power2.out' }, 0.32)
      .to(sb, { attr: { d: SILK.rising }, duration: 0.32, ease: 'power2.in' }, 0.12)
      .to(sb, { attr: { d: SILK.full }, duration: 0.4, ease: 'power2.out' }, 0.44)
      .fromTo($$('.fl', el), { yPercent: 60, opacity: 0, filter: 'blur(10px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'expo.out', stagger: 0.025 }, 0.45);
  });
  // Coming back via the browser's back button may restore the covered page from cache
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    $$('.veil').forEach((v) => v.remove());
    gsap.set('#main', { clearProps: 'transform,opacity' });
    leaving = false;
    lenis?.start();
  });
}

// Arrival label letters settle in as the silk starts to lift
if (showArrive) gsap.from('.veil .fl', { yPercent: 30, filter: 'blur(6px)', duration: 0.4, ease: 'expo.out', stagger: 0.015 });

/* ---------- Wow: living name, thread trail, magnetic buttons ---------- */
if (finePointer && !reduce) {
  // Split the hero name into letters whose weight follows the cursor
  const name = $('.me-name');
  if (name) {
    $$('.ln > span', name).forEach((line) => {
      const walk = (node) => [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...c.textContent].forEach((ch) => {
            const l = document.createElement('span');
            l.className = ch === ' ' ? 'ch sp' : 'ch';
            l.textContent = ch;
            frag.append(l);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) walk(c);
      });
      walk(line);
    });
    const letters = $$('.ch:not(.sp)', name).map((el) => ({ el, w: 600, target: 600 }));
    let mx = -9999, my = -9999, active = false;
    const hero = $('.me');
    hero.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; active = true; });
    hero.addEventListener('pointerleave', () => { active = false; });
    gsap.ticker.add(() => {
      letters.forEach((l) => {
        if (active) {
          const r = l.el.getBoundingClientRect();
          const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
          l.target = 300 + 600 * Math.max(0, 1 - d / 420);
        } else l.target = 600;
        const nw = l.w + (l.target - l.w) * 0.12;
        if (Math.abs(nw - l.w) > 0.5) { l.w = nw; l.el.style.fontVariationSettings = `'wght' ${nw.toFixed(0)}`; }
      });
    });
  }

  // A fading stitch follows the cursor across the first screen
  const hero = $('.me');
  if (hero) {
    const cv = document.createElement('canvas');
    cv.className = 'trail';
    hero.prepend(cv);
    const ctx = cv.getContext('2d');
    const pts = [];
    const size = () => { const dpr = Math.min(devicePixelRatio, 2); cv.width = hero.clientWidth * dpr; cv.height = hero.clientHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener('resize', size);
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      pts.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
    });
    gsap.ticker.add(() => {
      const now = performance.now();
      while (pts.length && now - pts[0].t > 900) pts.shift();
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (pts.length < 2) return;
      ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.setLineDash([9, 7]);
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        ctx.strokeStyle = `rgba(58, 44, 245, ${Math.max(0, 1 - (now - b.t) / 900) * 0.85})`;
        ctx.lineDashOffset = -i * 3;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    });
  }

  // Magnetic buttons
  $$('.btn, .wr-go, .next .go, .social, .rail-ctrl button').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    const host = el.closest('.work-row') || el;
    host.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
    });
    host.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

addEventListener('load', () => ScrollTrigger.refresh());
