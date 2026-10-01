// "Ask about Yasar": a small chat panel backed by /api/chat
import gsap from 'gsap';
import { person } from './data.js';

const SUGGESTIONS = [
  'What did Yasar build at Brandix?',
  'Tell me about GarmentFix QMS',
  'What are his main skills?',
  'How can I contact him?',
];
const STORE = 'ask-yasar';

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Plain text with **bold**, links to site pages, emails and URLs
function format(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|\s)(\/(?:project\?id=[\w-]+|work|garments|photography|about|cv))(?=[\s.,)]|$)/g, '$1<a href="$2">$2</a>')
    .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>')
    .replace(/\n/g, '<br>');
}

export function mountAssistant({ lenis, reduce }) {
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem(STORE) || '[]'); } catch { /* storage blocked */ }
  const save = () => { try { sessionStorage.setItem(STORE, JSON.stringify(history.slice(-20))); } catch { /* ignore */ } };

  const root = document.createElement('div');
  root.className = 'ask';
  root.innerHTML = `
    <button class="ask-fab" aria-expanded="false" aria-controls="ask-panel" aria-label="Ask about Yasar (AI assistant)">
      <span class="ask-fab-dot" aria-hidden="true"></span><span class="ask-long" aria-hidden="true">Ask about Yasar</span><span class="ask-short" aria-hidden="true">Ask AI</span>
    </button>
    <section class="ask-panel" id="ask-panel" role="dialog" aria-label="Ask about Yasar" hidden>
      <header class="ask-head">
        <span class="ask-avatar" aria-hidden="true">y</span>
        <div><b>Ask about Yasar</b><span>AI assistant · answers from this portfolio</span></div>
        <button class="ask-close" aria-label="Close assistant"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </header>
      <div class="ask-log" aria-live="polite"></div>
      <div class="ask-chips">${SUGGESTIONS.map((s) => `<button type="button">${s}</button>`).join('')}</div>
      <form class="ask-form">
        <label class="sr" for="ask-input">Your question</label>
        <input id="ask-input" name="q" autocomplete="off" maxlength="600" placeholder="Ask about projects, skills, experience…">
        <button class="ask-send" type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
      </form>
      <p class="ask-note">AI can get things wrong. For anything important, email <a href="mailto:${person.email}">${person.email}</a>.</p>
    </section>`;
  document.body.append(root);

  const fab = root.querySelector('.ask-fab'), panel = root.querySelector('.ask-panel');
  const log = root.querySelector('.ask-log'), form = root.querySelector('.ask-form'), input = root.querySelector('input');
  const chips = root.querySelector('.ask-chips');
  let busy = false;

  const bubble = (role, html) => {
    const el = document.createElement('div');
    el.className = `ask-msg ask-msg--${role}`;
    el.innerHTML = html;
    log.append(el);
    log.scrollTop = log.scrollHeight;
    return el;
  };
  const renderHistory = () => {
    log.innerHTML = '';
    bubble('bot', `Hi! I can tell you about Yasar's projects, experience, skills and how to reach him. What would you like to know?`);
    history.forEach((m) => bubble(m.role === 'user' ? 'user' : 'bot', m.role === 'user' ? esc(m.content) : format(m.content)));
    chips.hidden = history.length > 0;
  };

  const open = () => {
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    renderHistory();
    if (!reduce) gsap.fromTo(panel, { y: 24, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
    lenis?.stop();
    setTimeout(() => input.focus(), 50);
  };
  const close = () => {
    const done = () => { panel.hidden = true; root.classList.remove('is-open'); fab.setAttribute('aria-expanded', 'false'); lenis?.start(); fab.focus(); };
    if (reduce) done();
    else gsap.to(panel, { y: 16, opacity: 0, scale: 0.97, duration: 0.25, ease: 'power2.in', onComplete: done });
  };
  fab.addEventListener('click', () => (panel.hidden ? open() : close()));
  root.querySelector('.ask-close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) close(); });
  // Let the chat log scroll on its own while the page's smooth scroll is paused
  log.setAttribute('data-lenis-prevent', '');

  async function ask(q) {
    if (busy || !q.trim()) return;
    busy = true;
    chips.hidden = true;
    history.push({ role: 'user', content: q.trim() });
    bubble('user', esc(q.trim()));
    const out = bubble('bot', '<span class="ask-typing" aria-label="Thinking"><i></i><i></i><i></i></span>');
    let text = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader(), dec = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        out.innerHTML = format(text);
        log.scrollTop = log.scrollHeight;
      }
      if (!text.trim()) throw new Error('');
      history.push({ role: 'assistant', content: text });
      save();
    } catch (err) {
      history.pop();
      const msg = (err && err.message && err.message.length < 200) ? err.message : `Sorry, I couldn't answer that right now. You can reach Yasar at ${person.email}.`;
      out.classList.add('ask-msg--err');
      out.innerHTML = format(msg);
    } finally {
      busy = false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = '';
    ask(q);
  });
  chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
  if (location.hash === '#ask') open();
}
