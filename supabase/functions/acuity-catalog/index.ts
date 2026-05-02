// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACUITY_BASE = "https://acuityscheduling.com/api/v1";

interface AcuityCategory {
  name: string;
  description?: string;
  color?: string;
}

interface AcuityType {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price: string;
  category: string;
  active?: boolean;
  private?: boolean;
  color?: string;
  schedulingUrl?: string;
}

interface CatalogTreatment {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  schedulingUrl: string | null;
  featured: boolean;
  offerLabel: string | null;
}

interface CatalogResponse {
  categories: { name: string; description: string }[];
  treatments: CatalogTreatment[];
  fetchedAt: string;
  cached: boolean;
}

let memo: { data: CatalogResponse; ts: number } | null = null;
const TTL_MS = 60_000;

const isFeatured = (t: AcuityType) => {
  if (/offer|tox|special|promo/i.test(t.category)) return true;
  if (/offer|tox|special|promo|limited/i.test(t.name)) return true;
  return false;
};

const offerLabel = (t: AcuityType): string | null => {
  if (/tox/i.test(t.name) || /tox/i.test(t.category)) return "Tox Day";
  if (/offer|promo|special|limited/i.test(t.name) || /offer|promo|special|limited/i.test(t.category)) return "Limited";
  return null;
};

const fetchAcuity = async (path: string, userId: string, apiKey: string) => {
  const auth = btoa(`${userId}:${apiKey}`);
  const r = await fetch(`${ACUITY_BASE}${path}`, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
  });
  if (!r.ok) {
    const body = await r.text();
    console.error(`Acuity ${path} -> ${r.status}: ${body.slice(0, 300)}`);
    throw new Error(`acuity_${r.status}`);
  }
  return r.json();
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (memo && Date.now() - memo.ts < TTL_MS) {
      return new Response(JSON.stringify({ ...memo.data, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = Deno.env.get("ACUITY_USER_ID");
    const apiKey = Deno.env.get("ACUITY_API_KEY");
    if (!userId || !apiKey) {
      throw new Error("acuity_credentials_missing");
    }

    const [cats, types] = await Promise.all([
      fetchAcuity("/appointment-types/categories", userId, apiKey).catch(() => []),
      fetchAcuity("/appointment-types", userId, apiKey),
    ]);

    const treatments: CatalogTreatment[] = (types as AcuityType[])
      .filter((t) => t.active !== false && !t.private)
      .map((t) => ({
        id: String(t.id),
        name: t.name,
        description: t.description ?? "",
        price: Number(t.price ?? 0),
        duration: Number(t.duration ?? 60),
        category: t.category || "Treatments",
        schedulingUrl: t.schedulingUrl ?? null,
        featured: isFeatured(t),
        offerLabel: offerLabel(t),
      }));

    const cleanCats = (Array.isArray(cats) ? cats : []) as AcuityCategory[];
    const categoryNames = new Set<string>();
    treatments.forEach((t) => categoryNames.add(t.category));

    const categories = Array.from(categoryNames).map((name) => {
      const c = cleanCats.find((x) => x.name === name);
      return { name, description: c?.description ?? "" };
    });

    const payload: CatalogResponse = {
      categories,
      treatments,
      fetchedAt: new Date().toISOString(),
      cached: false,
    };

    memo = { data: payload, ts: Date.now() };

    // Persist snapshot for resilience (best-effort)
    try {
      const supa = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      await supa.from("acuity_cache").upsert({
        id: "catalog",
        data: payload as any,
        fetched_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("acuity_cache upsert failed", e);
    }

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("acuity-catalog error", err);

    // Fallback: serve last cached snapshot from DB
    try {
      const supa = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const { data } = await supa.from("acuity_cache").select("data, fetched_at").eq("id", "catalog").maybeSingle();
      if (data?.data) {
        return new Response(JSON.stringify({ ...(data.data as any), cached: true, stale: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch {/* ignore */}

    return new Response(JSON.stringify({ error: "Failed to load catalog" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
