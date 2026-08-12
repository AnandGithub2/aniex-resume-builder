import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Download, Save } from 'lucide-react';
import { AtsPanel } from '../components/AtsPanel';
import { Editor, TypeControls } from '../components/Editor';
import { ResumePreview } from '../components/ResumePreview';
import { RolePicker, TemplateGallery } from '../components/TemplateGallery';
import { getRole, getTemplate, TEMPLATES } from '../data/catalog';
import { analyzeATS, preflight } from '../lib/ats';
import { exportResumePdf } from '../lib/pdf';
import { duplicateResume, exportJson, getResume, saveResume } from '../lib/storage';
import type { ResumeData } from '../types/resume';

type Tab = 'write' | 'design' | 'ats';

export function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();

  return <BuilderContent key={id ?? 'missing'} id={id} navigate={navigate} />;
}

function BuilderContent({ id, navigate }: { id?: string; navigate: ReturnType<typeof useNavigate> }) {
  const [resume, setResume] = useState<ResumeData | null>(() => (id ? getResume(id) : null));
  const [tab, setTab] = useState<Tab>('write');
  const [savedFlash, setSavedFlash] = useState(false);
  const [preflightOpen, setPreflightOpen] = useState(false);
  const [zoom, setZoom] = useState(0.82);

  useEffect(() => {
    if (!id || !resume) {
      navigate('/');
    }
  }, [id, navigate, resume]);

  useEffect(() => {
    if (!resume) return;
    const handle = window.setTimeout(() => {
      saveResume(resume);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [resume]);

  const report = useMemo(() => (resume ? analyzeATS(resume) : null), [resume]);

  if (!resume || !report) {
    return (
      <div className="paper-grid grid min-h-screen place-items-center text-[#6b6356]">
        Loading draft…
      </div>
    );
  }

  const update = (next: ResumeData) => setResume(next);
  const tpl = getTemplate(resume.templateId);
  const role = getRole(resume.roleId);

  const persist = () => {
    const stored = saveResume(resume);
    setResume(stored);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1400);
  };

  const runExport = () => {
    exportResumePdf(resume);
    setPreflightOpen(false);
  };

  const tryExport = () => {
    setPreflightOpen(true);
  };

  const check = preflight(resume);

  return (
    <div className="paper-grid min-h-screen">
      <header className="no-print sticky top-0 z-20 border-b border-[#ddd4c4] bg-[#fbf8f2]/95 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="font-display text-[18px] tracking-tight">
              Folio<span className="text-[#6b4f2a]">ATS</span>
            </Link>
            <input
              value={resume.name}
              onChange={(e) => update({ ...resume, name: e.target.value })}
              className="w-[220px] truncate border-b border-transparent bg-transparent text-[13.5px] outline-none focus:border-[#c9b896]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
            <span className="hidden text-[#6b6356] md:inline">
              {role.name} · {tpl.name} · score {report.score}
            </span>
            <button
              type="button"
              onClick={persist}
              className="inline-flex items-center gap-1 rounded-sm border border-[#ddd4c4] bg-white px-2.5 py-1.5"
            >
              <Save size={13} /> {savedFlash ? 'Saved' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                const copy = duplicateResume(resume.id);
                if (copy) navigate(`/builder/${copy.id}`);
              }}
              className="rounded-sm border border-[#ddd4c4] bg-white px-2.5 py-1.5"
            >
              Duplicate
            </button>
            <button
              type="button"
              onClick={() => exportJson(resume)}
              className="rounded-sm border border-[#ddd4c4] bg-white px-2.5 py-1.5"
            >
              JSON
            </button>
            <button
              type="button"
              onClick={tryExport}
              className="inline-flex items-center gap-1 rounded-sm bg-[#1a1d23] px-3 py-1.5 text-[#fbf8f2]"
            >
              <Download size={13} /> Export PDF
            </button>
          </div>
        </div>
      </header>

      <div className="grid items-start gap-0 xl:grid-cols-[minmax(360px,42%)_1fr]">
        <aside className="no-print border-b border-[#ddd4c4] bg-[#fbf8f2] xl:sticky xl:top-[53px] xl:h-[calc(100vh-53px)] xl:overflow-y-auto xl:border-r xl:border-b-0">
          <div className="flex gap-1 border-b border-[#ddd4c4] px-3 pt-3">
            {(
              [
                ['write', 'Write'],
                ['design', 'Design'],
                ['ats', 'ATS check'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className="px-3 py-2 text-[12.5px]"
                style={{
                  borderBottom: tab === id ? '2px solid #1a1d23' : '2px solid transparent',
                  fontWeight: tab === id ? 650 : 450,
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-4">
            {tab === 'write' ? <Editor resume={resume} onChange={update} /> : null}
            {tab === 'design' ? (
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b6356]">
                    Target role
                  </p>
                  <RolePicker
                    value={resume.roleId}
                    onChange={(roleId) => {
                      const nextRole = getRole(roleId);
                      const recommended = TEMPLATES.find((t) => t.id === nextRole.recommendedTemplateId);
                      update({
                        ...resume,
                        roleId,
                        templateId: recommended ? recommended.id : resume.templateId,
                        settings: recommended
                          ? {
                              ...resume.settings,
                              fontFamily: recommended.defaultFont,
                              fontSize: recommended.defaultSize,
                              spacing: recommended.defaultSpacing,
                              margin: recommended.defaultMargin,
                              accent: recommended.defaultAccent,
                            }
                          : resume.settings,
                      });
                    }}
                  />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b6356]">
                    Template
                  </p>
                  <TemplateGallery
                    resume={resume}
                    onPick={(templateId) => {
                      const next = getTemplate(templateId);
                      update({
                        ...resume,
                        templateId,
                        settings: {
                          ...resume.settings,
                          fontFamily: next.defaultFont,
                          fontSize: next.defaultSize,
                          spacing: next.defaultSpacing,
                          margin: next.defaultMargin,
                          accent: next.defaultAccent,
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b6356]">
                    Type and color
                  </p>
                  <TypeControls resume={resume} onChange={update} />
                </div>
              </div>
            ) : null}
            {tab === 'ats' ? (
              <AtsPanel resume={resume} onJdChange={(jobDescription) => update({ ...resume, jobDescription })} />
            ) : null}
          </div>
        </aside>

        <section className="min-h-[70vh] overflow-auto px-4 py-6">
          <div className="no-print mb-3 flex items-center justify-between text-[12px] text-[#6b6356]">
            <span>
              A4 preview · {tpl.name} · ~{report.pageEstimate} pages
            </span>
            <label className="flex items-center gap-2">
              Zoom
              <input
                type="range"
                min={0.48}
                max={1}
                step={0.02}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="flex justify-center overflow-auto pb-16">
            <div
              style={{
                width: `${210 * 3.7795 * zoom}px`,
                height: `${297 * 3.7795 * zoom}px`,
              }}
            >
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                }}
              >
                <ResumePreview resume={resume} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {preflightOpen ? (
        <div className="no-print fixed inset-0 z-40 grid place-items-center bg-[#1a1d23]/45 px-4">
          <div className="w-full max-w-lg border border-[#ddd4c4] bg-[#fbf8f2] p-5 shadow-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b4f2a]">
              ATS preflight
            </p>
            <h2 className="font-display mt-1 text-2xl">Before this PDF leaves the browser</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#3a3f4b]">
              Compatibility score {check.report.score}. This is a structure and readability check, not a prediction that
              an employer will accept the file.
            </p>
            {check.blockers.length ? (
              <div className="mt-3 border border-[#e3c8c8] bg-white p-3">
                <p className="text-[13px] font-semibold text-[#7a2e2e]">Blocking issues</p>
                <ul className="mt-1 list-disc pl-4 text-[13px] text-[#3a3f4b]">
                  {check.blockers.map((i) => (
                    <li key={i.id}>{i.title}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[12px] text-[#6b6356]">
                  Export is still possible, but the file is likely incomplete for most ATS records.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-[13px] text-[#1c4532]">No blocking identity issues.</p>
            )}
            {check.warnings.length ? (
              <ul className="mt-3 space-y-1 text-[13px] text-[#3a3f4b]">
                {check.warnings.slice(0, 5).map((i) => (
                  <li key={i.id}>· {i.title}</li>
                ))}
              </ul>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreflightOpen(false)}
                className="rounded-sm border border-[#ddd4c4] bg-white px-3 py-1.5 text-[13px]"
              >
                Keep editing
              </button>
              <button
                type="button"
                onClick={runExport}
                className="rounded-sm bg-[#1a1d23] px-3 py-1.5 text-[13px] text-[#fbf8f2]"
              >
                Export selectable PDF
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}