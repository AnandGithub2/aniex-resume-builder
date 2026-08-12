import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, ShieldCheck, Type } from 'lucide-react';
import { createResume, getRole, getTemplate, ROLES, sampleResume, TEMPLATES } from '../data/catalog';
import { deleteResume, listResumes, saveResume } from '../lib/storage';
import type { ResumeData } from '../types/resume';

export function Home() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<ResumeData[]>(() => listResumes());

  const start = (roleId: string) => {
    const resume = saveResume(createResume(roleId, `${getRole(roleId).name} resume`));
    navigate(`/builder/${resume.id}`);
  };

  const openSample = () => {
    const resume = saveResume(sampleResume());
    navigate(`/builder/${resume.id}`);
  };

  return (
    <div className="paper-grid min-h-screen text-ink">
      <header className="no-print border-b border-[#ddd4c4] bg-[#fbf8f2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="font-display text-[22px] tracking-tight">
          ANIEX<span className="text-[#6b4f2a]">ATS</span>
          </Link>
          <div className="flex items-center gap-4 text-[13px]">
            <a href="#templates" className="text-[#3a3f4b] hover:text-ink">
              Templates
            </a>
            <a href="#method" className="text-[#3a3f4b] hover:text-ink">
              Method
            </a>
            <button
              type="button"
              onClick={openSample}
              className="rounded-sm border border-[#c9b896] bg-white px-3 py-1.5 text-[12.5px] hover:bg-[#f7f0e4]"
            >
              Open sample
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-end gap-10 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#6b4f2a]">
              ATS-first resume studio
            </p>
            <h1 className="font-display mt-3 max-w-xl text-[46px] leading-[1.05] tracking-tight sm:text-[56px]">
              Write a resume a parser can read and a recruiter will finish.
            </h1>
            <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-[#3a3f4b]">
              Fifteen single-column templates. One shared data model. Live A4 preview. Selectable-text PDF. A
              compatibility score that never invents skills — and never claims a guaranteed interview.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => start('software-developer')}
                className="inline-flex items-center gap-2 rounded-sm bg-[#1a1d23] px-4 py-2.5 text-[13.5px] text-[#fbf8f2]"
              >
                Start a draft <ArrowRight size={15} />
              </button>
              <a
                href="#roles"
                className="inline-flex items-center gap-2 rounded-sm border border-[#c9b896] bg-white px-4 py-2.5 text-[13.5px]"
              >
                Choose a role
              </a>
            </div>
          </div>
          <aside className="border border-[#ddd4c4] bg-[#fbf8f2] p-5 shadow-[0_20px_40px_-28px_rgba(26,29,35,0.45)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b6356]">What this will not do</p>
            <ul className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-[#3a3f4b]">
              <li>Promise 100% ATS or recruiter acceptance.</li>
              <li>Suggest fake tools, titles, or metrics.</li>
              <li>Export icons, charts, photos, or image-based text.</li>
              <li>Hide your words inside text boxes a parser cannot select.</li>
            </ul>
            <p className="mt-4 border-t border-[#e7dfd0] pt-3 text-[12.5px] leading-relaxed text-[#6b6356]">
              FolioATS optimizes for parse-safe structure and human readability. Hiring decisions stay with people and
              their software.
            </p>
          </aside>
        </section>

        {saved.length ? (
          <section className="border-y border-[#ddd4c4] bg-[#fbf8f2]/70">
            <div className="mx-auto max-w-6xl px-5 py-10">
              <div className="flex items-end justify-between">
                <h2 className="font-display text-2xl">Saved locally</h2>
                <p className="text-[12px] text-[#6b6356]">Stored in this browser only</p>
              </div>
              <ul className="mt-5 grid gap-3 md:grid-cols-3">
                {saved.map((r) => (
                  <li key={r.id} className="border border-[#ddd4c4] bg-white p-4">
                    <p className="font-semibold">{r.name}</p>
                    <p className="mt-1 text-[12px] text-[#6b6356]">
                      {getRole(r.roleId).name} · {getTemplate(r.templateId).name}
                    </p>
                    <p className="mt-1 text-[11px] text-[#8a8376]">
                      Updated {new Date(r.updatedAt).toLocaleString()}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Link
                        to={`/builder/${r.id}`}
                        className="rounded-sm bg-[#1a1d23] px-2.5 py-1 text-[12px] text-white"
                      >
                        Open
                      </Link>
                      <button
                        type="button"
                        className="text-[12px] text-[#7a2e2e]"
                        onClick={() => {
                          deleteResume(r.id);
                          setSaved(listResumes());
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section id="roles" className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="font-display text-3xl">Start from the job, not the decoration</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-[#3a3f4b]">
            Each role recommends a template and a section order. You can switch either later without losing a word.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => start(role.id)}
                className="group border border-[#ddd4c4] bg-white p-4 text-left hover:border-[#b7a078]"
              >
                <p className="text-[15px] font-semibold">{role.name}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#5c564b]">{role.blurb}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#6b4f2a]">
                  {getTemplate(role.recommendedTemplateId).name}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section id="templates" className="border-y border-[#ddd4c4] bg-[#f7f0e4]/50">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <h2 className="font-display text-3xl">Fifteen templates. One column. Shared data.</h2>
            <p className="mt-2 max-w-2xl text-[15px] text-[#3a3f4b]">
              Different headers, heading treatments, skill punctuation, and type defaults — never multi-column traps or
              icon rows.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((tpl) => (
                <article key={tpl.id} className="border border-[#ddd4c4] bg-white p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#8a8376]">{tpl.roleLabel}</p>
                  <h3 className="mt-1 font-display text-xl">{tpl.name}</h3>
                  <p className="mt-1 text-[13px] text-[#3a3f4b]">{tpl.tagline}</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#5c564b]">{tpl.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="method" className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="font-display text-3xl">How the score works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Parse and structure',
                body: 'Name, email, standard headings, dates, and single-column selectable text. No tables pretending to be layout.',
              },
              {
                icon: FileText,
                title: 'Job match, honestly',
                body: 'We highlight posting words that already appear — and list missing ones you may add only if they are true.',
              },
              {
                icon: Type,
                title: 'Human readability',
                body: 'Conservative type, real hierarchy, and a preflight check before the PDF leaves your browser.',
              },
            ].map((item) => (
              <div key={item.title} className="border-t border-[#1a1d23] pt-4">
                <item.icon size={18} />
                <h3 className="mt-3 text-[16px] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#3a3f4b]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ddd4c4] px-5 py-8 text-center text-[12px] text-[#6b6356]">
        FolioATS · Local drafts · Selectable-text A4 PDF · Not a hiring guarantee
      </footer>
    </div>
  );
}