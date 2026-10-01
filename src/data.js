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
    ],
    images: ['/images/projects/apms-1.jpg', '/images/projects/apms-2.jpg', '/images/projects/apms-3.jpg'],
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
    stack: ['Real-time database', 'Analytics', 'AMMS integration', 'AI-assisted analysis'],
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
    images: ['/images/projects/qms-1.jpg', '/images/projects/qms-2.jpg', '/images/projects/qms-3.jpg'],
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
    images: ['/images/projects/tedx-1.jpg', '/images/projects/tedx-2.jpg', '/images/projects/tedx-3.jpg'],
  },
  {
    id: 'smart-monitoring',
    title: 'GarmentFix Smart Monitoring',
    full: 'Smart Monitoring for Industrial Sewing Machines',
    role: 'System Designer & Developer',
    where: 'Industrial IoT',
    summary:
      'Sensor-based monitoring for industrial sewing machines — bringing Industrial IoT and mechatronics to the sewing floor.',
    problem:
      'Software only knows what people tell it. To see the floor as it really runs, the machines themselves need to report.',
    solution:
      'A smart monitoring system built onto industrial sewing machines, combining Industrial IoT and mechatronics so the machine itself becomes a source of data.',
    stack: ['Industrial IoT', 'Mechatronics', 'Smart Manufacturing'],
    features: [
      ['Industrial IoT', 'Connecting industrial sewing machines to a monitoring system.'],
      ['Mechatronics', 'Hardware and software designed together on the machine.'],
      ['Smart Manufacturing', 'A step from manual reporting toward a self-reporting floor.'],
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
    cover: '/images/garments/dress-1.jpg',
    images: ['/images/garments/dress-2.jpg', '/images/garments/dress-3.jpg', '/images/garments/dress-4.jpg'],
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
    cover: '/images/garments/croptop-1.jpg',
    images: ['/images/garments/croptop-2.jpg', '/images/garments/croptop-3.jpg', '/images/garments/croptop-4.jpg'],
  },
];

export const photoCategories = ['Fashion', 'Portrait', 'Event', 'Travel', 'Creative'];

const p = (cat, n, ratio) => ({ cat, src: `/images/photography/${cat.toLowerCase()}-${String(n).padStart(2, '0')}.jpg`, ratio });
export const photos = [
  p('Fashion', 1, '4/5'), p('Portrait', 1, '4/5'), p('Event', 1, '3/2'),
  p('Travel', 1, '3/2'), p('Fashion', 2, '2/3'), p('Creative', 1, '1/1'),
  p('Portrait', 2, '2/3'), p('Event', 2, '3/2'), p('Fashion', 3, '4/5'),
  p('Travel', 2, '2/3'), p('Portrait', 3, '4/5'), p('Event', 3, '4/5'),
  p('Travel', 3, '3/2'), p('Fashion', 4, '3/2'), p('Creative', 2, '4/5'),
];

export const camera = { body: 'Nikon Z6 II', lens: 'NIKKOR Z 24–70mm f/4 S' };

export const education = [
  { years: '2023–2027', place: 'NIFT Jodhpur', what: 'Bachelor of Fashion Technology (BFT), Major · Minor: Communication Design', now: 'Currently in BFT-7' },
  { years: '', place: 'Technical Higher Secondary School', what: 'Class 12 · Higher Secondary', now: 'Under Indian Human Resource Development' },
  { years: '', place: 'Aliya English Medium High School', what: 'Class 10 · Secondary School', now: '' },
];

export const experience = [
  {
    org: 'Brandix Apparel India Pvt. Ltd.',
    role: 'Apparel Internship · Unit-III, Visakhapatnam',
    when: '01 June – 24 July 2026 · 8 weeks',
    body: 'Quality management, process automation and human-resource analytics. Built QMS, APMS and HRMMS during the internship.',
    tags: ['QMS', 'APMS', 'HRMMS'],
  },
  {
    org: 'Arvind Limited',
    role: 'Textile Manufacturing Training',
    when: '16 – 30 June 2025',
    body: 'Hands-on training across woven and knit textile manufacturing.',
    tags: ['Wovens', 'Knits'],
  },
  {
    org: 'TEDxNIFT Jodhpur',
    role: 'Website Designer & Developer',
    when: 'Event platform',
    body: 'Website, volunteer system, seat selection, digital ticketing, My Tickets, database, Cloudinary, testing and deployment.',
    tags: ['Web', 'Firebase', 'Cloudinary'],
  },
  {
    org: 'Adventure & Photography Club, NIFT Jodhpur',
    role: 'President',
    when: '2026–27',
    body: 'Leadership, event planning, team management, photography, creative direction, trip planning and club activities.',
    tags: ['Leadership', 'Photography'],
  },
];

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
  { group: 'Creative & Design', items: ['Canva', 'Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Blender', 'Excel', 'PowerPoint'] },
  { group: 'Photography', items: ['Fashion', 'Portrait', 'Event', 'Travel', 'Photo Editing'] },
  { group: 'Management & Leadership', items: ['Event Management', 'Team Management', 'Project Management', 'Leadership', 'Creative Direction'] },
];
