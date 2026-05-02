import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Minus,
  Tag,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type LogRow = {
  id: string;
  ran_at: string;
  in_sync: boolean;
  issues_count: number;
  acuity_total: number;
  db_total: number;
  source: string;
  report: {
    missing?: Array<{ acuity_id: number; name: string; price: string; category: string }>;
    extras?: Array<{ db_id: string; name: string; category: string; price: number }>;
    price_mismatch?: Array<{
      acuity_id: number;
      name: string;
      acuity_price: number;
      db_price: number;
    }>;
    category_mismatch?: Array<{
      acuity_id: number;
      name: string;
      acuity_category: string;
      db_category: string;
    }>;
    unknown_categories?: string[];
  };
};

const fmtTime = (s: string) =>
  new Date(s).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AdminCatalogSyncTab() {
  const [latest, setLatest] = useState<LogRow | null>(null);
  const [history, setHistory] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("catalog_sync_log")
      .select("*")
      .order("ran_at", { ascending: false })
      .limit(20);
    if (data && data.length) {
      setLatest(data[0] as LogRow);
      setHistory(data.slice(1) as LogRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const runCheck = async () => {
    setRunning(true);
    const { data, error } = await supabase.functions.invoke("catalog-sync-check", {
      body: {},
    });
    setRunning(false);
    if (error) {
      toast.error("Check failed: " + error.message);
      return;
    }
    if (data?.in_sync)
      toast.success("Menu matches the live booking scheduler.");
    else toast.warning(`${data?.issues_count} issue(s) found.`);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Catalog Sync</h2>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Compares the live booking scheduler against the website menu.
            Runs nightly and on demand.
          </p>
        </div>
        <button
          onClick={runCheck}
          disabled={running}
          className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={running ? "animate-spin" : ""} />
          {running ? "Checking…" : "Run Check Now"}
        </button>
      </div>

      {loading ? (
        <p className="font-body text-sm text-muted-foreground animate-pulse">
          Loading…
        </p>
      ) : !latest ? (
        <div className="border border-border p-10 text-center">
          <Clock size={20} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-body text-sm text-muted-foreground">
            No checks have been recorded yet. Click "Run Check Now" to start.
          </p>
        </div>
      ) : (
        <>
          {/* Status banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-l-4 ${
              latest.in_sync
                ? "border-l-emerald-500 bg-emerald-50/50"
                : "border-l-amber-500 bg-amber-50/50"
            } border border-border p-6`}
          >
            <div className="flex items-start gap-4">
              {latest.in_sync ? (
                <CheckCircle2
                  size={22}
                  className="text-emerald-600 flex-shrink-0 mt-0.5"
                />
              ) : (
                <AlertTriangle
                  size={22}
                  className="text-amber-600 flex-shrink-0 mt-0.5"
                />
              )}
              <div className="flex-1">
                <h3 className="font-display text-xl mb-1">
                  {latest.in_sync
                    ? "Menu matches the live scheduler."
                    : `${latest.issues_count} issue${
                        latest.issues_count === 1 ? "" : "s"
                      } need attention before deploy.`}
                </h3>
                <p className="font-body text-xs text-muted-foreground">
                  Last checked {fmtTime(latest.ran_at)} · {latest.acuity_total}{" "}
                  live items · {latest.db_total} on website ·{" "}
                  {latest.source === "cron" ? "Auto" : "Manual"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Diff sections */}
          {!latest.in_sync && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DiffCard
                title="Missing from website"
                icon={<Plus size={14} />}
                tone="warn"
                empty="No items are missing."
                items={latest.report.missing?.map((m) => ({
                  primary: m.name,
                  secondary: `£${m.price} · ${m.category}`,
                  tag: `Acuity #${m.acuity_id}`,
                }))}
              />
              <DiffCard
                title="On website but not in scheduler"
                icon={<Minus size={14} />}
                tone="warn"
                empty="No stale items."
                items={latest.report.extras?.map((m) => ({
                  primary: m.name,
                  secondary: `£${m.price} · ${m.category}`,
                  tag: `DB`,
                }))}
              />
              <DiffCard
                title="Price mismatches"
                icon={<Tag size={14} />}
                tone="error"
                empty="All prices match."
                items={latest.report.price_mismatch?.map((m) => ({
                  primary: m.name,
                  secondary: `Website £${m.db_price.toFixed(
                    2,
                  )} · Scheduler £${m.acuity_price.toFixed(2)}`,
                  tag: `Acuity #${m.acuity_id}`,
                }))}
              />
              <DiffCard
                title="Category mismatches"
                icon={<ArrowRight size={14} />}
                tone="info"
                empty="All categories match."
                items={latest.report.category_mismatch?.map((m) => ({
                  primary: m.name,
                  secondary: `Website "${m.db_category}" → Scheduler "${m.acuity_category}"`,
                  tag: `Acuity #${m.acuity_id}`,
                }))}
              />
            </div>
          )}

          {/* History */}
          <div>
            <h3 className="font-display text-xl mb-4">History</h3>
            <div className="border border-border divide-y divide-border">
              {history.length === 0 ? (
                <p className="font-body text-sm text-muted-foreground p-4">
                  No previous runs.
                </p>
              ) : (
                history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      {h.in_sync ? (
                        <CheckCircle2
                          size={16}
                          className="text-emerald-600"
                        />
                      ) : (
                        <AlertTriangle size={16} className="text-amber-600" />
                      )}
                      <span className="font-body text-sm">
                        {fmtTime(h.ran_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
                      <span>{h.source === "cron" ? "Auto" : "Manual"}</span>
                      <span>
                        {h.in_sync
                          ? "In sync"
                          : `${h.issues_count} issue${
                              h.issues_count === 1 ? "" : "s"
                            }`}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DiffCard({
  title,
  icon,
  tone,
  items,
  empty,
}: {
  title: string;
  icon: React.ReactNode;
  tone: "warn" | "error" | "info";
  items?: Array<{ primary: string; secondary: string; tag: string }>;
  empty: string;
}) {
  const toneCls =
    tone === "error"
      ? "border-l-rose-500"
      : tone === "warn"
        ? "border-l-amber-500"
        : "border-l-sky-500";
  const hasItems = items && items.length > 0;
  return (
    <div className={`border border-border border-l-4 ${toneCls} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-display text-base">
          {title}
          {hasItems && (
            <span className="ml-2 font-body text-xs text-muted-foreground">
              ({items!.length})
            </span>
          )}
        </h4>
      </div>
      {!hasItems ? (
        <p className="font-body text-xs text-muted-foreground">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items!.map((it, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-3 border-t border-border pt-2 first:border-t-0 first:pt-0"
            >
              <div className="min-w-0">
                <p className="font-body text-sm font-medium truncate">
                  {it.primary}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {it.secondary}
                </p>
              </div>
              <span className="font-body text-[10px] tracking-wider uppercase text-muted-foreground whitespace-nowrap">
                {it.tag}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
