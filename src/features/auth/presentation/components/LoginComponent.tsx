"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useLogin } from "../controller/auth.controller";

export default function LoginComponent() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Card
        sx={{
          p: 3,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="primary.main">
              Lingora
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Teman ngobrol AI yang ramah untuk melatih bahasamu
            </Typography>
          </Box>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size="medium"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            size="medium"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={login.isPending}
          >
            {login.isPending ? "Memproses..." : "Masuk"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
