import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [busy, setBusy] = useState(false);

  async function sendLink() {
    setStatus({ type: "idle", message: "" });
    setBusy(true);

    const cleanEmail = String(email || "").trim().toLowerCase();

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
      },
    });

    if (error) {
      const message =
        error.message ||
        error.error_description ||
        "Something went wrong sending the login link. Please try again.";
      setStatus({ type: "error", message });
      setBusy(false);
      return;
    }

    setStatus({
      type: "success",
      message: "Check your email for your secure login link.",
    });
    setBusy(false);
  }

  return (
    <div style={{ padding: 28, maxWidth: 520 }}>
      <h2 style={{ marginBottom: 8 }}>Customer Portal Login</h2>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Use the same email you entered on the Travel Information page.
      </p>

      <label style={{ display: "block", marginTop: 16, marginBottom: 8 }}>
        Email
      </label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="you@email.com"
        style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
      />

      <button
        onClick={sendLink}
        disabled={!email || busy}
        style={{
          marginTop: 14,
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        {busy ? "Sending..." : "Send login link"}
      </button>

      {status.message ? (
        <div style={{ marginTop: 14 }}>
          <strong>{status.type === "error" ? "Error:" : "Done:"}</strong> {status.message}
        </div>
      ) : null}
    </div>
  );
}
