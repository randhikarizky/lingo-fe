"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

import type { ProgressActivity } from "@/features/dashboard/data/network/progress.api";
import { DASHBOARD_RADIUS } from "./dashboard.tokens";

type Props = {
  data: ProgressActivity[];
};

const DAYS = 30;
const COLS = 7;

function buildHeatmapDays(data: ProgressActivity[]) {
  const map = new Map(data.map((item) => [item.date, item.messages]));
  const today = dayjs().startOf("day");
  const days: Array<{ date: string; messages: number }> = [];

  for (let offset = DAYS - 1; offset >= 0; offset -= 1) {
    const date = today.subtract(offset, "day").format("YYYY-MM-DD");
    days.push({ date, messages: map.get(date) ?? 0 });
  }

  return days;
}

export default function ActivityHeatmap({ data }: Props) {
  const theme = useTheme();
  const [selected, setSelected] = useState<{ date: string; messages: number } | null>(null);

  const days = useMemo(() => buildHeatmapDays(data), [data]);
  const maxMessages = Math.max(...days.map((d) => d.messages), 1);

  if (days.every((d) => d.messages === 0)) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Belum ada aktivitas tercatat.
        </Typography>
      </Box>
    );
  }

  const getColor = (messages: number) => {
    if (messages === 0) return alpha(theme.palette.primary.main, 0.08);
    const intensity = messages / maxMessages;
    return alpha(theme.palette.primary.main, 0.2 + intensity * 0.75);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 0.75,
        }}
      >
        {days.map((day) => {
          const isSelected = selected?.date === day.date;
          return (
            <Box
              key={day.date}
              component="button"
              type="button"
              onClick={() => setSelected(day)}
              aria-label={`${day.date}: ${day.messages} pesan`}
              sx={{
                aspectRatio: "1",
                borderRadius: `${DASHBOARD_RADIUS.inset}px`,
                bgcolor: getColor(day.messages),
                border: "1px solid",
                borderColor: isSelected ? "primary.main" : "transparent",
                cursor: "pointer",
                p: 0,
                transition: "transform 0.15s ease, border-color 0.15s ease",
                "&:hover": { transform: "scale(1.08)" },
                "&:focus-visible": {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: 2,
                },
              }}
            />
          );
        })}
      </Box>

      <StackLegend />

      {selected && (
        <Paper
          elevation={2}
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: `${DASHBOARD_RADIUS.item}px`,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, display: "block" }}>
            {dayjs(selected.date).format("D MMMM YYYY")}
          </Typography>
          <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
            {selected.messages} pesan
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

function StackLegend() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5, mt: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
        Sedikit
      </Typography>
      {[0.08, 0.25, 0.45, 0.7, 0.95].map((opacity) => (
        <Box
          key={opacity}
          sx={{
            width: 12,
            height: 12,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, opacity),
          }}
        />
      ))}
      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
        Banyak
      </Typography>
    </Box>
  );
}
