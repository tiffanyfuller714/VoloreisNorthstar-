import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/**
 * MVP storage:
 * Replace with Postgres, Firestore, Supabase, MongoDB, Odoo model, etc.
 */
const users = [
  {
    id: "cust_001",
    role: "customer",
    email: "customer@voloreis.com",
    password: "password123",
    customerName: "Traveler One",
    destination: "Paris",
    itineraryText: "Day 1: Arrival\nDay 2: Louvre\nDay 3: Eiffel Tower",
    tripLengthDays: 3,
    planName: "Premium Safety Network",
    emergencyContact: { name: "Aunt Denise", phone: "555-0101" },
    preferences: {
      notificationsEmail: true,
      notificationsSms: false,
      checkInFrequency: 30,
      checkInStart: "10:00",
    },
    monitoringStatus: "active",
    lastCheckInAt: null,
  },
  {
    id: "admin_001",
    role: "admin",
    email: "admin@voloreis.com",
    password: "adminpassword",
    customerName: "Admin User",
  },
];

const tokens = new Map(); // token -> { userId, role }
const locations = new Map(); // travelerId -> { travelerId, lat, lng, accuracy, source, timestamp }

/* ------------------ helpers ------------------ */
function makeToken() {
  return `tok_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  const session = tokens.get(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = session;
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

/* ------------------ auth ------------------ */
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = makeToken();
  tokens.set(token, { userId: user.id, role: user.role });

  res.json({
    token,
    role: user.role,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      customerName: user.customerName,
    },
  });
});

/* ------------------ customer portal ------------------ */
app.get("/me", auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { password, ...safeUser } = user;
  safeUser.customerId = safeUser.id;
  res.json(safeUser);
});

app.post("/me/preferences", auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.preferences = {
    ...user.preferences,
    ...req.body,
  };

  res.json(user.preferences);
});

/* ------------------ admin portal ------------------ */
app.get("/admin/active", auth, requireRole("admin"), (req, res) => {
  const activeUsers = users.filter((u) => u.role === "customer" && u.monitoringStatus === "active");
  res.json({
    active: activeUsers.map((u) => ({
      customerId: u.id,
      customerName: u.customerName,
      destination: u.destination,
      tripLengthDays: u.tripLengthDays,
      planName: u.planName,
      monitoringStatus: u.monitoringStatus,
      lastCheckInAt: u.lastCheckInAt,
    })),
  });
});

app.get("/admin/locations", auth, requireRole("admin"), (req, res) => {
  const locArray = Array.from(locations.values());
  res.json({
    locations: locArray,
  });
});

/* ------------------ location tracking ------------------ */
app.post("/location/update", auth, (req, res) => {
  const { travelerId, lat, lng, accuracy, heading, speed, source, timestamp } = req.body;

  if (!travelerId || lat == null || lng == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  locations.set(travelerId, {
    travelerId,
    lat,
    lng,
    accuracy,
    heading,
    speed,
    source,
    timestamp,
  });

  res.json({ success: true });
});

app.post("/location/stop", auth, (req, res) => {
  const { travelerId } = req.body;

  if (travelerId) {
    locations.delete(travelerId);
  }

  res.json({ success: true });
});

app.get("/location/ip-approx", auth, async (req, res) => {
  // Simulate IP-based location for MVP
  // In production, integrate with a real geolocation API
  res.json({
    lat: 48.8566,
    lng: 2.3522,
    accuracy: 10000, // 10km accuracy for IP-based
    source: "ip_approx",
  });
});

/* ------------------ emergency ------------------ */
app.post("/emergency/trigger", auth, (req, res) => {
  const { source } = req.body;

  // In production, trigger alerts, send SMS, email admin, etc.
  console.log(`🚨 EMERGENCY TRIGGERED by user ${req.user.userId} from ${source}`);

  res.json({
    success: true,
    message: "Emergency signal received and processed",
  });
});

/* ------------------ health check ------------------ */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 VOLOREIS API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});