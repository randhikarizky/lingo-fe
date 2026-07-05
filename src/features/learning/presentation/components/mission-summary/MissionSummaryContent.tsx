"use client";

import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import AnimatedNumber from "@/features/dashboard/presentation/components/AnimatedNumber";
import type { ConversationDetail } from "@/features/conversation/data/network/conversation.api";
import {
  CHARACTER_EMOJIS,
  formatDifficultyLabel,
  getTutorName,
} from "../../../domain/constants/characters";
import type {
  SessionGoal,
  SessionMetrics,
  SessionSummaryFeedback,
} from "../../../domain/entities/learning-session.entity";
import {
  buildBadges,
  buildPerformanceDimensions,
  buildSessionRewards,
  buildTutorCongrats,
  computeOverallScore,
  getNextMission,
  getPerformanceLabel,
  getStarCount,
  type SessionBadge,
} from "../../utils/mission-summary.utils";
import ConfettiBurst from "./ConfettiBurst";
import VocabularyUnlockPanel from "./VocabularyUnlockPanel";
import {
  MISSION_HERO,
  MISSION_RADIUS,
  missionNestedSurface,
  missionSectionCardSx,
} from "./mission-summary.tokens";

type Props = {
  detail: ConversationDetail;
  summary: SessionSummaryFeedback;
  metrics: SessionMetrics;
  sessionGoals: SessionGoal[];
};

function truncateSentences(text: string, max = 2) {
  const parts = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return parts.slice(0, max).join(" ").trim();
}

function sectionVariants(index: number) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.08 + index * 0.07, duration: 0.45 },
  };
}

function MissionHero({
  detail,
  metrics,
  overallScore,
  tutorMessage,
  sentenceCount,
}: {
  detail: ConversationDetail;
  metrics: SessionMetrics;
  overallScore: number;
  tutorMessage: string;
  sentenceCount: number;
}) {
  const tutorName = getTutorName(detail.characterId);
  const tutorEmoji = CHARACTER_EMOJIS[detail.characterId] ?? "🎓";
  const stars = getStarCount(overallScore);

  return (
    <Card
      sx={{
        ...missionSectionCardSx,
        position: "relative",
        p: { xs: 2.5, sm: 3 },
        color: MISSION_HERO.text,
        bgcolor: "#12102a",
        backgroundImage: MISSION_HERO.bg,
        border: MISSION_HERO.border,
      }}
    >
      <ConfettiBurst />
      <Stack spacing={2} sx={{ position: "relative", zIndex: 2 }}>
        <Box>
          <Typography
            variant="overline"
            sx={{ color: MISSION_HERO.gold, letterSpacing: 2.5, fontWeight: 800 }}
          >
            MISI SELESAI
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>
            Misi {detail.scenarioLabel} Selesai
          </Typography>
          <Stack direction="row" spacing={0.25} sx={{ mt: 1 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Typography
                key={index}
                sx={{
                  color: index < stars ? MISSION_HERO.gold : "rgba(255,255,255,0.2)",
                  fontSize: 22,
                }}
              >
                ★
              </Typography>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            p: 1.75,
            borderRadius: `${MISSION_RADIUS.panel}px`,
            bgcolor: MISSION_HERO.panelBg,
            border: MISSION_HERO.panelBorder,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: MISSION_HERO.gold, fontWeight: 800 }}
          >
            {tutorEmoji} {tutorName}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "rgba(255,255,255,0.9)" }}>
            {tutorMessage}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          {[
            { label: "Durasi", value: `${metrics.estimatedSpeakingMinutes} mnt` },
            { label: "Speaking", value: `${metrics.estimatedSpeakingMinutes} mnt` },
            { label: "Kalimat", value: String(sentenceCount) },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                p: 1.25,
                borderRadius: `${MISSION_RADIUS.item}px`,
                bgcolor: MISSION_HERO.itemBg,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: MISSION_HERO.textMuted }}>
                {item.label}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: MISSION_HERO.text }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Card>
  );
}

