import type { ResumeData } from '../types/resume';
import { supabase } from './supabase';

const BASE_KEY = 'atsfolio.resumes.v1';
const ACTIVE_BASE_KEY = 'atsfolio.active.v1';

let currentUserId: string | null = null;

function getResumeKey() {
  return currentUserId
    ? `${BASE_KEY}.${currentUserId}`
    : null;
}

function getActiveKey() {
  return currentUserId
    ? `${ACTIVE_BASE_KEY}.${currentUserId}`
    : null;
}

// Keep the current Supabase user ID updated.
supabase.auth.getSession().then(({ data }) => {
  currentUserId = data.session?.user.id ?? null;
});

supabase.auth.onAuthStateChange((_event, session) => {
  currentUserId = session?.user.id ?? null;
});

function readAll(): ResumeData[] {
  const key = getResumeKey();

  if (!key) return [];

  try {
    const raw = localStorage.getItem(key);

    if (!raw) return [];

    const parsed = JSON.parse(raw) as ResumeData[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list: ResumeData[]) {
  const key = getResumeKey();

  if (!key) return;

  localStorage.setItem(key, JSON.stringify(list));
}

export function listResumes(): ResumeData[] {
  return readAll().sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1
  );
}

export function getResume(id: string): ResumeData | null {
  return readAll().find((r) => r.id === id) || null;
}

export function saveResume(resume: ResumeData): ResumeData {
  const key = getResumeKey();
  const activeKey = getActiveKey();

  if (!key || !activeKey) {
    throw new Error('You must be logged in to save a resume.');
  }

  const next = {
    ...resume,
    updatedAt: new Date().toISOString(),
  };

  const all = readAll();

  const idx = all.findIndex((r) => r.id === next.id);

  if (idx >= 0) {
    all[idx] = next;
  } else {
    all.unshift(next);
  }

  writeAll(all);

  localStorage.setItem(activeKey, next.id);

  return next;
}

export function deleteResume(id: string) {
  const activeKey = getActiveKey();

  writeAll(readAll().filter((r) => r.id !== id));

  if (
    activeKey &&
    localStorage.getItem(activeKey) === id
  ) {
    localStorage.removeItem(activeKey);
  }
}

export function duplicateResume(
  id: string
): ResumeData | null {
  const src = getResume(id);

  if (!src) return null;

  const copy: ResumeData = {
    ...JSON.parse(JSON.stringify(src)),
    id: `cv_${Math.random()
      .toString(36)
      .slice(2, 9)}_${Date.now().toString(36)}`,
    name: `${src.name} (copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return saveResume(copy);
}

export function getActiveId(): string | null {
  const key = getActiveKey();

  if (!key) return null;

  return localStorage.getItem(key);
}

export function setActiveId(id: string) {
  const key = getActiveKey();

  if (!key) return;

  localStorage.setItem(key, id);
}

export function exportJson(resume: ResumeData) {
  const blob = new Blob(
    [JSON.stringify(resume, null, 2)],
    {
      type: 'application/json',
    }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href = url;
  a.download = `${slug(
    resume.name || 'resume'
  )}.json`;

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