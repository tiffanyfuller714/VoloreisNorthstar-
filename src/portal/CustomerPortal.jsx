import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography, Chip, Divider, Button,
  FormControlLabel, Switch, TextField, Alert
} from "@mui/material";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { api } from "./api";
import { getToken } from "./auth";
import { startLiveTracking, isGeolocationSupported } from "./locationService";

export default function CustomerPortal() {
  const token = useMemo(() => getToken(), []);
  const trackerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");

  const [prefs, setPrefs] = useState({
    notificationsEmail: true,
    notificationsSms: false,
    checkInFrequency: "30",
    checkInStart: "10:00",
  });

  const [trackStatus, setTrackStatus] = useState({ state: "idle", message: "" });
  const [livePos, setLivePos] = useState(null);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    let live = true;

    (async () => {
      try {
        setLoading(true);
        const data = await api("/me", { token });
        if (!live) return;

        setProfile(data);
        setPrefs({
          notificationsEmail: !!data.preferences?.notificationsEmail,
          notificationsSms: !!data.preferences?.notificationsSms,
          checkInFrequency: String(data.preferences?.checkInFrequency ?? "30"),
          checkInStart: data.preferences?.checkInStart ?? "10:00",
        });
      } catch (e) {
        if (live) setErr(e.message);
      } finally {
        if (live) setLoading(false);
      }
    })();

    return () => { live = false; };
  }, [token]);

  useEffect(() => {
    return () => {
      trackerRef.current?.stop?.();
    };
  }, []);

  async function savePrefs() {
    setErr("");
    try {
      const updated = await api("/me/preferences", { method: "POST", token, body: prefs });
      setProfile((p) => ({ ...p, preferences: updated }));
    } catch (e) {
      setErr(e.message);
    }
  }

  async function triggerEmergency() {
    setErr("");
    try {
      await api("/emergency/trigger", { method: "POST", token, body: { source: "customer_portal" } });
      alert("Emergency signal sent. A team member is being notified now.");
    } catch (e) {
      setErr(e.message);
    }
  }

  async function startTracking() {
    if (!consented) {
      setErr("Please turn on consent before starting live tracking.");
      return;
    }
    if (!profile?.customerId) {
      setErr("Could not start tracking, missing traveler profile id.");
      return;
    }

    setErr("");
    trackerRef.current?.stop?.();

    trackerRef.current = startLiveTracking({
      travelerId: profile.customerId,
      onStatus: setTrackStatus,
      onPosition: setLivePos,
      enableIpFallback: true,
    });
  }

  async function stopTracking() {
    await trackerRef.current?.stop?.();
    trackerRef.current = null;
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <ShieldRoundedIcon color="primary" />
          <Typography variant="h4">My Trip Portal</Typography>
        </Box>

        {err ? <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert> : null}
        {loading ? <Typography>Loading your trip details…</Typography> : null}

        {!loading && profile ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {profile.customerName}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    <Chip label={`Plan: ${profile.planName}`} color="primary" variant="outlined" />
                    <Chip label={`Trip length: ${profile.tripLengthDays} days`} variant="outlined" />
                    <Chip label={`Destination: ${profile.destination}`} variant="outlined" />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" sx={{ mb: 1 }}>Itinerary</Typography>
                  <Typography sx={{ opacity: 0.85, whiteSpace: "pre-wrap" }}>
                    {profile.itineraryText || "No itinerary details found yet."}
                  </Typography>
                </CardContent>
              </Card>

              <Box sx={{ height: 16 }} />

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Emergency Contact</Typography>
                  <Typography sx={{ opacity: 0.85 }}>
                    {profile.emergencyContact?.name || "Not set"}{" "}
                    {profile.emergencyContact?.phone ? `(${profile.emergencyContact.phone})` : ""}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Safety Preferences</Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={prefs.notificationsEmail}
                        onChange={(e) => setPrefs(p => ({ ...p, notificationsEmail: e.target.checked }))}
                      />
                    }
                    label="Email notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={prefs.notificationsSms}
                        onChange={(e) => setPrefs(p => ({ ...p, notificationsSms: e.target.checked }))}
                      />
                    }
                    label="SMS notifications"
                  />

                  <Box sx={{ display: "grid", gap: 2, mt: 2 }}>
                    <TextField
                      label="Check-in frequency (minutes)"
                      value={prefs.checkInFrequency}
                      onChange={(e) => setPrefs(p => ({ ...p, checkInFrequency: e.target.value }))}
                    />
                    <TextField
                      label="Daily check-in start time"
                      value={prefs.checkInStart}
                      onChange={(e) => setPrefs(p => ({ ...p, checkInStart: e.target.value }))}
                      placeholder="10:00"
                    />
                    <Button variant="contained" onClick={savePrefs}>Save preferences</Button>
                  </Box>

                  <Divider sx={{ my: 2.5 }} />

                  <Box sx={{ display: "grid", gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ChatRoundedIcon />}
                      onClick={() => alert("Chat UI is wired next to /chat endpoints.")}
                    >
                      Chat with VOLOREIS
                    </Button>

                    <Button
                      color="error"
                      variant="contained"
                      startIcon={<WarningAmberRoundedIcon />}
                      onClick={triggerEmergency}
                    >
                      Emergency, I need help now
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ mt: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Live Location</Typography>

                  <Typography sx={{ opacity: 0.8, mb: 2 }}>
                    This shares your real-time GPS location with VOLOREIS monitoring while active. You can stop it anytime.
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch checked={consented} onChange={(e) => setConsented(e.target.checked)} />
                    }
                    label="I consent to share my live location for active monitoring"
                  />

                  <Divider sx={{ my: 2 }} />

                  <Typography sx={{ fontWeight: 700, mb: 1 }}>
                    Status: {trackStatus.state}
                  </Typography>

                  <Typography sx={{ opacity: 0.8, mb: 2 }}>
                    {trackStatus.message || (isGeolocationSupported() ? "Ready when you are." : "GPS not supported here.")}
                  </Typography>

                  {livePos ? (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ opacity: 0.9 }}>
                        Lat: {Number(livePos.lat).toFixed(6)}, Lng: {Number(livePos.lng).toFixed(6)}
                      </Typography>
                      <Typography sx={{ opacity: 0.75 }}>
                        Source: {livePos.source} • Accuracy: {livePos.accuracy ? `${Math.round(livePos.accuracy)}m` : "n/a"} • {new Date(livePos.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  ) : null}

                  <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    <Button variant="contained" onClick={startTracking} disabled={!consented}>
                      Start live tracking
                    </Button>
                    <Button variant="outlined" onClick={stopTracking}>
                      Stop tracking
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ mt: 2, p: 2, borderRadius: 3, background: "rgba(42,168,255,0.12)" }}>
                <Typography sx={{ fontWeight: 700 }}>The vibe we want</Typography>
                <Typography sx={{ opacity: 0.8 }}>
                  Calm, protected, in control. Like a seatbelt for your trip, not a panic button.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : null}
      </Container>
    </Box>
  );
}