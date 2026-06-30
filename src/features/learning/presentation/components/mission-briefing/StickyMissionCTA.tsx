"use client";

import { m } from "framer-motion";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { APP_BOTTOM_NAV_HEIGHT } from "@/global/constants/layout";

type Props = {
  scenarioLabel: string;
  difficultyLabel: string;
  tutorName: string;
  disabled?: boolean;
  loading?: boolean;
  onStart: () => void;
};

export default function StickyMissionCTA({
  scenarioLabel,
  difficultyLabel,
  tutorName,
  disabled,
  loading,
  onStart,
}: Props) {
  const theme = useTheme();

  return (
    <Box
      component={m.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        mx: "auto",
        bottom: APP_BOTTOM_NAV_HEIGHT,
        width: "100%",
        maxWidth: 480,
        zIndex: 1090,
        px: 2,
        pt: 1.25,
        pb: 1.25,
        borderRadius: 0,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: alpha(theme.palette.background.default, 0.96),
        backdropFilter: "blur(10px)",
        boxShadow: `0 -4px 20px ${alpha(theme.palette.common.black, 0.06)}`,
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900 }} noWrap>
            {scenarioLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {difficultyLabel} · {tutorName}
          </Typography>
        </Box>
        <Button
          variant="contained"
          disabled={disabled}
          onClick={onStart}
          sx={{ flexShrink: 0, minWidth: 120, fontWeight: 900, py: 1.1, px: 2 }}
        >
          {loading ? "..." : "Mulai Sesi"}
        </Button>
      </Stack>
    </Box>
  );
}
