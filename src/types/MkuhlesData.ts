import type { TranslationEntry, TranslationList } from "../i18n/types";

export type SocialPlatform = "github" | "linkedin";

export interface ContactSocial {
  platform: SocialPlatform;
  url: string;
}

export interface ContactData {
  full_name: string;
  email: string;
  socials: ContactSocial[];
}

export interface ProfileData {
  title: TranslationEntry;
  statement: TranslationList;
  bullets: TranslationEntry[];
}

export interface SkillData {
  name: string;
  knowledge: number;
  since: number;
  examples: TranslationList;
}

export interface ExperienceProjectData {
  name: TranslationEntry;
  start_date: string;
  end_date: string | null;
  description: TranslationEntry[];
  technologies: string[];
}

export interface ExperienceEntryData {
  role: TranslationEntry;
  company?: string;
  employment_type?: TranslationEntry;
  start_date: string;
  end_date: string | null;
  description?: TranslationEntry[];
  projects?: ExperienceProjectData[];
  technologies?: string[];
}

export interface EducationEntryData {
  institution: string;
  start_date: string;
  end_date: string | null;
  degree: TranslationEntry;
}

export interface MkuhlesData {
  contact: ContactData;
  profile: ProfileData;
  skills: SkillData[];
  experience: ExperienceEntryData[];
  education: EducationEntryData[];
}
