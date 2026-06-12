"use client";

import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

type Props = {
  id: string;
  name: string;
  emoji: string;
  role: string;
  index: number;
};

export default function CharacterSelectCard({ name, emoji, role, index }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/conversation");
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.04,
        duration: 0.25,
        ease: M3_MOTION_EASE.decelerate,
      }}
      whileHover={{
        scale: 1.03,
        y: -2,
        transition: { duration: 0.18 },
      }}
      whileTap={{
        scale: 0.97,
        transition: { duration: 0.1 },
      }}
      style={{ flexShrink: 0 }}
    >
      <Card
        onClick={handleClick}
        sx={{
          minWidth: 120,
          p: 1.5,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            mx: "auto",
            mb: 1,
            bgcolor: "primary.tonalContainer",
            color: "primary.onTonalContainer",
            fontSize: 24,
          }}
        >
          {emoji}
        </Avatar>
        <Typography variant="subtitle2">{name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {role}
        </Typography>
      </Card>
    </m.div>
  );
}
