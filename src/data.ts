export const profile = {
  name: 'Fareed Sokkar',
  role: 'Senior Full Stack Engineer',
  photo: '/fareed.webp',
  phone: '+972 52-816-4760',
  email: 'fareed.sokkar@gmail.com',
  linkedin: 'https://www.linkedin.com/in/', // TODO: add your LinkedIn URL
  github: 'https://github.com/',            // TODO: add your GitHub URL
  summary:
    'I build the billing and payment systems behind cloud-native SaaS platforms: event-driven, multi-tenant, multi-region, and safe to retry. 6+ years across TypeScript, Java, Python and AWS.',
}

export const achievements = [
  { big: '12×', text: 'the throughput of the legacy core system, from a telecom fulfillment solution I engineered.' },
  { big: '4.5h → 15m', text: 'billing processing time after re-engineering a legacy billing system, at lower cost.' },
  { big: '#1', text: 'Professional Team Member, awarded by the OSS division for outstanding contributions.' },
]

export const jobs = [
  {
    when: '2024 – Present',
    title: 'Senior Full Stack Engineer (Backend-Focused)',
    org: 'ConnectX R&D, Amdocs · Money R&D Team',
    stack: ['TypeScript', 'Python', 'AWS', 'Terraform', 'Nest.js', 'React.js', 'MongoDB', 'Docker'],
    points: [
      'Develop end-to-end billing and payment capabilities across prepaid and postpaid models, with integrations to multiple payment and billing processors.',
      'Design cloud-native, event-driven microservices for a multi-tenant, multi-region SaaS platform, focused on idempotent transactions, fault tolerance and recovery.',
      'Own solution design across REST APIs, data models, backend services, AWS infrastructure (EventBridge, SQS, SNS, IaC) and UI components.',
      'Build AI agents with Cursor-assisted workflows to automate infrastructure, deployments, functional testing and performance/stress testing.',
      'Maintain a customer-facing knowledge hub on feature enablement, configuration, integration and operations.',
    ],
  },
  {
    when: '2021 – 2024',
    title: 'Experienced Software Developer',
    org: 'SES / T-Mobile (Delivery), Amdocs',
    stack: ['Java', 'JavaScript', 'Node.js', 'Spring Boot', 'React.js', 'Kubernetes', 'Docker', 'Postgres'],
    points: ['Delivered production features for a major US telecom customer on a Java, Node.js and React stack running on Kubernetes.'],
  },
  {
    when: '2020 – 2021',
    title: 'Junior Implementation Developer',
    org: 'UXA System, Content Square X Galil Software',
    stack: ['Git', 'GitHub', 'JavaScript', 'React.js', 'jQuery'],
    points: ['R&D and support work on the UXA system.'],
  },
]

export const skills = [
  { group: 'Languages', items: ['TypeScript', 'Java', 'JavaScript', 'Python'] },
  { group: 'Frameworks', items: ['React.js', 'Nest.js', 'Node.js', 'Spring Boot'] },
  { group: 'DevOps & Cloud', items: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Maven'] },
  { group: 'Databases', items: ['PostgreSQL', 'MongoDB'] },
]

export const more = [
  { k: 'Education', v: 'B.Sc. Software Engineering, Braude College, Karmiel' },
  { k: 'Volunteering', v: 'Technical Mentor since 2021: Tsofen-Tashbik, Kav-Mashve and hackathons' },
  { k: 'Languages', v: 'Arabic (mother tongue), English (fluent), Hebrew (high level)' },
]
