// Smart Monitoring: animated wiring diagram (pin map from the verified v5 drawing)
// and a live safety-state ladder with an andon tower and the on-machine LCD.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const A = '#22c3d0'; // Node A side (Uno)
const B = '#f5873a'; // Node B side (ESP32)

const UNO = { x: 300, y: 56, w: 120, h: 340 };
const ESP = { x: 545, y: 56, w: 210, h: 440 };

// [label, sub, y-top, height, pins: [wireLabel, pinLabel, y]]
const sensors = [
  ['MPU6050', 'I²C · vibration', 70, 80, [['SDA', 'A4', 90], ['SCL', 'A5', 130]]],
  ['MAX6675', 'SPI + K-type probe', 160, 110, [['DO', 'D12', 175], ['CS', 'D10', 215], ['CLK', 'D13', 255]]],
  ['DHT11', 'room temp / humidity', 280, 40, [['DATA', 'D7', 300]]],
  ['RPM sensor', 'shaft pulses', 330, 40, [['SIGNAL', 'D2', 350]]],
];
const outputs = [
  ['SN65HVD230 CAN', 'to machine ECU, listen-only', 70, 80, [['CRX', 'GPIO4', 90], ['CTX', 'GPIO5', 130]]],
  ['LCD 16 × 2 (I²C)', 'on the machine', 160, 80, [['SDA', 'GPIO21', 180], ['SCL', 'GPIO22', 220]]],
  ['Needle-change button', 'INPUT_PULLUP', 248, 36, [['IN', 'GPIO32', 266]]],
  ['Emergency-stop button', 'INPUT_PULLUP', 292, 36, [['IN', 'GPIO33', 310]]],
  ['Andon LEDs', 'green 25 · yellow 26 · red 27', 338, 100, [['G', 'GPIO25', 355], ['Y', 'GPIO26', 388], ['R', 'GPIO27', 421]]],
  ['Opto-isolated relay', 'cuts machine power', 448, 40, [['CTRL', 'per firmware', 468]]],
];

const box = (x, y, w, h, t, sub, color) => `<g class="wr-box">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#15151c" stroke="${color}" stroke-opacity=".55"/>
  <text x="${x + 14}" y="${y + Math.min(h / 2, 28) + (sub ? -2 : 5)}" class="wr-t">${t}</text>
  ${sub ? `<text x="${x + 14}" y="${y + Math.min(h / 2, 28) + 15}" class="wr-s">${sub}</text>` : ''}
</g>`;

export function wiringSVG() {
  let wires = '', pins = '', boxes = '';
  sensors.forEach(([t, sub, y, h, ps]) => {
    boxes += box(20, y, 210, h, t, sub, A);
    ps.forEach(([wl, pl, py]) => {
      wires += `<path class="wr-wire" data-dir="in" d="M230 ${py} H${UNO.x}" stroke="${A}"/>`;
      pins += `<text x="265" y="${py - 6}" class="wr-l" text-anchor="middle">${wl}</text>
        <circle cx="${UNO.x}" cy="${py}" r="4.5" fill="${A}"/><text x="${UNO.x + 12}" y="${py + 4}" class="wr-p">${pl}</text>`;
    });
  });
  outputs.forEach(([t, sub, y, h, ps]) => {
    boxes += box(805, y, 195, h, t, sub, B);
    ps.forEach(([wl, pl, py]) => {
      wires += `<path class="wr-wire" data-dir="out" d="M${ESP.x + ESP.w} ${py} H805" stroke="${B}"/>`;
      pins += `<text x="780" y="${py - 6}" class="wr-l" text-anchor="middle">${wl}</text>
        <circle cx="${ESP.x + ESP.w}" cy="${py}" r="4.5" fill="${B}"/><text x="${ESP.x + ESP.w - 12}" y="${py + 4}" class="wr-p" text-anchor="end">${pl}</text>`;
    });
  });
  // UART link + shared ground between the boards
  const ux = UNO.x + UNO.w, ex = ESP.x;
  wires += `<path class="wr-wire wr-uart" data-dir="link" d="M${ux} 215 H${ex}" stroke="${B}"/>
    <path class="wr-wire wr-gnd" d="M${ux} 255 H${ex}" stroke="#8b8b99" stroke-dasharray="6 6"/>`;
  pins += `<circle cx="${ux}" cy="215" r="4.5" fill="${B}"/><text x="${ux - 12}" y="219" class="wr-p" text-anchor="end">TX (D1)</text>
    <circle cx="${ux}" cy="255" r="4.5" fill="#8b8b99"/><text x="${ux - 12}" y="259" class="wr-p" text-anchor="end">GND</text>
    <circle cx="${ex}" cy="215" r="4.5" fill="${B}"/><text x="${ex + 12}" y="219" class="wr-p">GPIO16 (RX2)</text>
    <circle cx="${ex}" cy="255" r="4.5" fill="#8b8b99"/><text x="${ex + 12}" y="259" class="wr-p">GND</text>
    <text x="${(ux + ex) / 2}" y="205" class="wr-l" text-anchor="middle">UART · 9600 baud</text>
    <text x="${(ux + ex) / 2}" y="276" class="wr-l" text-anchor="middle">shared ground</text>`;

  return `<svg class="wiring" viewBox="0 0 1010 510" role="img" aria-label="Wiring diagram: sensors to Arduino Uno, UART to ESP32, ESP32 to CAN transceiver, LCD, buttons, andon LEDs and relay">
    <g class="wr-boards">
      <rect x="${UNO.x}" y="${UNO.y}" width="${UNO.w}" height="${UNO.h}" rx="14" fill="#101a1f" stroke="${A}" stroke-width="2"/>
      <text x="${UNO.x + UNO.w / 2}" y="${UNO.y - 14}" class="wr-h" fill="${A}" text-anchor="middle">ARDUINO UNO</text>
      <rect x="${ESP.x}" y="${ESP.y}" width="${ESP.w}" height="${ESP.h}" rx="14" fill="#1f160f" stroke="${B}" stroke-width="2"/>
      <text x="${ESP.x + ESP.w / 2}" y="${ESP.y - 14}" class="wr-h" fill="${B}" text-anchor="middle">ESP32 DEVKIT</text>
    </g>
    <g class="wr-wires">${wires}</g>
    <g class="wr-pulses"></g>
    ${boxes}
    <g class="wr-pins">${pins}</g>
  </svg>`;
}

