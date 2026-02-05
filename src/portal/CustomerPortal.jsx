import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function CustomerPortal() {
  const [loading, setLoading] = useState(true);
  const [traveler, setTraveler] = useState(null);
  const [error, setError] = useState("");

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
          first_name,
          last_name,
          email,
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

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/portal/login";
  }

  if (loading) return <div style={{ padding: 24 }}>Loading your trip details...</div>;
  if (error) return <div style={{ padding: 24 }}>Problem loading your profile: {error}</div>;
  if (!traveler) return <div style={{ padding: 24 }}>No traveler record found.</div>;

  return (
    <div style={{ padding: 28, maxWidth: 820 }}>
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

      <h3>Trip Dates</h3>
      <div>
        {traveler.trip_start_date} to {traveler.trip_end_date}
      </div>

      <h3 style={{ marginTop: 18 }}>Emergency Contact</h3>
      <div>{traveler.emergency_contact_name}</div>
      <div style={{ opacity: 0.85 }}>{traveler.emergency_contact_phone}</div>

      <h3 style={{ marginTop: 18 }}>Check-in Preferences</h3>
      <pre style={{ background: "#f6f7f9", padding: 12, borderRadius: 10, overflow: "auto" }}>
        {JSON.stringify(traveler.checkin_preferences || {}, null, 2)}
      </pre>

      <h3 style={{ marginTop: 18 }}>Notification Preferences</h3>
      <pre style={{ background: "#f6f7f9", padding: 12, borderRadius: 10, overflow: "auto" }}>
        {JSON.stringify(traveler.notification_preferences || {}, null, 2)}
      </pre>

      <h3 style={{ marginTop: 18 }}>Itinerary</h3>
      <div style={{ whiteSpace: "pre-wrap", background: "#f6f7f9", padding: 12, borderRadius: 10 }}>
        {traveler.itinerary || "No itinerary saved yet."}
      </div>
    </div>
  );
}
