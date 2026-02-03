import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Typography, Card, CardContent, List, ListItem, ListItemText,
  Divider, Chip, Alert
} from "@mui/material";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { api } from "./api";
import { getToken } from "./auth";

export default function AdminPortal() {
  const token = useMemo(() => getToken(), []);
  const [active, setActive] = useState([]);
  const [locations, setLocations] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;

    const load = async () => {
      try {
        const data = await api("/admin/active", { token });
        const loc = await api("/admin/locations", { token });

        if (!live) return;

        setActive(data.active || []);
        setLocations(loc.locations || []);
        setErr("");
      } catch (e) {
        if (live) setErr(e.message);
      }
    };

    load();
    const t = setInterval(load, 10000);

    return () => {
      live = false;
      clearInterval(t);
    };
  }, [token]);

  const locMap = new Map(locations.map((l) => [l.travelerId, l]));

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <AdminPanelSettingsRoundedIcon color="primary" />
          <Typography variant="h4">Admin Monitoring</Typography>
          <Chip label={`Active: ${active.length}`} sx={{ ml: 1 }} />
        </Box>

        {err ? <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert> : null}

        <Card>
          <CardContent sx={{ p: 0 }}>
            <List>
              {active.map((u, idx) => {
                const l = locMap.get(u.customerId);
                const locLine = l
                  ? `Last location: ${Number(l.lat).toFixed(5)}, ${Number(l.lng).toFixed(5)} • ${l.source} • ${l.timestamp}`
                  : "Last location: n/a";

                const secondary = `Last check-in: ${u.lastCheckInAt || "n/a"} • Status: ${u.monitoringStatus || "active"} • ${locLine}`;

                return (
                  <React.Fragment key={u.customerId || idx}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={`${u.customerName} • ${u.destination} • ${u.tripLengthDays}d • ${u.planName}`}
                        secondary={secondary}
                      />
                    </ListItem>
                    {idx < active.length - 1 ? <Divider /> : null}
                  </React.Fragment>
                );
              })}

              {!active.length ? (
                <ListItem>
                  <ListItemText primary="No active monitored travelers right now." />
                </ListItem>
              ) : null}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}