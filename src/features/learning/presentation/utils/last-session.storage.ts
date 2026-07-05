import type { DifficultyId } from "../../domain/entities/learning-session.entity";

export const LAST_SESSION_KEY = "lingora:last-session";

export type LastSessionConfig = {
  scenarioId: string;
  scenarioLabel: string;
  scenarioType: string;
  objective: string;
  characterId: string;
  personality: string;
  difficulty: DifficultyId;
  updatedAt: string;
};

export function saveLastSession(config: Omit<LastSessionConfig, "updatedAt">) {
  if (typeof window === "undefined") return;

  const payload: LastSessionConfig = {
    ...config,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(payload));
}

export function getLastSession(): LastSessionConfig | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(LAST_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastSessionConfig;
  } catch {
    return null;
  }
}
