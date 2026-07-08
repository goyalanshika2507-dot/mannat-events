import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Agar variables nahi mile, toh ye console mein error dikhayega
  if (!url || !key) {
    console.error("DEBUG ERROR: Supabase env variables are missing!");
    console.error("URL:", url, "KEY:", key);
  }

  return createBrowserClient(
    url!,
    key!
  )
}