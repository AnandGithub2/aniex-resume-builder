import { getRole, getTemplate, ROLES, TEMPLATES } from '../data/catalog';
import type { ResumeData } from '../types/resume';

export function TemplateGallery({
  resume,
  onPick,
}: {
  resume: ResumeData;
  onPick: (templateId: string, applyDefaults?: boolean) => void;
}) {
  const role = getRole(resume.roleId);

  return (
    <div className="space-y-4">
      <p className="text-[12.5px] leading-relaxed text-[#5c564b]">
        Switching templates never discards your text. Recommended for{' '}
        <span className="font-semibold text-ink">
          {getTemplate(role.recommendedTemplateId).name}
        </span>
        .
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {TEMPLATES.map((tpl) => {
          const active = resume.templateId === tpl.id;
          const rec = tpl.id === role.recommendedTemplateId;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onPick(tpl.id)}
              className="rounded-sm border p-3 text-left transition"
              style={{
                borderColor: active ? '#6b4f2a' : '#ddd4c4',
                background: active ? '#f7f0e4' : '#fff',
              }}
            >
              <TemplateThumb
                templateId={tpl.id}
                accent={active ? resume.settings.accent : tpl.defaultAccent}
              />

              <div className="mt-2 flex items-baseline justify-between gap-2">
                <p className="text-[13px] font-semibold text-ink">
                  {tpl.name}
                </p>

                {rec ? (
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#6b4f2a]">
                    Recommended
                  </span>
                ) : null}
              </div>

              <p className="mt-0.5 text-[11.5px] leading-snug text-[#6b6356]">
                {tpl.tagline}
              </p>

              <p className="mt-1 text-[11px] text-[#8a8376]">
                {tpl.bestFor.join(' · ')}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RolePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (roleId: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {ROLES.map((role) => {
        const rec = getTemplate(role.recommendedTemplateId);
        const active = value === role.id;

        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            className="rounded-sm border px-3 py-3 text-left"
            style={{
              borderColor: active ? '#6b4f2a' : '#ddd4c4',
              background: active ? '#f7f0e4' : '#fff',
            }}
          >
            <p className="text-[13.5px] font-semibold text-ink">
              {role.name}
            </p>

            <p className="mt-1 text-[12px] leading-snug text-[#5c564b]">
              {role.blurb}
            </p>

            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[#8a8376]">
              Suggests {rec.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function TemplateThumb({
  templateId,
  accent,
}: {
  templateId: string;
  accent: string;
}) {
  const tpl = getTemplate(templateId);
  const lines = [88, 72, 80, 64, 76];

  const centered =
    tpl.header === 'centered-classic' ||
    tpl.header === 'executive' ||
    tpl.header === 'letterhead';

  return (
    <div className="h-[86px] overflow-hidden rounded-[2px] border border-[#ece4d4] bg-white px-2.5 py-2">
      <div
        className="mb-1.5 text-[9px] font-semibold"
        style={{
          color: accent,
          textAlign: centered ? 'center' : 'left',
          letterSpacing: tpl.header === 'executive' ? '0.12em' : 0,
        }}
      >
        {tpl.header === 'executive' ? 'CANDIDATE NAME' : 'Candidate Name'}
      </div>

      <div
        className="mb-1 h-px"
        style={{
          background: accent,
          opacity: 0.7,
        }}
      />

      {lines.map((width, index) => (
        <div
          key={index}
          className="mb-[3px] h-[4px] bg-[#e7dfd0]"
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );
}