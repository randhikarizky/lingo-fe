"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { enqueueSnackbar } from "notistack";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { useCreateConversation } from "@/features/conversation/presentation/controller/conversation.controller";
import {
  CHARACTER_EMOJIS,
  formatDifficultyLabel,
  getTutorName,
} from "../../domain/constants/characters";
import type { DifficultyId, ScenarioDefinition, SessionGoal } from "../../domain/entities/learning-session.entity";
import { useLearningCatalog } from "../controller/learning.controller";
import ScenarioSelector from "./ScenarioSelector";
import DifficultySelector from "./DifficultySelector";
import ObjectiveCard from "./ObjectiveCard";
import SessionGoalChecklist from "./SessionGoalChecklist";
import { useSubscriptionMe } from "@/features/subscription/presentation/controller/subscription.controller";
import { isScenarioAllowed } from "@/features/subscription/domain/utils/subscription-access";
import { parseSubscriptionError } from "@/features/subscription/domain/utils/parse-subscription-error";
import LockedFeatureDialog from "@/features/subscription/presentation/components/LockedFeatureDialog";

const DEFAULT_CHARACTER = "maya";
const DEFAULT_PERSONALITY = "santai";

export default function PracticeSetupComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createConversation = useCreateConversation();
  const { data: catalog, isLoading, isError } = useLearningCatalog();
  const { data: subscription } = useSubscriptionMe();

  const [lockedDialog, setLockedDialog] = useState<{
    type: "quota" | "feature";
    message: string;
    requiredPlan?: string;
  } | null>(null);

  const characterId = searchParams.get("character") || DEFAULT_CHARACTER;
  const personality = searchParams.get("personality") || DEFAULT_PERSONALITY;

  const [scenarioId, setScenarioId] = useState("restaurant");
  const [difficulty, setDifficulty] = useState<DifficultyId>("beginner");

  const selectedScenario = useMemo(() => {
    if (!catalog) return null;
    return catalog.scenarios
      .flatMap((group) => group.scenarios)
      .find((item) => item.id === scenarioId);
  }, [catalog, scenarioId]);

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

  const handleStart = () => {
    if (!selectedScenario) return;

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
          router.replace(`/conversation?id=${data.id}`);
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
      message: `${scenario.label} tersedia mulai paket Starter.`,
      requiredPlan: "STARTER",
    });
  };

  if (isLoading) {
    return <LoadingTips label="Menyiapkan skenario latihan..." />;
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
    <Stack spacing={2.5} sx={{ pb: 3 }}>
      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => router.push("/dashboard")}
          color="inherit"
          size="small"
        >
          Dashboard
        </Button>
      </Stack>

      <Box>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Atur Sesi Latihan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pilih skenario dan tingkat kesulitan sebelum mulai berlatih.
        </Typography>
      </Box>

      <Chip
        variant="soft"
        color="primary"
        label={`${CHARACTER_EMOJIS[characterId] ?? "🎓"} Tutor: ${getTutorName(characterId)}`}
        sx={{ alignSelf: "flex-start" }}
      />

      <ObjectiveCard
        scenarioLabel={selectedScenario.label}
        scenarioCategory={selectedScenario.category}
        difficultyLabel={difficultyLabel}
        objective={selectedScenario.objective}
        characterName={getTutorName(characterId)}
      />

      {previewGoals.length > 0 && (
        <SessionGoalChecklist goals={previewGoals} title="Misi Sesi Kamu" />
      )}

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          Skenario
        </Typography>
        <ScenarioSelector
          groups={catalog.scenarios}
          value={scenarioId}
          onChange={setScenarioId}
          disabled={createConversation.isPending}
          isLocked={(id) => !isScenarioAllowed(subscription, id)}
          onLockedClick={handleLockedScenario}
        />
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          Tingkat Kesulitan
        </Typography>
        <DifficultySelector
          options={catalog.difficulties}
          value={difficulty}
          onChange={setDifficulty}
          disabled={createConversation.isPending}
        />
      </Box>

      <Button
        variant="contained"
        size="large"
        disabled={createConversation.isPending}
        onClick={handleStart}
      >
        {createConversation.isPending ? "Memulai sesi..." : "Mulai Latihan"}
      </Button>

      <LockedFeatureDialog
        open={lockedDialog !== null}
        type={lockedDialog?.type ?? "feature"}
        message={lockedDialog?.message ?? ""}
        requiredPlan={lockedDialog?.requiredPlan}
        onClose={() => setLockedDialog(null)}
        onUpgrade={() => router.push("/pricing")}
      />
    </Stack>
  );
}
