// Mini-Yasar: a small illustrated character for the assistant.
// Big dark curls, warm brown skin, light stubble, navy hibiscus shirt, measuring tape and a camera.
const SKIN = '#b57552', SKIN_D = '#975a3b', HAIR = '#1c191b', HAIR_L = '#3b3437';
const SHIRT = '#3f4c86', SHIRT_D = '#323d6e', PRINT = '#eef0f6', TAPE = '#f2c94c';

// A five-petal hibiscus from the shirt print
const flower = (x, y, r = 2.3) => `<g fill="${PRINT}">${[0, 72, 144, 216, 288].map((a) => {
  const t = (a * Math.PI) / 180;
  return `<circle cx="${(x + Math.cos(t) * r).toFixed(1)}" cy="${(y + Math.sin(t) * r).toFixed(1)}" r="${(r * 0.72).toFixed(1)}"/>`;
}).join('')}<circle cx="${x}" cy="${y}" r="${(r * 0.5).toFixed(1)}" fill="${SHIRT_D}"/></g>`;

// Hair: one big swept wavy mass, a bumpy curly outline, loose locks falling onto the forehead, tighter sides
const HAIR_MASS = 'M39 58 C33 47 33 33 42 25 C47 16 58 12 68 14 C79 15 88 22 89 33 C91 40 89 49 84 56 C83 50 80 45 75 43 C69 45 62 45 56 43 C50 45 45 49 42 57 Z';
const bumps = [[40, 33, 7], [45, 23, 7.5], [55, 16, 7.5], [66, 14, 7.5], [77, 17, 7], [85, 25, 6.5], [89, 35, 5.5], [36, 44, 5.5], [88, 46, 4.5], [60, 12, 5.5], [50, 19, 6]];
const locks = [
  'M54 42 C50 44 49 49 51.5 52.5 C52.5 49 54.5 46.5 57.5 45.5 Z',
  'M63 43 C60 46 60.5 50.5 63.5 52.5 C63.5 49 65 46.5 68 45.5 Z',
  'M72 42 C71 45.5 72.5 48.5 75.5 49.5 C74.5 47 75 44.5 77 43 Z',
];
const waves = ['M44 30 q4 -4 8 -1 t8 -1', 'M56 22 q4 -4 8 -1 t8 -1', 'M66 30 q4 -4 8 -1 t7 -1', 'M41 42 q3 -3.5 6.5 -1 t6.5 -1', 'M70 23 q3 -3 6 -0.5 t6 -0.5', 'M78 38 q3 -3 6 -0.5'];

export function mini({ wave = false, crop = true } = {}) {
  return `<svg class="mini" viewBox="${crop ? "17 4 90 90" : "0 0 120 120"}" aria-hidden="true">
    <g class="mini-body">
      <path d="M18 121 C18 97 37 86 60 86 C83 86 102 97 102 121 Z" fill="${SHIRT}"/>
      ${flower(31, 104)}${flower(88, 101)}${flower(80, 115, 2.6)}${flower(39, 117, 2)}${flower(95, 113, 1.8)}${flower(24, 116, 1.8)}
      <path d="M51 86 L60 101 L69 86 Z" fill="${SKIN_D}"/>
      <path d="M45 87 L58 101 L51 86 Z" fill="${SHIRT_D}"/><path d="M75 87 L62 101 L69 86 Z" fill="${SHIRT_D}"/>
      <path d="M52 87 C50 97 49 107 48 121 M68 87 C70 97 71 107 72 121" stroke="${TAPE}" stroke-width="5" fill="none"/>
      <path d="M52 87 C50 97 49 107 48 121 M68 87 C70 97 71 107 72 121" stroke="#9a7a1f" stroke-width="5" stroke-dasharray="0.7 3.2" fill="none"/>
      <g class="mini-cam"><rect x="49" y="103" width="22" height="14" rx="3" fill="#18181d"/><rect x="52" y="101" width="7" height="3" rx="1" fill="#18181d"/>
        <circle cx="60" cy="110" r="4.6" fill="#30303a" stroke="#9696a8" stroke-width="1.2"/><circle cx="61.2" cy="108.8" r="1.2" fill="#c9c9d6"/></g>
    </g>
    <g class="mini-head">
      <rect x="53" y="72" width="14" height="16" rx="5" fill="${SKIN_D}"/>
      <circle cx="38.5" cy="58" r="5" fill="${SKIN_D}"/><circle cx="81.5" cy="58" r="5" fill="${SKIN_D}"/>
      <ellipse cx="60" cy="56" rx="21.5" ry="23.5" fill="${SKIN}"/>
      <path d="M43 64 C45 76 53 80 60 80 C67 80 75 76 77 64 C74 72 67 75.5 60 75.5 C53 75.5 46 72 43 64 Z" fill="${HAIR}" opacity=".16"/>
      <g class="mini-hair"><path d="${HAIR_MASS}" fill="${HAIR}"/>${bumps.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${HAIR}"/>`).join('')}
        ${locks.map((d) => `<path d="${d}" fill="${HAIR}"/>`).join('')}
        ${waves.map((d) => `<path d="${d}" stroke="${HAIR_L}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`).join('')}</g>
      <path d="M45 48.5 Q50.5 45.5 56 47.5 M64 47.5 Q69.5 45.5 75 48.5" stroke="${HAIR}" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      <g class="mini-eyes"><g class="mini-pupils">
        <ellipse cx="51" cy="56.5" rx="3" ry="3.7" fill="#24160f"/><ellipse cx="69" cy="56.5" rx="3" ry="3.7" fill="#24160f"/>
        <circle cx="52.1" cy="55.2" r="1" fill="#fff"/><circle cx="70.1" cy="55.2" r="1" fill="#fff"/></g></g>
      <path d="M60.5 58.5 Q58.3 64.5 61.2 65" stroke="${SKIN_D}" stroke-width="1.7" fill="none" stroke-linecap="round"/>
      <path d="M53.5 67.6 Q60 65.4 66.5 67.6" stroke="${HAIR}" stroke-width="1.8" opacity=".5" fill="none" stroke-linecap="round"/>
      <path class="mini-mouth" d="M55 70.5 Q60 73.2 65 70.5" stroke="#5e2a1d" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
    ${wave ? `<g class="mini-wave"><path d="M95 98 C99 92 101 86 102 80" stroke="${SHIRT}" stroke-width="9" stroke-linecap="round" fill="none"/>
      <circle cx="102.5" cy="76" r="5.6" fill="${SKIN}"/><path d="M99.5 71.5 v-3 M102.5 70.5 v-3.4 M105.5 71.5 v-3" stroke="${SKIN}" stroke-width="2.4" stroke-linecap="round"/></g>` : ''}
  </svg>`;
}
