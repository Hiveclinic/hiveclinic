import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Save } from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type AvailabilityRow = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_mins: number;
  is_available: boolean;
};

const AdminAvailabilityTab = () => {
  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("availability").select("*").order("day_of_week");
      if (data) setAvailability(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const updateRow = (id: string, field: string, value: any) => {
    setAvailability(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const saveAll = async () => {
    setSaving(true);
    for (const row of availability) {
      const { error } = await supabase
        .from("availability")
        .update({
          start_time: row.start_time,
          end_time: row.end_time,
          is_available: row.is_available,
          slot_duration_mins: row.slot_duration_mins,
        })
        .eq("id", row.id);
      if (error) {
        toast.error(`Failed to update ${DAYS[row.day_of_week]}`);
        setSaving(false);
        return;
      }
    }
    toast.success("Availability updated successfully");
    setSaving(false);
  };

  const addDay = async (dayOfWeek: number) => {
    const { data, error } = await supabase
      .from("availability")
      .insert({ day_of_week: dayOfWeek, start_time: "10:00", end_time: "17:00", is_available: true, slot_duration_mins: 30 })
      .select()
      .single();
    if (data) setAvailability(prev => [...prev, data].sort((a, b) => a.day_of_week - b.day_of_week));
    if (error) toast.error("Failed to add day");
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading...</p></div>;

  const existingDays = availability.map(a => a.day_of_week);
  const missingDays = DAYS.map((_, i) => i).filter(d => !existingDays.includes(d));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl flex items-center gap-2"><Clock size={18} /> Weekly Availability</h3>
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-foreground text-background font-body text-sm tracking-wider uppercase hover:bg-accent transition-colors disabled:opacity-50"
        >
          <Save size={14} /> {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      <div className="space-y-3">
        {availability.map(row => (
          <div key={row.id} className={`border p-4 flex flex-wrap gap-4 items-center transition-colors ${row.is_available ? "border-border" : "border-border/50 opacity-60"}`}>
            <label className="flex items-center gap-3 min-w-[140px]">
              <input
                type="checkbox"
                checked={row.is_available}
                onChange={e => updateRow(row.id, "is_available", e.target.checked)}
                className="accent-[hsl(var(--gold))]"
              />
              <span className="font-body text-sm font-medium">{DAYS[row.day_of_week]}</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="time"
                value={row.start_time.slice(0, 5)}
                onChange={e => updateRow(row.id, "start_time", e.target.value)}
                className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
              />
              <span className="font-body text-sm text-muted-foreground">to</span>
              <input
                type="time"
                value={row.end_time.slice(0, 5)}
                onChange={e => updateRow(row.id, "end_time", e.target.value)}
                className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-body text-xs text-muted-foreground">Slot:</span>
              <select
                value={row.slot_duration_mins}
                onChange={e => updateRow(row.id, "slot_duration_mins", Number(e.target.value))}
                className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {missingDays.length > 0 && (
        <div className="mt-6">
          <p className="font-body text-sm text-muted-foreground mb-3">Add missing days:</p>
          <div className="flex gap-2 flex-wrap">
            {missingDays.map(d => (
              <button
                key={d}
                onClick={() => addDay(d)}
                className="px-4 py-2 border border-border font-body text-xs tracking-wider uppercase hover:border-gold hover:text-gold transition-colors"
              >
                + {DAYS[d]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAvailabilityTab;
