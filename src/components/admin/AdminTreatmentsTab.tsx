import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, Save, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Treatment = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  duration_mins: number;
  deposit_required: boolean;
  deposit_amount: number | null;
  payment_type: string;
  active: boolean;
  sort_order: number | null;
  description: string | null;
};

const AdminTreatmentsTab = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const fetchTreatments = async () => {
    const { data } = await supabase.from("treatments").select("*").order("sort_order", { ascending: true });
    if (data) setTreatments(data as Treatment[]);
    setLoading(false);
  };

  useEffect(() => { fetchTreatments(); }, []);

  const updateField = (id: string, field: string, value: any) => {
    setTreatments(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const saveOne = async (t: Treatment) => {
    const { error } = await supabase.from("treatments").update({
      name: t.name,
      price: t.price,
      duration_mins: t.duration_mins,
      deposit_required: t.deposit_required,
      deposit_amount: t.deposit_amount,
      active: t.active,
      category: t.category,
      description: t.description,
    }).eq("id", t.id);
    if (error) { toast.error("Failed to save"); return; }
    toast.success(`${t.name} updated`);
    setEditingId(null);
  };

  const saveOrder = async () => {
    for (let i = 0; i < treatments.length; i++) {
      await supabase.from("treatments").update({ sort_order: i }).eq("id", treatments[i].id);
    }
    toast.success("Order saved");
  };

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    const items = [...treatments];
    const dragIdx = items.findIndex(t => t.id === dragId);
    const targetIdx = items.findIndex(t => t.id === targetId);
    const [item] = items.splice(dragIdx, 1);
    items.splice(targetIdx, 0, item);
    setTreatments(items);
  };
  const handleDragEnd = () => { setDragId(null); saveOrder(); };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("treatments").update({ active: !current }).eq("id", id);
    if (!error) setTreatments(prev => prev.map(t => t.id === id ? { ...t, active: !current } : t));
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl">Treatments ({treatments.length})</h3>
        <p className="font-body text-xs text-muted-foreground">Drag to reorder</p>
      </div>

      <div className="space-y-2">
        {treatments.map((t, i) => (
          <div
            key={t.id}
            draggable
            onDragStart={() => handleDragStart(t.id)}
            onDragOver={(e) => handleDragOver(e, t.id)}
            onDragEnd={handleDragEnd}
            className={`border p-4 transition-colors cursor-grab active:cursor-grabbing ${t.active ? "border-border" : "border-border/50 opacity-60"} ${dragId === t.id ? "border-gold bg-gold/5" : ""}`}
          >
            {editingId === t.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input value={t.name} onChange={e => updateField(t.id, "name", e.target.value)} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Name" />
                  <input value={t.category} onChange={e => updateField(t.id, "category", e.target.value)} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Category" />
                  <input type="number" value={t.price} onChange={e => updateField(t.id, "price", Number(e.target.value))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Price" />
                  <input type="number" value={t.duration_mins} onChange={e => updateField(t.id, "duration_mins", Number(e.target.value))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Duration" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={t.deposit_required} onChange={e => updateField(t.id, "deposit_required", e.target.checked)} className="accent-[hsl(var(--gold))]" />
                    <span className="font-body text-xs">Deposit required</span>
                  </label>
                  {t.deposit_required && (
                    <input type="number" value={t.deposit_amount || ""} onChange={e => updateField(t.id, "deposit_amount", Number(e.target.value))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Deposit amount" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveOne(t)} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors"><Save size={12} className="inline mr-1" /> Save</button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <GripVertical size={16} className="text-muted-foreground flex-shrink-0" />
                <span className="font-body text-xs text-muted-foreground w-6">{i + 1}</span>
                <span className="font-body text-sm font-medium flex-1">{t.name}</span>
                <span className="font-body text-xs text-muted-foreground">{t.category}</span>
                <span className="font-body text-xs">£{Number(t.price).toFixed(0)}</span>
                <span className="font-body text-xs text-muted-foreground">{t.duration_mins}m</span>
                {t.deposit_required && <span className="font-body text-xs text-gold">Dep: £{Number(t.deposit_amount).toFixed(0)}</span>}
                <button onClick={() => toggleActive(t.id, t.active)} className={`px-2 py-1 border font-body text-xs transition-colors ${t.active ? "border-green-600/30 text-green-600" : "border-border text-muted-foreground"}`}>
                  {t.active ? "Active" : "Off"}
                </button>
                <button onClick={() => setEditingId(t.id)} className="px-2 py-1 border border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors">
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTreatmentsTab;
