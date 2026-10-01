// All portfolio content lives here. Image paths point into /public/images —
// drop a file with the same name there and it replaces the placeholder.

export const person = {
  name: 'Yasar C H',
  tagline: ['Fashion Technology', 'Digital Innovation', 'Photography'],
  degree: 'Bachelor of Fashion Technology',
  school: 'NIFT Jodhpur',
  years: '2023–2027',
  semester: 'BFT-7',
  minor: 'Communication Design',
  about:
    'I am a Bachelor of Fashion Technology student at NIFT Jodhpur, interested in combining fashion, technology, digital development and visual storytelling. I enjoy building digital systems, exploring AI-assisted development, working with technology in manufacturing, creating visual content, and managing creative projects and events.',
  signoff: 'Building at the intersection of Fashion, Technology & Visual Storytelling.',
  email: 'chyasar2004@gmail.com',
  location: 'Perinthalmanna, Kerala · NIFT Jodhpur',
  cv: '/Yasar_CH_CV.pdf',
  portrait: '/images/portrait.jpg',
  portraitAlt: '/images/portrait-2.jpg',
  socials: [
    { label: 'GitHub', handle: 'Yasar011', href: 'https://github.com/Yasar011' },
    { label: 'LinkedIn', handle: 'yasar-c-h', href: 'https://www.linkedin.com/in/yasar-c-h-78131b2b6/' },
    { label: 'Instagram', handle: '_y_asar_', href: 'https://www.instagram.com/_y_asar_/' },
  ],
};

