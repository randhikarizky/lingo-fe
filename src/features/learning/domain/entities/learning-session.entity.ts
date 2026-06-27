export type DifficultyId = "beginner" | "intermediate" | "advanced";

export type ScenarioDefinition = {
  id: string;
  label: string;
  category: string;
  objective: string;
  setting: string;
};

export type SessionSummaryFeedback = {
  grammar: string;
  vocabulary: string;
  fluency: string;
  confidence: string;
  strength: string;
  improvementArea: string;
};

export type SessionMetrics = {
  wordsSpoken: number;
  corrections: number;
  newVocabulary: string[];
  estimatedSpeakingMinutes: number;
};

export type SessionGoalId =
  | "complete-sentences"
  | "new-vocabulary"
  | "english-only"
  | "independent-practice";

export type SessionGoal = {
  id: SessionGoalId;
  emoji: string;
  label: string;
  target: number;
  progress: number;
  progressLabel: string;
  achieved: boolean;
};

export type SessionGoalPreview = Pick<
  SessionGoal,
  "id" | "emoji" | "label" | "target"
>;

export type LearningCatalog = {
  scenarios: Array<{
    category: string;
    scenarios: ScenarioDefinition[];
  }>;
  difficulties: Array<{
    id: DifficultyId;
    label: string;
  }>;
  sessionGoalPreviews: Array<{
    difficulty: DifficultyId;
    goals: SessionGoalPreview[];
  }>;
};

export type EndSessionResponse = {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  summary: SessionSummaryFeedback;
  metrics: SessionMetrics;
  sessionGoals: SessionGoal[];
};
