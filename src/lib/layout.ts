import type { CSSProperties } from 'react';
import type { ResumeData, ResumeSettings } from '../types/resume';
import { fontStack } from '../data/catalog';

export function pagePadding(margin: ResumeSettings['margin']) {
  if (margin === 'narrow') return '14mm 13mm';
  if (margin === 'wide') return '22mm 22mm';
  return '18mm 17mm';
}

export function sectionGap(spacing: ResumeSettings['spacing']) {
  if (spacing === 'compact') return '11px';
  if (spacing === 'relaxed') return '18px';
  return '14px';
}

export function itemGap(spacing: ResumeSettings['spacing']) {
  if (spacing === 'compact') return '8px';
  if (spacing === 'relaxed') return '13px';
  return '10px';
}

export function lineHeight(spacing: ResumeSettings['spacing']) {
  if (spacing === 'compact') return 1.32;
  if (spacing === 'relaxed') return 1.5;
  return 1.4;
}

export function pageStyle(settings: ResumeSettings): CSSProperties {
  return {
    boxSizing: 'border-box',
    width: '210mm',
    minWidth: '210mm',
    minHeight: '297mm',
    backgroundColor: '#ffffff',

    fontFamily: fontStack(settings.fontFamily),
    fontSize: `${settings.fontSize}pt`,
    lineHeight: lineHeight(settings.spacing),
    color: '#1a1d23',

    padding: pagePadding(settings.margin),

    ['--accent' as string]: settings.accent,
  };
}

export function dateLine(
  start: string,
  end: string,
  current?: boolean,
) {
  const right = current ? 'Present' : end;

  if (start && right) {
    return `${start} – ${right}`;
  }

  return start || right || '';
}

export function contactList(resume: ResumeData) {
  const p = resume.personal;

  return [
    p.email,
    p.phone,
    p.location,
    p.linkedin,
    p.github,
    p.website,
  ]
    .map((v) => v.trim())
    .filter(Boolean);
}