export const projects = [
  {
    id: 'apms',
    title: 'APMS',
    full: 'Automatic Problem Management System',
    role: 'System Designer & Full-Stack Developer',
    where: 'Brandix Apparel India · Unit 3',
    summary:
      'A real-time platform that handles machine breakdowns, maintenance and production changeovers across an apparel factory floor.',
    problem:
      'When a sewing machine stops, every minute counts. Breakdowns, maintenance calls and style changeovers were reported by walking, shouting and paper — slow to reach the right engineer and impossible to analyse later.',
    solution:
      'Operators scan a QR code on the machine and raise the problem in seconds. The right engineering department is pushed a notification instantly, and every event is timestamped from call to fix.',
    stack: ['React', 'Tailwind CSS', 'Firebase Realtime Database', 'Firebase Cloud Messaging', 'PWA', 'QR Code', 'JavaScript'],
    scale: [
      { value: '1,486', label: 'machines on the system' },
      { value: '32', label: 'production modules' },
      { value: '4', label: 'factory sections' },
      { value: '4', label: 'engineering departments' },
      { value: '19', label: 'registered users' },
    ],
    features: [
      ['QR machine identity', 'Every machine carries a QR code, so a problem is raised against the exact machine in one scan.'],
      ['Instant push alerts', 'Firebase Cloud Messaging routes each call straight to the responsible engineering department.'],
      ['Changeover tracking', 'Production style changeovers are logged and timed alongside breakdowns.'],
      ['Works like an app', 'Installable PWA that runs on the phones already on the floor.'],
      ['Command Center', 'Factory-wide overview: fleet uptime, machines down, open tickets, techs online and workload by department.'],
      ['Live Monitor', 'Every breakdown with priority and department, assign or re-route in one click, plus a live technician status board.'],
      ['Preventive maintenance', 'A PM scheduler that tracks when each machine was last serviced and raises service tickets before a failure.'],
      ['Mechanic skill matrix', 'Machine-wise skill percentage for every mechanic, used to send the right person to the right machine.'],
      ['Factory Manager', 'Plants, sections, modules and lines with every machine, spares, transfers, bookings and printable QR codes.'],
      ['QMS link', 'Defects found by quality checks raise maintenance tickets straight into APMS (tagged QCM).'],
    ],
    flow: [
      { label: 'Report', nodes: [{ t: 'Scan machine QR', d: 'Every machine carries a QR code. The operator scans it on the floor, with no login needed.' }] },
      { label: 'Ticket', nodes: [{ t: 'Raise the problem', d: 'Breakdown or changeover, with priority and a short description.' }] },
      { label: 'Live data', hub: true, nodes: [{ t: 'Firebase Realtime DB', d: 'Machine status, tickets and every timestamp, synced live to all screens.' }] },
      { label: 'Routing', nodes: [{ t: 'Mechanical' }, { t: 'Technical' }, { t: 'IE' }, { t: 'Quality' }] },
      { label: 'Fix', nodes: [{ t: 'Technician app', d: 'Push alert → accept → fix with a running timer → close or escalate.' }, { t: 'Spare parts', d: 'Part requests go to stores for approval and issue.' }] },
      { label: 'Oversight', nodes: [{ t: 'Admin & factory manager', d: 'Open tickets, techs online, repair logs, PM due, reports; machines, modules and transfers.' }] },
    ],
    live: 'https://garment-fix.vercel.app/',
    repo: 'https://github.com/Yasar011/GarmentFix',
    images: [1, 2, 3, 4, 5].map((n) => `/images/projects/apms-${n}.jpg`),
  },
  {
    id: 'garmentfix-qms',
    title: 'GarmentFix QMS',
    full: 'Real-Time Quality Management System',
    role: 'System Designer & Developer',
    where: 'Brandix Apparel India · Unit 3',
    summary:
      'A paperless quality system for Brandix Unit 3 — inspections, approvals, defect analytics and reports in one real-time platform.',
    problem:
      'Quality checks lived on paper. Each shift produced stacks of inspection sheets that someone re-typed for hours, and management saw the numbers six hours late.',
    solution:
      'Inspectors log end-line, roving and third-party checks directly on a device. Defects flow into live analytics, repeat offenders are flagged automatically, and reports are ready the moment the data lands.',
    stack: ['JavaScript', 'Firebase Realtime Database', 'QR Code', 'PWA', 'Groq AI', 'AMMS integration'],
    impact: [
      { from: '70–80', to: '0', label: 'paper sheets per shift' },
      { from: '3–4 h', to: '0', label: 'manual re-entry per day' },
      { from: '6 h', to: 'Live', label: 'reporting delay' },
    ],
    features: [
      ['End Line Inspection', 'Final checks recorded garment by garment at the end of the line.'],
      ['Roving Inspection', 'Checks taken in-line while production runs.'],
      ['3rd-Party Quality Checking', 'External audits captured in the same system.'],
      ['Approvals Hub', 'Sign-offs routed and recorded in one place.'],
      ['Defect Analytics', 'Live breakdown of defects by type, operation and line.'],
      ['Red Operator Detection', 'Operators with repeated defects are flagged for support.'],
      ['Reports Hub', 'Shift and day reports generated instantly.'],
      ['AMMS + AI analysis', 'Linked with the maintenance system, with AI-assisted analysis of trends.'],
    ],
    flow: [
      { label: 'Setup', nodes: [{ t: 'Admin configures', d: 'Styles, operations, defect library, line rosters and rotation.' }] },
      { label: 'Inspect', nodes: [{ t: 'End Line', d: 'Final check, garment by garment.' }, { t: 'Roving', d: 'In-line spot checks by operator.' }, { t: '3rd Party', d: 'Independent audit stage.' }] },
      { label: 'Live data', hub: true, nodes: [{ t: 'Firebase Realtime DB', d: 'Inspections, defects and rework written the moment they happen.' }] },
      { label: 'Act', nodes: [{ t: 'Red Operator detection', d: 'Flags operators repeating the same defect.' }, { t: 'Approvals hub', d: 'Floor edit requests reviewed by admin.' }, { t: 'AMMS ticket', d: 'Machine-caused defects go to maintenance.' }] },
      { label: 'Report', nodes: [{ t: 'QMS admin dashboard', d: 'Defect analytics, operator analysis, module, style and shift reports, corrective actions.' }] },
      { label: 'Insight', nodes: [{ t: 'QMS Bot (AI)', d: 'Groq-powered analysis that explains trends and answers questions about quality.' }] },
    ],
    floor: [
      ['The sewing floor at Brandix Unit 3, where QMS runs across the production modules.'],
      ['End-line QC logging a check on the phone, with the old paper sheet underneath.'],
      ['Picking the operation and operator to inspect, straight from the module list.'],
      ['Roving QC recording a check at the operator’s machine.'],
      ['Roving inspection on the line at Module 10.1.'],
      ['Fixing a QR code to a machine so every defect links to the exact machine.'],
      ['Tagging machines across the floor during rollout.'],
      ['Walking the team through the defect analytics dashboard.'],
    ].map(([cap], i) => ({ src: `/images/projects/qms-floor-${i + 1}.jpg`, cap })),
    repo: 'https://github.com/Yasar011/GarmentFix',
    images: ['/images/projects/qms-1.jpg', '/images/projects/qms-2.jpg', '/images/projects/qms-3.jpg', '/images/projects/qms-4.jpg'],
  },
  {
    id: 'tedx-nift-jodhpur',
    title: 'TEDxNIFT Jodhpur',
    full: 'Website & Digital Platform',
    role: 'Website Designer & Developer',
    where: 'TEDxNIFT Jodhpur',
    summary:
      'The full digital side of a TEDx event: public website, volunteer recruitment, seat selection and digital tickets.',
    problem:
      'An event run by students needed to recruit volunteers across departments, run interviews and seat an audience — without spreadsheets breaking at the last minute.',
    solution:
      'One platform covers it end to end: volunteers apply and track their interview status, organisers manage departments from a dashboard, and attendees pick a seat and carry their ticket on their phone.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'Cloudinary', 'Vercel'],
    features: [
      ['Volunteer Application', 'Applications collected online, sorted by department.'],
      ['Department Management', 'Each team lead sees and manages only their department.'],
      ['Interview Status', 'Applicants follow their interview progress live.'],
      ['Volunteer Dashboard', 'A home base for every selected volunteer.'],
      ['Seat Selection', 'Attendees choose their own seat on a live map.'],
      ['Digital Ticketing', 'Tickets issued digitally, with a "My Tickets" view.'],
      ['Cloud Image Storage', 'Media served through Cloudinary.'],
      ['Responsive UI', 'Built to work on every phone in the audience.'],
    ],
    live: 'https://apc-movie.vercel.app/',
    images: ['/images/projects/tedx-1.jpg', '/images/projects/tedx-2.jpg', '/images/projects/tedx-3.jpg', '/images/projects/tedx-4.jpg'],
  },
  {
    id: 'smart-monitoring',
    title: 'GarmentFix Smart Monitoring',
    full: 'Smart Monitoring for Industrial Sewing Machines',
    role: 'System Designer & Developer',
    where: 'Industrial IoT',
    summary:
      'A two-board IoT retrofit that lets an industrial sewing machine report its own speed, stitches, heat, vibration and state, live to the cloud and to an andon light on the machine.',
    problem:
      'Software only knows what people tell it. Whether a machine is running, idle, overheating or shaking itself apart stays invisible until someone notices and walks over to report it.',
    solution:
      'An Arduino Nano reads the machine’s encoder and sensors; an ESP32 gateway listens to the machine’s own CAN bus to know when it is on, drives a tower light and LCD at the machine, and logs timestamped data to Firebase every two seconds.',
    stack: ['Arduino Nano', 'ESP32', 'C++', 'CAN bus (TWAI)', 'Firebase Realtime Database', 'MPU6050', 'MAX6675', 'DHT11'],
    scaleTitle: 'By the <span class="serif">numbers.</span>',
    scale: [
      { value: '6', label: 'live signals per machine' },
      { value: '250 ms', label: 'sensor sampling' },
      { value: '2 s', label: 'cloud sync to Firebase' },
      { value: '5 s', label: 'fault watchdog' },
      { value: '2', label: 'boards: Nano + ESP32' },
    ],
    features: [
      ['Speed & direction', 'A quadrature encoder gives RPM and direction; stitches are only counted while sewing forward.'],
      ['Condition sensing', 'Motor temperature (thermocouple), vibration (MPU6050), plus room temperature and humidity.'],
      ['Reads the machine’s CAN bus', 'The ESP32 listens to the sewing machine’s own controller (250 kbps, listen-only) to know if it is ON or OFF.'],
      ['Andon tower light', 'Green running, yellow idle, red + yellow needle change, red for emergency or fault.'],
      ['Operator buttons', 'Needle-change and emergency buttons at the machine, debounced and mutually exclusive.'],
      ['Timestamped cloud log', 'NTP time (IST) on every record; when the machine is off, only room data is sent.'],
      ['Self-check watchdog', 'If the sensor board goes silent for 5 seconds, the gateway halts to SYS_ERROR and says so on the LCD.'],
      ['On-machine LCD', 'A 16×2 display shows live RPM, motor temperature and state, with no app needed.'],
    ],
    flow: [
      { label: 'Sense', nodes: [{ t: 'Encoder', d: 'RPM + direction' }, { t: 'Stitch pulse' }, { t: 'Vibration · MPU6050' }, { t: 'Motor temp · MAX6675' }, { t: 'Room · DHT11' }] },
      { label: 'Sensor node', nodes: [{ t: 'Arduino Nano', d: 'Interrupts and debouncing, packs a CSV line every 250 ms over serial.' }] },
      { label: 'Gateway', hub: true, nodes: [{ t: 'ESP32', d: 'Parses the data, listens to the machine’s CAN bus for ON/OFF, keeps NTP time.' }] },
      { label: 'At the machine', nodes: [{ t: 'Andon tower light' }, { t: '16×2 LCD' }, { t: 'Needle & emergency buttons' }] },
      { label: 'Cloud', nodes: [{ t: 'Firebase Realtime DB', d: 'Timestamped sensor history every 2 s over WiFi.' }] },
      { label: 'Use', nodes: [{ t: 'Live machine data', d: 'Running, idle, stopped and condition trends for maintenance and planning.' }] },
    ],
    images: ['/images/projects/monitoring-1.jpg', '/images/projects/monitoring-2.jpg'],
  },
];

