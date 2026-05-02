// Shared auth helpers for edge functions.
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// Verifies the request is either:
//   1) An authenticated admin user (JWT with `admin` role in user_roles), OR
//   2) An internal/server-to-server caller presenting the shared INTERNAL_FUNCTION_SECRET.
export async function requireAdminOrInternal(req: Request): Promise<
  { ok: true; userId?: string } | { ok: false; status: number; message: string }
> {
  const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET") ?? "";
  const providedSecret = req.headers.get("x-internal-secret") ?? "";
  if (internalSecret && providedSecret && timingSafeEqual(providedSecret, internalSecret)) {
    return { ok: true };
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }
  const userId = data.claims.sub as string;

  // Verify admin role via service-role client (bypasses RLS for the role check)
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
  const { data: roleRow } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleRow) return { ok: false, status: 403, message: "Forbidden" };
  return { ok: true, userId };
}

// Verifies the request bears an authenticated user JWT (no role required).
export async function requireUser(req: Request): Promise<
  { ok: true; userId: string } | { ok: false; status: number; message: string }
> {
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims) return { ok: false, status: 401, message: "Unauthorized" };
  return { ok: true, userId: data.claims.sub as string };
}

export function requireInternalSecret(req: Request): boolean {
  const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET") ?? "";
  const providedSecret = req.headers.get("x-internal-secret") ?? "";
  if (!internalSecret || !providedSecret) return false;
  return timingSafeEqual(providedSecret, internalSecret);
}
