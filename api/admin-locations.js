const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      res.status(500).json({ error: "Missing Supabase service role configuration." });
      return;
    }

    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ locations: data || [] });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Admin locations error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};
