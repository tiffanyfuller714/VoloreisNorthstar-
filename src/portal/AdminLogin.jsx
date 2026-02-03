import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from "@mui/material";
import { api } from "./api";
import { setSession } from "./auth";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      if (data.role !== "admin") throw new Error("This login is not an admin account.");
      setSession({ token: data.token, role: data.role });
      nav("/admin");
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", px: 2 }}>
      <Card sx={{ width: "min(520px, 100%)" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>Admin Access</Typography>
          <Typography sx={{ opacity: 0.8, mb: 3 }}>
            Monitor active trips, respond to chats, handle emergency signals.
          </Typography>

          {err ? <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert> : null}

          <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="contained" size="large">Log in</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}