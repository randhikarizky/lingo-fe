"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";

import { DEMO_ACCOUNT } from "@/features/auth/domain/constants/demo-account";
import { useLogin } from "../controller/auth.controller";
import { getLoginErrorMessage } from "../utils/login-error.utils";
import LoginBrandHeader from "./login/LoginBrandHeader";
import TutorHero from "./login/TutorHero";
import LoginCardV2 from "./login/LoginCardV2";
import DemoLoginCard from "./login/DemoLoginCard";
import { LINGORA_HERO } from "@/global/constants/lingora-brand";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

export default function LoginComponent() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const errorMessage = login.isError ? getLoginErrorMessage(login.error) : null;

  const submitLogin = (nextEmail: string, nextPassword: string) => {
    login.mutate({ email: nextEmail, password: nextPassword });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitLogin(email, password);
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    submitLogin(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: LINGORA_HERO.pageBg,
        display: "flex",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Stack spacing={2.5} sx={{ width: "100%", maxWidth: 420, my: "auto" }}>
        <LoginBrandHeader />
        <TutorHero />
        <LoginCardV2
          email={email}
          password={password}
          showPassword={showPassword}
          errorMessage={errorMessage}
          isPending={login.isPending}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword((prev) => !prev)}
          onSubmit={handleSubmit}
        />
        <DemoLoginCard disabled={login.isPending} onDemoLogin={handleDemoLogin} />

        <Box
          component={m.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.35, ease: M3_MOTION_EASE.decelerate }}
          sx={{ textAlign: "center" }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Belum punya akun?
          </Typography>
          <Button variant="text" disabled sx={{ fontWeight: 700 }}>
            Buat Akun — Segera Hadir
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
