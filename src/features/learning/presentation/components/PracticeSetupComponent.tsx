"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { enqueueSnackbar } from "notistack";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { useCreateConversation } from "@/features/conversation/presentation/controller/conversation.controller";
import { getPersonalityLabel } from "@/features/settings/domain/constants/learning-preferences";
import { useSettingsContext } from "@/theme/settings";
import type { PreferredPersonality } from "@/theme/settings/types";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import {
  CHARACTER_EMOJIS,
  CHARACTER_TO_PERSONALITY,
  formatDifficultyLabel,
  getTutorName,
} from "../../domain/constants/characters";
import type { DifficultyId, ScenarioDefinition, SessionGoal } from "../../domain/entities/learning-session.entity";
import { useLearningCatalog } from "../controller/learning.controller";
import { saveLastSession } from "../utils/last-session.storage";
import DifficultySelector from "./DifficultySelector";
import MissionHero from "./mission-briefing/MissionHero";
import TutorOverviewCard from "./mission-briefing/TutorOverviewCard";
import MissionObjectivesAccordion from "./mission-briefing/MissionObjectivesAccordion";
import ScenarioCategorySelector from "./mission-briefing/ScenarioCategorySelector";
import ScenarioList from "./mission-briefing/ScenarioList";
import StickyMissionCTA from "./mission-briefing/StickyMissionCTA";
import MissionAcceptedOverlay from "./mission-briefing/MissionAcceptedOverlay";
import { useSubscriptionMe } from "@/features/subscription/presentation/controller/subscription.controller";
import { isScenarioAllowed } from "@/features/subscription/domain/utils/subscription-access";
import { parseSubscriptionError } from "@/features/subscription/domain/utils/parse-subscription-error";
import LockedFeatureDialog from "@/features/subscription/presentation/components/LockedFeatureDialog";
import { FOCUS_HANDOFF_KEY } from "@/theme/animate/practice-session";
import { APP_BOTTOM_NAV_HEIGHT, MISSION_STICKY_CTA_HEIGHT } from "@/global/constants/layout";

const DEFAULT_CHARACTER = "maya";
const DEFAULT_PERSONALITY = "santai";

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.36, ease: M3_MOTION_EASE.decelerate },
  }),
};

