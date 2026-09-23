import { createClient } from "@supabase/supabase-js";

function cleanSupabaseUrl(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null;
  let url = rawUrl.trim().replace(/^["']|["']$/g, ""); // strip wrapping quotes

  // If user pasted postgres connection string by accident
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
    const match = url.match(/@(?:db\.)?([a-z0-9-]+)\.supabase\.co/i);
    if (match?.[1]) {
      return `https://${match[1]}.supabase.co`;
    }
  }

  // Ensure starts with http
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    // Return strictly the origin (e.g. https://xxxx.supabase.co) without extra paths like /rest/v1
    return parsed.origin;
  } catch {
    return url.replace(/\/+$/, "");
  }
}

function cleanKey(rawKey: string | undefined): string | null {
  if (!rawKey) return null;
  return rawKey.trim().replace(/^["']|["']$/g, "");
}

const cleanedUrl = cleanSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const cleanedKey = cleanKey(
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const isSupabaseConfigured = Boolean(
  cleanedUrl &&
  cleanedKey &&
  cleanedUrl.startsWith("http") &&
  !cleanedUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured && cleanedUrl && cleanedKey
  ? (() => {
      try {
        return createClient(cleanedUrl, cleanedKey, {
          auth: { persistSession: false },
        });
      } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
        return null;
      }
    })()
  : null;


