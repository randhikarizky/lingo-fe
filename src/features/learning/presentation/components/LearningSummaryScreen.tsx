"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { useGetConversationDetail } from "@/features/conversation/presentation/controller/conversation.controller";
import { formatDifficultyLabel } from "../../domain/constants/characters";
import type {
  SessionMetrics,
  SessionSummaryFeedback,
} from "../../domain/entities/learning-session.entity";

type Props = {
  conversationId: string;
};

function SummarySection({
  title,
  content,
  accent,
}: {
  title: string;
  content: string;
  accent?: "success" | "warning";
}) {
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>
        {accent && (
          <Chip
            size="small"
            label={accent === "success" ? "Kekuatan" : "Perbaiki"}
            color={accent === "success" ? "success" : "warning"}
            variant="soft"
          />
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {content}
      </Typography>
    </Card>
  );
}

function MetricsGrid({ metrics }: { metrics: SessionMetrics }) {
  const items = [
    { label: "Kata Diucapkan", value: metrics.wordsSpoken },
    { label: "Koreksi", value: metrics.corrections },
    { label: "Kosakata Baru", value: metrics.newVocabulary.length },
    { label: "Menit Latihan", value: metrics.estimatedSpeakingMinutes },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 1.5,
      }}
    >
      {items.map((item) => (
        <Card key={item.label} sx={{ p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            {item.label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {item.value}
          </Typography>
        </Card>
      ))}
    </Box>
  );
}

export default function LearningSummaryScreen({ conversationId }: Props) {
  const router = useRouter();
  const { data: detail, isLoading, isError } = useGetConversationDetail(conversationId);

  if (isLoading) {
    return <LoadingTips label="Menyusun laporan belajarmu..." />;
  }

  if (isError || !detail) {
    return (
      <Stack spacing={2} sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">Gagal memuat ringkasan sesi.</Typography>
        <Button variant="outlined" onClick={() => router.push("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </Stack>
    );
  }

  const summary = detail.summary as SessionSummaryFeedback | null;
  const metrics = detail.metrics as SessionMetrics | null;

  if (!summary || !metrics) {
    return (
      <Stack spacing={2} sx={{ py: 4, textAlign: "center" }}>
        <Typography>Ringkasan belum tersedia untuk sesi ini.</Typography>
        <Button variant="outlined" onClick={() => router.push("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5} sx={{ pb: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Ringkasan Belajar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {detail.scenarioLabel} · {formatDifficultyLabel(detail.difficulty)}
        </Typography>
      </Box>

      <MetricsGrid metrics={metrics} />

      <SummarySection title="Grammar" content={summary.grammar} />
      <SummarySection title="Vocabulary" content={summary.vocabulary} />
      <SummarySection title="Fluency" content={summary.fluency} />
      <SummarySection title="Confidence" content={summary.confidence} />
      <SummarySection title="Strength" content={summary.strength} accent="success" />
      <SummarySection title="Improve" content={summary.improvementArea} accent="warning" />

      {metrics.newVocabulary.length > 0 && (
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Kosakata Baru
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {metrics.newVocabulary.map((word) => (
              <Chip key={word} label={word} size="small" variant="soft" />
            ))}
          </Stack>
        </Card>
      )}

      <Button variant="contained" size="large" onClick={() => router.push("/dashboard")}>
        Kembali ke Dashboard
      </Button>
    </Stack>
  );
}
