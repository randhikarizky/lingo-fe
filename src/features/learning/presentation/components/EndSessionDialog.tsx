"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

type Props = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function EndSessionDialog({ open, loading, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Akhiri Sesi Latihan?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          AI akan membuat ringkasan grammar, vocabulary, fluency, dan area perbaikan dari sesi ini.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
          Pastikan kamu sudah mengirim minimal satu pesan (teks atau suara).
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Lanjut Latihan
        </Button>
        <Button variant="contained" onClick={onConfirm} disabled={loading}>
          {loading ? "Menyusun ringkasan..." : "Akhiri & Lihat Ringkasan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
