import { useState, type ReactNode } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { ACCENT_SWATCHES, FONT_OPTIONS, makeSection } from '../data/catalog';
import { uid } from '../lib/ids';
import type {
  ExperienceItem,
  FontFamily,
  FontSize,
  MarginScale,
  ResumeData,
  ResumeSection,
  SectionType,
  SpacingScale,
} from '../types/resume';
import { AreaField, CheckField, TextField } from './Field';

const ADDABLE: { type: SectionType; label: string }[] = [
  { type: 'summary', label: 'Summary' },
  { type: 'experience', label: 'Experience' },
  { type: 'education', label: 'Education' },
  { type: 'skills', label: 'Skills' },
  { type: 'projects', label: 'Projects' },
  { type: 'certifications', label: 'Certifications' },
  { type: 'achievements', label: 'Achievements' },
  { type: 'languages', label: 'Languages' },
  { type: 'custom', label: 'Custom section' },
];

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function Card({
  title,
  actions,
  children,
  collapsed,
  onToggle,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="rounded-sm border border-[#ddd4c4] bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-[#eee6d8] px-3 py-2">
        <button type="button" onClick={onToggle} className="flex min-w-0 items-center gap-2 text-left">
          {onToggle ? (
            collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />
          ) : null}
          <span className="truncate text-[13px] font-semibold tracking-wide text-ink">{title}</span>
        </button>
        <div className="flex items-center gap-1">{actions}</div>
      </div>
      {!collapsed ? <div className="space-y-3 p-3">{children}</div> : null}
    </div>
  );
}

function IconBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="rounded-sm p-1.5 text-[#6b6356] hover:bg-[#f4efe6] hover:text-ink"
    >
      {children}
    </button>
  );
}

function PersonalEditor({ resume, onChange }: { resume: ResumeData; onChange: (next: ResumeData) => void }) {
  const p = resume.personal;
  const set = (patch: Partial<typeof p>) => onChange({ ...resume, personal: { ...p, ...patch } });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField label="Full name" value={p.fullName} onChange={(e) => set({ fullName: e.target.value })} />
      <TextField
        label="Headline / target role"
        value={p.headline}
        onChange={(e) => set({ headline: e.target.value })}
        placeholder="Software Developer"
      />
      <TextField label="Email" value={p.email} onChange={(e) => set({ email: e.target.value })} />
      <TextField label="Phone" value={p.phone} onChange={(e) => set({ phone: e.target.value })} />
      <TextField
        label="Location"
        value={p.location}
        onChange={(e) => set({ location: e.target.value })}
        placeholder="City, Region"
      />
      <TextField
        label="LinkedIn"
        value={p.linkedin}
        onChange={(e) => set({ linkedin: e.target.value })}
        placeholder="linkedin.com/in/…"
      />
      <TextField
        label="GitHub"
        value={p.github}
        onChange={(e) => set({ github: e.target.value })}
        placeholder="github.com/…"
      />
      <TextField
        label="Website"
        value={p.website}
        onChange={(e) => set({ website: e.target.value })}
        placeholder="Optional"
      />
    </div>
  );
}

