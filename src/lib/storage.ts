import type { ResumeData } from '../types/resume';

const KEY = 'atsfolio.resumes.v1';
const ACTIVE = 'atsfolio.active.v1';

function readAll(): ResumeData[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ResumeData[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list: ResumeData[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function listResumes(): ResumeData[] {
  return readAll().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getResume(id: string): ResumeData | null {
  return readAll().find((r) => r.id === id) || null;
}

export function saveResume(resume: ResumeData): ResumeData {
  const next = { ...resume, updatedAt: new Date().toISOString() };
  const all = readAll();
  const idx = all.findIndex((r) => r.id === next.id);
  if (idx >= 0) all[idx] = next;
  else all.unshift(next);
  writeAll(all);
  localStorage.setItem(ACTIVE, next.id);
  return next;
}

export function deleteResume(id: string) {
  writeAll(readAll().filter((r) => r.id !== id));
  if (localStorage.getItem(ACTIVE) === id) localStorage.removeItem(ACTIVE);
}

export function duplicateResume(id: string): ResumeData | null {
  const src = getResume(id);
  if (!src) return null;
  const copy: ResumeData = {
    ...JSON.parse(JSON.stringify(src)),
    id: `cv_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`,
    name: `${src.name} (copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return saveResume(copy);
}

export function getActiveId(): string | null {
  return localStorage.getItem(ACTIVE);
}

export function setActiveId(id: string) {
  localStorage.setItem(ACTIVE, id);
}

export function exportJson(resume: ResumeData) {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug(resume.name || 'resume')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'resume';
}
