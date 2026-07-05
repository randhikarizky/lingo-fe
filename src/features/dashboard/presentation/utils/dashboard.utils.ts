import type { ConversationListItem } from "@/features/conversation/data/network/conversation.api";
import type { ProgressSummary } from "@/features/dashboard/data/network/progress.api";
import type { LastSessionConfig } from "@/features/learning/presentation/utils/last-session.storage";
import type { SessionGoal } from "@/features/learning/domain/entities/learning-session.entity";
import { getTutorName } from "@/features/learning/domain/constants/characters";
import { formatDifficultyLabel } from "@/features/learning/domain/constants/characters";
import { getEstimatedDuration } from "@/features/learning/presentation/components/mission-briefing/mission-briefing.tokens";
import type { DifficultyId } from "@/features/learning/domain/entities/learning-session.entity";

export type JourneyNode = {
  level: number;
  title: string;
  status: "done" | "active" | "locked";
};

export type MissionCardState =
  | { kind: "first" }
  | { kind: "continue"; conversation: ConversationListItem; progress: number }
  | { kind: "completed"; nextLabel: string }
  | { kind: "next"; config: LastSessionConfig | ConversationListItem };

export function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat pagi";
  if (hour < 17) return "Selamat siang";
  return "Selamat malam";
}

export function estimateVocabulary(summary: ProgressSummary) {
  return Math.max(summary.conversationCount * 4, Math.round(summary.messageCount * 0.6));
}

export function buildJourneyNodes(conversationCount: number): JourneyNode[] {
  const nodes: JourneyNode[] = [
    { level: 1, title: "Perkenalan", status: "locked" },
    { level: 2, title: "Obrolan Harian", status: "locked" },
    { level: 3, title: "Cerita Percakapan", status: "locked" },
    { level: 4, title: "Debat", status: "locked" },
  ];

  if (conversationCount >= 1) nodes[0].status = "done";
  if (conversationCount >= 1)
    nodes[1].status = conversationCount >= 5 ? "done" : "active";
  if (conversationCount >= 5)
    nodes[2].status = conversationCount >= 12 ? "done" : "active";
  if (conversationCount >= 12) nodes[3].status = "active";

  return nodes;
}

export function computeGoalProgress(goals: SessionGoal[]) {
  if (goals.length === 0) return 0;
  const achieved = goals.filter((goal) => goal.achieved).length;
  return Math.round((achieved / goals.length) * 100);
}

export function resolveMissionState(
  conversations: ConversationListItem[],
  summary: ProgressSummary | undefined,
  lastSession: LastSessionConfig | null
): MissionCardState {
  const active = conversations.find((item) => item.status === "ACTIVE");

  if (active) {
    return { kind: "continue", conversation: active, progress: 40 };
  }

  if ((summary?.conversationCount ?? 0) === 0) {
    return { kind: "first" };
  }

  const today = new Date().toISOString().slice(0, 10);
  const practicedToday = summary?.lastPracticeDate === today;

  if (practicedToday && !active) {
    const recent = conversations.find((item) => item.status === "COMPLETED");
    return {
      kind: "completed",
      nextLabel: recent?.scenarioLabel ?? lastSession?.scenarioLabel ?? "Restaurant",
    };
  }

  if (lastSession) {
    return { kind: "next", config: lastSession };
  }

  const recentCompleted = [...conversations]
    .filter((item) => item.status === "COMPLETED")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

  if (recentCompleted) {
    return { kind: "next", config: recentCompleted };
  }

  return { kind: "first" };
}

export function formatRelativeDay(dateIso: string) {
  const date = new Date(dateIso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
}

export function missionMetaFromConversation(conversation: ConversationListItem) {
  return {
    scenarioLabel: conversation.scenarioLabel,
    tutorName: getTutorName(conversation.characterId),
    difficultyLabel: formatDifficultyLabel(conversation.difficulty),
    duration: getEstimatedDuration(conversation.difficulty as DifficultyId),
    href: `/conversation?id=${conversation.id}`,
  };
}

export function missionMetaFromLastSession(config: LastSessionConfig) {
  return {
    scenarioLabel: config.scenarioLabel,
    tutorName: getTutorName(config.characterId),
    difficultyLabel: formatDifficultyLabel(config.difficulty),
    duration: getEstimatedDuration(config.difficulty),
    href: `/practice?character=${config.characterId}&personality=${config.personality}&scenario=${config.scenarioType}&difficulty=${config.difficulty}`,
  };
}
