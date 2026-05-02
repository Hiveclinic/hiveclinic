// Catalog sync validator: scrapes the live Acuity scheduler and compares
// against the public.treatments table. Logs a structured diff to catalog_sync_log.
// Triggered manually (admin tab) or on a schedule (pg_cron).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ACUITY_URL = "https://app.acuityscheduling.com/schedule.php?owner=39098354";

// Acuity raw category label  ->  canonical DB category
const CATEGORY_MAP: Record<string, string> = {
  "✦ ANTI WRINKLE (BOTOX)": "Anti Wrinkle (Botox)",
  "✦ CHEMCIAL PEELS": "Chemical Peels",
  "✦ CONSULTATION": "Consultation",
  "✦ CONTENT MODEL APPOINTMENTS": "Content Model",
  "✦ CORRECTION": "Correction",
  "✦ FACIAL BALANCING": "Facial Balancing",
  "✦ FAT DISSOLVE": "Fat Dissolve",
  "✦ LIPS": "Lips",
  "✦ OFFERS": "Offers",
  "✦ SKIN BOOSTERS": "Skin Boosters",
  "✦ SKIN TREATMENTS": "Skin Treatments",
};

const cleanName = (s: string) =>
  (s || "").replace(/\s+/g, " ").trim().toLowerCase();

type AcuityItem = {
  id: number;
  name: string;
  price: string;
  duration: number;
  active: boolean;
  category: string; // raw
};

async function fetchAcuityCatalog(): Promise<AcuityItem[]> {
  const res = await fetch(ACUITY_URL, {
    headers: { "User-Agent": "Mozilla/5.0 HiveCatalogBot/1.0" },
  });
  if (!res.ok) throw new Error(`Acuity fetch ${res.status}`);
  const html = await res.text();

  const i = html.indexOf('"appointmentTypes":');
  if (i === -1) throw new Error("appointmentTypes block not found");
  const start = html.indexOf("{", i);
  let depth = 0;
  let end = -1;
  for (let j = start; j < html.length; j++) {
    const c = html[j];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        end = j + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error("Could not locate JSON end");
  const obj = JSON.parse(html.slice(start, end));

  const items: AcuityItem[] = [];
  for (const [cat, list] of Object.entries(obj)) {
    if (!Array.isArray(list)) continue;
    for (const t of list as Array<Record<string, unknown>>) {
      items.push({
        id: Number(t.id),
        name: String(t.name ?? ""),
        price: String(t.price ?? "0"),
        duration: Number(t.duration ?? 0),
        active: Boolean(t.active),
        category: cat,
      });
    }
  }
  return items;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const acuity = await fetchAcuityCatalog();
    const acuityActive = acuity.filter((a) => a.active);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: dbRows, error } = await supabase
      .from("treatments")
      .select(
        "id, acuity_appointment_type_id, name, category, price, on_offer, offer_price, active",
      )
      .eq("active", true);
    if (error) throw error;

    const dbById = new Map<string, typeof dbRows[number]>();
    const dbByName = new Map<string, typeof dbRows[number]>();
    for (const r of dbRows ?? []) {
      if (r.acuity_appointment_type_id)
        dbById.set(String(r.acuity_appointment_type_id), r);
      dbByName.set(cleanName(r.name), r);
    }

    const missing: Array<Record<string, unknown>> = []; // in Acuity, not in DB
    const priceMismatch: Array<Record<string, unknown>> = [];
    const categoryMismatch: Array<Record<string, unknown>> = [];
    const matched: Array<Record<string, unknown>> = [];
    const unknownCategories: string[] = [];

    for (const a of acuityActive) {
      const canonicalCat = CATEGORY_MAP[a.category];
      if (!canonicalCat && !unknownCategories.includes(a.category))
        unknownCategories.push(a.category);

      const dbRow =
        dbById.get(String(a.id)) ?? dbByName.get(cleanName(a.name));

      if (!dbRow) {
        missing.push({
          acuity_id: a.id,
          name: a.name,
          price: a.price,
          category: a.category,
        });
        continue;
      }

      const dbPrice = Number(
        dbRow.on_offer && dbRow.offer_price
          ? dbRow.offer_price
          : dbRow.price,
      );
      const acuityPrice = Number(a.price);
      if (Math.abs(dbPrice - acuityPrice) > 0.001) {
        priceMismatch.push({
          acuity_id: a.id,
          name: a.name,
          acuity_price: acuityPrice,
          db_price: dbPrice,
          db_id: dbRow.id,
        });
      }

      if (canonicalCat && dbRow.category !== canonicalCat) {
        categoryMismatch.push({
          acuity_id: a.id,
          name: a.name,
          acuity_category: canonicalCat,
          db_category: dbRow.category,
        });
      }

      matched.push({ acuity_id: a.id, name: a.name });
    }

    // Items in DB but not in Acuity (potentially stale)
    const acuityIds = new Set(acuityActive.map((a) => String(a.id)));
    const acuityNames = new Set(acuityActive.map((a) => cleanName(a.name)));
    const extras: Array<Record<string, unknown>> = [];
    for (const r of dbRows ?? []) {
      const idMatch = r.acuity_appointment_type_id
        ? acuityIds.has(String(r.acuity_appointment_type_id))
        : false;
      const nameMatch = acuityNames.has(cleanName(r.name));
      if (!idMatch && !nameMatch) {
        extras.push({
          db_id: r.id,
          name: r.name,
          category: r.category,
          price: Number(r.price),
        });
      }
    }

    const issuesCount =
      missing.length +
      priceMismatch.length +
      categoryMismatch.length +
      extras.length;
    const inSync = issuesCount === 0;

    const report = {
      generated_at: new Date().toISOString(),
      acuity_total: acuityActive.length,
      db_total: dbRows?.length ?? 0,
      missing,
      price_mismatch: priceMismatch,
      category_mismatch: categoryMismatch,
      extras,
      unknown_categories: unknownCategories,
    };

    // Insert via service role (bypasses RLS)
    const { data: logRow } = await supabase
      .from("catalog_sync_log")
      .insert({
        in_sync: inSync,
        issues_count: issuesCount,
        acuity_total: acuityActive.length,
        db_total: dbRows?.length ?? 0,
        report,
        source: req.headers.get("x-cron") === "1" ? "cron" : "manual",
      })
      .select("id, ran_at")
      .single();

    return new Response(
      JSON.stringify({
        ok: true,
        in_sync: inSync,
        issues_count: issuesCount,
        log_id: logRow?.id,
        ran_at: logRow?.ran_at,
        report,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
