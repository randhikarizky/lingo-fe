"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import type { JourneyNode } from "../../utils/dashboard.utils";
import { DASHBOARD_RADIUS, dashboardActiveSurface } from "./dashboard.tokens";

type Props = {
  nodes: JourneyNode[];
};

function NodeIcon({ status }: { status: JourneyNode["status"] }) {
  if (status === "done") {
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: "success.main",
          color: "success.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckRoundedIcon sx={{ fontSize: 18 }} />
      </Box>
    );
  }

  if (status === "active") {
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: (theme) => `0 0 0 4px ${theme.palette.primary.main}33`,
        }}
      >
        <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        bgcolor: "action.hover",
        color: "text.disabled",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LockRoundedIcon sx={{ fontSize: 16 }} />
    </Box>
  );
}

export default function JourneyTimeline({ nodes }: Props) {
  return (
    <Stack spacing={0}>
      {nodes.map((node, index) => (
        <Box
          key={node.level}
          component={m.div}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.3 }}
          sx={{ display: "flex", gap: 1.5 }}
        >
          <Stack sx={{ alignItems: "center", width: 32 }}>
            <NodeIcon status={node.status} />
            {index < nodes.length - 1 && (
              <Box
                sx={{
                  width: 2,
                  flex: 1,
                  minHeight: 24,
                  my: 0.5,
                  bgcolor: node.status === "done" ? "success.main" : "divider",
                  opacity: node.status === "locked" ? 0.4 : 1,
                }}
              />
            )}
          </Stack>

          <Box
            sx={(theme) => ({
              flex: 1,
              mb: index < nodes.length - 1 ? 1.5 : 0,
              p: 1.5,
              borderRadius: `${DASHBOARD_RADIUS.panel}px`,
              opacity: node.status === "locked" ? 0.6 : 1,
              ...(node.status === "active"
                ? dashboardActiveSurface(theme)
                : {
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  }),
            })}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              <Chip
                label={`Lv${node.level}`}
                size="small"
                color={
                  node.status === "done"
                    ? "success"
                    : node.status === "active"
                      ? "primary"
                      : "default"
                }
                variant={node.status === "locked" ? "outlined" : "filled"}
              />
              <Typography variant="body2" sx={{ fontWeight: 700, flex: 1 }}>
                {node.title}
              </Typography>
              {node.status === "done" && (
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                  Selesai
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
