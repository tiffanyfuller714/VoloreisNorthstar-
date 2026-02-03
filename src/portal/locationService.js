import { api } from "./api";
import { getToken } from "./auth";

const DEFAULTS = {
  highAccuracy: true,
  timeoutMs: 15000,
  maxAgeMs: 5000,
  postIntervalMs: 5000,
};

export function isGeolocationSupported() {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

export function startLiveTracking({
  travelerId,
  onStatus,
  onPosition,
  options = {},
  enableIpFallback = true,
} = {}) {
  const token = getToken();
  const cfg = { ...DEFAULTS, ...options };

  if (!isGeolocationSupported()) {
    onStatus?.({ state: "unsupported", message: "GPS is not supported on this device/browser." });
    return { stop: async () => {} };
  }

  let watchId = null;
  let lastPostedAt = 0;
  let stopped = false;

  const lastKnownKey = `voloreis_last_known_${travelerId || "me"}`;

  function saveLastKnown(payload) {
    try {
      localStorage.setItem(lastKnownKey, JSON.stringify(payload));
    } catch {}
  }

  function readLastKnown() {
    try {
      const raw = localStorage.getItem(lastKnownKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  async function postToServer(positionPayload) {
    const now = Date.now();
    if (now - lastPostedAt < cfg.postIntervalMs) return;
    lastPostedAt = now;

    await api("/location/update", {
      method: "POST",
      token,
      body: {
        travelerId,
        ...positionPayload,
      },
    });
  }

  async function ipFallback(reason) {
    if (!enableIpFallback) return;

    try {
      const data = await api("/location/ip-approx", { token });

      onStatus?.({
        state: "fallback",
        message: `Using approximate location due to: ${reason}`,
      });

      const payload = {
        lat: data.lat,
        lng: data.lng,
        accuracy: data.accuracy || null,
        source: "ip_approx",
        timestamp: new Date().toISOString(),
      };

      saveLastKnown(payload);
      onPosition?.(payload);
      await postToServer(payload);
    } catch {
      onStatus?.({ state: "error", message: "Could not get IP-based fallback location." });
    }
  }

  function handleSuccess(pos) {
    if (stopped) return;

    const coords = pos.coords;
    const payload = {
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: coords.accuracy,
      heading: coords.heading,
      speed: coords.speed,
      source: "gps",
      timestamp: new Date(pos.timestamp).toISOString(),
    };

    saveLastKnown(payload);
    onPosition?.(payload);
    onStatus?.({ state: "tracking", message: "Live GPS tracking is active." });

    postToServer(payload).catch(() => {
      onStatus?.({ state: "degraded", message: "Tracking active, but update failed. Retrying…" });
    });
  }

  function handleError(err) {
    if (stopped) return;

    const code = err?.code;
    const msg =
      code === 1
        ? "Permission denied."
        : code === 2
        ? "Position unavailable."
        : code === 3
        ? "GPS request timed out."
        : "Unknown GPS error.";

    onStatus?.({ state: "error", message: msg });

    const last = readLastKnown();
    if (last) {
      onPosition?.({ ...last, source: last.source || "last_known" });
      onStatus?.({ state: "degraded", message: "Showing last known location while retrying." });
    }

    ipFallback(msg);

    if (watchId !== null) navigator.geolocation.clearWatch(watchId);

    setTimeout(() => {
      if (stopped) return;

      watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: cfg.highAccuracy,
        timeout: cfg.timeoutMs,
        maximumAge: cfg.maxAgeMs,
      });
    }, 4000);
  }

  onStatus?.({ state: "requesting", message: "Requesting GPS permission…" });

  watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
    enableHighAccuracy: cfg.highAccuracy,
    timeout: cfg.timeoutMs,
    maximumAge: cfg.maxAgeMs,
  });

  return {
    stop: async () => {
      stopped = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      onStatus?.({ state: "stopped", message: "Live GPS tracking stopped." });

      try {
        await api("/location/stop", { method: "POST", token, body: { travelerId } });
      } catch {}
    },
  };
}