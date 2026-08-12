import type {
  FontFamily,
  ResumeData,
  ResumeSection,
  RoleDefinition,
  SectionType,
  TemplateDefinition,
} from '../types/resume';
import { uid } from '../lib/ids';

export const ACCENT_SWATCHES = [
  { id: 'ink', label: 'Ink', value: '#1a1d23' },
  { id: 'navy', label: 'Navy', value: '#1e3a5f' },
  { id: 'slate', label: 'Slate', value: '#334155' },
  { id: 'forest', label: 'Forest', value: '#1c4532' },
  { id: 'burgundy', label: 'Burgundy', value: '#6b2d3c' },
  { id: 'bronze', label: 'Bronze', value: '#6b4f2a' },
  { id: 'teal', label: 'Teal', value: '#1a4a4f' },
  { id: 'charcoal', label: 'Charcoal', value: '#2d3436' },
];

export const FONT_OPTIONS: { id: FontFamily; label: string; stack: string }[] = [
  { id: 'georgia', label: 'Georgia', stack: 'Georgia, "Source Serif 4", "Times New Roman", serif' },
  { id: 'times', label: 'Times New Roman', stack: '"Times New Roman", Times, "Source Serif 4", serif' },
  { id: 'garamond', label: 'Garamond', stack: '"EB Garamond", Garamond, "Palatino Linotype", serif' },
  { id: 'calibri', label: 'Calibri', stack: 'Carlito, Calibri, "Source Sans 3", "Segoe UI", sans-serif' },
  { id: 'cambria', label: 'Cambria', stack: 'Cambria, "Source Serif 4", Georgia, serif' },
  { id: 'arial', label: 'Arial', stack: 'Arial, "Source Sans 3", Helvetica, sans-serif' },
];

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'apex-classic',
    name: 'Apex Classic',
    tagline: 'Centered, traditional, universally parsed',
    roleLabel: 'Software Developer',
    bestFor: ['Software Developer', 'Backend', 'Full-stack'],
    header: 'centered-classic',
    heading: 'uppercase-tracked',
    skills: 'comma',
    experience: 'title-dates',
    defaultFont: 'times',
    defaultSize: 11,
    defaultSpacing: 'normal',
    defaultMargin: 'normal',
    defaultAccent: '#1a1d23',
    nameSize: 22,
    ruleWeight: 1,
    contactSeparator: '  ·  ',
    headingCase: 'upper',
    description:
      'A conservative single-column letter. Centered identity, tracked uppercase headings, and hairline rules. Safe default for most applicant tracking systems.',
  },
  {
    id: 'cascade-compact',
    name: 'Cascade Compact',
    tagline: 'Left-aligned, dense, recruiter-skimmable',
    roleLabel: 'Software Developer',
    bestFor: ['Software Developer', 'Frontend', 'DevOps'],
    header: 'left-stacked',
    heading: 'title-border',
    skills: 'grouped',
    experience: 'title-dates',
    defaultFont: 'calibri',
    defaultSize: 10.5,
    defaultSpacing: 'compact',
    defaultMargin: 'narrow',
    defaultAccent: '#1e3a5f',
    nameSize: 20,
    ruleWeight: 1.25,
    contactSeparator: '  |  ',
    headingCase: 'title',
    description:
      'Modern compact layout used by high-volume tech screening. Grouped skills and tight spacing keep senior histories on one page without sacrificing parseable text.',
  },
  {
    id: 'harbor-analyst',
    name: 'Harbor Analyst',
    tagline: 'Evidence-first hierarchy for data roles',
    roleLabel: 'Data Analyst',
    bestFor: ['Data Analyst', 'BI', 'Analytics'],
    header: 'left-rule',
    heading: 'title-underline',
    skills: 'grouped',
    experience: 'company-first',
    defaultFont: 'georgia',
    defaultSize: 11,
    defaultSpacing: 'normal',
    defaultMargin: 'normal',
    defaultAccent: '#1e3a5f',
    nameSize: 21,
    ruleWeight: 1.5,
    contactSeparator: '  ·  ',
    headingCase: 'title',
    description:
      'Company-first experience lines and underlined headings make metrics easy to scan. Serif body text stays comfortable for hiring managers who still print packets.',
  },
  {
    id: 'summit-systems',
    name: 'Summit Systems',
    tagline: 'Clear identity block for IT operations',
    roleLabel: 'IT Specialist',
    bestFor: ['IT Support', 'Systems Admin', 'Infrastructure'],
    header: 'split-contact',
    heading: 'uppercase-rule',
    skills: 'pipe',
    experience: 'title-dates',
    defaultFont: 'cambria',
    defaultSize: 11,
    defaultSpacing: 'normal',
    defaultMargin: 'normal',
    defaultAccent: '#2d3436',
    nameSize: 23,
    ruleWeight: 1.75,
    contactSeparator: '  |  ',
    headingCase: 'upper',
    description:
      'Large name, pipe-separated skills, and strong section rules. Built for tickets, environments, and certifications that IT screeners search by keyword.',
  },
  {
    id: 'northstar-brand',
    name: 'Northstar Brand',
    tagline: 'Open leading for marketing narratives',
    roleLabel: 'Marketing',
    bestFor: ['Marketing', 'Content', 'Brand'],
    header: 'letterhead',
    heading: 'smallcaps',
    skills: 'comma',
    experience: 'stacked',
    defaultFont: 'garamond',
    defaultSize: 11.5,
    defaultSpacing: 'relaxed',
    defaultMargin: 'normal',
    defaultAccent: '#6b2d3c',
    nameSize: 24,
    ruleWeight: 0.75,
    contactSeparator: '   ',
    headingCase: 'small',
    description:
      'Letterhead header and small-cap headings give campaigns room to breathe. Still fully text-based — no banners, icons, or multi-column traps.',
  },
  {
    id: 'atlas-revenue',
    name: 'Atlas Revenue',
    tagline: 'Quota-forward, achievement-led',
    roleLabel: 'Sales',
    bestFor: ['Sales', 'Account Executive', 'BDR'],
    header: 'inline-title',
    heading: 'uppercase-tracked',
    skills: 'semicolon',
    experience: 'title-dates',
    defaultFont: 'calibri',
    defaultSize: 11,
    defaultSpacing: 'normal',
    defaultMargin: 'normal',
    defaultAccent: '#6b4f2a',
    nameSize: 20,
    ruleWeight: 1,
    contactSeparator: '  ·  ',
    headingCase: 'upper',
    description:
      'Name and target role share a line so recruiters see the function immediately. Semicolon skill lists and date-aligned roles keep numbers easy to harvest.',
  },
  {
    id: 'meridian-people',
    name: 'Meridian People',
    tagline: 'Warm, formal, HR-readable',
    roleLabel: 'Human Resources',
    bestFor: ['HR', 'People Ops', 'Talent'],
    header: 'centered-classic',
    heading: 'title-underline',
    skills: 'comma',
    experience: 'stacked',
    defaultFont: 'georgia',
    defaultSize: 11,
    defaultSpacing: 'relaxed',
    defaultMargin: 'wide',
    defaultAccent: '#1c4532',
    nameSize: 21,
    ruleWeight: 1,
    contactSeparator: '  ·  ',
    headingCase: 'title',
    description:
      'Centered identity with generous margins. Title-case headings avoid the shouty look while remaining standard tokens for HRIS parsers.',
  },
  {
    id: 'ledger-fiduciary',
    name: 'Ledger Fiduciary',
    tagline: 'Banking-conservative, double-ruled',
    roleLabel: 'Finance',
    bestFor: ['Finance', 'Accounting', 'FP&A'],
    header: 'executive',
    heading: 'centered-uppercase',
    skills: 'pipe',
    experience: 'company-first',
    defaultFont: 'times',
    defaultSize: 10.5,
    defaultSpacing: 'compact',
    defaultMargin: 'normal',
    defaultAccent: '#1a1d23',
    nameSize: 18,
    ruleWeight: 0.6,
    contactSeparator: '  ·  ',
    headingCase: 'upper',
    description:
      'The look of a private-banking bio: smaller name, centered headings, double rules. Dense enough for deal lists without leaving the single-column path.',
  },
  {
    id: 'vector-works',
    name: 'Vector Works',
    tagline: 'Technical, precise, specification-like',
    roleLabel: 'Engineering',
    bestFor: ['Mechanical', 'Civil', 'Electrical'],
    header: 'left-stacked',
    heading: 'accent-left',
    skills: 'grouped',
    experience: 'title-dates',
    defaultFont: 'arial',
    defaultSize: 10.5,
    defaultSpacing: 'compact',
    defaultMargin: 'narrow',
    defaultAccent: '#334155',
    nameSize: 19,
    ruleWeight: 2,
    contactSeparator: '  |  ',
    headingCase: 'upper',
    description:
      'Sans-serif specification sheet. Left accent bars are CSS borders, not images, so the heading text remains the only token a parser needs.',
  },
  {
    id: 'pinnacle-quality',
    name: 'Pinnacle Quality',
    tagline: 'Structured blocks for QA and compliance',
    roleLabel: 'QA / QC',
    bestFor: ['QA', 'QC', 'Compliance'],
    header: 'letterhead',
    heading: 'boxed-rules',
    skills: 'grouped',
    experience: 'company-first',
    defaultFont: 'cambria',
    defaultSize: 11,
    defaultSpacing: 'normal',
    defaultMargin: 'normal',
    defaultAccent: '#1c4532',
    nameSize: 20,
    ruleWeight: 1,
    contactSeparator: '  ·  ',
    headingCase: 'upper',
    description:
      'Headings sit between twin rules, echoing inspection reports. Company-first roles help auditors and hiring managers map employers quickly.',
  },
  {
    id: 'compass-lead',
    name: 'Compass Lead',
    tagline: 'Balanced program and stakeholder view',
    roleLabel: 'Project Manager',
    bestFor: ['Project Manager', 'Program Manager', 'Scrum'],
    header: 'split-contact',
    heading: 'uppercase-rule',
    skills: 'comma',
    experience: 'title-dates',
    defaultFont: 'calibri',
    defaultSize: 11,
    defaultSpacing: 'normal',
    defaultMargin: 'normal',
    defaultAccent: '#1e3a5f',
    nameSize: 21,
    ruleWeight: 1.25,
    contactSeparator: '  |  ',
    headingCase: 'upper',
    description:
      'Contact sits opposite the name for a briefing-doc feel, still in one column of selectable text. Designed around scope, delivery, and stakeholder verbs.',
  },
  {
    id: 'origin-launch',
    name: 'Origin Launch',
    tagline: 'Education and projects first',
    roleLabel: 'Fresher / New Grad',
    bestFor: ['New Grad', 'Intern', 'Career Starter'],
    header: 'left-stacked',
    heading: 'title-border',
    skills: 'comma',
    experience: 'stacked',
    defaultFont: 'georgia',
    defaultSize: 11.5,
    defaultSpacing: 'relaxed',
    defaultMargin: 'normal',
    defaultAccent: '#1e3a5f',
    nameSize: 22,
    ruleWeight: 1,
    contactSeparator: '  ·  ',
    headingCase: 'title',
    description:
      'Larger type and open spacing so internships, coursework, and projects can carry a first resume. Default section order leads with education and projects.',
  },
  {
    id: 'keystone-ops',
    name: 'Keystone Ops',
    tagline: 'Compact executive operations brief',
    roleLabel: 'Operations',
    bestFor: ['Operations', 'Supply Chain', 'Business'],
    header: 'executive',
    heading: 'smallcaps',
    skills: 'semicolon',
    experience: 'title-dates',
    defaultFont: 'times',
    defaultSize: 10.5,
    defaultSpacing: 'compact',
    defaultMargin: 'narrow',
    defaultAccent: '#1a1d23',
    nameSize: 17,
    ruleWeight: 0.75,
    contactSeparator: '  ·  ',
    headingCase: 'small',
    description:
      'A tight executive brief. Narrow margins and small-cap headings keep multi-site operations histories inside two pages.',
  },
  {
    id: 'beacon-service',
    name: 'Beacon Service',
    tagline: 'Labeled contact, relationship-led',
    roleLabel: 'Customer Success',
    bestFor: ['Customer Success', 'Support', 'Account Management'],
    header: 'stacked-labels',
    heading: 'title-underline',
    skills: 'grouped',
    experience: 'stacked',
    defaultFont: 'calibri',
    defaultSize: 11,
    defaultSpacing: 'normal',
    defaultMargin: 'normal',
    defaultAccent: '#1a4a4f',
    nameSize: 20,
    ruleWeight: 1,
    contactSeparator: '   ',
    headingCase: 'title',
    description:
      'Explicit Email / Phone / Location labels help less sophisticated parsers and human readers. Skills stay grouped by practice area.',
  },
  {
    id: 'horizon-neutral',
    name: 'Horizon Neutral',
    tagline: 'The flexible all-role default',
    roleLabel: 'General / Product',
    bestFor: ['Product', 'Career Change', 'Any role'],
    header: 'left-rule',
    heading: 'title-border',
    skills: 'comma',
    experience: 'title-dates',
    defaultFont: 'georgia',
    defaultSize: 11,
    defaultSpacing: 'normal',
    defaultMargin: 'normal',
    defaultAccent: '#1e3a5f',
    nameSize: 20,
    ruleWeight: 1,
    contactSeparator: '  ·  ',
    headingCase: 'title',
    description:
      'A quiet, modern-conservative page. Use it when the role is hybrid, the industry is mixed, or you want the content — not the chrome — to do the work.',
  },
];

