import { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { analyzeATS, matchJobDescription } from '../lib/ats';
import type { ATSIssue, ResumeData } from '../types/resume';

function tone(score: number) {
  if (score >= 82) return { label: 'Strong structure', color: '#1c4532', ring: '#1c4532' };
  if (score >= 64) return { label: 'Needs polish', color: '#6b4f2a', ring: '#6b4f2a' };
  return { label: 'Not ready', color: '#7a2e2e', ring: '#7a2e2e' };
}

function IssueIcon({ severity }: { severity: ATSIssue['severity'] }) {
  if (severity === 'block') return <ShieldAlert size={14} className="mt-0.5 shrink-0 text-[#7a2e2e]" />;
  if (severity === 'warn') return <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[#8a5a1a]" />;
  if (severity === 'pass') return <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#1c4532]" />;
  return <Info size={14} className="mt-0.5 shrink-0 text-[#4a5a72]" />;
}

export function AtsPanel({
  resume,
  onJdChange,
}: {
  resume: ResumeData;
  onJdChange: (value: string) => void;
}) {
  const report = useMemo(() => analyzeATS(resume), [resume]);
  const match = useMemo(
    () => matchJobDescription(resume, resume.jobDescription),
    [resume],
  );
  const look = tone(report.score);

  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-[#ddd4c4] bg-[#fbf8f2] p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b6356]">
              ATS compatibility
            </p>
            <p className="mt-1 font-display text-3xl leading-none text-ink">{report.score}</p>
            <p className="mt-1 text-[12px]" style={{ color: look.color }}>
              {look.label}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-[#5c564b]">
            <span>Parse {report.parseScore}</span>
            <span>Complete {report.completeScore}</span>
            <span>Content {report.contentScore}</span>
            <span>Read {report.readScore}</span>
            <span>~{report.pageEstimate}p</span>
            <span>{report.wordCount} words</span>
          </div>
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-[#6b6356]">{report.disclaimer}</p>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b6356]">Findings</p>
        {report.issues.length === 0 ? (
          <p className="text-[13px] text-[#3a3f4b]">No structural issues detected on this draft.</p>
        ) : (
          <ul className="space-y-2">
            {report.issues.map((issue) => (
              <li key={issue.id} className="flex gap-2 rounded-sm border border-[#e4dccb] bg-white px-3 py-2.5">
                <IssueIcon severity={issue.severity} />
                <div>
                  <p className="text-[13px] font-semibold text-ink">{issue.title}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[#5c564b]">{issue.detail}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#3a3f4b]">{issue.suggestion}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b6356]">
          Job description match
        </p>
        <p className="mt-1 mb-2 text-[12px] leading-relaxed text-[#6b6356]">
          Compare only against words already on your resume. Missing keywords are suggestions to consider — never add
          a skill you have not used.
        </p>
        <textarea
          value={resume.jobDescription}
          onChange={(e) => onJdChange(e.target.value)}
          rows={7}
          placeholder="Paste the posting here…"
          className="w-full resize-y rounded-sm border border-[#ddd4c4] bg-white px-3 py-2 text-[13px] leading-relaxed outline-none focus:border-[#b7a078]"
        />
        {resume.jobDescription.trim() ? (
          <div className="mt-3 space-y-3">
            <p className="text-[13px] text-ink">
              Overlap score <span className="font-semibold">{match.score}</span>
              <span className="text-[#6b6356]"> · {match.jdWordCount} words in posting</span>
            </p>
            {match.matched.length ? (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1c4532]">Already present</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#3a3f4b]">{match.matched.join(' · ')}</p>
              </div>
            ) : null}
            {match.missing.length ? (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b4f2a]">
                  In the posting, not on the resume
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#3a3f4b]">{match.missing.join(' · ')}</p>
                <p className="mt-1 text-[11.5px] text-[#6b6356]">
                  Add a term only if it is true of your work. Do not copy the posting verbatim.
                </p>
              </div>
            ) : null}
            {match.sectionGaps.map((g) => (
              <p key={g} className="text-[12.5px] text-[#3a3f4b]">
                {g}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
