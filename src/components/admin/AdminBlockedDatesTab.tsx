import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarX, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type BlockedDate = {
  id: string;
  blocked_date: string;
  reason: string | null;
  created_at: string;
};

const AdminBlockedDatesTab = () => {
  const [dates, setDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");

  const fetchDates = async () => {
    const { data } = await supabase.from("blocked_dates").select("*").order("blocked_date", { ascending: true });
    if (data) setDates(data);
    setLoading(false);
  };

  useEffect(() => { fetchDates(); }, []);

  const addDate = async () => {
    if (!newDate) { toast.error("Select a date"); return; }
    const { error } = await supabase.from("blocked_dates").insert({ blocked_date: newDate, reason: newReason || null });
    if (error) { toast.error("Failed to block date"); return; }
    toast.success("Date blocked");
    setNewDate(""); setNewReason("");
    fetchDates();
  };

  const removeDate = async (id: string) => {
    const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
    if (error) { toast.error("Failed to remove"); return; }
    setDates(prev => prev.filter(d => d.id !== id));
    toast.success("Date unblocked");
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div>
      <h3 className="font-display text-xl flex items-center gap-2 mb-6"><CalendarX size={18} /> Blocked Dates</h3>

      <div className="border border-border p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="font-body text-xs block mb-1 text-muted-foreground">Date</label>
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="font-body text-xs block mb-1 text-muted-foreground">Reason (optional)</label>
          <input value={newReason} onChange={e => setNewReason(e.target.value)} placeholder="E.g. Bank Holiday, Training Day" className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
        </div>
        <button onClick={addDate} className="flex items-center gap-2 px-6 py-2 bg-foreground text-background font-body text-sm tracking-wider uppercase hover:bg-accent transition-colors">
          <Plus size={14} /> Block Date
        </button>
      </div>

      {dates.length === 0 ? (
        <div className="p-12 bg-secondary text-center"><p className="font-body text-muted-foreground">No blocked dates.</p></div>
      ) : (
        <div className="space-y-2">
          {dates.map(d => (
            <div key={d.id} className="border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-body text-sm font-medium">
                  {new Date(d.blocked_date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
                {d.reason && <span className="font-body text-xs text-muted-foreground">- {d.reason}</span>}
              </div>
              <button onClick={() => removeDate(d.id)} className="px-2 py-1 border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlockedDatesTab;
