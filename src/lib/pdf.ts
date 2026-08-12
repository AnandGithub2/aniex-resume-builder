import { jsPDF } from 'jspdf';
import { getTemplate } from '../data/catalog';
import type {
  ExperienceItem,
  ResumeData,
  ResumeSection,
  TemplateDefinition,
} from '../types/resume';
import { slug } from './storage';

const PAGE_W = 210;
const PAGE_H = 297;

const FONT_MAP: Record<ResumeData['settings']['fontFamily'], 'times' | 'helvetica'> = {
  georgia: 'times',
  times: 'times',
  garamond: 'times',
  cambria: 'times',
  calibri: 'helvetica',
  arial: 'helvetica',
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function marginMm(scale: ResumeData['settings']['margin']) {
  if (scale === 'narrow') return 12;
  if (scale === 'wide') return 22;
  return 16;
}

function space(scale: ResumeData['settings']['spacing']) {
  if (scale === 'compact') return { para: 2.1, item: 2.4, section: 3.2, line: 1.28 };
  if (scale === 'relaxed') return { para: 3.2, item: 3.6, section: 5.2, line: 1.45 };
  return { para: 2.6, item: 3.0, section: 4.2, line: 1.36 };
}

function dateRange(start: string, end: string, current?: boolean) {
  const right = current ? 'Present' : end;
  if (start && right) return `${start} – ${right}`;
  return start || right || '';
}

function headingText(title: string, tpl: TemplateDefinition) {
  if (tpl.headingCase === 'upper') return title.toUpperCase();
  if (tpl.headingCase === 'small') return title.toUpperCase();
  return title;
}

class Writer {
  doc: jsPDF;
  x: number;
  maxW: number;
  y: number;
  bottom: number;
  font: 'times' | 'helvetica';
  color: [number, number, number];
  size: number;
  sp: ReturnType<typeof space>;

  constructor(resume: ResumeData) {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const m = marginMm(resume.settings.margin);
    this.x = m;
    this.maxW = PAGE_W - m * 2;
    this.y = m;
    this.bottom = PAGE_H - m;
    this.font = FONT_MAP[resume.settings.fontFamily];
    this.color = hexToRgb(resume.settings.accent);
    this.size = resume.settings.fontSize;
    this.sp = space(resume.settings.spacing);
    this.doc.setFont(this.font, 'normal');
    this.doc.setTextColor(26, 29, 35);
  }

  ensure(h: number) {
    if (this.y + h > this.bottom) {
      this.doc.addPage();
      this.y = marginMmFromDoc(this.doc) || 16;
    }
  }

  set(style: 'normal' | 'bold' | 'italic', size?: number) {
    this.doc.setFont(this.font, style);
    if (size) this.doc.setFontSize(size);
  }

  text(
    value: string,
    opts?: { align?: 'left' | 'center' | 'right'; size?: number; style?: 'normal' | 'bold' | 'italic'; color?: [number, number, number]; x?: number; maxW?: number },
  ) {
    const size = opts?.size ?? this.size;
    const style = opts?.style ?? 'normal';
    const color = opts?.color ?? [26, 29, 35];
    const x = opts?.x ?? this.x;
    const maxW = opts?.maxW ?? this.maxW;
    this.set(style, size);
    this.doc.setTextColor(...color);
    const lines = this.doc.splitTextToSize(value, maxW) as string[];
    const lh = size * 0.352778 * this.sp.line;
    this.ensure(lines.length * lh);
    lines.forEach((line) => {
      if (opts?.align === 'center') this.doc.text(line, PAGE_W / 2, this.y, { align: 'center' });
      else if (opts?.align === 'right') this.doc.text(line, x + maxW, this.y, { align: 'right' });
      else this.doc.text(line, x, this.y);
      this.y += lh;
    });
    return lines.length;
  }

  pair(left: string, right: string, size: number, style: 'normal' | 'bold' | 'italic' = 'bold') {
    this.set(style, size);
    const rightW = right ? this.doc.getTextWidth(right) + 2 : 0;
    const lines = this.doc.splitTextToSize(left, this.maxW - rightW) as string[];
    const lh = size * 0.352778 * this.sp.line;
    this.ensure(lh);
    this.doc.setTextColor(26, 29, 35);
    this.doc.text(lines[0] || '', this.x, this.y);
    if (right) {
      this.set('normal', size);
      this.doc.text(right, this.x + this.maxW, this.y, { align: 'right' });
    }
    this.y += lh;
    lines.slice(1).forEach((line) => {
      this.ensure(lh);
      this.set(style, size);
      this.doc.text(line, this.x, this.y);
      this.y += lh;
    });
  }

  rule(weight: number, color?: [number, number, number]) {
    this.ensure(2);
    const c = color || this.color;
    this.doc.setDrawColor(...c);
    this.doc.setLineWidth(weight * 0.2);
    this.doc.line(this.x, this.y, this.x + this.maxW, this.y);
    this.y += 1.6;
  }

  gap(n: number) {
    this.y += n;
  }
}

function marginMmFromDoc(doc: jsPDF) {
  const info = doc.internal.pageSize;
  return info ? 16 : 16;
}

function writeHeader(w: Writer, resume: ResumeData, tpl: TemplateDefinition) {
  const p = resume.personal;
  const name = p.fullName || 'Your Name';
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean);
  const sep = tpl.contactSeparator;
  const accent = w.color;
  const nameSize = tpl.nameSize;

  if (tpl.header === 'centered-classic') {
    w.text(name, { align: 'center', size: nameSize, style: 'bold', color: accent });
    if (p.headline) {
      w.gap(0.6);
      w.text(p.headline, { align: 'center', size: w.size, style: 'italic' });
    }
    w.gap(1.2);
    if (contacts.length) w.text(contacts.join(sep), { align: 'center', size: w.size - 0.5 });
    w.gap(1.4);
    w.rule(tpl.ruleWeight);
  } else if (tpl.header === 'left-stacked') {
    w.text(name, { size: nameSize, style: 'bold', color: accent });
    if (p.headline) {
      w.gap(0.4);
      w.text(p.headline, { size: w.size, style: 'italic' });
    }
    w.gap(1);
    if (contacts.length) w.text(contacts.join(sep), { size: w.size - 0.5 });
    w.gap(1.2);
    w.rule(tpl.ruleWeight);
  } else if (tpl.header === 'left-rule') {
    w.doc.setFillColor(...accent);
    w.doc.rect(w.x, w.y - 4, 1.1, nameSize * 0.45 + 6, 'F');
    const savedX = w.x;
    w.x += 3.2;
    w.maxW -= 3.2;
    w.text(name, { size: nameSize, style: 'bold', color: accent });
    if (p.headline) w.text(p.headline, { size: w.size, style: 'italic' });
    if (contacts.length) {
      w.gap(0.8);
      w.text(contacts.join(sep), { size: w.size - 0.5 });
    }
    w.x = savedX;
    w.maxW += 3.2;
    w.gap(2);
    w.rule(tpl.ruleWeight);
  } else if (tpl.header === 'letterhead') {
    w.rule(tpl.ruleWeight * 1.4);
    w.gap(1);
    w.text(name, { align: 'center', size: nameSize, style: 'bold', color: accent });
    if (p.headline) w.text(p.headline.toUpperCase(), { align: 'center', size: w.size - 0.8, style: 'normal' });
    w.gap(0.8);
    if (contacts.length) w.text(contacts.join(sep), { align: 'center', size: w.size - 0.5 });
    w.gap(1.4);
    w.rule(tpl.ruleWeight);
  } else if (tpl.header === 'inline-title') {
    const title = p.headline ? `${name}  ·  ${p.headline}` : name;
    w.text(title, { size: nameSize - 1, style: 'bold', color: accent });
    w.gap(1);
    if (contacts.length) w.text(contacts.join(sep), { size: w.size - 0.5 });
    w.gap(1.4);
    w.rule(tpl.ruleWeight);
  } else if (tpl.header === 'executive') {
    w.rule(0.6);
    w.gap(1.6);
    w.text(name.toUpperCase(), { align: 'center', size: nameSize, style: 'bold', color: accent });
    if (p.headline) {
      w.gap(0.6);
      w.text(p.headline, { align: 'center', size: w.size - 0.4, style: 'italic' });
    }
    w.gap(1);
    if (contacts.length) w.text(contacts.join(sep), { align: 'center', size: w.size - 0.6 });
    w.gap(1.6);
    w.rule(1.4);
    w.gap(0.4);
    w.rule(0.5);
  } else if (tpl.header === 'stacked-labels') {
    w.text(name, { size: nameSize, style: 'bold', color: accent });
    if (p.headline) w.text(p.headline, { size: w.size, style: 'italic' });
    w.gap(1.4);
    const labeled = [
      p.email && `Email  ${p.email}`,
      p.phone && `Phone  ${p.phone}`,
      p.location && `Location  ${p.location}`,
      p.linkedin && `LinkedIn  ${p.linkedin}`,
      p.github && `GitHub  ${p.github}`,
      p.website && `Web  ${p.website}`,
    ].filter(Boolean) as string[];
    if (labeled.length) w.text(labeled.join('    '), { size: w.size - 0.6 });
    w.gap(1.4);
    w.rule(tpl.ruleWeight);
  } else {
    // split-contact
    w.set('bold', nameSize);
    const nameW = w.doc.getTextWidth(name);
    w.doc.setTextColor(...accent);
    w.doc.text(name, w.x, w.y);
    if (p.headline) {
      w.set('italic', w.size);
      w.doc.setTextColor(26, 29, 35);
      const hx = w.x + nameW + 3;
      w.doc.text(p.headline, hx, w.y);
    }
    w.y += nameSize * 0.42;
    if (contacts.length) {
      w.gap(1);
      w.text(contacts.join(sep), { size: w.size - 0.5 });
    }
    w.gap(1.6);
    w.rule(tpl.ruleWeight);
  }
  w.gap(1.2);
}