export const garments = [
  {
    id: 'full-length-dress',
    title: "Women's Full-Length Dress",
    note: 'Complete garment development',
    steps: [
      'Design & concept',
      'Pattern making',
      'Fabric cutting',
      'Garment construction',
      'Panel detailing',
      'Sleeve construction',
      'Surface embellishment',
      'Stitching & finishing',
      'Styling & presentation',
    ],
    details: ['Two-tone lilac & plum panels', 'Stand collar with V-notch', 'Flared bell sleeves', 'Hand-applied flower cluster', 'Laced back detail', 'Floor-length flare'],
    cover: '/images/garments/dress-1.jpg',
    images: [2, 3, 4, 5, 6, 7].map((n) => `/images/garments/dress-${n}.jpg`),
  },
  {
    id: 'crop-top-skirt',
    title: 'Contemporary Crop Top & Skirt',
    note: 'Complete garment development',
    steps: [
      'Design & concept',
      'Pattern making',
      'Fabric cutting',
      'Top construction',
      'Sleeve construction',
      'Skirt construction',
      'Panel detailing',
      'Stitching & finishing',
      'Styling & presentation',
    ],
    details: ['Smocked bodice', 'Sheer dotted puff sleeves', 'Ruffled cuffs & tie neckline', 'Lace-up eyelet panels', 'Contrast beige godets', 'Ribbon-tie trims'],
    cover: '/images/garments/croptop-1.jpg',
    images: [2, 3, 4].map((n) => `/images/garments/croptop-${n}.jpg`),
  },
];

