import type {
  DailyGoalMinutes,
  PreferredPersonality,
  TargetLanguage,
} from "@/theme/settings/types";

export const TARGET_LANGUAGES: Array<{
  id: TargetLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { id: "en", label: "English", nativeLabel: "Bahasa Inggris" },
  { id: "id", label: "Indonesia", nativeLabel: "Bahasa Indonesia" },
  { id: "ja", label: "Japanese", nativeLabel: "Bahasa Jepang" },
];

export const DAILY_GOAL_OPTIONS: DailyGoalMinutes[] = ["10", "20", "30", "45", "60"];

export const PERSONALITY_OPTIONS: Array<{
  id: PreferredPersonality;
  label: string;
  description: string;
}> = [
  { id: "santai", label: "Ramah", description: "Santai dan mendukung" },
  { id: "semangat", label: "Energik", description: "Semangat dan motivatif" },
  { id: "teliti", label: "Profesional", description: "Teliti dan terstruktur" },
  { id: "bebas", label: "Bebas Ngobrol", description: "Bebas dan natural" },
];

export function getTargetLanguageLabel(id: TargetLanguage) {
  return TARGET_LANGUAGES.find((item) => item.id === id)?.label ?? id;
}

export function getPersonalityLabel(id: PreferredPersonality) {
  return PERSONALITY_OPTIONS.find((item) => item.id === id)?.label ?? id;
}
