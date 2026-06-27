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

export type LearningCatalog = {
  scenarios: Array<{
    category: string;
    scenarios: ScenarioDefinition[];
  }>;
  difficulties: Array<{
    id: DifficultyId;
    label: string;
  }>;
};

export type EndSessionResponse = {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  summary: SessionSummaryFeedback;
  metrics: SessionMetrics;
};