// Both garments styled together
export const garmentsTogether = [1, 2, 3, 4, 5, 6].map((n) => `/images/garments/duo-${n}.jpg`);

export const photoCategories = ['Fashion', 'Runway', 'Brand', 'Product', 'Portrait', 'Event', 'Travel', 'Creative'];

const p = (cat, n, ratio, cap) => ({ cat, src: `/images/photography/${cat.toLowerCase()}-${String(n).padStart(2, '0')}.jpg`, ratio, cap });
// Only real photos go here. Add a file to /public/images/photography and a line below.
export const photos = [
  p('Fashion', 1, '3/2'),
  p('Fashion', 2, '2/3'),
  p('Product', 1, '1/1'),
  p('Product', 4, '3/2'),
  p('Product', 2, '1/1'),
  p('Product', 3, '1/1'),
  p('Runway', 1, '3/4'),
  p('Runway', 2, '3/4'),
  p('Runway', 3, '3/4'),
  // Brand shoot for The Artsy Harbour (bag startup)
  p('Brand', 2, '4/5', 'The Artsy Harbour'),
  p('Brand', 1, '4/5', 'The Artsy Harbour'),
  p('Brand', 3, '4/5', 'The Artsy Harbour'),
  // Silent Disco event for NEWME Jodhpur
  p('Event', 1, '4/5', 'NEWME Jodhpur · Silent Disco'),
  p('Event', 2, '4/5', 'NEWME Jodhpur · Silent Disco'),
  p('Event', 3, '4/5', 'NEWME Jodhpur · Silent Disco'),
  p('Event', 4, '4/5', 'NEWME Jodhpur · Silent Disco'),
  p('Event', 5, '4/5', 'NEWME Jodhpur · Silent Disco'),
  p('Event', 6, '4/5', 'NEWME Jodhpur · Silent Disco'),
  p('Event', 7, '4/5', 'NEWME Jodhpur · Silent Disco'),
  p('Event', 8, '4/5', 'NEWME Jodhpur · Silent Disco'),
];

export const camera = { body: 'Nikon Z6 II', lens: 'NIKKOR Z 24–70mm f/4 S' };