export default function PracticeSetupComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const settings = useSettingsContext();
  const createConversation = useCreateConversation();
  const { data: catalog, isLoading, isError } = useLearningCatalog();
  const { data: subscription } = useSubscriptionMe();

  const [lockedDialog, setLockedDialog] = useState<{
    type: "quota" | "feature";
    message: string;
    requiredPlan?: string;
  } | null>(null);
  const [pendingConversationId, setPendingConversationId] = useState<string | null>(null);
  const [launchPhase, setLaunchPhase] = useState<"idle" | "accepted">("idle");

  const characterId = searchParams.get("character") || settings.defaultTutor || DEFAULT_CHARACTER;
  const personality =
    searchParams.get("personality") ||
    settings.preferredPersonality ||
    CHARACTER_TO_PERSONALITY[characterId] ||
    DEFAULT_PERSONALITY;
  const initialScenario = searchParams.get("scenario") || "restaurant";
  const initialDifficultyParam = searchParams.get("difficulty");
  const initialDifficulty: DifficultyId =
    initialDifficultyParam === "intermediate" ||
    initialDifficultyParam === "advanced" ||
    initialDifficultyParam === "beginner"
      ? initialDifficultyParam
      : "beginner";

  const [scenarioId, setScenarioId] = useState(initialScenario);
  const [difficulty, setDifficulty] = useState<DifficultyId>(initialDifficulty);
  const [activeCategory, setActiveCategory] = useState("Daily Life");

  const isLocked = launchPhase === "accepted" || createConversation.isPending;

  const selectedScenario = useMemo(() => {
    if (!catalog) return null;
    return catalog.scenarios
      .flatMap((group) => group.scenarios)
      .find((item) => item.id === scenarioId);
  }, [catalog, scenarioId]);

  const categories = useMemo(
    () => catalog?.scenarios.map((group) => group.category) ?? [],
    [catalog]
  );

  const activeScenarios = useMemo(() => {
    if (!catalog) return [];
    return catalog.scenarios.find((group) => group.category === activeCategory)?.scenarios ?? [];
  }, [catalog, activeCategory]);

  useEffect(() => {
    if (selectedScenario) {
      setActiveCategory(selectedScenario.category);
    }
  }, [selectedScenario?.id, selectedScenario?.category]);

  const difficultyLabel =
    catalog?.difficulties.find((item) => item.id === difficulty)?.label ??
    formatDifficultyLabel(difficulty);

  const previewGoals = useMemo<SessionGoal[]>(() => {
    const preview = catalog?.sessionGoalPreviews.find((item) => item.difficulty === difficulty);

    return (
      preview?.goals.map((goal) => ({
        ...goal,
        progress: 0,
        progressLabel: "Belum dimulai",
        achieved: false,
      })) ?? []
    );
  }, [catalog?.sessionGoalPreviews, difficulty]);

  const tutorName = getTutorName(characterId);
  const tutorEmoji = CHARACTER_EMOJIS[characterId] ?? "🎓";
  const personalityLabel = getPersonalityLabel(personality as PreferredPersonality);

  const handleMissionAcceptedComplete = useCallback(() => {
    if (!pendingConversationId) return;
    sessionStorage.setItem(FOCUS_HANDOFF_KEY, "1");
    router.replace(`/conversation?id=${pendingConversationId}&focus=1`);
  }, [pendingConversationId, router]);

  const handleCategoryChange = (category: string) => {
    if (!catalog || isLocked) return;

    setActiveCategory(category);
    const group = catalog.scenarios.find((item) => item.category === category);
    if (!group) return;

    const stillInGroup = group.scenarios.some((item) => item.id === scenarioId);
    if (stillInGroup) return;

    const nextScenario =
      group.scenarios.find((item) => isScenarioAllowed(subscription, item.id)) ??
      group.scenarios[0];

    setScenarioId(nextScenario.id);
  };

  const handleStart = () => {
    if (!selectedScenario || isLocked) return;

    if (!isScenarioAllowed(subscription, selectedScenario.id)) {
      handleLockedScenario(selectedScenario);
      return;
    }

    createConversation.mutate(
      {
        characterId,
        personality,
        language: "en",
        scenarioType: selectedScenario.id,
        difficulty,
        objective: selectedScenario.objective,
      },
      {
        onSuccess: (data) => {
          saveLastSession({
            scenarioId: selectedScenario.id,
            scenarioLabel: selectedScenario.label,
            scenarioType: selectedScenario.id,
            objective: selectedScenario.objective,
            characterId,
            personality,
            difficulty,
          });
          setPendingConversationId(data.id);
          setLaunchPhase("accepted");
        },
        onError: (error) => {
          const parsed = parseSubscriptionError(error);
          if (parsed) {
            setLockedDialog(parsed);
            return;
          }

          enqueueSnackbar("Gagal memulai sesi latihan", { variant: "error" });
        },
      }
    );
  };

  const handleLockedScenario = (scenario: ScenarioDefinition) => {
    setLockedDialog({
      type: "feature",
      message: `${scenario.label} tersedia mulai paket Pro.`,
      requiredPlan: "PRO",
    });
  };

  if (isLoading) {
    return <LoadingTips label="Menyiapkan mission briefing..." />;
  }

  if (isError || !catalog || !selectedScenario) {
    return (
      <Stack spacing={2} sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">Gagal memuat katalog belajar.</Typography>
        <Button variant="outlined" onClick={() => router.push("/dashboard")}>
          Kembali
        </Button>
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        pb: `${APP_BOTTOM_NAV_HEIGHT + MISSION_STICKY_CTA_HEIGHT}px`,
      }}
    >
      <AnimatePresence>
        {launchPhase === "accepted" && (
          <MissionAcceptedOverlay
            scenarioLabel={selectedScenario.label}
            tutorName={tutorName}
            tutorEmoji={tutorEmoji}
            onComplete={handleMissionAcceptedComplete}
          />
        )}
      </AnimatePresence>

      <Stack
        component={m.div}
        spacing={2}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      >
        <Box component={m.div} variants={sectionVariants} custom={0}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => router.push("/dashboard")}
            color="inherit"
            size="small"
            disabled={isLocked}
          >
            Dashboard
          </Button>
        </Box>

        <Box component={m.div} variants={sectionVariants} custom={0.03}>
          <MissionHero
            scenario={selectedScenario}
            difficulty={difficulty}
            difficultyLabel={difficultyLabel}
            tutorName={tutorName}
            tutorEmoji={tutorEmoji}
          />
        </Box>

        <Box component={m.div} variants={sectionVariants} custom={0.06}>
          <TutorOverviewCard
            tutorName={tutorName}
            tutorEmoji={tutorEmoji}
            personalityLabel={personalityLabel}
            objective={selectedScenario.objective}
            characterId={characterId}
          />
        </Box>

        <Box component={m.div} variants={sectionVariants} custom={0.09}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
            Tingkat Kesulitan
          </Typography>
          <DifficultySelector
            options={catalog.difficulties}
            value={difficulty}
            onChange={setDifficulty}
            disabled={isLocked}
          />
        </Box>

        <Box component={m.div} variants={sectionVariants} custom={0.12}>
          <MissionObjectivesAccordion goals={previewGoals} disabled={isLocked} />
        </Box>

        <Box component={m.div} variants={sectionVariants} custom={0.15}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
            Skenario
          </Typography>
          <Stack spacing={1.25}>
            <ScenarioCategorySelector
              categories={categories}
              value={activeCategory}
              disabled={isLocked}
              onChange={handleCategoryChange}
            />
            <ScenarioList
              scenarios={activeScenarios}
              category={activeCategory}
              value={scenarioId}
              difficulty={difficulty}
              disabled={isLocked}
              isLocked={(id) => !isScenarioAllowed(subscription, id)}
              onChange={setScenarioId}
              onLockedClick={handleLockedScenario}
            />
          </Stack>
        </Box>
      </Stack>

      <StickyMissionCTA
        scenarioLabel={selectedScenario.label}
        difficultyLabel={difficultyLabel}
        tutorName={tutorName}
        disabled={isLocked}
        loading={createConversation.isPending}
        onStart={handleStart}
      />

      <LockedFeatureDialog
        open={lockedDialog !== null}
        type={lockedDialog?.type ?? "feature"}
        message={lockedDialog?.message ?? ""}
        requiredPlan={lockedDialog?.requiredPlan}
        onClose={() => setLockedDialog(null)}
        onUpgrade={() => router.push("/pricing")}
      />
    </Box>
  );
}
