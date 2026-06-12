"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";

type Props = {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
};

export default function MicPermissionDialog({ open, onClose, onRetry }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <MicOffRoundedIcon color="error" />
        Akses mikrofon dibutuhkan
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Untuk latihan berbicara, Lingora perlu izin memakai mikrofon perangkatmu.
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Cara mengaktifkan:
        </Typography>

        <List dense disablePadding>
          <ListItem disableGutters sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primary="iPhone / iPad (Safari)"
              secondary="Settings → Safari → Microphone → Izinkan untuk situs ini. Lalu muat ulang halaman."
            />
          </ListItem>
          <ListItem disableGutters sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primary="Android (Chrome)"
              secondary="Ketuk ikon gembok di address bar → Permissions → Microphone → Allow. Lalu coba lagi."
            />
          </ListItem>
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Tutup
        </Button>
        <Button variant="contained" onClick={onRetry}>
          Coba lagi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
