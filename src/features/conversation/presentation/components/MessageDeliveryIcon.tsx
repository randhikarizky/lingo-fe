"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { keyframes } from "@mui/material/styles";

import type { UserDeliveryStatus } from "../../domain/constants/message-status";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

type Props = {
  status?: UserDeliveryStatus;
  isUser: boolean;
};

export default function MessageDeliveryIcon({ status, isUser }: Props) {
  if (!isUser || !status || status === "sent") {
    return null;
  }

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 6,
        right: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: `${fadeIn} 0.2s ease-out`,
      }}
    >
      {status === "sending" || status === "retrying" ? (
        <CircularProgress size={12} thickness={6} sx={{ color: "inherit", opacity: 0.85 }} />
      ) : status === "failed" ? (
        <ErrorOutlineRoundedIcon sx={{ fontSize: 14, opacity: 0.95 }} />
      ) : (
        <CheckRoundedIcon sx={{ fontSize: 14, opacity: 0.75 }} />
      )}
    </Box>
  );
}
