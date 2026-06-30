import type {
  SessionGoal,
  SessionMetrics,
  SessionSummaryFeedback,
} from "../../domain/entities/learning-session.entity";

export type SessionReward = {
  emoji: string;
  label: string;
  value: string;
};

export type SessionBadge = {
  emoji: string;
  label: string;
};

export type PerformanceDimension = {
  key: string;
  label: string;
  score: number;
  blurb: string;
};

export type NextMission = {
  scenarioId: string;
  label: string;
  difficulty: string;
  estimatedMinutes: number;
};

const NEXT_MISSION_MAP: Record<string, NextMission> = {
  shopping: {
    scenarioId: "restaurant",
    label: "Restaurant Ordering",
    difficulty: "intermediate",
    estimatedMinutes: 12,
  },
  restaurant: {
    scenarioId: "hotel",
    label: "Hotel Check-in",
    difficulty: "intermediate",
    estimatedMinutes: 12,
  },
  cafe: {
    scenarioId: "shopping",
    label: "Shopping",
    difficulty: "beginner",
    estimatedMinutes: 10,
  },
  hotel: {
    scenarioId: "airport",
    label: "Airport",
    difficulty: "intermediate",
    estimatedMinutes: 15,
  },
  airport: {
    scenarioId: "taxi",
    label: "Taxi Ride",
    difficulty: "intermediate",
    estimatedMinutes: 12,
  },
};

function clampScore(value: number) {
  return Math.max(55, Math.min(99, Math.round(value)));
}

function scoreFromText(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("excellent") || lower.includes("strong") || lower.includes("great")) {
    return 92;
  }
  if (lower.includes("good") || lower.includes("solid") || lower.includes("clear")) {
    return 84;
  }
  if (lower.includes("improv") || lower.includes("practice") || lower.includes("work on")) {
    return 74;
  }
  return 80;
}

export function computeOverallScore(
  metrics: SessionMetrics,
  goals: SessionGoal[],
  summary: SessionSummaryFeedback
) {
  const achieved = goals.filter((goal) => goal.achieved).length;
  const goalRate = goals.length > 0 ? achieved / goals.length : 0.85;
  const fluencyScore = scoreFromText(summary.fluency);
  const grammarScore = scoreFromText(summary.grammar);
  const vocabScore = Math.min(95, 70 + metrics.newVocabulary.length * 6);
  const confidenceScore = scoreFromText(summary.confidence);

  const blended =
    goalRate * 30 +
    fluencyScore * 0.2 +
    grammarScore * 0.2 +
    vocabScore * 0.15 +
    confidenceScore * 0.15;

  return clampScore(blended);
}

export function getPerformanceLabel(score: number) {
  if (score >= 90) return "Luar Biasa";
  if (score >= 80) return "Hebat";
  if (score >= 70) return "Bagus";
  return "Terus Semangat";
}

export function getStarCount(score: number) {
  if (score >= 95) return 5;
  if (score >= 85) return 4;
  if (score >= 75) return 3;
  if (score >= 65) return 2;
  return 1;
}

export function buildSessionRewards(
  metrics: SessionMetrics,
  goals: SessionGoal[],
  overallScore: number
): SessionReward[] {
  const achieved = goals.filter((goal) => goal.achieved).length;
  const xp = 80 + achieved * 25 + metrics.newVocabulary.length * 12 + Math.min(metrics.wordsSpoken, 40);

  const rewards: SessionReward[] = [
    { emoji: "⭐", label: "XP Sesi", value: `+${xp} XP` },
    { emoji: "🎙", label: "Waktu Speaking", value: `${metrics.estimatedSpeakingMinutes} mnt` },
    { emoji: "📚", label: "Kosakata", value: `+${metrics.newVocabulary.length}` },
  ];

  if (achieved === goals.length && goals.length > 0) {
    rewards.push({ emoji: "🏆", label: "Misi Sempurna", value: "Selesai" });
  }

  if (overallScore >= 88) {
    rewards.push({ emoji: "🔥", label: "Progres Streak", value: "+1 Hari" });
  }

  return rewards;
}

export function buildBadges(
  goals: SessionGoal[],
  metrics: SessionMetrics,
  scenarioType: string,
  overallScore: number
): SessionBadge[] {
  const badges: SessionBadge[] = [];

  if (goals.some((goal) => goal.id === "english-only" && goal.achieved)) {
    badges.push({ emoji: "🏅", label: "Tanpa Indonesia" });
  }
  if (metrics.wordsSpoken >= 35) {
    badges.push({ emoji: "🏅", label: "Belajar Cepat" });
  }
  if (scenarioType === "shopping" && goals.every((goal) => goal.achieved)) {
    badges.push({ emoji: "🏅", label: "Ahli Belanja" });
  }
  if (metrics.corrections <= 2 && metrics.wordsSpoken > 0) {
    badges.push({ emoji: "🏅", label: "Grammar Sempurna" });
  }
  if (overallScore >= 90) {
    badges.push({ emoji: "🏅", label: "Pelafalan Hebat" });
  }

  return badges;
}

export function buildPerformanceDimensions(
  summary: SessionSummaryFeedback,
  metrics: SessionMetrics
): PerformanceDimension[] {
  return [
    { key: "grammar", label: "Grammar", score: scoreFromText(summary.grammar), blurb: summary.grammar },
    {
      key: "vocabulary",
      label: "Kosakata",
      score: Math.min(95, 68 + metrics.newVocabulary.length * 8),
      blurb: summary.vocabulary,
    },
    { key: "fluency", label: "Kelancaran", score: scoreFromText(summary.fluency), blurb: summary.fluency },
    {
      key: "confidence",
      label: "Kepercayaan Diri",
      score: scoreFromText(summary.confidence),
      blurb: summary.confidence,
    },
  ];
}

export function getNextMission(scenarioType: string, currentDifficulty: string): NextMission {
  const mapped = NEXT_MISSION_MAP[scenarioType];
  if (mapped) return mapped;

  return {
    scenarioId: "restaurant",
    label: "Restaurant Ordering",
    difficulty: currentDifficulty === "beginner" ? "intermediate" : currentDifficulty,
    estimatedMinutes: 12,
  };
}

export function buildTutorCongrats(
  tutorName: string,
  scenarioLabel: string,
  summary: SessionSummaryFeedback
) {
  const snippet = summary.strength.split(".")[0]?.trim();
  if (snippet && snippet.length > 12) {
    return `Luar biasa! ${snippet}.`;
  }
  return `Luar biasa! Kamu menangani percakapan ${scenarioLabel.toLowerCase()} dengan natural.`;
}

export function vocabularyExample(word: string, scenarioLabel: string) {
  return `Saya menggunakan "${word}" saat latihan ${scenarioLabel.toLowerCase()}.`;
}