export const education = [
  { years: '2023–2027', place: 'National Institute of Fashion Technology (NIFT), Jodhpur', what: 'Bachelor of Fashion Technology (BFT) · Minor: Communication Design', now: 'Currently in BFT-7' },
  { years: '2021–2023', place: 'Technical Higher Secondary School', what: 'Higher Secondary · Physical Science', now: 'Under Indian Human Resource Development' },
  { years: '2010–2021', place: 'Aliya English Medium High School', what: 'Secondary School', now: '' },
];

export const experience = [
  {
    org: 'Brandix Apparel India Pvt. Ltd.',
    role: 'Apparel Internship · Unit-III, Visakhapatnam',
    when: 'June – July 2026 · 8 weeks',
    body: 'Worked on the QMS, APMS and HRMMS projects. Analysed quality workflows, problem reporting, manpower planning, operational performance monitoring and digital transformation initiatives.',
    tags: ['Quality Management', 'Process Automation', 'HR Analytics'],
  },
  {
    org: 'Arvind Limited',
    role: 'Textile Manufacturing Training · Ahmedabad',
    when: 'June 2025 · 16–30 June',
    body: 'Gained hands-on experience in textile manufacturing and production processes across wovens and knits.',
    tags: ['Wovens', 'Knits'],
  },
  {
    org: 'TEDxNIFT Jodhpur',
    role: 'Website Designer & Developer',
    when: 'November 2025',
    body: 'Designed and developed the digital platform using vibe coding and AI-assisted development: website, volunteer system, seat selection, digital ticketing, My Tickets and Cloudinary.',
    tags: ['Website', 'Volunteer System', 'Digital Ticketing', 'Cloudinary'],
  },
  {
    org: 'Adventure & Photography Club, NIFT Jodhpur',
    role: 'President',
    when: '2026–2027',
    body: 'Led the club, organised events, planned trips and managed team activities.',
    tags: ['Leadership', 'Event Planning', 'Team Management', 'Photography', 'Creative Direction', 'Trip Planning'],
  },
];

export const focusAreas = ['Web Development', 'UI/UX Design', 'Photography', 'Video Editing', 'Fashion Technology'];
export const tools = ['HTML / CSS / JavaScript', 'Firebase', 'GitHub', 'Vercel', 'Canva', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe Lightroom', 'Adobe Premiere Pro', 'Microsoft Office'];
export const languages = ['Malayalam', 'English', 'Hindi'];

export const events = ['TEDxNIFT Jodhpur', 'Spectrum 2026 — VIBHRAM', 'Adventure & Photography Club'];

export const certificates = [
  { title: "Chintan Shivir & Directors' Conclave 2026", detail: 'Social media coverage. Signed by Ms. Tanu Kashyap, IAS, Director General, NIFT.' },
  { title: 'National Service Scheme (NSS)', detail: 'Two years of service · 240 hours.' },
  { title: 'Work Experience Fair — Electronics', detail: 'Grade A.' },
  { title: 'Artisan Awareness Workshop', detail: 'Certificate of Volunteering, NIFT Jodhpur.' },
];

export const recommendations = [
  { name: 'Mr. Amit Patil', title: 'Principal Design Manager, Microsoft', about: 'Recommends Yasar for his technical expertise, creative vision and contribution to TEDxNIFT Jodhpur.' },
  { name: 'Mr. Narpath Raman', title: 'Mentalist & Mind Reader', about: 'Recommends Yasar for his professionalism, dedication and technical contribution.' },
];

export const skills = [
  { group: 'Digital & Technology', items: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'Vercel', 'Cloudinary', 'GitHub', 'Web Development', 'AI Tools', 'Vibe Coding', 'n8n'] },
  { group: 'Fashion Tech & Manufacturing', items: ['TukaTech', 'TukaCard', 'FastReact', 'TimeSSD', 'Digital Quality Systems', 'Industrial IoT', 'Process Automation'] },
  { group: 'Creative & Design', items: ['Canva', 'Photoshop', 'Illustrator', 'Lightroom', 'Premiere Pro', 'After Effects', 'Blender', 'Excel', 'PowerPoint'] },
  { group: 'Photography', items: ['Fashion', 'Portrait', 'Event', 'Travel', 'Photo Editing'] },
  { group: 'Management & Leadership', items: ['Event Management', 'Team Management', 'Project Management', 'Leadership', 'Creative Direction'] },
];
