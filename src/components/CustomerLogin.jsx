import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/portal",
      },
    });

    if (error) setMessage(error.message);
    else setMessage("Check your email for the login link.");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Customer Portal Login</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Send Login Link</button>
      <p>{message}</p>
    </div>
  );
}