function writeHeading(w: Writer, title: string, tpl: TemplateDefinition) {
  const label = headingText(title, tpl);
  w.gap(w.sp.section * 0.15);
  w.ensure(8);

  if (tpl.heading === 'uppercase-tracked' || tpl.heading === 'uppercase-rule') {
    w.text(label, { size: w.size - 0.4, style: 'bold', color: w.color });
    w.gap(0.4);
    w.rule(tpl.heading === 'uppercase-rule' ? tpl.ruleWeight * 1.2 : 0.7);
  } else if (tpl.heading === 'title-underline') {
    w.text(label, { size: w.size + 0.4, style: 'bold', color: w.color });
    w.gap(0.3);
    w.doc.setDrawColor(...w.color);
    w.doc.setLineWidth(0.25);
    const tw = w.doc.getTextWidth(label);
    w.doc.line(w.x, w.y, w.x + tw, w.y);
    w.y += 1.8;
  } else if (tpl.heading === 'title-border') {
    w.text(label, { size: w.size + 0.2, style: 'bold', color: w.color });
    w.gap(0.5);
    w.rule(1.1);
  } else if (tpl.heading === 'smallcaps') {
    w.text(label, { size: w.size - 0.6, style: 'bold', color: w.color });
    w.gap(0.8);
  } else if (tpl.heading === 'centered-uppercase') {
    w.gap(0.6);
    w.rule(0.5);
    w.gap(0.8);
    w.text(label, { align: 'center', size: w.size - 0.5, style: 'bold', color: w.color });
    w.gap(0.6);
    w.rule(0.5);
  } else if (tpl.heading === 'boxed-rules') {
    w.rule(0.7);
    w.gap(0.7);
    w.text(label, { align: 'center', size: w.size - 0.3, style: 'bold', color: w.color });
    w.gap(0.5);
    w.rule(0.7);
  } else {
    // accent-left
    const h = 4.2;
    w.doc.setFillColor(...w.color);
    w.doc.rect(w.x, w.y - 3.1, 1.15, h, 'F');
    const sx = w.x;
    w.x += 3;
    w.maxW -= 3;
    w.text(label, { size: w.size - 0.2, style: 'bold', color: w.color });
    w.x = sx;
    w.maxW += 3;
    w.gap(0.6);
  }
  w.gap(1.1);
}

