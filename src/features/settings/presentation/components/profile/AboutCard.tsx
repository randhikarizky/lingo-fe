"use client";

import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { PROFILE_RADIUS, profileSectionCardSx } from "./profile.tokens";

const ABOUT_ITEMS = [
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Ketentuan Layanan", href: "#" },
  { label: "Dukungan", href: "mailto:support@lingora.app" },
  { label: "Kirim Feedback", href: "mailto:feedback@lingora.app" },
  { label: "Versi", value: "0.1.0" },
  { label: "Lisensi", href: "#" },
] as const;

export default function AboutCard() {
  return (
    <Card sx={{ ...profileSectionCardSx, p: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        Tentang
      </Typography>

      <List disablePadding>
        {ABOUT_ITEMS.map((item) => {
          const isStatic = "value" in item;

          if (isStatic) {
            return (
              <ListItemButton
                key={item.label}
                disabled
                sx={{ borderRadius: `${PROFILE_RADIUS.inset}px`, px: 1 }}
              >
                <ListItemText primary={item.label} secondary={item.value} />
              </ListItemButton>
            );
          }

          return (
            <ListItemButton
              key={item.label}
              component="a"
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              sx={{ borderRadius: `${PROFILE_RADIUS.inset}px`, px: 1 }}
            >
              <ListItemText primary={item.label} />
              <ChevronRightRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );
}
