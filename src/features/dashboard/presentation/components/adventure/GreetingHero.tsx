"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getTimeGreeting } from "../../utils/dashboard.utils";

type Props = {
  name: string;
};

export default function GreetingHero({ name }: Props) {
  const firstName = name.split(" ")[0] || "teman";

  return (
    <Box
      component={m.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Typography
        variant="overline"
        sx={{ fontWeight: 700, letterSpacing: 1.2, color: "text.secondary" }}
      >
        {getTimeGreeting()} 👋
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.25 }}>
        Senang bertemu lagi, {firstName}.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Siap untuk tantangan hari ini?
      </Typography>
    </Box>
  );
}