export function statesHTML(states) {
  return `<div class="ladder" data-ladder>
    <ol class="ladder-list">${states.map((s, i) => `<li><button type="button" data-i="${i}">
      <span class="mono">${i + 1}</span><b>${s.id.replace('_', ' ')}</b><span class="dim">${s.when}</span></button></li>`).join('')}</ol>
    <div class="ladder-rig" aria-live="polite">
      <div class="tower" aria-hidden="true"><i class="lamp r"></i><i class="lamp y"></i><i class="lamp g"></i><span class="pole"></span></div>
      <div class="lcd" aria-label="On-machine LCD"><span class="lcd-1"></span><span class="lcd-2"></span></div>
      <p class="ladder-note">Checked top to bottom: the first match wins, so a real fault can never be hidden by a machine that otherwise looks fine.</p>
    </div>
  </div>`;
}

export function initMonitor({ reduce, states }) {
  const svg = document.querySelector('.wiring');
  if (svg) {
    const wires = [...svg.querySelectorAll('.wr-wire')];
    wires.forEach((w) => { const L = w.getTotalLength(); w.style.strokeDasharray = w.classList.contains('wr-gnd') ? '6 6' : `${L} ${L}`; if (!w.classList.contains('wr-gnd')) w.style.strokeDashoffset = reduce ? 0 : L; });
    if (!reduce) {
      gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%' } })
        .from(svg.querySelectorAll('.wr-boards > *'), { opacity: 0, duration: 0.6, stagger: 0.05 })
        .from(svg.querySelectorAll('.wr-box'), { opacity: 0, x: (i, el) => (el.querySelector('rect').getAttribute('x') < 300 ? -20 : 20), duration: 0.6, stagger: 0.05, ease: 'expo.out' }, 0.1)
        .to(wires.filter((w) => !w.classList.contains('wr-gnd')), { strokeDashoffset: 0, duration: 0.7, stagger: 0.04, ease: 'power2.inOut' }, 0.4)
        .from(svg.querySelectorAll('.wr-pins > *'), { opacity: 0, duration: 0.4, stagger: 0.01 }, 0.9)
        .call(() => startPulses(svg, wires));
    }
  }

  const lad = document.querySelector('[data-ladder]');
  if (lad && states) {
    const btns = [...lad.querySelectorAll('.ladder-list button')];
    const lamps = { r: lad.querySelector('.lamp.r'), y: lad.querySelector('.lamp.y'), g: lad.querySelector('.lamp.g') };
    const l1 = lad.querySelector('.lcd-1'), l2 = lad.querySelector('.lcd-2'), lcd = lad.querySelector('.lcd');
    let i = 3, timer = null;
    const show = (k) => {
      i = k; const s = states[k];
      btns.forEach((b, j) => b.classList.toggle('is-on', j === k));
      Object.entries(lamps).forEach(([c, el]) => el.classList.toggle('on', s.lamps.includes(c)));
      l1.textContent = s.lcd[0]; l2.textContent = s.lcd[1];
      lcd.classList.toggle('dim', s.id === 'MACHINE_OFF');
      lcd.classList.toggle('alert', s.id === 'SYS_ERROR' || s.id === 'EMERGENCY');
    };
    const order = [5, 3, 4, 2, 3, 1, 0, 3]; let step = 0;
    const auto = () => { timer = setInterval(() => { step = (step + 1) % order.length; show(order[step]); }, 2400); };
    btns.forEach((b) => b.addEventListener('click', () => { clearInterval(timer); show(+b.dataset.i); }));
    show(3);
    if (!reduce) ScrollTrigger.create({ trigger: lad, start: 'top 80%', end: 'bottom top', onToggle: (st) => { clearInterval(timer); if (st.isActive) auto(); } });
  }
}

// Data pulses travelling along the wires: sensors → Uno → ESP32 → outputs
function startPulses(svg, wires) {
  const g = svg.querySelector('.wr-pulses');
  const ns = 'http://www.w3.org/2000/svg';
  wires.filter((w) => w.dataset.dir).forEach((w, k) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('r', w.dataset.dir === 'link' ? 5 : 3.5);
    c.setAttribute('fill', w.getAttribute('stroke'));
    c.setAttribute('class', 'wr-dot');
    const m = document.createElementNS(ns, 'animateMotion');
    m.setAttribute('dur', w.dataset.dir === 'link' ? '1.1s' : '1.6s');
    m.setAttribute('repeatCount', 'indefinite');
    m.setAttribute('begin', `${(k * 0.23) % 1.6}s`);
    m.setAttribute('path', w.getAttribute('d'));
    c.appendChild(m);
    g.appendChild(c);
  });
}