function ExperienceEditor({
  items,
  onChange,
}: {
  items: ExperienceItem[];
  onChange: (next: ExperienceItem[]) => void;
}) {
  const [drag, setDrag] = useState<number | null>(null);

  const update = (id: string, patch: Partial<ExperienceItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-3">
      {items.map((job, index) => (
        <div
          key={job.id}
          draggable
          onDragStart={() => setDrag(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (drag === null || drag === index) return;
            onChange(move(items, drag, index));
            setDrag(null);
          }}
          className={`rounded-sm border border-[#e7dfd0] bg-[#fbf8f2] p-3 ${drag === index ? 'drag-ghost' : ''}`}
        >
          <div className="mb-2 flex items-center justify-between text-[#8a8376]">
            <span className="inline-flex cursor-grab items-center gap-1 text-[11px] uppercase tracking-[0.12em]">
              <GripVertical size={13} /> Reorder role
            </span>
            <div className="flex items-center gap-1">
              <IconBtn label={job.hidden ? 'Show role' : 'Hide role'} onClick={() => update(job.id, { hidden: !job.hidden })}>
                {job.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </IconBtn>
              <IconBtn label="Delete role" onClick={() => onChange(items.filter((x) => x.id !== job.id))}>
                <Trash2 size={14} />
              </IconBtn>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Job title" value={job.title} onChange={(e) => update(job.id, { title: e.target.value })} />
            <TextField label="Company" value={job.company} onChange={(e) => update(job.id, { company: e.target.value })} />
            <TextField label="Location" value={job.location} onChange={(e) => update(job.id, { location: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <TextField label="Start" value={job.startDate} onChange={(e) => update(job.id, { startDate: e.target.value })} placeholder="Mar 2021" />
              <TextField
                label="End"
                value={job.current ? 'Present' : job.endDate}
                onChange={(e) => update(job.id, { endDate: e.target.value, current: false })}
                disabled={job.current}
              />
            </div>
          </div>
          <div className="mt-2">
            <CheckField label="Current role" checked={job.current} onChange={(current) => update(job.id, { current })} />
          </div>
          <div className="mt-3 space-y-2">
            {job.bullets.map((b, bi) => (
              <div key={b.id} className="flex gap-2">
                <textarea
                  rows={2}
                  value={b.text}
                  onChange={(e) =>
                    update(job.id, {
                      bullets: job.bullets.map((x) => (x.id === b.id ? { ...x, text: e.target.value } : x)),
                    })
                  }
                  placeholder={`Bullet ${bi + 1} — verb, scope, truthful result`}
                  className="w-full resize-y rounded-sm border border-[#ddd4c4] bg-white px-3 py-2 text-[13.5px] outline-none focus:border-[#b7a078]"
                />
                <IconBtn
                  label="Remove bullet"
                  onClick={() => update(job.id, { bullets: job.bullets.filter((x) => x.id !== b.id) })}
                >
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            ))}
            <button
              type="button"
              onClick={() => update(job.id, { bullets: [...job.bullets, { id: uid('b'), text: '' }] })}
              className="text-[12.5px] font-medium text-[#6b4f2a] hover:underline"
            >
              Add bullet
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...items,
            {
              id: uid('ex'),
              company: '',
              title: '',
              location: '',
              startDate: '',
              endDate: '',
              current: false,
              bullets: [{ id: uid('b'), text: '' }],
            },
          ])
        }
        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6b4f2a]"
      >
        <Plus size={14} /> Add role
      </button>
    </div>
  );
}

function SectionEditor({
  section,
  onChange,
}: {
  section: ResumeSection;
  onChange: (next: ResumeSection) => void;
}) {
  if (section.type === 'summary') {
    return (
      <AreaField
        label="Summary"
        rows={5}
        hint="2–4 honest sentences"
        value={section.summary || ''}
        onChange={(e) => onChange({ ...section, summary: e.target.value })}
      />
    );
  }

  if (section.type === 'experience') {
    return (
      <ExperienceEditor
        items={section.experience || []}
        onChange={(experience) => onChange({ ...section, experience })}
      />
    );
  }

  if (section.type === 'education') {
    const items = section.education || [];
    return (
      <div className="space-y-3">
        {items.map((ed) => (
          <div key={ed.id} className="space-y-3 rounded-sm border border-[#e7dfd0] bg-[#fbf8f2] p-3">
            <div className="flex justify-end">
              <IconBtn label="Delete school" onClick={() => onChange({ ...section, education: items.filter((x) => x.id !== ed.id) })}>
                <Trash2 size={14} />
              </IconBtn>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="School" value={ed.school} onChange={(e) => onChange({ ...section, education: items.map((x) => (x.id === ed.id ? { ...x, school: e.target.value } : x)) })} />
              <TextField label="Degree" value={ed.degree} onChange={(e) => onChange({ ...section, education: items.map((x) => (x.id === ed.id ? { ...x, degree: e.target.value } : x)) })} />
              <TextField label="Field" value={ed.field} onChange={(e) => onChange({ ...section, education: items.map((x) => (x.id === ed.id ? { ...x, field: e.target.value } : x)) })} />
              <TextField label="Location" value={ed.location} onChange={(e) => onChange({ ...section, education: items.map((x) => (x.id === ed.id ? { ...x, location: e.target.value } : x)) })} />
              <TextField label="Start" value={ed.startDate} onChange={(e) => onChange({ ...section, education: items.map((x) => (x.id === ed.id ? { ...x, startDate: e.target.value } : x)) })} />
              <TextField label="End" value={ed.endDate} onChange={(e) => onChange({ ...section, education: items.map((x) => (x.id === ed.id ? { ...x, endDate: e.target.value } : x)) })} />
              <TextField label="GPA (optional)" value={ed.gpa} onChange={(e) => onChange({ ...section, education: items.map((x) => (x.id === ed.id ? { ...x, gpa: e.target.value } : x)) })} />
              <TextField label="Details" value={ed.details} onChange={(e) => onChange({ ...section, education: items.map((x) => (x.id === ed.id ? { ...x, details: e.target.value } : x)) })} />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6b4f2a]"
          onClick={() =>
            onChange({
              ...section,
              education: [
                ...items,
                { id: uid('ed'), school: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '', details: '' },
              ],
            })
          }
        >
          <Plus size={14} /> Add school
        </button>
      </div>
    );
  }

  if (section.type === 'skills') {
    const groups = section.skills || [];
    return (
      <div className="space-y-3">
        {groups.map((g) => (
          <div key={g.id} className="grid gap-2 sm:grid-cols-[160px_1fr_auto]">
            <TextField
              label="Group"
              value={g.category}
              placeholder="Languages"
              onChange={(e) =>
                onChange({ ...section, skills: groups.map((x) => (x.id === g.id ? { ...x, category: e.target.value } : x)) })
              }
            />
            <TextField
              label="Items"
              value={g.items}
              placeholder="Comma-separated, only tools you can defend"
              onChange={(e) =>
                onChange({ ...section, skills: groups.map((x) => (x.id === g.id ? { ...x, items: e.target.value } : x)) })
              }
            />
            <div className="flex items-end">
              <IconBtn label="Remove group" onClick={() => onChange({ ...section, skills: groups.filter((x) => x.id !== g.id) })}>
                <Trash2 size={14} />
              </IconBtn>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6b4f2a]"
          onClick={() => onChange({ ...section, skills: [...groups, { id: uid('sk'), category: '', items: '' }] })}
        >
          <Plus size={14} /> Add skill group
        </button>
      </div>
    );
  }

  if (section.type === 'projects') {
    const items = section.projects || [];
    return (
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="space-y-3 rounded-sm border border-[#e7dfd0] bg-[#fbf8f2] p-3">
            <div className="flex justify-end gap-1">
              <IconBtn label={p.hidden ? 'Show' : 'Hide'} onClick={() => onChange({ ...section, projects: items.map((x) => (x.id === p.id ? { ...x, hidden: !x.hidden } : x)) })}>
                {p.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </IconBtn>
              <IconBtn label="Delete project" onClick={() => onChange({ ...section, projects: items.filter((x) => x.id !== p.id) })}>
                <Trash2 size={14} />
              </IconBtn>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Name" value={p.name} onChange={(e) => onChange({ ...section, projects: items.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)) })} />
              <TextField label="Link" value={p.link} onChange={(e) => onChange({ ...section, projects: items.map((x) => (x.id === p.id ? { ...x, link: e.target.value } : x)) })} />
              <TextField label="Stack" value={p.stack} onChange={(e) => onChange({ ...section, projects: items.map((x) => (x.id === p.id ? { ...x, stack: e.target.value } : x)) })} />
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Start" value={p.startDate} onChange={(e) => onChange({ ...section, projects: items.map((x) => (x.id === p.id ? { ...x, startDate: e.target.value } : x)) })} />
                <TextField label="End" value={p.endDate} onChange={(e) => onChange({ ...section, projects: items.map((x) => (x.id === p.id ? { ...x, endDate: e.target.value } : x)) })} />
              </div>
            </div>
            {p.bullets.map((b) => (
              <textarea
                key={b.id}
                rows={2}
                value={b.text}
                onChange={(e) =>
                  onChange({
                    ...section,
                    projects: items.map((x) =>
                      x.id === p.id ? { ...x, bullets: x.bullets.map((y) => (y.id === b.id ? { ...y, text: e.target.value } : y)) } : x,
                    ),
                  })
                }
                className="w-full rounded-sm border border-[#ddd4c4] bg-white px-3 py-2 text-[13.5px] outline-none focus:border-[#b7a078]"
              />
            ))}
            <button
              type="button"
              className="text-[12.5px] font-medium text-[#6b4f2a]"
              onClick={() =>
                onChange({
                  ...section,
                  projects: items.map((x) => (x.id === p.id ? { ...x, bullets: [...x.bullets, { id: uid('b'), text: '' }] } : x)),
                })
              }
            >
              Add bullet
            </button>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6b4f2a]"
          onClick={() =>
            onChange({
              ...section,
              projects: [
                ...items,
                { id: uid('pr'), name: '', link: '', stack: '', startDate: '', endDate: '', bullets: [{ id: uid('b'), text: '' }] },
              ],
            })
          }
        >
          <Plus size={14} /> Add project
        </button>
      </div>
    );
  }

  if (section.type === 'certifications') {
    const items = section.certifications || [];
    return (
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="grid gap-2 sm:grid-cols-2">
            <TextField label="Name" value={c.name} onChange={(e) => onChange({ ...section, certifications: items.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)) })} />
            <TextField label="Issuer" value={c.issuer} onChange={(e) => onChange({ ...section, certifications: items.map((x) => (x.id === c.id ? { ...x, issuer: e.target.value } : x)) })} />
            <TextField label="Date" value={c.date} onChange={(e) => onChange({ ...section, certifications: items.map((x) => (x.id === c.id ? { ...x, date: e.target.value } : x)) })} />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField label="Credential" value={c.credential} onChange={(e) => onChange({ ...section, certifications: items.map((x) => (x.id === c.id ? { ...x, credential: e.target.value } : x)) })} />
              </div>
              <IconBtn label="Delete" onClick={() => onChange({ ...section, certifications: items.filter((x) => x.id !== c.id) })}>
                <Trash2 size={14} />
              </IconBtn>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6b4f2a]"
          onClick={() =>
            onChange({
              ...section,
              certifications: [...items, { id: uid('ce'), name: '', issuer: '', date: '', credential: '' }],
            })
          }
        >
          <Plus size={14} /> Add certification
        </button>
      </div>
    );
  }

  if (section.type === 'achievements') {
    const items = section.achievements || [];
    return (
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
              <TextField label="Title" value={a.title} onChange={(e) => onChange({ ...section, achievements: items.map((x) => (x.id === a.id ? { ...x, title: e.target.value } : x)) })} />
              <TextField label="Date" value={a.date} onChange={(e) => onChange({ ...section, achievements: items.map((x) => (x.id === a.id ? { ...x, date: e.target.value } : x)) })} />
              <div className="flex items-end">
                <IconBtn label="Delete" onClick={() => onChange({ ...section, achievements: items.filter((x) => x.id !== a.id) })}>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>
            <AreaField
              label="Description"
              rows={2}
              value={a.description}
              onChange={(e) => onChange({ ...section, achievements: items.map((x) => (x.id === a.id ? { ...x, description: e.target.value } : x)) })}
            />
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6b4f2a]"
          onClick={() =>
            onChange({
              ...section,
              achievements: [...items, { id: uid('ac'), title: '', date: '', description: '' }],
            })
          }
        >
          <Plus size={14} /> Add achievement
        </button>
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = section.languages || [];
    return (
      <div className="space-y-2">
        {items.map((l) => (
          <div key={l.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <TextField label="Language" value={l.name} onChange={(e) => onChange({ ...section, languages: items.map((x) => (x.id === l.id ? { ...x, name: e.target.value } : x)) })} />
            <TextField label="Level" value={l.level} placeholder="Professional" onChange={(e) => onChange({ ...section, languages: items.map((x) => (x.id === l.id ? { ...x, level: e.target.value } : x)) })} />
            <div className="flex items-end">
              <IconBtn label="Delete" onClick={() => onChange({ ...section, languages: items.filter((x) => x.id !== l.id) })}>
                <Trash2 size={14} />
              </IconBtn>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6b4f2a]"
          onClick={() => onChange({ ...section, languages: [...items, { id: uid('ln'), name: '', level: '' }] })}
        >
          <Plus size={14} /> Add language
        </button>
      </div>
    );
  }

  const items = section.custom || [];
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <div key={c.id} className="space-y-2">
          <TextField
            label="Entry heading"
            value={c.heading}
            onChange={(e) => onChange({ ...section, custom: items.map((x) => (x.id === c.id ? { ...x, heading: e.target.value } : x)) })}
          />
          <AreaField
            label="Text"
            rows={3}
            value={c.text}
            onChange={(e) => onChange({ ...section, custom: items.map((x) => (x.id === c.id ? { ...x, text: e.target.value } : x)) })}
          />
        </div>
      ))}
    </div>
  );
}

export function Editor({ resume, onChange }: { resume: ResumeData; onChange: (next: ResumeData) => void }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ personal: true });
  const [secDrag, setSecDrag] = useState<number | null>(null);

  const patchSection = (id: string, next: ResumeSection) =>
    onChange({ ...resume, sections: resume.sections.map((s) => (s.id === id ? next : s)) });

  return (
    <div className="space-y-3">
      <Card
        title="Personal information"
        collapsed={!open.personal}
        onToggle={() => setOpen((o) => ({ ...o, personal: !o.personal }))}
      >
        <PersonalEditor resume={resume} onChange={onChange} />
      </Card>

      {resume.sections.map((section, index) => (
        <div
          key={section.id}
          draggable
          onDragStart={() => setSecDrag(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (secDrag === null || secDrag === index) return;
            onChange({ ...resume, sections: move(resume.sections, secDrag, index) });
            setSecDrag(null);
          }}
        >
          <Card
            title={section.visible ? section.title : `${section.title} (hidden)`}
            collapsed={!open[section.id]}
            onToggle={() => setOpen((o) => ({ ...o, [section.id]: !o[section.id] }))}
            actions={
              <>
                <span className="mr-1 hidden cursor-grab text-[10px] uppercase tracking-[0.12em] text-[#8a8376] sm:inline">
                  Drag
                </span>
                <IconBtn
                  label="Toggle visibility"
                  onClick={() => patchSection(section.id, { ...section, visible: !section.visible })}
                >
                  {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </IconBtn>
                <IconBtn
                  label="Delete section"
                  onClick={() => onChange({ ...resume, sections: resume.sections.filter((s) => s.id !== section.id) })}
                >
                  <Trash2 size={14} />
                </IconBtn>
              </>
            }
          >
            <TextField
              label="Section heading"
              hint="Prefer standard names"
              value={section.title}
              onChange={(e) => patchSection(section.id, { ...section, title: e.target.value })}
            />
            <SectionEditor section={section} onChange={(next) => patchSection(section.id, next)} />
          </Card>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 pt-1">
        {ADDABLE.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => onChange({ ...resume, sections: [...resume.sections, makeSection(opt.type)] })}
            className="inline-flex items-center gap-1 rounded-sm border border-[#ddd4c4] bg-white px-2.5 py-1.5 text-[12px] text-[#3a3f4b] hover:border-[#b7a078]"
          >
            <Plus size={12} /> {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TypeControls({ resume, onChange }: { resume: ResumeData; onChange: (next: ResumeData) => void }) {
  const s = resume.settings;
  const set = (patch: Partial<typeof s>) => onChange({ ...resume, settings: { ...s, ...patch } });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6356]">Font</span>
        <select
          value={s.fontFamily}
          onChange={(e) => set({ fontFamily: e.target.value as FontFamily })}
          className="w-full rounded-sm border border-[#ddd4c4] bg-[#fbf8f2] px-3 py-2 text-[13px]"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6356]">
          Size {s.fontSize}pt
        </span>
        <input
          type="range"
          min={10}
          max={12}
          step={0.5}
          value={s.fontSize}
          onChange={(e) => set({ fontSize: Number(e.target.value) as FontSize })}
          className="mt-2 w-full"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6356]">Spacing</span>
        <select
          value={s.spacing}
          onChange={(e) => set({ spacing: e.target.value as SpacingScale })}
          className="w-full rounded-sm border border-[#ddd4c4] bg-[#fbf8f2] px-3 py-2 text-[13px]"
        >
          <option value="compact">Compact</option>
          <option value="normal">Normal</option>
          <option value="relaxed">Relaxed</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6356]">Margins</span>
        <select
          value={s.margin}
          onChange={(e) => set({ margin: e.target.value as MarginScale })}
          className="w-full rounded-sm border border-[#ddd4c4] bg-[#fbf8f2] px-3 py-2 text-[13px]"
        >
          <option value="narrow">Narrow</option>
          <option value="normal">Normal</option>
          <option value="wide">Wide</option>
        </select>
      </label>
      <div className="sm:col-span-2">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6356]">
          Accent
        </span>
        <div className="flex flex-wrap gap-2">
          {ACCENT_SWATCHES.map((sw) => (
            <button
              key={sw.id}
              type="button"
              title={sw.label}
              onClick={() => set({ accent: sw.value })}
              className="h-7 w-7 rounded-full border border-black/10"
              style={{
                background: sw.value,
                outline: s.accent === sw.value ? '2px solid #6b4f2a' : undefined,
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