export const ROLES: RoleDefinition[] = [
  {
    id: 'software-developer',
    name: 'Software Developer',
    blurb: 'Engineering resumes that survive keyword screens and staff-engineer reads.',
    recommendedTemplateId: 'cascade-compact',
    alternateTemplateIds: ['apex-classic', 'horizon-neutral'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
    sectionTitles: {
      summary: 'Summary',
      experience: 'Experience',
      skills: 'Technical Skills',
      projects: 'Projects',
      education: 'Education',
    },
    expectedHeadings: ['summary', 'experience', 'skills', 'education'],
    usefulKeywords: [
      'javascript',
      'typescript',
      'python',
      'react',
      'node',
      'sql',
      'api',
      'git',
      'testing',
      'cloud',
    ],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    blurb: 'Lead with tools, methods, and quantified business outcomes.',
    recommendedTemplateId: 'harbor-analyst',
    alternateTemplateIds: ['cascade-compact', 'horizon-neutral'],
    defaultSectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    sectionTitles: {
      summary: 'Professional Summary',
      skills: 'Technical Skills',
      experience: 'Experience',
      projects: 'Analytical Projects',
    },
    expectedHeadings: ['summary', 'experience', 'skills', 'education'],
    usefulKeywords: [
      'sql',
      'excel',
      'tableau',
      'python',
      'dashboard',
      'visualization',
      'statistics',
      'etl',
      'reporting',
    ],
  },
  {
    id: 'it-specialist',
    name: 'IT Specialist',
    blurb: 'Environments, tickets, and certifications in a parser-safe stack.',
    recommendedTemplateId: 'summit-systems',
    alternateTemplateIds: ['vector-works', 'apex-classic'],
    defaultSectionOrder: ['summary', 'skills', 'experience', 'certifications', 'education'],
    sectionTitles: {
      skills: 'Technical Skills',
      experience: 'Professional Experience',
      certifications: 'Certifications',
    },
    expectedHeadings: ['summary', 'experience', 'skills', 'certifications'],
    usefulKeywords: [
      'windows',
      'active directory',
      'office 365',
      'networking',
      'troubleshooting',
      'help desk',
      'security',
      'linux',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    blurb: 'Campaign results without graphics that break ATS parsers.',
    recommendedTemplateId: 'northstar-brand',
    alternateTemplateIds: ['horizon-neutral', 'atlas-revenue'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'achievements', 'education'],
    sectionTitles: {
      summary: 'Profile',
      experience: 'Experience',
      skills: 'Skills',
      achievements: 'Selected Results',
    },
    expectedHeadings: ['summary', 'experience', 'skills'],
    usefulKeywords: [
      'campaign',
      'seo',
      'content',
      'analytics',
      'brand',
      'email',
      'social',
      'go-to-market',
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    blurb: 'Quota, pipeline, and territory — written as text, not charts.',
    recommendedTemplateId: 'atlas-revenue',
    alternateTemplateIds: ['compass-lead', 'horizon-neutral'],
    defaultSectionOrder: ['summary', 'experience', 'achievements', 'skills', 'education'],
    sectionTitles: {
      summary: 'Summary',
      experience: 'Professional Experience',
      achievements: 'Selected Achievements',
      skills: 'Skills',
    },
    expectedHeadings: ['summary', 'experience', 'skills'],
    usefulKeywords: [
      'quota',
      'pipeline',
      'crm',
      'negotiation',
      'forecast',
      'account',
      'revenue',
      'prospecting',
    ],
  },
  {
    id: 'hr',
    name: 'Human Resources',
    blurb: 'People operations language that HRIS software can actually read.',
    recommendedTemplateId: 'meridian-people',
    alternateTemplateIds: ['horizon-neutral', 'compass-lead'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'certifications', 'education'],
    sectionTitles: {
      summary: 'Professional Summary',
      experience: 'Experience',
      skills: 'Core Competencies',
    },
    expectedHeadings: ['summary', 'experience', 'skills', 'education'],
    usefulKeywords: [
      'recruiting',
      'employee relations',
      'onboarding',
      'hris',
      'compliance',
      'performance',
      'policy',
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    blurb: 'Conservative structure for banking, FP&A, and accounting screens.',
    recommendedTemplateId: 'ledger-fiduciary',
    alternateTemplateIds: ['keystone-ops', 'apex-classic'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'education', 'certifications'],
    sectionTitles: {
      summary: 'Summary',
      experience: 'Professional Experience',
      skills: 'Technical Skills',
    },
    expectedHeadings: ['summary', 'experience', 'education', 'skills'],
    usefulKeywords: [
      'forecasting',
      'excel',
      'financial modeling',
      'variance',
      'gaap',
      'reconciliation',
      'budget',
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    blurb: 'Specifications, standards, and project scope in a single column.',
    recommendedTemplateId: 'vector-works',
    alternateTemplateIds: ['pinnacle-quality', 'apex-classic'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
    sectionTitles: {
      summary: 'Summary',
      experience: 'Engineering Experience',
      skills: 'Technical Skills',
      projects: 'Projects',
    },
    expectedHeadings: ['summary', 'experience', 'skills', 'education'],
    usefulKeywords: [
      'cad',
      'design',
      'testing',
      'standards',
      'manufacturing',
      'analysis',
      'safety',
      'documentation',
    ],
  },
  {
    id: 'qa-qc',
    name: 'QA / QC',
    blurb: 'Test evidence and quality systems without icon clutter.',
    recommendedTemplateId: 'pinnacle-quality',
    alternateTemplateIds: ['vector-works', 'cascade-compact'],
    defaultSectionOrder: ['summary', 'skills', 'experience', 'certifications', 'education'],
    sectionTitles: {
      summary: 'Summary',
      skills: 'Methods & Tools',
      experience: 'Experience',
      certifications: 'Certifications',
    },
    expectedHeadings: ['summary', 'experience', 'skills'],
    usefulKeywords: [
      'test cases',
      'regression',
      'automation',
      'iso',
      'defect',
      'quality',
      'audit',
      'selenium',
    ],
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    blurb: 'Scope, budget, and stakeholders in standard headings.',
    recommendedTemplateId: 'compass-lead',
    alternateTemplateIds: ['keystone-ops', 'horizon-neutral'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'certifications', 'education'],
    sectionTitles: {
      summary: 'Summary',
      experience: 'Project Experience',
      skills: 'Skills',
      certifications: 'Certifications',
    },
    expectedHeadings: ['summary', 'experience', 'skills'],
    usefulKeywords: [
      'stakeholder',
      'budget',
      'timeline',
      'agile',
      'risk',
      'cross-functional',
      'delivery',
      'pmp',
    ],
  },
  {
    id: 'fresher',
    name: 'Fresher / New Grad',
    blurb: 'Education and projects first — honest, not padded.',
    recommendedTemplateId: 'origin-launch',
    alternateTemplateIds: ['horizon-neutral', 'cascade-compact'],
    defaultSectionOrder: ['summary', 'education', 'projects', 'skills', 'experience', 'certifications'],
    sectionTitles: {
      summary: 'Objective',
      education: 'Education',
      projects: 'Projects',
      skills: 'Skills',
      experience: 'Internships & Experience',
    },
    expectedHeadings: ['education', 'skills', 'projects'],
    usefulKeywords: ['project', 'internship', 'coursework', 'team', 'analysis', 'communication'],
  },
  {
    id: 'customer-success',
    name: 'Customer Success',
    blurb: 'Retention, onboarding, and accounts as readable text.',
    recommendedTemplateId: 'beacon-service',
    alternateTemplateIds: ['atlas-revenue', 'horizon-neutral'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'achievements', 'education'],
    sectionTitles: {
      summary: 'Summary',
      experience: 'Experience',
      skills: 'Skills',
      achievements: 'Selected Results',
    },
    expectedHeadings: ['summary', 'experience', 'skills'],
    usefulKeywords: [
      'retention',
      'onboarding',
      'nps',
      'account',
      'support',
      'escalation',
      'relationship',
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    blurb: 'Process, cost, and throughput without dashboard graphics.',
    recommendedTemplateId: 'keystone-ops',
    alternateTemplateIds: ['compass-lead', 'ledger-fiduciary'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'achievements', 'education'],
    sectionTitles: {
      summary: 'Summary',
      experience: 'Professional Experience',
      skills: 'Core Skills',
    },
    expectedHeadings: ['summary', 'experience', 'skills'],
    usefulKeywords: [
      'process',
      'kpi',
      'vendor',
      'logistics',
      'cost',
      'throughput',
      'sop',
      'continuous improvement',
    ],
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    blurb: 'Discovery and delivery in a template that product orgs actually parse.',
    recommendedTemplateId: 'horizon-neutral',
    alternateTemplateIds: ['compass-lead', 'cascade-compact'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'projects', 'education'],
    sectionTitles: {
      summary: 'Summary',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Selected Products',
    },
    expectedHeadings: ['summary', 'experience', 'skills'],
    usefulKeywords: [
      'roadmap',
      'discovery',
      'stakeholders',
      'metrics',
      'user research',
      'prioritization',
      'agile',
    ],
  },
  {
    id: 'general',
    name: 'General / Career Change',
    blurb: 'A neutral page when the role is hybrid or still taking shape.',
    recommendedTemplateId: 'horizon-neutral',
    alternateTemplateIds: ['apex-classic', 'origin-launch'],
    defaultSectionOrder: ['summary', 'experience', 'skills', 'education', 'projects'],
    sectionTitles: {
      summary: 'Summary',
      experience: 'Experience',
      skills: 'Skills',
    },
    expectedHeadings: ['summary', 'experience', 'skills', 'education'],
    usefulKeywords: ['communication', 'analysis', 'project', 'collaboration', 'problem solving'],
  },
];

const STANDARD_TITLES: Record<SectionType, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
  custom: 'Additional Information',
};

export function emptyPersonal() {
  return {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
  };
}

export function makeSection(type: SectionType, title?: string): ResumeSection {
  const base: ResumeSection = {
    id: uid('sec'),
    type,
    title: title || STANDARD_TITLES[type],
    visible: true,
  };
  switch (type) {
    case 'summary':
      return { ...base, summary: '' };
    case 'experience':
      return { ...base, experience: [] };
    case 'education':
      return { ...base, education: [] };
    case 'skills':
      return { ...base, skills: [{ id: uid('sk'), category: '', items: '' }] };
    case 'projects':
      return { ...base, projects: [] };
    case 'certifications':
      return { ...base, certifications: [] };
    case 'achievements':
      return { ...base, achievements: [] };
    case 'languages':
      return { ...base, languages: [] };
    case 'custom':
      return { ...base, title: title || 'Additional Information', custom: [{ id: uid('cu'), heading: '', text: '' }] };
  }
}

export function createResume(roleId: string, name = 'Untitled resume'): ResumeData {
  const role = ROLES.find((r) => r.id === roleId) || ROLES[ROLES.length - 1];
  const template = TEMPLATES.find((t) => t.id === role.recommendedTemplateId) || TEMPLATES[0];
  const order = [...role.defaultSectionOrder];
  if (!order.includes('languages')) order.push('languages');
  if (!order.includes('achievements')) order.push('achievements');
  if (!order.includes('certifications')) order.push('certifications');

  const sections = order.map((type) => {
    const section = makeSection(type, role.sectionTitles[type]);
    if (type === 'languages' || type === 'achievements' || type === 'certifications') {
      if (!role.defaultSectionOrder.includes(type)) section.visible = false;
    }
    return section;
  });

  const now = new Date().toISOString();
  return {
    id: uid('cv'),
    name,
    createdAt: now,
    updatedAt: now,
    roleId: role.id,
    templateId: template.id,
    settings: {
      fontFamily: template.defaultFont,
      fontSize: template.defaultSize,
      spacing: template.defaultSpacing,
      margin: template.defaultMargin,
      accent: template.defaultAccent,
    },
    personal: emptyPersonal(),
    sections,
    jobDescription: '',
  };
}

export function sampleResume(): ResumeData {
  const resume = createResume('software-developer', 'Alex Rivera — Software Developer');
  resume.personal = {
    fullName: 'Alex Rivera',
    headline: 'Software Developer',
    email: 'alex.rivera@email.com',
    phone: '(415) 555-0148',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/alexrivera',
    website: '',
  };
  resume.sections = resume.sections.map((section) => {
    if (section.type === 'summary') {
      return {
        ...section,
        visible: true,
        summary:
          'Software developer with 6 years building reliable web services and internal tools. Comfortable owning features from design review through production support. Known for clear documentation, measured performance work, and mentoring junior engineers.',
      };
    }
    if (section.type === 'experience') {
      return {
        ...section,
        visible: true,
        experience: [
          {
            id: uid('ex'),
            company: 'Northline Software',
            title: 'Software Developer',
            location: 'San Francisco, CA',
            startDate: 'Mar 2021',
            endDate: '',
            current: true,
            bullets: [
              {
                id: uid('b'),
                text: 'Designed and shipped a billing reconciliation service that cut month-end close time from 4 days to 1.5 days for a 40-person finance team.',
              },
              {
                id: uid('b'),
                text: 'Reduced p95 API latency 32% by adding query indexes, request coalescing, and targeted caching on the accounts service.',
              },
              {
                id: uid('b'),
                text: 'Led weekly design reviews and paired with two junior engineers; both reached independent on-call within two quarters.',
              },
              {
                id: uid('b'),
                text: 'Wrote runbooks and added structured logging that lowered after-hours incident time by about 25%.',
              },
            ],
          },
          {
            id: uid('ex'),
            company: 'Harbor Labs',
            title: 'Junior Software Developer',
            location: 'Oakland, CA',
            startDate: 'Jul 2018',
            endDate: 'Feb 2021',
            current: false,
            bullets: [
              {
                id: uid('b'),
                text: 'Built React and TypeScript interfaces for a patient-scheduling product used by 12 clinic sites.',
              },
              {
                id: uid('b'),
                text: 'Added integration tests around appointment conflicts, reducing related production defects from 9 per quarter to 2.',
              },
              {
                id: uid('b'),
                text: 'Maintained a small Node.js service that synced calendar events with an external EHR API.',
              },
            ],
          },
        ],
      };
    }
    if (section.type === 'skills') {
      return {
        ...section,
        visible: true,
        skills: [
          { id: uid('sk'), category: 'Languages', items: 'TypeScript, JavaScript, Python, SQL' },
          { id: uid('sk'), category: 'Web', items: 'React, Node.js, REST APIs, HTML, CSS' },
          { id: uid('sk'), category: 'Data & Cloud', items: 'PostgreSQL, AWS (S3, Lambda), Git, CI/CD' },
          { id: uid('sk'), category: 'Practices', items: 'Code review, testing, on-call, technical writing' },
        ],
      };
    }
    if (section.type === 'projects') {
      return {
        ...section,
        visible: true,
        projects: [
          {
            id: uid('pr'),
            name: 'Route Ledger',
            link: 'github.com/alexrivera/route-ledger',
            stack: 'TypeScript, PostgreSQL, React',
            startDate: '2023',
            endDate: '2024',
            bullets: [
              {
                id: uid('b'),
                text: 'Personal tool that imports bank CSV files and flags duplicate vendor payments using simple matching rules.',
              },
            ],
          },
        ],
      };
    }
    if (section.type === 'education') {
      return {
        ...section,
        visible: true,
        education: [
          {
            id: uid('ed'),
            school: 'San Jose State University',
            degree: 'B.S.',
            field: 'Computer Science',
            location: 'San Jose, CA',
            startDate: '2014',
            endDate: '2018',
            gpa: '',
            details: 'Coursework: algorithms, databases, operating systems',
          },
        ],
      };
    }
    if (section.type === 'certifications') {
      return {
        ...section,
        visible: false,
        certifications: [
          {
            id: uid('ce'),
            name: 'AWS Certified Developer – Associate',
            issuer: 'Amazon Web Services',
            date: '2023',
            credential: '',
          },
        ],
      };
    }
    return section;
  });
  return resume;
}

export function getTemplate(id: string): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

export function getRole(id: string): RoleDefinition {
  return ROLES.find((r) => r.id === id) || ROLES[ROLES.length - 1];
}

export function fontStack(family: FontFamily): string {
  return FONT_OPTIONS.find((f) => f.id === family)?.stack || FONT_OPTIONS[0].stack;
}
