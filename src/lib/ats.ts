import { getRole, getTemplate } from '../data/catalog';
import type { ATSIssue, ATSReport, JDMatchReport, ResumeData, ResumeSection } from '../types/resume';

const STANDARD_HEADINGS = new Set([
  'summary',
  'professional summary',
  'profile',
  'objective',
  'experience',
  'professional experience',
  'work experience',
  'employment',
  'project experience',
  'engineering experience',
  'internships & experience',
  'education',
  'skills',
  'technical skills',
  'core competencies',
  'core skills',
  'methods & tools',
  'projects',
  'analytical projects',
  'selected products',
  'certifications',
  'achievements',
  'selected achievements',
  'selected results',
  'languages',
  'additional information',
]);

const STOP = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'you', 'are', 'was', 'were',
  'will', 'have', 'has', 'had', 'not', 'but', 'our', 'their', 'they', 'them', 'who', 'what',
  'when', 'where', 'which', 'into', 'onto', 'over', 'under', 'about', 'across', 'after',
  'before', 'between', 'within', 'without', 'using', 'used', 'use', 'also', 'more', 'than',
  'such', 'other', 'including', 'include', 'ability', 'able', 'strong', 'excellent', 'good',
  'great', 'high', 'low', 'new', 'work', 'working', 'team', 'role', 'job', 'position',
  'candidate', 'required', 'requirements', 'preferred', 'plus', 'must', 'should', 'etc',
  'years', 'year', 'experience', 'experiences', 'skills', 'skill', 'knowledge', 'looking',
  'seeking', 'join', 'company', 'we', 'us', 'or', 'an', 'a', 'to', 'of', 'in', 'on', 'at',
  'as', 'by', 'be', 'is', 'it', 'its', 'if', 'can', 'may', 'per', 'via', 'all', 'any',
]);

const FILLER = [
  'hardworking',
  'motivated',
  'results-driven',
  'results driven',
  'go-getter',
  'synergy',
  'passionate',
  'dynamic',
  'self-starter',
  'think outside the box',
  'rockstar',
  'ninja',
  'guru',
  'best of breed',
];

function flatten(resume: ResumeData): string {
  const chunks: string[] = [];
  const p = resume.personal;
  chunks.push(p.fullName, p.headline, p.email, p.phone, p.location, p.linkedin, p.github, p.website);
  for (const s of resume.sections) {
    if (!s.visible) continue;
    chunks.push(s.title);
    if (s.summary) chunks.push(s.summary);
    s.experience?.forEach((e) => {
      if (e.hidden) return;
      chunks.push(e.company, e.title, e.location, e.startDate, e.endDate);
      e.bullets.forEach((b) => chunks.push(b.text));
    });
    s.education?.forEach((e) => {
      if (e.hidden) return;
      chunks.push(e.school, e.degree, e.field, e.location, e.details, e.gpa);
    });
    s.skills?.forEach((g) => chunks.push(g.category, g.items));
    s.projects?.forEach((pjt) => {
      if (pjt.hidden) return;
      chunks.push(pjt.name, pjt.stack, pjt.link);
      pjt.bullets.forEach((b) => chunks.push(b.text));
    });
    s.certifications?.forEach((c) => chunks.push(c.name, c.issuer, c.credential));
    s.achievements?.forEach((a) => chunks.push(a.title, a.description));
    s.languages?.forEach((l) => chunks.push(l.name, l.level));
    s.custom?.forEach((c) => chunks.push(c.heading, c.text));
  }
  return chunks.filter(Boolean).join('\n');
}

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9+#./\-\s]/g, ' ')
    .split(/[\s,/|;]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1);
}

function wordCount(text: string) {
  return words(text).length;
}

function hasEmail(value: string) {
  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value);
}

function hasPhone(value: string) {
  return /(\+?\d[\d\s().-]{7,}\d)/.test(value);
}

function visibleOf(resume: ResumeData, type: ResumeSection['type']) {
  return resume.sections.find((s) => s.type === type && s.visible);
}

