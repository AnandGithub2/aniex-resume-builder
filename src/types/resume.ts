export type SectionType =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'languages'
  | 'custom';

export type FontFamily =
  | 'georgia'
  | 'times'
  | 'garamond'
  | 'calibri'
  | 'cambria'
  | 'arial';

export type SpacingScale = 'compact' | 'normal' | 'relaxed';
export type MarginScale = 'narrow' | 'normal' | 'wide';
export type FontSize = 10 | 10.5 | 11 | 11.5 | 12;

export type HeaderVariant =
  | 'centered-classic'
  | 'left-stacked'
  | 'left-rule'
  | 'letterhead'
  | 'inline-title'
  | 'executive'
  | 'stacked-labels'
  | 'split-contact';

export type HeadingVariant =
  | 'uppercase-tracked'
  | 'uppercase-rule'
  | 'title-underline'
  | 'title-border'
  | 'smallcaps'
  | 'centered-uppercase'
  | 'boxed-rules'
  | 'accent-left';

export type SkillsDisplay =
  | 'comma'
  | 'pipe'
  | 'grouped'
  | 'semicolon';

export type ExperienceLayout =
  | 'title-dates'
  | 'company-first'
  | 'stacked';

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface BulletItem {
  id: string;
  text: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: BulletItem[];
  hidden?: boolean;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  details: string;
  hidden?: boolean;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  stack: string;
  startDate: string;
  endDate: string;
  bullets: BulletItem[];
  hidden?: boolean;
}

export interface CertItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credential: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface CustomItem {
  id: string;
  heading: string;
  text: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  summary?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: SkillGroup[];
  projects?: ProjectItem[];
  certifications?: CertItem[];
  achievements?: AchievementItem[];
  languages?: LanguageItem[];
  custom?: CustomItem[];
}

export interface ResumeSettings {
  fontFamily: FontFamily;
  fontSize: FontSize;
  spacing: SpacingScale;
  margin: MarginScale;
  accent: string;

  // Controls the vertical distance between
  // section title and its underline/rule.
  headingLineGap: number;
}

export interface ResumeData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  roleId: string;
  templateId: string;
  settings: ResumeSettings;
  personal: PersonalInfo;
  sections: ResumeSection[];
  jobDescription: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  tagline: string;
  roleLabel: string;
  bestFor: string[];

  header: HeaderVariant;
  heading: HeadingVariant;
  skills: SkillsDisplay;
  experience: ExperienceLayout;

  defaultFont: FontFamily;
  defaultSize: FontSize;
  defaultSpacing: SpacingScale;
  defaultMargin: MarginScale;
  defaultAccent: string;

  nameSize: number;
  ruleWeight: number;
  contactSeparator: string;

  headingCase: 'upper' | 'title' | 'small';

  description: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  blurb: string;

  recommendedTemplateId: string;
  alternateTemplateIds: string[];

  defaultSectionOrder: SectionType[];
  sectionTitles: Partial<Record<SectionType, string>>;

  expectedHeadings: string[];
  usefulKeywords: string[];
}

export type ATSSeverity =
  | 'pass'
  | 'info'
  | 'warn'
  | 'block';

export interface ATSIssue {
  id: string;
  severity: ATSSeverity;

  category:
    | 'parse'
    | 'complete'
    | 'content'
    | 'read'
    | 'match'
    | 'format';

  title: string;
  detail: string;
  suggestion: string;
}

export interface ATSReport {
  score: number;
  parseScore: number;
  completeScore: number;
  contentScore: number;
  readScore: number;

  issues: ATSIssue[];

  pageEstimate: number;
  wordCount: number;

  disclaimer: string;
}

export interface JDMatchReport {
  score: number;
  matched: string[];
  missing: string[];
  sectionGaps: string[];
  notes: string[];
  jdWordCount: number;
}