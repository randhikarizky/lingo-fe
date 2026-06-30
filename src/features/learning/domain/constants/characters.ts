export const TUTOR_CHARACTERS = [
  { id: "maya", name: "Maya", emoji: "👩‍🏫", role: "Guru santai", personality: "santai" },
  { id: "alex", name: "Alex", emoji: "🧑‍💻", role: "Bahasa Inggris bisnis", personality: "bebas" },
  { id: "sora", name: "Sora", emoji: "🌸", role: "Small talk santai", personality: "semangat" },
  { id: "ken", name: "Ken", emoji: "🎧", role: "Partner latihan", personality: "teliti" },
] as const;

export const CHARACTER_TO_PERSONALITY: Record<string, string> = {
  maya: "santai",
  alex: "bebas",
  sora: "semangat",
  ken: "teliti",
};

export const CHARACTER_EMOJIS: Record<string, string> = {
  maya: "👩‍🏫",
  alex: "🧑‍💻",
  sora: "🌸",
  ken: "🎧",
};

export function getTutorName(characterId: string) {
  const tutor = TUTOR_CHARACTERS.find((item) => item.id === characterId);
  return tutor?.name ?? characterId.charAt(0).toUpperCase() + characterId.slice(1);
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
};

export function formatDifficultyLabel(difficulty: string) {
  return DIFFICULTY_LABELS[difficulty.toLowerCase()] ?? difficulty;
}