function writeExperience(w: Writer, items: ExperienceItem[], tpl: TemplateDefinition) {
  items
    .filter((e) => !e.hidden)
    .forEach((job, idx) => {
      if (idx) w.gap(w.sp.item);
      const dates = dateRange(job.startDate, job.endDate, job.current);
      if (tpl.experience === 'company-first') {
        w.pair(job.company || 'Organization', dates, w.size, 'bold');
        const sub = [job.title, job.location].filter(Boolean).join('  ·  ');
        if (sub) w.text(sub, { size: w.size - 0.2, style: 'italic' });
      } else if (tpl.experience === 'stacked') {
        w.text(job.title || 'Role', { size: w.size, style: 'bold' });
        const mid = [job.company, job.location].filter(Boolean).join('  ·  ');
        if (mid) w.text(mid, { size: w.size - 0.2, style: 'italic' });
        if (dates) w.text(dates, { size: w.size - 0.4 });
      } else {
        w.pair(job.title || 'Role', dates, w.size, 'bold');
        const mid = [job.company, job.location].filter(Boolean).join('  ·  ');
        if (mid) w.text(mid, { size: w.size - 0.2, style: 'italic' });
      }
      w.gap(0.7);
      job.bullets
        .map((b) => b.text.trim())
        .filter(Boolean)
        .forEach((line) => {
          const bullet = `•  ${line}`;
          w.text(bullet, { size: w.size });
          w.gap(0.35);
        });
    });
}

