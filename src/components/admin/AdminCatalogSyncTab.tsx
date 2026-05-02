import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Eye,
  Copy,
  Download,
  X,
} from "lucide-react";
import { toast } from "sonner";

type DiffItem = { primary: string; secondary: string; tag: string; raw: Record<string, unknown> };

type LogReport = {
  missing?: Array<{ acuity_id: number; name: string; price: string; category: string }>;
  extras?: Array<{ db_id: string; name: string; category: string; price: number }>;
  price_mismatch?: Array<{
    acuity_id: number;
    name: string;
    acuity_price: number;
    db_price: number;
    db_id?: string;
  }>;
  category_mismatch?: Array<{
    acuity_id: number;
    name: string;
    acuity_category: string;
    db_category: string;
  }>;
  unknown_categories?: string[];
};

type LogRow = {
  id: string;
  ran_at: string;
  in_sync: boolean;
  issues_count: number;
  acuity_total: number;
  db_total: number;
  source: string;
  report: LogReport;
};

const fmtTime = (s: string) =>
  new Date(s).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const timeAgo = (s: string) => {
  const diff = (Date.now() - new Date(s).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? "" : "s"} ago`;
};

export default function AdminCatalogSyncTab() {
  const [latest, setLatest] = useState<LogRow | null>(null);
  const [history, setHistory] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [viewing, setViewing] = useState<LogRow | null>(null);

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
    if (data?.in_sync) toast.success("Menu matches the live booking scheduler.");
    else toast.warning(`${data?.issues_count} issue(s) found.`);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Catalog Sync</h2>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Compares the live booking scheduler against the website menu. Runs nightly and on demand.
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

      {/* Status header — always visible (in-sync or not) */}
      {loading ? (
        <p className="font-body text-sm text-muted-foreground animate-pulse">Loading…</p>
      ) : !latest ? (
        <div className="border border-border p-10 text-center">
          <Clock size={20} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-body text-sm text-muted-foreground">
            No checks have been recorded yet. Click "Run Check Now" to start.
          </p>
        </div>
      ) : (
        <>
          <StatusHeader latest={latest} />

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
                  raw: m,
                }))}
                exportName="missing"
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
                  raw: m,
                }))}
                exportName="extras"
              />
              <DiffCard
                title="Price mismatches"
                icon={<Tag size={14} />}
                tone="error"
                empty="All prices match."
                items={latest.report.price_mismatch?.map((m) => ({
                  primary: m.name,
                  secondary: `Website £${m.db_price.toFixed(2)} · Scheduler £${m.acuity_price.toFixed(2)}`,
                  tag: `Acuity #${m.acuity_id}`,
                  raw: m,
                }))}
                exportName="price-mismatch"
                sqlFix={(raw) =>
                  raw.db_id
                    ? `UPDATE public.treatments SET price = ${(raw as { acuity_price: number }).acuity_price} WHERE id = '${(raw as { db_id: string }).db_id}';`
                    : null
                }
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
                  raw: m,
                }))}
                exportName="category-mismatch"
              />
            </div>
          )}

          {/* History with View buttons */}
          <div>
            <h3 className="font-display text-xl mb-4">History</h3>
            <div className="border border-border divide-y divide-border">
              {history.length === 0 ? (
                <p className="font-body text-sm text-muted-foreground p-4">No previous runs.</p>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-4 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {h.in_sync ? (
                        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
                      )}
                      <span className="font-body text-sm truncate">{fmtTime(h.ran_at)}</span>
                    </div>
                    <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
                      <span className="hidden sm:inline">{h.source === "cron" ? "Auto" : "Manual"}</span>
                      <span>
                        {h.in_sync
                          ? "In sync"
                          : `${h.issues_count} issue${h.issues_count === 1 ? "" : "s"}`}
                      </span>
                      <button
                        onClick={() => setViewing(h)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-border hover:border-gold hover:text-gold transition-colors uppercase tracking-widest text-[10px]"
                      >
                        <Eye size={11} /> View
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <DiffViewer log={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

function StatusHeader({ latest }: { latest: LogRow }) {
  const inSync = latest.in_sync;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-l-4 ${
        inSync ? "border-l-emerald-500 bg-emerald-50/50" : "border-l-amber-500 bg-amber-50/50"
      } border border-border p-6`}
    >
      <div className="flex items-start gap-4 flex-wrap">
        {inSync ? (
          <CheckCircle2 size={22} className="text-emerald-600 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-[240px]">
          <h3 className="font-display text-xl mb-1">
            {inSync
              ? "Menu matches the live scheduler."
              : `${latest.issues_count} issue${latest.issues_count === 1 ? "" : "s"} need attention before deploy.`}
          </h3>
          <p className="font-body text-xs text-muted-foreground">
            Last checked {fmtTime(latest.ran_at)} ({timeAgo(latest.ran_at)}) ·{" "}
            {latest.acuity_total} live items · {latest.db_total} on website ·{" "}
            {latest.source === "cron" ? "Auto" : "Manual"}
          </p>
          <p className="font-body text-[11px] text-muted-foreground mt-1">
            Next scheduled run: nightly via cron
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] tracking-widest uppercase border ${
            inSync
              ? "border-emerald-300 text-emerald-700 bg-emerald-100/50"
              : "border-amber-300 text-amber-700 bg-amber-100/50"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${inSync ? "bg-emerald-500" : "bg-amber-500"}`} />
          {inSync ? "In sync" : "Drift"}
        </span>
      </div>
    </motion.div>
  );
}

function DiffCard({
  title,
  icon,
  tone,
  items,
  empty,
  exportName,
  sqlFix,
}: {
  title: string;
  icon: React.ReactNode;
  tone: "warn" | "error" | "info";
  items?: Array<DiffItem>;
  empty: string;
  exportName: string;
  sqlFix?: (raw: Record<string, unknown>) => string | null;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const toneCls =
    tone === "error"
      ? "border-l-rose-500"
      : tone === "warn"
        ? "border-l-amber-500"
        : "border-l-sky-500";
  const hasItems = items && items.length > 0;

  const copyCsv = async () => {
    if (!items?.length) return;
    const headers = ["primary", "secondary", "tag"];
    const rows = items.map((it) => [it.primary, it.secondary, it.tag]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    await navigator.clipboard.writeText(csv);
    toast.success("Copied as CSV");
  };

  const downloadJson = () => {
    if (!items?.length) return;
    const blob = new Blob([JSON.stringify(items.map((i) => i.raw), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catalog-${exportName}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`border border-border border-l-4 ${toneCls} p-5`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-display text-base">
            {title}
            {hasItems && (
              <span className="ml-2 font-body text-xs text-muted-foreground">({items!.length})</span>
            )}
          </h4>
        </div>
        {hasItems && (
          <div className="flex items-center gap-1">
            <button
              onClick={copyCsv}
              title="Copy as CSV"
              className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
            >
              <Copy size={12} />
            </button>
            <button
              onClick={downloadJson}
              title="Export JSON"
              className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
            >
              <Download size={12} />
            </button>
          </div>
        )}
      </div>
      {!hasItems ? (
        <p className="font-body text-xs text-muted-foreground">{empty}</p>
      ) : (
        <ul className="space-y-1">
          {items!.map((it, i) => {
            const open = openIdx === i;
            const sql = sqlFix?.(it.raw);
            return (
              <li key={i} className="border-t border-border first:border-t-0">
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-start justify-between gap-3 py-2 text-left hover:bg-secondary/50 transition-colors px-1"
                >
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium truncate">{it.primary}</p>
                    <p className="font-body text-xs text-muted-foreground">{it.secondary}</p>
                  </div>
                  <span className="font-body text-[10px] tracking-wider uppercase text-muted-foreground whitespace-nowrap">
                    {it.tag}
                  </span>
                </button>
                {open && (
                  <div className="px-1 pb-3 space-y-2">
                    <pre className="text-[10px] bg-secondary/60 p-2 overflow-x-auto whitespace-pre-wrap break-all border border-border">
                      {JSON.stringify(it.raw, null, 2)}
                    </pre>
                    {sql && (
                      <div className="flex items-center justify-between gap-2 bg-foreground text-background px-3 py-2">
                        <code className="text-[10px] font-mono truncate flex-1">{sql}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(sql);
                            toast.success("SQL copied");
                          }}
                          className="text-[10px] tracking-widest uppercase border border-white/20 px-2 py-1 hover:border-gold hover:text-gold"
                        >
                          Copy SQL
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DiffViewer({ log, onClose }: { log: LogRow | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {log && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex justify-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="w-full max-w-2xl bg-background h-full overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl">Sync Run</h3>
                <p className="font-body text-xs text-muted-foreground">
                  {fmtTime(log.ran_at)} · {log.source === "cron" ? "Auto" : "Manual"} ·{" "}
                  {log.in_sync ? "In sync" : `${log.issues_count} issues`}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded">
                <X size={16} />
              </button>
            </div>
            <pre className="text-[11px] bg-secondary/60 p-4 overflow-x-auto whitespace-pre-wrap break-all border border-border">
              {JSON.stringify(log.report, null, 2)}
            </pre>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
