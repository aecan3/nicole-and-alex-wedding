import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser/client-safe Supabase client. Only ever uses the public anon key,
// which is restricted by row-level security to insert-only on `rsvps`.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
