"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import type { PlanId } from "../../domain/entities/subscription.entity";
import { getPlanLabel } from "../../domain/utils/subscription-access";

type Props = {
  open: boolean;
  planId: Exclude<PlanId, "FREE">;
  priceLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function UpgradeDialog({
  open,
  planId,
  priceLabel,
  loading,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Upgrade ke {getPlanLabel(planId)}?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Pembayaran belum aktif — upgrade akan langsung diterapkan untuk pengujian closed beta.
        </Typography>
        {priceLabel && (
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {priceLabel}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button variant="contained" onClick={onConfirm} disabled={loading}>
          {loading ? "Memproses..." : "Konfirmasi Upgrade"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