function estimatePages(resume: ResumeData, text: string) {
  const wc = wordCount(text);
  const spacing = resume.settings.spacing === 'compact' ? 0.88 : resume.settings.spacing === 'relaxed' ? 1.14 : 1;
  const margin = resume.settings.margin === 'narrow' ? 0.92 : resume.settings.margin === 'wide' ? 1.12 : 1;
  const size = resume.settings.fontSize / 11;
  const estimate = (wc / 460) * spacing * margin * size;
  return Math.max(0.4, Math.round(estimate * 10) / 10);
}

export function analyzeATS(resume: ResumeData): ATSReport {
  const issues: ATSIssue[] = [];
  const text = flatten(resume);
  const wc = wordCount(text);
  const pages = estimatePages(resume, text);
  const role = getRole(resume.roleId);
  const template = getTemplate(resume.templateId);
  const p = resume.personal;

  // Parse / identity
  if (!p.fullName.trim()) {
    issues.push({
      id: 'name',
      severity: 'block',
      category: 'parse',
      title: 'Missing full name',
      detail: 'Most ATS profiles are keyed to a candidate name extracted from the top of the document.',
      suggestion: 'Add your legal or professional name in Personal information. Keep it as plain text, not a logo.',
    });
  } else if (p.fullName.trim().split(/\s+/).length < 2) {
    issues.push({
      id: 'name-parts',
      severity: 'warn',
      category: 'parse',
      title: 'Name looks incomplete',
      detail: 'A single token is sometimes stored as a first name with an empty last name.',
      suggestion: 'Use at least a first and last name unless you professionally use a single name.',
    });
  }

  if (!hasEmail(p.email)) {
    issues.push({
      id: 'email',
      severity: 'block',
      category: 'parse',
      title: 'Missing or invalid email',
      detail: 'Recruiters and ATS records almost always require a reachable email address.',
      suggestion: 'Enter a standard address such as name@domain.com. Avoid images or “email me” buttons.',
    });
  }

  if (!hasPhone(p.phone)) {
    issues.push({
      id: 'phone',
      severity: 'warn',
      category: 'complete',
      title: 'Phone number missing',
      detail: 'Many workflows still call or SMS shortlisted candidates.',
      suggestion: 'Add a phone number with country or area code, as plain digits and separators.',
    });
  }

  if (!p.location.trim()) {
    issues.push({
      id: 'location',
      severity: 'info',
      category: 'complete',
      title: 'No location listed',
      detail: 'Location is a common ATS filter even for hybrid roles.',
      suggestion: 'Add city and region or “Remote — Time zone”. Do not put it only in a header graphic.',
    });
  }

  const contactBits = [p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter((x) => x.trim());
  if (contactBits.length >= 6) {
    issues.push({
      id: 'contact-crowd',
      severity: 'info',
      category: 'read',
      title: 'Contact line is crowded',
      detail: 'Very long contact rows can wrap awkwardly and confuse weaker parsers.',
      suggestion: 'Keep 3–5 contact fields. Prefer email, phone, city, and one professional profile.',
    });
  }

  // Completeness
  for (const expected of role.expectedHeadings) {
    const section = visibleOf(resume, expected as ResumeSection['type']);
    if (!section) {
      issues.push({
        id: `missing-${expected}`,
        severity: expected === 'experience' || expected === 'education' ? 'warn' : 'info',
        category: 'complete',
        title: `Recommended section hidden: ${expected}`,
        detail: `${role.name} resumes are usually screened for a visible ${expected} section.`,
        suggestion: `Turn the ${expected} section back on, or rename a custom section to a standard heading. Do not invent content to fill it.`,
      });
    }
  }

  const exp = visibleOf(resume, 'experience');
  const visibleJobs = exp?.experience?.filter((e) => !e.hidden && (e.company || e.title)) || [];
  if (exp && visibleJobs.length === 0 && role.id !== 'fresher') {
    issues.push({
      id: 'no-jobs',
      severity: 'warn',
      category: 'complete',
      title: 'Experience section is empty',
      detail: 'An empty Experience heading can look unfinished and wastes a standard parse field.',
      suggestion: 'Add real roles, internships, or contract work. If you are a new grad, hide Experience and lead with Education and Projects.',
    });
  }

  visibleJobs.forEach((job, i) => {
    if (!job.title.trim() || !job.company.trim()) {
      issues.push({
        id: `job-id-${i}`,
        severity: 'warn',
        category: 'parse',
        title: 'Role is missing a title or employer',
        detail: 'ATS job history usually maps to employer + title + dates.',
        suggestion: 'Fill both the job title and the organization name for every visible role.',
      });
    }
    if (!job.startDate.trim()) {
      issues.push({
        id: `job-dates-${i}`,
        severity: 'warn',
        category: 'parse',
        title: `Missing start date at ${job.company || 'a role'}`,
        detail: 'Date ranges help parsers order employment and help humans spot gaps.',
        suggestion: 'Use a consistent format such as “Mar 2021”. Leave the end date blank and check Current if you are still there.',
      });
    }
    const bullets = job.bullets.map((b) => b.text.trim()).filter(Boolean);
    if (bullets.length === 0) {
      issues.push({
        id: `job-bullets-${i}`,
        severity: 'warn',
        category: 'content',
        title: `No bullets under ${job.title || 'a role'}`,
        detail: 'A title without evidence is hard for both keyword screens and recruiters.',
        suggestion: 'Add 2–5 bullets describing real work. Prefer verb + scope + result. Do not invent metrics.',
      });
    } else if (bullets.some((b) => b.length < 28)) {
      issues.push({
        id: `job-short-${i}`,
        severity: 'info',
        category: 'content',
        title: `Very short bullet under ${job.title || 'a role'}`,
        detail: 'One- or two-word bullets rarely survive keyword or human scans.',
        suggestion: 'Expand thin bullets with tools, scope, or a truthful outcome — or delete them.',
      });
    }
  });

  const edu = visibleOf(resume, 'education');
  const schools = edu?.education?.filter((e) => !e.hidden && (e.school || e.degree)) || [];
  if (role.id === 'fresher' && schools.length === 0) {
    issues.push({
      id: 'edu-required',
      severity: 'warn',
      category: 'complete',
      title: 'Education is empty',
      detail: 'New-grad screens almost always require a school and credential.',
      suggestion: 'Add your degree, school, and graduation date. Coursework is optional and should be real.',
    });
  }

  const skills = visibleOf(resume, 'skills');
  const skillText = skills?.skills?.map((g) => g.items).join(' ') || '';
  const skillTokens = skillText
    .split(/[,;/|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!skills || skillTokens.length < 4) {
    issues.push({
      id: 'skills-thin',
      severity: 'warn',
      category: 'complete',
      title: 'Skills list is thin',
      detail: 'Skill sections are a primary keyword bag for many ATS configurations.',
      suggestion: 'List tools and methods you can defend in an interview. Group them if helpful. Never add a skill you have not used.',
    });
  }
  if (skillTokens.length > 36) {
    issues.push({
      id: 'skills-long',
      severity: 'info',
      category: 'read',
      title: 'Skills list is very long',
      detail: 'Long undifferentiated lists look like keyword stuffing to recruiters.',
      suggestion: 'Keep the skills you would happily be tested on. Group the rest or remove dated tools.',
    });
  }

  const summary = visibleOf(resume, 'summary')?.summary?.trim() || '';
  if (!summary) {
    issues.push({
      id: 'summary-missing',
      severity: 'info',
      category: 'complete',
      title: 'No summary yet',
      detail: 'A short plain-text summary helps humans and gives parsers extra keywords in context.',
      suggestion: 'Write 2–4 sentences about the role you want and the work you have actually done. Skip slogans.',
    });
  } else if (summary.length > 700) {
    issues.push({
      id: 'summary-long',
      severity: 'info',
      category: 'read',
      title: 'Summary is long',
      detail: 'Recruiters often skip a first paragraph that reads like a cover letter.',
      suggestion: 'Aim for 40–80 words. Move evidence into Experience bullets.',
    });
  }

  const lower = text.toLowerCase();
  FILLER.forEach((phrase) => {
    if (lower.includes(phrase)) {
      issues.push({
        id: `filler-${phrase}`,
        severity: 'info',
        category: 'content',
        title: `Filler phrase: “${phrase}”`,
        detail: 'Generic praise words rarely match a job description and can weaken an otherwise specific page.',
        suggestion: 'Replace the phrase with a concrete responsibility or result you can stand behind.',
      });
    }
  });

  if (wc < 120) {
    issues.push({
      id: 'thin',
      severity: 'warn',
      category: 'content',
      title: 'Resume is very short',
      detail: `About ${wc} words. Thin files often fail both keyword coverage and human credibility checks.`,
      suggestion: 'Add real experience, projects, or coursework. Do not pad with adjectives or unused tools.',
    });
  } else if (wc > 900) {
    issues.push({
      id: 'dense',
      severity: 'info',
      category: 'read',
      title: 'Resume is dense',
      detail: `About ${wc} words. Many recruiters stop after the first page.`,
      suggestion: 'Hide older roles, shorten bullets, or tighten spacing. Prefer one focused page unless seniority requires two.',
    });
  }

  if (pages > 2.15) {
    issues.push({
      id: 'pages',
      severity: 'warn',
      category: 'read',
      title: 'Likely longer than two pages',
      detail: `Estimated length is about ${pages.toFixed(1)} pages at the current type settings.`,
      suggestion: 'Reduce spacing, hide weaker sections, or cut bullets. Two pages is a practical ceiling for most roles.',
    });
  }

  resume.sections
    .filter((s) => s.visible)
    .forEach((s) => {
      const key = s.title.trim().toLowerCase();
      if (key && !STANDARD_HEADINGS.has(key) && s.type !== 'custom') {
        issues.push({
          id: `heading-${s.id}`,
          severity: 'info',
          category: 'parse',
          title: `Uncommon heading: “${s.title}”`,
          detail: 'Some ATS maps only recognize headings like Experience, Education, and Skills.',
          suggestion: 'Prefer a standard heading. You can still tailor bullets underneath it.',
        });
      }
    });

  const tablesLike = text.includes('\t\t') || /\|.+\|/.test(text);
  if (tablesLike) {
    issues.push({
      id: 'pipes',
      severity: 'info',
      category: 'format',
      title: 'Pipe or tab characters detected',
      detail: 'Heavy use of | or tabs can be read as a table and scramble field order.',
      suggestion: 'Use commas or line breaks instead of constructing a visual table.',
    });
  }

  if (resume.settings.fontSize < 10.5 && resume.settings.spacing === 'compact') {
    issues.push({
      id: 'tiny-type',
      severity: 'info',
      category: 'read',
      title: 'Type is very tight',
      detail: 'Sub-10.5 pt type with compact spacing is hard for tired recruiters and some OCR paths.',
      suggestion: 'Use 10.5–11.5 pt and normal spacing unless you must keep a senior history on one page.',
    });
  }

  // Role keyword coverage — only flag tools already expected for the role, never invent
  const missingRoleKw = role.usefulKeywords.filter((kw) => !lower.includes(kw));
  if (missingRoleKw.length >= Math.ceil(role.usefulKeywords.length * 0.7)) {
    issues.push({
      id: 'role-kw',
      severity: 'info',
      category: 'match',
      title: 'Few typical tools for this role appear',
      detail: `This check looks only for common ${role.name} vocabulary already on the page. Missing: ${missingRoleKw.slice(0, 6).join(', ')}.`,
      suggestion: 'If you have used any of those tools, name them in Skills or a bullet. If you have not, leave them off.',
    });
  }

  if (template.header === 'split-contact' || template.header === 'stacked-labels') {
    issues.push({
      id: 'layout-note',
      severity: 'info',
      category: 'format',
      title: 'Header is still a single text column',
      detail: `${template.name} uses CSS alignment only. Contact fields remain selectable text, not a table or image.`,
      suggestion: 'Keep contact details as typed fields. Do not paste a logo or photo into the name line.',
    });
  }

  const parseScore = scoreBucket(issues, ['parse'], 32);
  const completeScore = scoreBucket(issues, ['complete'], 28);
  const contentScore = scoreBucket(issues, ['content', 'match'], 24);
  const readScore = scoreBucket(issues, ['read', 'format'], 16);
  const score = Math.max(12, Math.min(96, parseScore + completeScore + contentScore + readScore));

  return {
    score,
    parseScore,
    completeScore,
    contentScore,
    readScore,
    issues,
    pageEstimate: pages,
    wordCount: wc,
    disclaimer:
      'This is an optimization score for structure, completeness, and parse-safe formatting. It is not a prediction that any employer, recruiter, or ATS will accept, rank, or interview you.',
  };
}

function scoreBucket(issues: ATSIssue[], cats: ATSIssue['category'][], max: number) {
  const relevant = issues.filter((i) => cats.includes(i.category));
  let penalty = 0;
  relevant.forEach((i) => {
    if (i.severity === 'block') penalty += 10;
    else if (i.severity === 'warn') penalty += 5;
    else penalty += 2;
  });
  return Math.max(4, max - penalty);
}

const PHRASE_HINTS = [
  'machine learning',
  'project management',
  'customer success',
  'data analysis',
  'financial modeling',
  'quality assurance',
  'user research',
  'active directory',
  'continuous improvement',
  'go to market',
  'go-to-market',
  'rest api',
  'rest apis',
  'unit testing',
  'regression testing',
  'supply chain',
  'employee relations',
  'stakeholder management',
];

export function matchJobDescription(resume: ResumeData, rawJd: string): JDMatchReport {
  const jd = rawJd.trim();
  if (!jd) {
    return {
      score: 0,
      matched: [],
      missing: [],
      sectionGaps: [],
      notes: ['Paste a job description to compare it with the words already on your resume.'],
      jdWordCount: 0,
    };
  }

  const resumeText = flatten(resume).toLowerCase();
  const jdLower = jd.toLowerCase();
  const jdTokens = Array.from(new Set(words(jd))).filter((w) => !STOP.has(w) && w.length > 2);

  const phrases = PHRASE_HINTS.filter((p) => jdLower.includes(p));
  const singles = jdTokens.filter((w) => w.length >= 4);

  const targets = Array.from(new Set([...phrases, ...singles])).slice(0, 80);
  const matched: string[] = [];
  const missing: string[] = [];

  targets.forEach((token) => {
    if (resumeText.includes(token)) matched.push(token);
    else missing.push(token);
  });

  // Prefer showing multi-word and distinctive tokens first
  missing.sort((a, b) => b.includes(' ') === a.includes(' ') ? b.length - a.length : a.includes(' ') ? -1 : 1);
  matched.sort((a, b) => b.length - a.length);

  const sectionGaps: string[] = [];
  if (/bachelor|master|degree|university|college/i.test(jd) && !visibleOf(resume, 'education')) {
    sectionGaps.push('The posting mentions education; your Education section is hidden or empty.');
  }
  if (/certif/i.test(jd) && !visibleOf(resume, 'certifications')) {
    sectionGaps.push('The posting mentions certifications; consider showing that section if you hold a relevant one.');
  }
  if (/project/i.test(jd) && !visibleOf(resume, 'projects') && !visibleOf(resume, 'experience')) {
    sectionGaps.push('The posting talks about projects; add a real project or relevant role rather than a placeholder.');
  }

  const denom = Math.max(8, matched.length + Math.min(missing.length, 24));
  const score = Math.round((matched.length / denom) * 100);

  const notes = [
    'Matches are exact or near-exact phrases already in your resume. This tool will not invent skills or rewrite history.',
    'A missing keyword is only useful if you have used that tool or done that work. Leave it off if you have not.',
    'Some ATS also score headings, dates, and file type. Use the Preflight check before you export.',
  ];

  return {
    score: Math.max(0, Math.min(99, score)),
    matched: matched.slice(0, 24),
    missing: missing.slice(0, 18),
    sectionGaps,
    notes,
    jdWordCount: words(jd).length,
  };
}

export function preflight(resume: ResumeData) {
  const report = analyzeATS(resume);
  const blockers = report.issues.filter((i) => i.severity === 'block');
  const warnings = report.issues.filter((i) => i.severity === 'warn');
  return { report, blockers, warnings, canExport: blockers.length === 0 };
}
