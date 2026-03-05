import { createClient } from "@supabase/supabase-js";

// Client-safe values: Supabase URL and anon key are public by design.
// Keep service role keys server-only and rely on RLS for data protection.
const EMBEDDED_SUPABASE_URL = "https://gqkmjqfrzaafzdnmtzhl.supabase.co";
const EMBEDDED_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxa21qcWZyemFhZnpkbm10emhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzA2MjQsImV4cCI6MjA4ODMwNjYyNH0.Lhg2PkpAQnRKXwcQKYMjZpRbdfHY52H4FOQlOtpuw08";

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = envSupabaseUrl || EMBEDDED_SUPABASE_URL;
const supabaseAnonKey = envSupabaseAnonKey || EMBEDDED_SUPABASE_ANON_KEY;

const hasRealSupabaseUrl =
  /^https:\/\/.+\.supabase\.co$/i.test(supabaseUrl) &&
  !supabaseUrl.includes("YOUR_PROJECT_ID");
const hasRealAnonKey =
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey.length > 40 &&
  !supabaseAnonKey.includes("YOUR_SUPABASE_ANON_KEY");

export const isSupabaseConfigured = hasRealSupabaseUrl && hasRealAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
