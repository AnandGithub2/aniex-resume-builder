import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Download, Save } from 'lucide-react';
import { AtsPanel } from '../components/AtsPanel';
import { Editor, TypeControls } from '../components/Editor';
import { ResumePreview } from '../components/ResumePreview';
import { RolePicker, TemplateGallery } from '../components/TemplateGallery';
import { getRole, getTemplate, TEMPLATES } from '../data/catalog';
import { analyzeATS } from '../lib/ats';
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

  const [zoom, setZoom] = useState(0.82);
  const resumeRef = useRef<HTMLDivElement>(null);

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

const runExport = async () => {
  if (!resumeRef.current) return;

  await exportResumePdf(
    resumeRef.current,
    `${resume.personal.fullName || resume.name || 'resume'}.pdf`,
  );
};

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
              onClick={runExport}
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
      width: '210mm',
      height: '297mm',
    }}
  >
    <div
      id="resume-print"
      ref={resumeRef}
      style={{
        width: '210mm',
        minHeight: '297mm',
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

    </div>
  );
}