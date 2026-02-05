import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Container, Typography, Card, CardContent, List, ListItem, ListItemText,
  Divider, Chip, Alert, Button
} from "@mui/material";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { api } from "./api";
import { getToken } from "./auth";
import { supabase } from "../lib/supabase";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function AdminPortal() {
  const token = useMemo(() => getToken(), []);
  const [active, setActive] = useState([]);
  const [locations, setLocations] = useState([]);
  const [err, setErr] = useState("");
  const [news, setNews] = useState([]);
  const [newsStatus, setNewsStatus] = useState({ state: "idle", message: "" });
  const [lastNewsRefresh, setLastNewsRefresh] = useState(null);
  const [mapStatus, setMapStatus] = useState({ state: "idle", message: "" });
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());

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

  async function fetchNews(regions = []) {
    setNewsStatus({ state: "loading", message: "" });
    try {
      const res = await fetch("/api/fetch-travel-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regions }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch travel news");
      }
      setNews(data.alerts || []);
      setLastNewsRefresh(new Date().toISOString());
      setNewsStatus({ state: "success", message: `Fetched ${data.alerts?.length || 0} alerts` });
    } catch (e) {
      setNewsStatus({ state: "error", message: e.message });
    }
  }

  useEffect(() => {
    fetchNews();
    const t = setInterval(() => fetchNews(), 300000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!supabase) {
      setMapStatus({ state: "error", message: "Supabase is not configured." });
      return;
    }

    const token = typeof window !== "undefined" ? window.__MAPBOX_TOKEN : "";
    if (!token) {
      setMapStatus({ state: "error", message: "Missing Mapbox token." });
      return;
    }

    mapboxgl.accessToken = token;
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [0, 20],
        zoom: 1.6,
      });
    }

    function upsertMarker(row) {
      if (!row || row.lat == null || row.lng == null) return;
      const key = row.traveler_id || row.email || row.id;
      if (!key) return;

      const existing = markersRef.current.get(key);
      if (existing) {
        existing.setLngLat([row.lng, row.lat]);
        return;
      }

      const marker = new mapboxgl.Marker({ color: "#1b8ef2" })
        .setLngLat([row.lng, row.lat])
        .setPopup(new mapboxgl.Popup({ offset: 24 }).setText(row.email || row.traveler_id || "Traveler"));
      marker.addTo(mapRef.current);
      markersRef.current.set(key, marker);
    }

    function removeMarker(row) {
      const key = row.traveler_id || row.email || row.id;
      const existing = markersRef.current.get(key);
      if (existing) {
        existing.remove();
        markersRef.current.delete(key);
      }
    }

    async function loadInitial() {
      const { data, error } = await supabase.from("locations").select("*");
      if (error) {
        setMapStatus({ state: "error", message: error.message });
        return;
      }
      (data || []).forEach(upsertMarker);
      if (data?.length) {
        const first = data[0];
        mapRef.current?.setCenter([first.lng, first.lat]);
        mapRef.current?.setZoom(6);
      }
      setMapStatus({ state: "success", message: "Live map connected." });
    }

    loadInitial();

    const channel = supabase
      .channel("locations-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "locations" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            removeMarker(payload.old);
          } else {
            upsertMarker(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
    };
  }, []);

  const locMap = new Map(locations.map((l) => [l.travelerId, l]));

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <AdminPanelSettingsRoundedIcon color="primary" />
          <Typography variant="h4">Admin Monitoring</Typography>
          <Chip label={`Active: ${active.length}`} sx={{ ml: 1 }} />
          <Button variant="outlined" onClick={() => fetchNews()} sx={{ ml: "auto" }}>
            Refresh Travel News
          </Button>
        </Box>

        {err ? <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert> : null}
        {newsStatus.state === "error" ? (
          <Alert severity="error" sx={{ mb: 2 }}>{newsStatus.message}</Alert>
        ) : null}
        {newsStatus.state === "success" ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {newsStatus.message}
            {lastNewsRefresh ? ` - ${new Date(lastNewsRefresh).toLocaleString()}` : ""}
          </Alert>
        ) : null}

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

        <Box sx={{ height: 20 }} />

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Live Traveler Map</Typography>
            {mapStatus.state === "error" ? (
              <Alert severity="error" sx={{ mb: 2 }}>{mapStatus.message}</Alert>
            ) : null}
            <Box
              ref={mapContainerRef}
              sx={{
                height: 360,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            />
          </CardContent>
        </Card>

        <Box sx={{ height: 20 }} />

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Travel News & Alerts</Typography>
            <List>
              {news.map((alert, idx) => (
                <React.Fragment key={`${alert.title}-${idx}`}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`${alert.title} - ${alert.severity || "medium"}`}
                      secondary={`${alert.summary || ""} ${alert.source ? `- ${alert.source}` : ""}`}
                    />
                  </ListItem>
                  {idx < news.length - 1 ? <Divider /> : null}
                </React.Fragment>
              ))}
              {!news.length ? (
                <ListItem>
                  <ListItemText primary="No travel alerts fetched yet." />
                </ListItem>
              ) : null}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
