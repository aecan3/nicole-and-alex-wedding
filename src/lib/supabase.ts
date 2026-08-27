import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazily created so a missing env var never crashes the build (Next.js
// prerenders "use client" pages during `next build`, which runs this
// module in Node before any browser env vars exist). The client is only
// ever actually constructed when a component calls getSupabase() at
// runtime, by which point Vercel has injected the real values.
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase isn't configured yet — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the Vercel project's Environment Variables."
    );
  }

  // Browser/client-safe Supabase client. Only ever uses the public anon
  // key, which is restricted by row-level security to the SECURITY
  // DEFINER functions in supabase/schema.sql.
  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