function SessionRewards({
  rewards,
}: {
  rewards: ReturnType<typeof buildSessionRewards>;
}) {
  return (
    <Card sx={{ ...missionSectionCardSx, p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
        Hadiah Sesi
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
        }}
      >
        {rewards.map((reward) => (
          <Box
            key={reward.label}
            sx={{
              p: 1.5,
              borderRadius: `${MISSION_RADIUS.item}px`,
              ...missionNestedSurface("gold"),
            }}
          >
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              {reward.emoji}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, mt: 0.5, color: "text.primary" }}
            >
              {reward.value}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {reward.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

function MissionObjectives({ goals }: { goals: SessionGoal[] }) {
  if (goals.length === 0) return null;

  const achieved = goals.filter((goal) => goal.achieved).length;
  const progress = Math.round((achieved / goals.length) * 100);

  return (
    <Card sx={{ ...missionSectionCardSx, p: 2 }}>
      <Stack direction="row" sx={{ mb: 1, justifyContent: "space-between" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Tujuan Misi
        </Typography>
        <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 800 }}>
          {progress}% · Misi Selesai
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={100}
        sx={{
          mb: 1.5,
          height: 6,
          borderRadius: `${MISSION_RADIUS.track}px`,
          bgcolor: "action.hover",
        }}
      />
      <Stack spacing={0.75}>
        {goals.map((goal) => (
          <Stack
            key={goal.id}
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              px: 1.25,
              py: 0.75,
              borderRadius: `${MISSION_RADIUS.inset}px`,
              bgcolor: goal.achieved ? "action.selected" : "transparent",
            }}
          >
            <CheckCircleRoundedIcon
              sx={{
                color: goal.achieved ? "success.main" : "action.disabled",
                fontSize: 20,
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: goal.achieved ? 700 : 500 }}>
              {goal.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

function PerformanceSummary({
  overallScore,
  dimensions,
}: {
  overallScore: number;
  dimensions: ReturnType<typeof buildPerformanceDimensions>;
}) {
  return (
    <Card sx={{ ...missionSectionCardSx, p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
        Ringkasan Performa
      </Typography>
      <Box
        sx={{
          p: 2,
          mb: 1.5,
          borderRadius: `${MISSION_RADIUS.panel}px`,
          textAlign: "center",
          ...missionNestedSurface("primary"),
        }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Performa Keseluruhan
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontWeight: 900, lineHeight: 1, color: "text.primary" }}
        >
          <AnimatedNumber value={overallScore} />
        </Typography>
        <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800 }}>
          {getPerformanceLabel(overallScore)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
        }}
      >
        {dimensions.map((dimension) => (
          <Box
            key={dimension.key}
            sx={{
              p: 1.25,
              borderRadius: `${MISSION_RADIUS.item}px`,
              ...missionNestedSurface("neutral"),
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {dimension.label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
              <AnimatedNumber value={dimension.score} />
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

function CoachFeedback({
  summary,
  nextChallenge,
}: {
  summary: SessionSummaryFeedback;
  nextChallenge: string;
}) {
  const sections = [
    {
      title: "Kekuatan",
      content: truncateSentences(summary.strength),
      tone: "success.main",
    },
    {
      title: "Kerja Bagus",
      content: truncateSentences(summary.fluency),
      tone: "primary.main",
    },
    {
      title: "Perbaiki Berikutnya",
      content: truncateSentences(summary.improvementArea),
      tone: "warning.main",
    },
    {
      title: "Tantangan Sesi Berikutnya",
      content: nextChallenge,
      tone: "secondary.main",
    },
  ];

  return (
    <Card sx={{ ...missionSectionCardSx, p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
        Umpan Balik Coach AI
      </Typography>
      <Stack spacing={1}>
        {sections.map((section) => (
          <Box
            key={section.title}
            sx={{
              p: 1.25,
              borderRadius: `${MISSION_RADIUS.item}px`,
              borderLeft: "3px solid",
              borderColor: section.tone,
              bgcolor: "background.surfaceContainerHigh",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: section.tone }}>
              {section.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {section.content}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

function AchievementsPanel({ badges }: { badges: SessionBadge[] }) {
  return (
    <Card sx={{ ...missionSectionCardSx, p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
        Pencapaian
      </Typography>
      {badges.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Belum ada badge khusus kali ini — lanjutkan latihan untuk membuka pencapaian
          baru.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
          }}
        >
          {badges.map((badge) => (
            <Box
              key={badge.label}
              component={m.div}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, type: "spring", stiffness: 260 }}
              sx={{
                p: 1.25,
                borderRadius: `${MISSION_RADIUS.item}px`,
                textAlign: "center",
                ...missionNestedSurface("gold"),
              }}
            >
              <Typography variant="h5">{badge.emoji}</Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {badge.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
}

function NextChallengeCard({
  detail,
  nextMission,
}: {
  detail: ConversationDetail;
  nextMission: ReturnType<typeof getNextMission>;
}) {
  const router = useRouter();

  return (
    <Card
      sx={{
        ...missionSectionCardSx,
        p: 2,
        ...missionNestedSurface("primary"),
      }}
    >
      <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>
        Misi Berikutnya
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 900, mt: 0.25, color: "text.primary" }}>
        {nextMission.label}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 2 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Tingkat · {formatDifficultyLabel(nextMission.difficulty)}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Perkiraan · {nextMission.estimatedMinutes} mnt
        </Typography>
      </Stack>
      <Button
        variant="contained"
        endIcon={<ArrowForwardRoundedIcon />}
        onClick={() =>
          router.push(
            `/practice?character=${detail.characterId}&personality=${detail.personality}&scenario=${nextMission.scenarioId}&difficulty=${nextMission.difficulty}`
          )
        }
      >
        Mulai Misi Berikutnya
      </Button>
    </Card>
  );
}

export default function MissionSummaryContent({
  detail,
  summary,
  metrics,
  sessionGoals,
}: Props) {
  const router = useRouter();
  const overallScore = computeOverallScore(metrics, sessionGoals, summary);
  const rewards = buildSessionRewards(metrics, sessionGoals, overallScore);
  const badges = buildBadges(sessionGoals, metrics, detail.scenarioType, overallScore);
  const dimensions = buildPerformanceDimensions(summary, metrics);
  const nextMission = getNextMission(detail.scenarioType, detail.difficulty);
  const tutorMessage = buildTutorCongrats(
    getTutorName(detail.characterId),
    detail.scenarioLabel,
    summary
  );
  const sentenceCount = detail.messages.filter(
    (message) => message.role === "USER"
  ).length;
  const nextChallenge = `Coba ${nextMission.label.toLowerCase()} dan fokus pada ${truncateSentences(summary.improvementArea, 1).replace(/\.$/, "")}.`;

  return (
    <Stack spacing={2.5} sx={{ pb: 3 }}>
      <Box component={m.div} {...sectionVariants(0)}>
        <MissionHero
          detail={detail}
          metrics={metrics}
          overallScore={overallScore}
          tutorMessage={tutorMessage}
          sentenceCount={sentenceCount}
        />
      </Box>

      <Box component={m.div} {...sectionVariants(1)}>
        <SessionRewards rewards={rewards} />
      </Box>

      <Box component={m.div} {...sectionVariants(2)}>
        <MissionObjectives goals={sessionGoals} />
      </Box>

      <Box component={m.div} {...sectionVariants(3)}>
        <PerformanceSummary overallScore={overallScore} dimensions={dimensions} />
      </Box>

      <Box component={m.div} {...sectionVariants(4)}>
        <CoachFeedback summary={summary} nextChallenge={nextChallenge} />
      </Box>

      <Box component={m.div} {...sectionVariants(5)}>
        <VocabularyUnlockPanel
          words={metrics.newVocabulary}
          scenarioLabel={detail.scenarioLabel}
          conversationId={detail.id}
        />
      </Box>

      <Box component={m.div} {...sectionVariants(6)}>
        <AchievementsPanel badges={badges} />
      </Box>

      <Box component={m.div} {...sectionVariants(7)}>
        <NextChallengeCard detail={detail} nextMission={nextMission} />
      </Box>

      <Stack spacing={1.25} component={m.div} {...sectionVariants(8)}>
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            router.push(
              `/practice?character=${detail.characterId}&personality=${detail.personality}&scenario=${nextMission.scenarioId}&difficulty=${nextMission.difficulty}`
            )
          }
        >
          Lanjut Belajar
        </Button>
        <Button variant="outlined" size="large" onClick={() => router.push("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </Stack>
    </Stack>
  );
}
