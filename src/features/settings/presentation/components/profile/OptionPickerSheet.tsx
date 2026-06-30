"use client";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { PROFILE_RADIUS } from "./profile.tokens";

type Option = {
  id: string;
  label: string;
  description?: string;
};

type Props = {
  open: boolean;
  title: string;
  options: Option[];
  value: string;
  onClose: () => void;
  onSelect: (id: string) => void;
};

export default function OptionPickerSheet({
  open,
  title,
  options,
  value,
  onClose,
  onSelect,
}: Props) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: PROFILE_RADIUS.sheet,
            borderTopRightRadius: PROFILE_RADIUS.sheet,
            maxWidth: 480,
            mx: "auto",
          },
        },
      }}
    >
      <Stack sx={{ px: 2, pt: 1.5, pb: 2 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <IconButton size="small" aria-label="Tutup" onClick={onClose}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <List disablePadding>
          {options.map((option) => {
            const selected = option.id === value;
            return (
              <ListItemButton
                key={option.id}
                selected={selected}
                onClick={() => {
                  onSelect(option.id);
                  onClose();
                }}
                sx={{
                  mb: 0.5,
                  borderRadius: `${PROFILE_RADIUS.item}px`,
                }}
              >
                <ListItemText
                  primary={option.label}
                  secondary={option.description}
                  slotProps={{
                    primary: { sx: { fontWeight: selected ? 800 : 600 } },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Stack>
    </Drawer>
  );
}
