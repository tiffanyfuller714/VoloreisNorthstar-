import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Avoid crashing the whole app; the UI can show a banner while we fix envs.
  // eslint-disable-next-line no-console
  console.warn(
    "Missing Supabase env vars. Ensure .env has REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY, then restart the dev server."
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

