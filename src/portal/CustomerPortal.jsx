import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import TravelerMap from "./TravelerMap";

export default function CustomerPortal() {
  const [loading, setLoading] = useState(true);
  const [traveler, setTraveler] = useState(null);
  const [error, setError] = useState("");
  const [news, setNews] = useState([]);
  const [newsStatus, setNewsStatus] = useState({ state: "idle", message: "" });
  const [lastNewsRefresh, setLastNewsRefresh] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState({ state: "idle", message: "" });
  const [lastWeatherRefresh, setLastWeatherRefresh] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [trackStatus, setTrackStatus] = useState({ state: "idle", message: "" });
  const [lastPosition, setLastPosition] = useState(null);
  const [consent, setConsent] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const watchRef = useRef(null);

  const destinationRegions = useMemo(() => {
    if (!traveler?.destination) return [];
    return [traveler.destination];
  }, [traveler?.destination]);

  useEffect(() => {
    let active = true;

    async function load() {
      setError("");
      setLoading(true);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        if (active) setError(userErr.message);
        if (active) setLoading(false);
        return;
      }

      const email = userData?.user?.email;
      if (!email) {
        if (active) setError("No email found in session.");
        if (active) setLoading(false);
        return;
      }

      const { data, error: dbErr } = await supabase
        .from("travelers")
        .select(`
          id,
          first_name,
          last_name,
          email,
          destination,
          trip_start_date,
          trip_end_date,
          itinerary,
          emergency_contact_name,
          emergency_contact_phone,
          notification_preferences,
          checkin_preferences
        `)
        .eq("email", email.toLowerCase())
        .single();

      if (dbErr) {
        if (active) setError(dbErr.message);
        if (active) setLoading(false);
        return;
      }

      if (active) setTraveler(data);
      if (active) setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  // Show the location-consent dialog as soon as we know who the traveler is,
  // but only if they haven't already granted consent in this session.
  useEffect(() => {
    if (traveler?.id && !consent) {
      setShowConsentDialog(true);
    }
  }, [traveler?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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
    fetchNews(destinationRegions);
    const t = setInterval(() => fetchNews(destinationRegions), 300000);
    return () => clearInterval(t);
  }, [destinationRegions]);

  async function fetchWeather(destination) {
    if (!destination) return;
    setWeatherStatus({ state: "loading", message: "" });
    try {
      const res = await fetch("/api/fetch-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch weather");
      }
      setWeather(data.weather || null);
      setLastWeatherRefresh(new Date().toISOString());
      setWeatherStatus({ state: "success", message: "Weather updated" });
    } catch (e) {
      setWeatherStatus({ state: "error", message: e.message });
    }
  }

  useEffect(() => {
    if (!traveler?.destination) return;
    fetchWeather(traveler.destination);
    const t = setInterval(() => fetchWeather(traveler.destination), 300000);
    return () => clearInterval(t);
  }, [traveler?.destination]);

  useEffect(() => {
    return () => {
      if (watchRef.current != null) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
    };
  }, []);

  async function startTracking(hasConsent = consent) {
    if (!supabase) {
      setTrackStatus({ state: "error", message: "Supabase is not configured." });
      return;
    }
    if (!navigator.geolocation) {
      setTrackStatus({ state: "error", message: "Geolocation is not supported on this device." });
      return;
    }
    if (!hasConsent) {
      setTrackStatus({ state: "error", message: "Please confirm consent before sharing." });
      return;
    }
    if (!traveler?.id) {
      setTrackStatus({ state: "error", message: "Missing traveler record." });
      return;
    }

    setTrackStatus({ state: "loading", message: "Starting live tracking..." });
    setTracking(true);

    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const payload = {
          traveler_id: traveler.id,
          email: traveler.email,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          source: "gps",
          updated_at: new Date().toISOString(),
        };

        setLastPosition(payload);
        setTrackStatus({ state: "success", message: "Live location shared." });

        try {
          await supabase.from("locations").upsert(payload, { onConflict: "traveler_id" });
        } catch (e) {
          setTrackStatus({ state: "error", message: e.message });
        }
      },
      (err) => {
        setTrackStatus({ state: "error", message: err.message });
        setTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  }

  function stopTracking() {
    if (watchRef.current != null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    setTracking(false);
    setTrackStatus({ state: "idle", message: "Live tracking stopped." });
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/portal/login";
  }

  if (loading) return <div style={{ padding: 24 }}>Loading your trip details...</div>;
  if (error) return <div style={{ padding: 24 }}>Problem loading your profile: {error}</div>;
  if (!traveler) return <div style={{ padding: 24 }}>No traveler record found.</div>;

  const severeAlerts = news.filter((alert) => {
    const level = String(alert.severity || "").toLowerCase();
    return level === "high" || level === "critical";
  });

  return (
    <div style={{ padding: 28, maxWidth: 980 }}>

      {/* Location-consent dialog — shown once on first portal load */}
      {showConsentDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 32,
              maxWidth: 440,
              width: "90%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>📍</div>
            <h2 style={{ marginBottom: 8 }}>Enable Location Tracking</h2>
            <p style={{ opacity: 0.75, marginBottom: 24, lineHeight: 1.6 }}>
              VOLOREIS would like to track your live location so your trip safety
              team can monitor your journey in real time. Your position will be
              displayed on a private map visible only to you and your VOLOREIS
              monitoring team.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setShowConsentDialog(false)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  fontWeight: 600,
                  background: "white",
                }}
              >
                Not now
              </button>
              <button
                onClick={() => {
                  setConsent(true);
                  setShowConsentDialog(false);
                  startTracking(true);
                }}
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: "#1976d2",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Allow location tracking
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ marginBottom: 6 }}>
            Welcome, {traveler.first_name} {traveler.last_name}
          </h2>
          <div style={{ opacity: 0.8 }}>{traveler.email}</div>
        </div>

        <button
          onClick={signOut}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            cursor: "pointer",
            fontWeight: 700,
            height: 42,
          }}
        >
          Sign out
        </button>
      </div>

      <hr style={{ margin: "18px 0" }} />

      <div style={{ display: "grid", gap: 18 }}>
        <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Trip Details</h3>
          <div><strong>Destination:</strong> {traveler.destination || "Not specified"}</div>
          <div>
            <strong>Trip Dates:</strong> {traveler.trip_start_date || "n/a"} to {traveler.trip_end_date || "n/a"}
          </div>
        </section>

        <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Emergency Contact</h3>
          <div>{traveler.emergency_contact_name || "Not set"}</div>
          <div style={{ opacity: 0.85 }}>{traveler.emergency_contact_phone || ""}</div>
        </section>

        <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Weather at Destination</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => fetchWeather(traveler.destination)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #ccc",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Refresh Weather
            </button>
            {weatherStatus.state === "success" && lastWeatherRefresh ? (
              <span style={{ opacity: 0.8 }}>
                {weatherStatus.message} - {new Date(lastWeatherRefresh).toLocaleString()}
              </span>
            ) : null}
            {weatherStatus.state === "error" ? (
              <span style={{ color: "#b00020" }}>{weatherStatus.message}</span>
            ) : null}
          </div>
          <div style={{ marginTop: 12 }}>
            {weather ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
                <div style={{ padding: 12, borderRadius: 10, background: "#f6f7f9" }}>
                  <div style={{ fontWeight: 700 }}>{weather.location || traveler.destination}</div>
                  <div style={{ opacity: 0.7 }}>{weather.region || ""}</div>
                </div>
                <div style={{ padding: 12, borderRadius: 10, background: "#f6f7f9" }}>
                  <div style={{ fontWeight: 700 }}>Temperature</div>
                  <div>{weather.temperature_c != null ? `${Math.round(weather.temperature_c)}°C` : "n/a"}</div>
                </div>
                <div style={{ padding: 12, borderRadius: 10, background: "#f6f7f9" }}>
                  <div style={{ fontWeight: 700 }}>Humidity</div>
                  <div>{weather.humidity != null ? `${weather.humidity}%` : "n/a"}</div>
                </div>
                <div style={{ padding: 12, borderRadius: 10, background: "#f6f7f9" }}>
                  <div style={{ fontWeight: 700 }}>Wind</div>
                  <div>{weather.wind_kph != null ? `${Math.round(weather.wind_kph)} km/h` : "n/a"}</div>
                </div>
              </div>
            ) : (
              <div style={{ opacity: 0.7 }}>No weather data yet.</div>
            )}
          </div>
        </section>

        <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Check-in Preferences</h3>
          <pre style={{ background: "#f6f7f9", padding: 12, borderRadius: 10, overflow: "auto" }}>
            {JSON.stringify(traveler.checkin_preferences || {}, null, 2)}
          </pre>
        </section>

        <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Notification Preferences</h3>
          <pre style={{ background: "#f6f7f9", padding: 12, borderRadius: 10, overflow: "auto" }}>
            {JSON.stringify(traveler.notification_preferences || {}, null, 2)}
          </pre>
        </section>

        <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Itinerary</h3>
          <div style={{ whiteSpace: "pre-wrap", background: "#f6f7f9", padding: 12, borderRadius: 10 }}>
            {traveler.itinerary || "No itinerary saved yet."}
          </div>
        </section>

        <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Alerts</h3>
          {severeAlerts.length ? (
            severeAlerts.map((alert, idx) => (
              <div
                key={`alert-${idx}`}
                style={{
                  border: "1px solid #f2caca",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  background: "#fff7f7",
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {alert.title} - {alert.severity || "high"}
                </div>
                <div style={{ opacity: 0.85 }}>{alert.summary}</div>
              </div>
            ))
          ) : (
            <div style={{ opacity: 0.7 }}>No active alerts right now.</div>
          )}
        </section>

        <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Live Location Sharing</h3>
          <label style={{ display: "block", marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            I consent to share my live location with VOLOREIS monitoring.
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {!tracking ? (
              <button
                onClick={() => startTracking()}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid #0b6",
                  cursor: "pointer",
                  fontWeight: 700,
                  background: "#0b6",
                  color: "white",
                }}
              >
                Start live sharing
              </button>
            ) : (
              <button
                onClick={stopTracking}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid #999",
                  cursor: "pointer",
                  fontWeight: 700,
                  background: "white",
                }}
              >
                Stop sharing
              </button>
            )}
            {trackStatus.message ? (
              <span style={{ opacity: 0.8 }}>{trackStatus.message}</span>
            ) : null}
          </div>
          {lastPosition ? (
            <div style={{ marginTop: 10, opacity: 0.8 }}>
              Last shared: {Number(lastPosition.lat).toFixed(5)}, {Number(lastPosition.lng).toFixed(5)} •{" "}
              Accuracy {Math.round(lastPosition.accuracy)}m
            </div>
          ) : (
            <div style={{ marginTop: 10, opacity: 0.7 }}>No location shared yet.</div>
          )}

          {/* Live map — visible once tracking has started or a position is available */}
          {(tracking || lastPosition) && (
            <TravelerMap
              position={lastPosition}
              destination={traveler.destination}
            />
          )}
        </section>

        <section style={{ border: "1px solid #e6e6e6", borderRadius: 14, padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Travel News</h3>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => fetchNews(destinationRegions)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #ccc",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Refresh Travel News
            </button>
            {newsStatus.state === "success" && lastNewsRefresh ? (
              <span style={{ opacity: 0.8 }}>
                {newsStatus.message} - {new Date(lastNewsRefresh).toLocaleString()}
              </span>
            ) : null}
            {newsStatus.state === "error" ? (
              <span style={{ color: "#b00020" }}>{newsStatus.message}</span>
            ) : null}
          </div>

          <div style={{ marginTop: 12 }}>
            {news.map((alert, idx) => (
              <div
                key={`${alert.title}-${idx}`}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  background: "#fafafa",
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {alert.title} - {alert.severity || "medium"}
                </div>
                <div style={{ opacity: 0.85 }}>{alert.summary}</div>
                <div style={{ opacity: 0.7, marginTop: 6 }}>
                  {alert.source ? `Source: ${alert.source}` : "Source: Unknown"}
                </div>
              </div>
            ))}
            {!news.length ? (
              <div style={{ opacity: 0.7 }}>No travel alerts fetched yet.</div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
