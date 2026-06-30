"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import { getPlanLabel } from "../../domain/utils/subscription-access";

type Props = {
  open: boolean;
  type: "quota" | "feature";
  message: string;
  requiredPlan?: string;
  onClose: () => void;
  onUpgrade: () => void;
};

export default function LockedFeatureDialog({
  open,
  type,
  message,
  requiredPlan,
  onClose,
  onUpgrade,
}: Props) {
  const title = type === "quota" ? "🚫 Kuota Habis" : "🔒 Fitur Terkunci";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {message}
        </Typography>
        {type === "feature" && requiredPlan && (
          <Typography variant="caption" color="text.secondary">
            Upgrade ke paket {getPlanLabel(requiredPlan)} untuk membuka fitur ini.
          </Typography>
        )}
        {type === "quota" && (
          <Typography variant="caption" color="text.secondary">
            Upgrade ke Starter untuk melanjutkan belajar tanpa batasan yang mengganggu.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Nanti Saja</Button>
        <Button variant="contained" onClick={onUpgrade}>
          Lihat Paket
        </Button>
      </DialogActions>
    </Dialog>
  );
}
