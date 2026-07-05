"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import type { ConversationListItem } from "@/features/conversation/data/network/conversation.api";
import { formatRelativeDay } from "../../utils/dashboard.utils";
import { DASHBOARD_RADIUS } from "./dashboard.tokens";

type Props = {
  conversation?: ConversationListItem;
};

export default function RecentPracticeCard({ conversation }: Props) {
  const router = useRouter();

  if (!conversation) {
    return (
      <Card
        sx={{
          p: 2.5,
          borderRadius: `${DASHBOARD_RADIUS.panel}px`,
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
          Belum ada latihan
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Mulai sesi pertamamu untuk melihatnya di sini.
        </Typography>
        <Button variant="outlined" size="small" onClick={() => router.push("/practice")}>
          Mulai sesi pertama
        </Button>
      </Card>
    );
  }

  const scoreLabel =
    conversation.status === "COMPLETED"
      ? "Selesai"
      : conversation.status === "ACTIVE"
        ? "Sedang berlangsung"
        : "—";

  return (
    <Card sx={{ p: 2, borderRadius: `${DASHBOARD_RADIUS.panel}px` }}>
      <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900 }} noWrap>
            {conversation.scenarioLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {formatRelativeDay(conversation.updatedAt)} · {scoreLabel}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => router.push(`/conversation?id=${conversation.id}`)}
          sx={{ fontWeight: 700, flexShrink: 0 }}
        >
          Lanjutkan
        </Button>
      </Stack>
    </Card>
  );
}
