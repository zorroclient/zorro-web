import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Minimal typing for the one table this client touches, so `.from()` is typed
// instead of resolving to `never`. (Swap for generated types if we ever add
// `supabase gen types`.)
type SubscriptionRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: string | null;
  status: string;
  current_period_end: string | null;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      subscriptions: {
        Row: SubscriptionRow;
        Insert: Partial<SubscriptionRow> & { user_id: string };
        Update: Partial<SubscriptionRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// Privileged Supabase client for trusted, server-only code (the Stripe
// webhook). Uses the Supabase Secret key (sb_secret_…), which bypasses RLS, so
// NEVER import this into a client component or expose SUPABASE_SECRET_KEY to
// the browser.
let admin: SupabaseClient<Database> | null = null;

export function createAdminClient(): SupabaseClient<Database> {
  if (!admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (!url || !secretKey) {
      throw new Error(
        "Supabase admin client needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY",
      );
    }
    admin = createClient<Database>(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}
