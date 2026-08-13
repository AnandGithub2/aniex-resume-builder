import { getTemplate } from '../data/catalog';
import { contactList, dateLine, itemGap, pageStyle, sectionGap } from '../lib/layout';
import type {
  AchievementItem,
  CertItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  ResumeSection,
  TemplateDefinition,
} from '../types/resume';

function headingLabel(title: string, tpl: TemplateDefinition) {
  if (tpl.headingCase === 'upper' || tpl.headingCase === 'small') return title.toUpperCase();
  return title;
}

function Heading({ title, tpl }: { title: string; tpl: TemplateDefinition }) {
  const label = headingLabel(title, tpl);
  const accent = 'var(--accent)';
  const tracked = tpl.headingCase !== 'title';

  if (tpl.heading === 'uppercase-tracked') {
    return (
      <div style={{ marginBottom: 6, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div
          style={{
            fontWeight: 700,
            letterSpacing: tracked ? '0.14em' : 0,
            fontSize: '0.92em',
            color: accent,
          }}
        >
          {label}
        </div>
        <div style={{ borderBottom: `${tpl.ruleWeight}px solid ${accent}`, marginTop: 3 }} />
      </div>
    );
  }

  if (tpl.heading === 'uppercase-rule') {
    return (
      <div style={{ marginBottom: 6, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div
          style={{
            fontWeight: 700,
            letterSpacing: '0.16em',
            fontSize: '0.88em',
            color: accent,
          }}
        >
          {label}
        </div>
        <div style={{ borderBottom: `${Math.max(1.5, tpl.ruleWeight)}px solid ${accent}`, marginTop: 4 }} />
      </div>
    );
  }

  if (tpl.heading === 'title-underline') {
    return (
      <div style={{ marginBottom: 7 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.02em',
            color: accent,
            display: 'inline-block',
            borderBottom: `1.25px solid ${accent}`,
            paddingBottom: 1,
          }}
        >
          {label}
        </div>
      </div>
    );
  }

  if (tpl.heading === 'title-border') {
    return (
      <div style={{ marginBottom: 7, borderBottom: `1.5px solid ${accent}`, paddingBottom: 2 }}>
        <div style={{ fontWeight: 700, fontSize: '1.02em', color: accent }}>{label}</div>
      </div>
    );
  }

  if (tpl.heading === 'smallcaps') {
    return (
      <div
        style={{
          marginBottom: 7,
          fontWeight: 650,
          letterSpacing: '0.18em',
          fontSize: '0.84em',
          color: accent,
        }}
      >
        {label}
      </div>
    );
  }

  if (tpl.heading === 'centered-uppercase') {
    return (
      <div style={{ marginBottom: 8, textAlign: 'center', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div style={{ borderTop: `0.6px solid ${accent}`, marginBottom: 5 }} />
        <div style={{ fontWeight: 700, letterSpacing: '0.22em', fontSize: '0.82em', color: accent }}>{label}</div>
        <div style={{ borderTop: `0.6px solid ${accent}`, marginTop: 5 }} />
      </div>
    );
  }

  if (tpl.heading === 'boxed-rules') {
    return (
      <div style={{ marginBottom: 8, textAlign: 'center', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div style={{ borderTop: `1px solid ${accent}` }} />
        <div style={{ fontWeight: 700, letterSpacing: '0.16em', fontSize: '0.86em', color: accent, padding: '3px 0' }}>
          {label}
        </div>
        <div style={{ borderTop: `1px solid ${accent}` }} />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 7, display: 'flex', alignItems: 'stretch', gap: 8, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
      <div style={{ width: 3, background: accent, borderRadius: 1 }} />
      <div style={{ fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.9em', color: accent }}>{label}</div>
    </div>
  );
}

function Header({ resume, tpl }: { resume: ResumeData; tpl: TemplateDefinition }) {
  const p = resume.personal;
  const name = p.fullName || 'Your Name';
  const contacts = contactList(resume);
  const accent = 'var(--accent)';
  const sep = tpl.contactSeparator;

  if (tpl.header === 'centered-classic') {
    return (
      <header style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: `${tpl.nameSize}pt`, fontWeight: 700, color: accent, lineHeight: 1.15 }}>{name}</div>
        {p.headline ? <div style={{ fontStyle: 'italic', marginTop: 3 }}>{p.headline}</div> : null}
        {contacts.length ? <div style={{ marginTop: 5, fontSize: '0.94em' }}>{contacts.join(sep)}</div> : null}
        <div style={{ borderBottom: `${tpl.ruleWeight}px solid ${accent}`, marginTop: 8 }} />
      </header>
    );
  }

  if (tpl.header === 'left-stacked') {
    return (
      <header style={{ marginBottom: 12 }}>
        <div style={{ fontSize: `${tpl.nameSize}pt`, fontWeight: 700, color: accent, lineHeight: 1.12 }}>{name}</div>
        {p.headline ? <div style={{ fontStyle: 'italic', marginTop: 2 }}>{p.headline}</div> : null}
        {contacts.length ? <div style={{ marginTop: 5, fontSize: '0.94em' }}>{contacts.join(sep)}</div> : null}
        <div style={{ borderBottom: `${tpl.ruleWeight}px solid ${accent}`, marginTop: 8 }} />
      </header>
    );
  }

  if (tpl.header === 'left-rule') {
    return (
      <header style={{ marginBottom: 12, display: 'flex', gap: 10 }}>
        <div style={{ width: 3, background: accent, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${tpl.nameSize}pt`, fontWeight: 700, color: accent, lineHeight: 1.12 }}>{name}</div>
          {p.headline ? <div style={{ fontStyle: 'italic', marginTop: 2 }}>{p.headline}</div> : null}
          {contacts.length ? <div style={{ marginTop: 5, fontSize: '0.94em' }}>{contacts.join(sep)}</div> : null}
        </div>
      </header>
    );
  }

  if (tpl.header === 'letterhead') {
    return (
      <header style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ borderTop: `${Math.max(1.4, tpl.ruleWeight)}px solid ${accent}`, marginBottom: 8 }} />
        <div style={{ fontSize: `${tpl.nameSize}pt`, fontWeight: 700, color: accent, lineHeight: 1.1 }}>{name}</div>
        {p.headline ? (
          <div style={{ letterSpacing: '0.16em', fontSize: '0.82em', marginTop: 4 }}>{p.headline.toUpperCase()}</div>
        ) : null}
        {contacts.length ? <div style={{ marginTop: 6, fontSize: '0.94em' }}>{contacts.join(sep)}</div> : null}
        <div style={{ borderBottom: `${tpl.ruleWeight}px solid ${accent}`, marginTop: 8 }} />
      </header>
    );
  }

  if (tpl.header === 'inline-title') {
    return (
      <header style={{ marginBottom: 12 }}>
        <div style={{ fontSize: `${tpl.nameSize}pt`, fontWeight: 700, color: accent, lineHeight: 1.15 }}>
          {name}
          {p.headline ? <span style={{ fontWeight: 500 }}>  ·  {p.headline}</span> : null}
        </div>
        {contacts.length ? <div style={{ marginTop: 5, fontSize: '0.94em' }}>{contacts.join(sep)}</div> : null}
        <div style={{ borderBottom: `${tpl.ruleWeight}px solid ${accent}`, marginTop: 8 }} />
      </header>
    );
  }

  if (tpl.header === 'executive') {
    return (
      <header style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ borderTop: `0.7px solid ${accent}`, marginBottom: 8 }} />
        <div
          style={{
            fontSize: `${tpl.nameSize}pt`,
            fontWeight: 700,
            color: accent,
            letterSpacing: '0.16em',
            lineHeight: 1.2,
          }}
        >
          {name.toUpperCase()}
        </div>
        {p.headline ? <div style={{ fontStyle: 'italic', marginTop: 4 }}>{p.headline}</div> : null}
        {contacts.length ? <div style={{ marginTop: 5, fontSize: '0.9em' }}>{contacts.join(sep)}</div> : null}
        <div style={{ borderTop: `1.6px solid ${accent}`, marginTop: 8 }} />
        <div style={{ borderTop: `0.6px solid ${accent}`, marginTop: 2 }} />
      </header>
    );
  }

  if (tpl.header === 'stacked-labels') {
    const labeled = [
      p.email && `Email  ${p.email}`,
      p.phone && `Phone  ${p.phone}`,
      p.location && `Location  ${p.location}`,
      p.linkedin && `LinkedIn  ${p.linkedin}`,
      p.github && `GitHub  ${p.github}`,
      p.website && `Web  ${p.website}`,
    ].filter(Boolean) as string[];
    return (
      <header style={{ marginBottom: 12 }}>
        <div style={{ fontSize: `${tpl.nameSize}pt`, fontWeight: 700, color: accent, lineHeight: 1.12 }}>{name}</div>
        {p.headline ? <div style={{ fontStyle: 'italic', marginTop: 2 }}>{p.headline}</div> : null}
        {labeled.length ? <div style={{ marginTop: 7, fontSize: '0.9em' }}>{labeled.join('    ')}</div> : null}
        <div style={{ borderBottom: `${tpl.ruleWeight}px solid ${accent}`, marginTop: 8 }} />
      </header>
    );
  }

  return (
    <header style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
        <div style={{ fontSize: `${tpl.nameSize}pt`, fontWeight: 700, color: accent, lineHeight: 1.1 }}>{name}</div>
        {p.headline ? <div style={{ fontStyle: 'italic', textAlign: 'right' }}>{p.headline}</div> : null}
      </div>
      {contacts.length ? <div style={{ marginTop: 6, fontSize: '0.94em' }}>{contacts.join(sep)}</div> : null}
      <div style={{ borderBottom: `${tpl.ruleWeight}px solid ${accent}`, marginTop: 8 }} />
    </header>
  );
}

function JobBlock({ job, tpl }: { job: ExperienceItem; tpl: TemplateDefinition }) {
  const dates = dateLine(job.startDate, job.endDate, job.current);
  const bullets = job.bullets.map((b) => b.text.trim()).filter(Boolean);
  return (
    <div>
      {tpl.experience === 'company-first' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontWeight: 700 }}>{job.company || 'Organization'}</div>
            {dates ? <div style={{ whiteSpace: 'nowrap' }}>{dates}</div> : null}
          </div>
          <div style={{ fontStyle: 'italic' }}>{[job.title, job.location].filter(Boolean).join('  ·  ')}</div>
        </>
      ) : tpl.experience === 'stacked' ? (
        <>
          <div style={{ fontWeight: 700 }}>{job.title || 'Role'}</div>
          <div style={{ fontStyle: 'italic' }}>{[job.company, job.location].filter(Boolean).join('  ·  ')}</div>
          {dates ? <div>{dates}</div> : null}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontWeight: 700 }}>{job.title || 'Role'}</div>
            {dates ? <div style={{ whiteSpace: 'nowrap' }}>{dates}</div> : null}
          </div>
          <div style={{ fontStyle: 'italic' }}>{[job.company, job.location].filter(Boolean).join('  ·  ')}</div>
        </>
      )}
      {bullets.length ? (
        <ul style={{ margin: '4px 0 0', paddingLeft: '1.15em' }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ marginBottom: 2 }}>
              {b}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function EducationBlock({ item }: { item: EducationItem }) {
  const credential = [item.degree, item.field].filter(Boolean).join(' in ');
  const dates = dateLine(item.startDate, item.endDate);
  const mid = [item.school, item.location, item.gpa && `GPA ${item.gpa}`].filter(Boolean).join('  ·  ');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{credential || item.school || 'Education'}</div>
        {dates ? <div style={{ whiteSpace: 'nowrap' }}>{dates}</div> : null}
      </div>
      {mid ? <div style={{ fontStyle: 'italic' }}>{mid}</div> : null}
      {item.details ? <div>{item.details}</div> : null}
    </div>
  );
}

function ProjectBlock({ item }: { item: ProjectItem }) {
  const right = [item.stack, dateLine(item.startDate, item.endDate)].filter(Boolean).join('  ·  ');
  const bullets = item.bullets.map((b) => b.text.trim()).filter(Boolean);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{item.name || 'Project'}</div>
        {right ? <div style={{ whiteSpace: 'nowrap' }}>{right}</div> : null}
      </div>
      {item.link ? <div style={{ fontStyle: 'italic' }}>{item.link}</div> : null}
      {bullets.length ? (
        <ul style={{ margin: '4px 0 0', paddingLeft: '1.15em' }}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SkillsBlock({ section, tpl }: { section: ResumeSection; tpl: TemplateDefinition }) {
  const groups = section.skills?.filter((g) => g.items.trim()) || [];
  if (!groups.length) return null;
  if (tpl.skills === 'grouped') {
    return (
      <div>
        {groups.map((g) => (
          <div key={g.id}>
            {g.category.trim() ? <span style={{ fontWeight: 700 }}>{g.category}: </span> : null}
            {g.items}
          </div>
        ))}
      </div>
    );
  }
  const sep = tpl.skills === 'pipe' ? '  |  ' : tpl.skills === 'semicolon' ? ';  ' : ',  ';
  const all = groups.map((g) => (g.category.trim() ? `${g.category}: ${g.items}` : g.items)).join(sep);
  return <div>{all}</div>;
}

function CertBlock({ item }: { item: CertItem }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <div>
        {[item.name, item.issuer].filter(Boolean).join('  ·  ')}
        {item.credential ? <div style={{ fontStyle: 'italic' }}>{item.credential}</div> : null}
      </div>
      {item.date ? <div>{item.date}</div> : null}
    </div>
  );
}

function AchieveBlock({ item }: { item: AchievementItem }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{item.title || 'Achievement'}</div>
        {item.date ? <div>{item.date}</div> : null}
      </div>
      {item.description ? <div>{item.description}</div> : null}
    </div>
  );
}

function sectionHasContent(section: ResumeSection) {
  switch (section.type) {
    case 'summary':
      return Boolean(section.summary?.trim());
    case 'experience':
      return Boolean(section.experience?.some((e) => !e.hidden && (e.title || e.company)));
    case 'education':
      return Boolean(section.education?.some((e) => !e.hidden && (e.school || e.degree)));
    case 'skills':
      return Boolean(section.skills?.some((g) => g.items.trim()));
    case 'projects':
      return Boolean(section.projects?.some((p) => !p.hidden && p.name));
    case 'certifications':
      return Boolean(section.certifications?.some((c) => c.name));
    case 'achievements':
      return Boolean(section.achievements?.some((a) => a.title || a.description));
    case 'languages':
      return Boolean(section.languages?.some((l) => l.name));
    case 'custom':
      return Boolean(section.custom?.some((c) => c.heading || c.text));
  }
}

function SectionBody({
  section,
  tpl,
  spacing,
}: {
  section: ResumeSection;
  tpl: TemplateDefinition;
  spacing: ResumeData['settings']['spacing'];
}) {
  const gap = itemGap(spacing);
  if (section.type === 'summary') return <div>{section.summary}</div>;
  if (section.type === 'experience') {
    return (
      <div style={{ display: 'grid', gap }}>
        {section.experience?.filter((e) => !e.hidden).map((job) => <JobBlock key={job.id} job={job} tpl={tpl} />)}
      </div>
    );
  }
  if (section.type === 'education') {
    return (
      <div style={{ display: 'grid', gap }}>
        {section.education?.filter((e) => !e.hidden).map((item) => <EducationBlock key={item.id} item={item} />)}
      </div>
    );
  }
  if (section.type === 'skills') return <SkillsBlock section={section} tpl={tpl} />;
  if (section.type === 'projects') {
    return (
      <div style={{ display: 'grid', gap }}>
        {section.projects?.filter((p) => !p.hidden).map((item) => <ProjectBlock key={item.id} item={item} />)}
      </div>
    );
  }
  if (section.type === 'certifications') {
    return (
      <div style={{ display: 'grid', gap: 6 }}>
        {section.certifications?.map((item) => <CertBlock key={item.id} item={item} />)}
      </div>
    );
  }
  if (section.type === 'achievements') {
    return (
      <div style={{ display: 'grid', gap }}>
        {section.achievements?.map((item) => <AchieveBlock key={item.id} item={item} />)}
      </div>
    );
  }
  if (section.type === 'languages') {
    const line = (section.languages || [])
      .filter((l) => l.name)
      .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
      .join('  ·  ');
    return <div>{line}</div>;
  }
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {section.custom?.map((c) => (
        <div key={c.id}>
          {c.heading ? <div style={{ fontWeight: 700 }}>{c.heading}</div> : null}
          {c.text ? <div>{c.text}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function ResumePreview({ resume }: { resume: ResumeData }) {
  const tpl = getTemplate(resume.templateId);
  const visible = resume.sections.filter((s) => s.visible && sectionHasContent(s));

  return (
    <article className="a4-page" style={pageStyle(resume.settings)} data-template={tpl.id}>
      <Header resume={resume} tpl={tpl} />
      <div style={{ display: 'grid', gap: sectionGap(resume.settings.spacing) }}>
        {visible.map((section) => (
          <section key={section.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <Heading title={section.title} tpl={tpl} />
            <SectionBody section={section} tpl={tpl} spacing={resume.settings.spacing} />
          </section>
        ))}
      </div>
    </article>
  );
}

export function MiniPreview({ resume, scale = 0.22 }: { resume: ResumeData; scale?: number }) {
  return (
    <div className="relative overflow-hidden rounded-sm bg-white" style={{ height: 297 * 3.78 * scale }}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${100 / scale}%`,
        }}
      >
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}