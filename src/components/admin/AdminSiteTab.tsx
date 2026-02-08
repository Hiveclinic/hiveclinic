import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Pencil, Save, X, Megaphone, Settings, Layers } from "lucide-react";
import { toast } from "sonner";

type Addon = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_mins: number;
  applicable_categories: string[] | null;
  active: boolean;
  sort_order: number | null;
};

type SiteSettings = {
  announcement_text: string;
  announcement_active: boolean;
  announcement_link: string;
};

const AdminSiteTab = () => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ announcement_text: "", announcement_active: false, announcement_link: "" });
  const [loading, setLoading] = useState(true);
  const [showNewAddon, setShowNewAddon] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAddon, setNewAddon] = useState({ name: "", description: "", price: 0, duration_mins: 0, applicable_categories: "" });
  const [categories, setCategories] = useState<string[]>([]);

  const fetchAll = async () => {
    const [addonsRes, settingsRes, treatRes] = await Promise.all([
      supabase.from("treatment_addons").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").eq("id", "global").single(),
      supabase.from("treatments").select("category"),
    ]);
    if (addonsRes.data) setAddons(addonsRes.data as Addon[]);
    if (settingsRes.data) {
      setSettings({
        announcement_text: settingsRes.data.announcement_text || "",
        announcement_active: settingsRes.data.announcement_active || false,
        announcement_link: settingsRes.data.announcement_link || "",
      });
    }
    if (treatRes.data) setCategories([...new Set(treatRes.data.map((t: any) => t.category))].sort());
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const saveSettings = async () => {
    const { error } = await supabase.from("site_settings").update({
      announcement_text: settings.announcement_text,
      announcement_active: settings.announcement_active,
      announcement_link: settings.announcement_link,
      updated_at: new Date().toISOString(),
    }).eq("id", "global");
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Settings saved");
  };

  const createAddon = async () => {
    if (!newAddon.name.trim() || newAddon.price <= 0) { toast.error("Name and price required"); return; }
    const cats = newAddon.applicable_categories ? newAddon.applicable_categories.split(",").map(s => s.trim()).filter(Boolean) : [];
    const { error } = await supabase.from("treatment_addons").insert({
      name: newAddon.name,
      description: newAddon.description || null,
      price: newAddon.price,
      duration_mins: newAddon.duration_mins,
      applicable_categories: cats.length > 0 ? cats : null,
      sort_order: addons.length,
    });
    if (error) { toast.error("Failed to create"); return; }
    toast.success("Add-on created");
    setNewAddon({ name: "", description: "", price: 0, duration_mins: 0, applicable_categories: "" });
    setShowNewAddon(false);
    fetchAll();
  };

  const updateAddon = async (addon: Addon) => {
    const { error } = await supabase.from("treatment_addons").update({
      name: addon.name,
      description: addon.description,
      price: addon.price,
      duration_mins: addon.duration_mins,
      applicable_categories: addon.applicable_categories,
      active: addon.active,
    }).eq("id", addon.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Updated");
    setEditingId(null);
  };

  const deleteAddon = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const { error } = await supabase.from("treatment_addons").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Deleted");
    fetchAll();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("treatment_addons").update({ active: !current }).eq("id", id);
    setAddons(prev => prev.map(a => a.id === id ? { ...a, active: !current } : a));
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-10">
      {/* Announcement Banner */}
      <div>
        <h3 className="font-display text-xl mb-4 flex items-center gap-2"><Megaphone size={18} /> Announcement Banner</h3>
        <div className="border border-border p-4 space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.announcement_active} onChange={e => setSettings(p => ({ ...p, announcement_active: e.target.checked }))} className="accent-[hsl(var(--gold))]" />
            <span className="font-body text-sm">Show banner on website</span>
          </label>
          <input
            value={settings.announcement_text}
            onChange={e => setSettings(p => ({ ...p, announcement_text: e.target.value }))}
            className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            placeholder="e.g. 20% off all lip fillers this month - Book now!"
          />
          <input
            value={settings.announcement_link}
            onChange={e => setSettings(p => ({ ...p, announcement_link: e.target.value }))}
            className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none"
            placeholder="Link (optional) e.g. /bookings"
          />
          <button onClick={saveSettings} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
            <Save size={12} className="inline mr-1" /> Save Banner
          </button>
        </div>
      </div>

      {/* Add-ons Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl flex items-center gap-2"><Layers size={18} /> Treatment Add-ons ({addons.length})</h3>
          <button onClick={() => setShowNewAddon(!showNewAddon)} className="flex items-center gap-1 px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>

        {showNewAddon && (
          <div className="border border-gold/30 bg-gold/5 p-4 mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-body text-sm font-medium">New Add-on</h4>
              <button onClick={() => setShowNewAddon(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input value={newAddon.name} onChange={e => setNewAddon(p => ({ ...p, name: e.target.value }))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Name e.g. LED Therapy" />
              <input type="number" value={newAddon.price || ""} onChange={e => setNewAddon(p => ({ ...p, price: Number(e.target.value) }))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Price (£)" />
              <input type="number" value={newAddon.duration_mins || ""} onChange={e => setNewAddon(p => ({ ...p, duration_mins: Number(e.target.value) }))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Extra mins" />
            </div>
            <input value={newAddon.description} onChange={e => setNewAddon(p => ({ ...p, description: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Description (optional)" />
            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Applicable categories (comma separated, leave empty for all)</label>
              <input value={newAddon.applicable_categories} onChange={e => setNewAddon(p => ({ ...p, applicable_categories: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder={`e.g. ${categories.slice(0, 3).join(", ")}`} />
            </div>
            <button onClick={createAddon} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">Create</button>
          </div>
        )}

        {addons.length === 0 ? (
          <div className="p-8 bg-secondary text-center"><p className="font-body text-muted-foreground">No add-ons yet. Create your first one above.</p></div>
        ) : (
          <div className="space-y-2">
            {addons.map(addon => (
              <div key={addon.id} className={`border p-4 transition-colors ${addon.active ? "border-border" : "border-border/50 opacity-60"}`}>
                {editingId === addon.id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input value={addon.name} onChange={e => setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, name: e.target.value } : a))} className="border border-border bg-transparent px-2 py-1 font-body text-sm focus:border-gold focus:outline-none" />
                      <input type="number" value={addon.price} onChange={e => setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, price: Number(e.target.value) } : a))} className="border border-border bg-transparent px-2 py-1 font-body text-sm focus:border-gold focus:outline-none" />
                      <input type="number" value={addon.duration_mins} onChange={e => setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, duration_mins: Number(e.target.value) } : a))} className="border border-border bg-transparent px-2 py-1 font-body text-sm focus:border-gold focus:outline-none" />
                    </div>
                    <input value={addon.description || ""} onChange={e => setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, description: e.target.value } : a))} className="w-full border border-border bg-transparent px-2 py-1 font-body text-sm focus:border-gold focus:outline-none" placeholder="Description" />
                    <div className="flex gap-2">
                      <button onClick={() => updateAddon(addon)} className="px-3 py-1 bg-foreground text-background font-body text-xs hover:bg-accent transition-colors"><Save size={10} className="inline mr-1" /> Save</button>
                      <button onClick={() => { setEditingId(null); fetchAll(); }} className="px-3 py-1 border border-border font-body text-xs hover:border-foreground transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-body text-sm font-medium flex-1">{addon.name}</span>
                    {addon.description && <span className="font-body text-xs text-muted-foreground">{addon.description}</span>}
                    <span className="font-body text-xs">£{Number(addon.price).toFixed(0)}</span>
                    {addon.duration_mins > 0 && <span className="font-body text-xs text-muted-foreground">+{addon.duration_mins}m</span>}
                    {addon.applicable_categories && addon.applicable_categories.length > 0 && (
                      <span className="font-body text-[10px] text-muted-foreground">{(addon.applicable_categories as string[]).join(", ")}</span>
                    )}
                    <button onClick={() => toggleActive(addon.id, addon.active)} className={`px-2 py-1 border font-body text-xs transition-colors ${addon.active ? "border-green-600/30 text-green-600" : "border-border text-muted-foreground"}`}>
                      {addon.active ? "Active" : "Off"}
                    </button>
                    <button onClick={() => setEditingId(addon.id)} className="px-2 py-1 border border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors"><Pencil size={12} /></button>
                    <button onClick={() => deleteAddon(addon.id, addon.name)} className="px-2 py-1 border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors"><Trash2 size={12} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSiteTab;
