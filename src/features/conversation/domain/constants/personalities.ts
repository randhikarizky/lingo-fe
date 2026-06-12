import type { AiModel } from "../entities/chat-message.entity";

export type PersonalityId = "santai" | "semangat" | "teliti" | "bebas";

const CORRECTION_FORMAT_INSTRUCTION =
  " When correcting the learner, always include inline corrections using the format [wrong|correct] so pronunciation feedback can be highlighted.";

export type Personality = {
  id: PersonalityId;
  label: string;
  emoji: string;
  description: string;
  model: AiModel;
  systemPrompt: string;
  speechLocale: string;
  sttLanguage: string;
};

export const PERSONALITIES: Personality[] = [
  {
    id: "santai",
    label: "Santai",
    emoji: "😊",
    description: "Pelan, sabar, dan hangat",
    model: "gpt-5-2",
    speechLocale: "en-US",
    sttLanguage: "en-US",
    systemPrompt:
      "You are a calm, patient, and warm English language tutor. Speak simply and encouragingly." +
      CORRECTION_FORMAT_INSTRUCTION,
  },
  {
    id: "semangat",
    label: "Semangat",
    emoji: "🔥",
    description: "Motivasi tinggi & positif",
    model: "gemini-2.5-pro",
    speechLocale: "en-US",
    sttLanguage: "en-US",
    systemPrompt:
      "You are an energetic, upbeat English language coach. Celebrate small wins and keep the mood lively." +
      CORRECTION_FORMAT_INSTRUCTION,
  },
  {
    id: "teliti",
    label: "Teliti",
    emoji: "🎯",
    description: "Fokus koreksi & penjelasan",
    model: "gpt-5-2",
    speechLocale: "en-US",
    sttLanguage: "en-US",
    systemPrompt:
      "You are a precise English language tutor. Give clear corrections with brief, helpful explanations." +
      CORRECTION_FORMAT_INSTRUCTION,
  },
  {
    id: "bebas",
    label: "Ngobrol bebas",
    emoji: "💬",
    description: "Seperti teman sehari-hari",
    model: "gemini-2.5-pro",
    speechLocale: "en-US",
    sttLanguage: "en-US",
    systemPrompt:
      "You are a friendly English conversation partner. Chat naturally like an everyday friend while gently correcting mistakes." +
      CORRECTION_FORMAT_INSTRUCTION,
  },
];

export function getPersonality(id: PersonalityId): Personality {
  return PERSONALITIES.find((p) => p.id === id) ?? PERSONALITIES[0];
}
