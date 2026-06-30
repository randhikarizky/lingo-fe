import type { DifficultyId } from "../../../domain/entities/learning-session.entity";

export const BRIEFING_RADIUS = {
  section: 20,
  panel: 12,
  item: 8,
  inset: 6,
} as const;

export const BRIEFING_HERO = {
  bg: "linear-gradient(145deg, #1a1240 0%, #0d0818 55%, #12102a 100%)",
  border: "1px solid rgba(245,185,66,0.22)",
  gold: "#F5B942",
  text: "#F5EFEB",
  textMuted: "rgba(255,255,255,0.55)",
} as const;

export const briefingSectionSx = {
  borderRadius: `${BRIEFING_RADIUS.section}px`,
  overflow: "hidden",
} as const;

export const CATEGORY_ICONS: Record<string, string> = {
  "Daily Life": "🏠",
  Travel: "✈️",
  Business: "💼",
  Career: "🎯",
  Academic: "🎓",
  Healthcare: "❤️",
};

export function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category] ?? "🗺️";
}

export const SCENARIO_ICONS: Record<string, string> = {
  restaurant: "🍽️",
  cafe: "☕",
  shopping: "🛍️",
  hotel: "🏨",
  airport: "✈️",
  immigration: "🛂",
  taxi: "🚕",
  "train-station": "🚆",
  meeting: "💼",
  presentation: "📊",
  negotiation: "🤝",
  "job-interview": "🎯",
  classroom: "📚",
  university: "🎓",
  pharmacy: "💊",
  clinic: "🏥",
};

export function getScenarioIcon(scenarioId: string) {
  return SCENARIO_ICONS[scenarioId] ?? "🗺️";
}

export function getEstimatedDuration(difficulty: DifficultyId) {
  if (difficulty === "intermediate") return "10–12 min";
  if (difficulty === "advanced") return "12–15 min";
  return "8–10 min";
}

export function getSessionDurationMinutes(difficulty: DifficultyId) {
  if (difficulty === "intermediate") return 12;
  if (difficulty === "advanced") return 15;
  return 10;
}

export const DIFFICULTY_BRIEFS: Record<
  DifficultyId,
  { label: string; complexity: string; lines: [string, string] }
> = {
  beginner: {
    label: "Pemula",
    complexity: "Low complexity",
    lines: ["Short sentences", "Basic vocabulary"],
  },
  intermediate: {
    label: "Menengah",
    complexity: "Medium complexity",
    lines: ["Longer conversations", "Natural responses"],
  },
  advanced: {
    label: "Lanjutan",
    complexity: "High complexity",
    lines: ["Realistic conversation", "Complex grammar"],
  },
};

export const TUTOR_GREETINGS: Record<string, string> = {
  maya: "I'll help you practice naturally and build confidence step by step.",
  alex: "Let's work through real-world English with clear, practical feedback.",
  sora: "Ready for an energetic session? We'll keep the conversation flowing.",
  ken: "I'll guide you with structured practice and precise corrections.",
};

export function getTutorGreeting(characterId: string, objective: string) {
  const custom = TUTOR_GREETINGS[characterId];
  if (custom) return custom;
  return `I'll help you practice: ${objective.charAt(0).toLowerCase()}${objective.slice(1)}`;
}