function writeSection(w: Writer, section: ResumeSection, tpl: TemplateDefinition) {
  writeHeading(w, section.title, tpl);

  if (section.type === 'summary' && section.summary) {
    w.text(section.summary.trim(), { size: w.size });
  }

  if (section.type === 'experience' && section.experience) {
    writeExperience(w, section.experience, tpl);
  }

  if (section.type === 'education' && section.education) {
    section.education
      .filter((e) => !e.hidden)
      .forEach((ed, idx) => {
        if (idx) w.gap(w.sp.item);
        const credential = [ed.degree, ed.field].filter(Boolean).join(' in ');
        const left = credential || ed.school || 'Education';
        const dates = dateRange(ed.startDate, ed.endDate);
        w.pair(left, dates, w.size, 'bold');
        const mid = [ed.school, ed.location, ed.gpa && `GPA ${ed.gpa}`].filter(Boolean).join('  ·  ');
        if (mid) w.text(mid, { size: w.size - 0.2, style: 'italic' });
        if (ed.details) {
          w.gap(0.4);
          w.text(ed.details, { size: w.size });
        }
      });
  }

  if (section.type === 'skills' && section.skills) {
    const groups = section.skills.filter((g) => g.items.trim());
    if (tpl.skills === 'grouped') {
      groups.forEach((g) => {
        if (g.category.trim()) {
          w.text(`${g.category}:  ${g.items}`, { size: w.size });
        } else {
          w.text(g.items, { size: w.size });
        }
        w.gap(0.45);
      });
    } else {
      const sep = tpl.skills === 'pipe' ? '  |  ' : tpl.skills === 'semicolon' ? ';  ' : ',  ';
      const all = groups
        .map((g) => (g.category.trim() ? `${g.category}: ${g.items}` : g.items))
        .join(sep);
      w.text(all, { size: w.size });
    }
  }

  if (section.type === 'projects' && section.projects) {
    section.projects
      .filter((p) => !p.hidden)
      .forEach((p, idx) => {
        if (idx) w.gap(w.sp.item);
        const right = [p.stack, dateRange(p.startDate, p.endDate)].filter(Boolean).join('  ·  ');
        w.pair(p.name || 'Project', right, w.size, 'bold');
        if (p.link) w.text(p.link, { size: w.size - 0.4, style: 'italic' });
        p.bullets
          .map((b) => b.text.trim())
          .filter(Boolean)
          .forEach((line) => {
            w.text(`•  ${line}`, { size: w.size });
            w.gap(0.3);
          });
      });
  }

  if (section.type === 'certifications' && section.certifications) {
    section.certifications.forEach((c, idx) => {
      if (idx) w.gap(0.6);
      const left = [c.name, c.issuer].filter(Boolean).join('  ·  ');
      w.pair(left || 'Certification', c.date, w.size, 'normal');
      if (c.credential) w.text(c.credential, { size: w.size - 0.4, style: 'italic' });
    });
  }

  if (section.type === 'achievements' && section.achievements) {
    section.achievements.forEach((a, idx) => {
      if (idx) w.gap(0.7);
      w.pair(a.title || 'Achievement', a.date, w.size, 'bold');
      if (a.description) w.text(a.description, { size: w.size });
    });
  }

  if (section.type === 'languages' && section.languages) {
    const line = section.languages
      .filter((l) => l.name)
      .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
      .join('  ·  ');
    if (line) w.text(line, { size: w.size });
  }

  if (section.type === 'custom' && section.custom) {
    section.custom.forEach((c, idx) => {
      if (idx) w.gap(0.8);
      if (c.heading) w.text(c.heading, { size: w.size, style: 'bold' });
      if (c.text) w.text(c.text, { size: w.size });
    });
  }
}

export function exportResumePdf(resume: ResumeData) {
  const tpl = getTemplate(resume.templateId);
  const w = new Writer(resume);
  writeHeader(w, resume, tpl);
  resume.sections
    .filter((s) => s.visible)
    .forEach((section) => {
      const has =
        (section.type === 'summary' && section.summary?.trim()) ||
        (section.type === 'experience' && section.experience?.some((e) => !e.hidden && (e.title || e.company))) ||
        (section.type === 'education' && section.education?.some((e) => !e.hidden && (e.school || e.degree))) ||
        (section.type === 'skills' && section.skills?.some((g) => g.items.trim())) ||
        (section.type === 'projects' && section.projects?.some((p) => !p.hidden && p.name)) ||
        (section.type === 'certifications' && section.certifications?.some((c) => c.name)) ||
        (section.type === 'achievements' && section.achievements?.some((a) => a.title || a.description)) ||
        (section.type === 'languages' && section.languages?.some((l) => l.name)) ||
        (section.type === 'custom' && section.custom?.some((c) => c.heading || c.text));
      if (!has) return;
      writeSection(w, section, tpl);
    });

  const file = `${slug(resume.personal.fullName || resume.name || 'resume')}.pdf`;
  w.doc.save(file);
}
