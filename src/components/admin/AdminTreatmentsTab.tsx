import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, Save, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Tag, Package, Layers, X, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Variant = {
  id: string;
  treatment_id: string;
  name: string;
  price: number;
  duration_mins: number;
  deposit_amount: number;
  sort_order: number;
  active: boolean;
};

type TreatmentPackage = {
  id: string;
  treatment_id: string;
  name: string;
  sessions_count: number;
  total_price: number;
  price_per_session: number;
  valid_days: number;
  active: boolean;
};

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
  on_offer: boolean;
  offer_price: number | null;
  offer_label: string | null;
  image_url: string | null;
};

const EMPTY_TREATMENT = {
  name: "", slug: "", category: "", price: 0, duration_mins: 60,
  deposit_required: false, deposit_amount: 0, payment_type: "full",
  active: true, description: "", on_offer: false, offer_price: null as number | null,
  offer_label: null as string | null,
};

const AdminTreatmentsTab = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [packages, setPackages] = useState<TreatmentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showNewTreatment, setShowNewTreatment] = useState(false);
  const [newTreatment, setNewTreatment] = useState({ ...EMPTY_TREATMENT });

  // Variant/package forms
  const [newVariant, setNewVariant] = useState({ name: "", price: 0, duration_mins: 60, deposit_amount: 0 });
  const [showNewVariant, setShowNewVariant] = useState<string | null>(null);
  const [showNewPackage, setShowNewPackage] = useState<string | null>(null);
  const [newPackage, setNewPackage] = useState({ name: "", sessions_count: 3, total_price: 0, price_per_session: 0, valid_days: 365 });
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  const fetchAll = async () => {
    const [tRes, vRes, pRes] = await Promise.all([
      supabase.from("treatments").select("*").order("sort_order", { ascending: true }),
      supabase.from("treatment_variants").select("*").order("sort_order", { ascending: true }),
      supabase.from("treatment_packages").select("*").order("sort_order", { ascending: true }),
    ]);
    if (tRes.data) setTreatments(tRes.data as Treatment[]);
    if (vRes.data) setVariants(vRes.data as Variant[]);
    if (pRes.data) setPackages(pRes.data as TreatmentPackage[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const categories = [...new Set(treatments.map(t => t.category))].sort();
  const filteredTreatments = categoryFilter ? treatments.filter(t => t.category === categoryFilter) : treatments;

  const updateField = (id: string, field: string, value: any) => {
    setTreatments(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const saveOne = async (t: Treatment) => {
    const { error } = await supabase.from("treatments").update({
      name: t.name, price: t.price, duration_mins: t.duration_mins,
      deposit_required: t.deposit_required, deposit_amount: t.deposit_amount,
      active: t.active, category: t.category, description: t.description,
      on_offer: t.on_offer, offer_price: t.offer_price, offer_label: t.offer_label,
      slug: t.slug, image_url: t.image_url,
    }).eq("id", t.id);
    if (error) { toast.error("Failed to save"); return; }
    toast.success(`${t.name} updated`);
    setEditingId(null);
  };

  const createTreatment = async () => {
    if (!newTreatment.name.trim()) { toast.error("Name is required"); return; }
    const slug = newTreatment.slug || generateSlug(newTreatment.name);
    const { error } = await supabase.from("treatments").insert({
      ...newTreatment,
      slug,
      sort_order: treatments.length,
    });
    if (error) { toast.error("Failed to create treatment"); return; }
    toast.success(`${newTreatment.name} created`);
    setNewTreatment({ ...EMPTY_TREATMENT });
    setShowNewTreatment(false);
    fetchAll();
  };

  const deleteTreatment = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will also remove all its variants and packages. This cannot be undone.`)) return;
    // Delete related data first
    await Promise.all([
      supabase.from("treatment_variants").delete().eq("treatment_id", id),
      supabase.from("treatment_packages").delete().eq("treatment_id", id),
    ]);
    const { error } = await supabase.from("treatments").delete().eq("id", id);
    if (error) { toast.error("Failed to delete - it may have existing bookings"); return; }
    toast.success(`${name} deleted`);
    fetchAll();
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

  const toggleOffer = async (id: string, current: boolean) => {
    const { error } = await supabase.from("treatments").update({ on_offer: !current }).eq("id", id);
    if (!error) setTreatments(prev => prev.map(t => t.id === id ? { ...t, on_offer: !current } : t));
    toast.success(!current ? "On offer" : "Offer removed");
  };

  // Variant management
  const addVariant = async (treatmentId: string) => {
    if (!newVariant.name || newVariant.price <= 0) { toast.error("Fill in variant details"); return; }
    const { error } = await supabase.from("treatment_variants").insert({
      treatment_id: treatmentId, ...newVariant, sort_order: variants.filter(v => v.treatment_id === treatmentId).length,
    });
    if (error) { toast.error("Failed to add variant"); return; }
    toast.success("Variant added");
    setNewVariant({ name: "", price: 0, duration_mins: 60, deposit_amount: 0 });
    setShowNewVariant(null);
    fetchAll();
  };

  const updateVariant = async (v: Variant) => {
    const { error } = await supabase.from("treatment_variants").update({
      name: v.name, price: v.price, duration_mins: v.duration_mins, deposit_amount: v.deposit_amount, active: v.active,
    }).eq("id", v.id);
    if (error) { toast.error("Failed to update variant"); return; }
    toast.success("Variant updated");
    setEditingVariantId(null);
  };

  const deleteVariant = async (id: string) => {
    if (!confirm("Delete this variant?")) return;
    await supabase.from("treatment_variants").delete().eq("id", id);
    setVariants(prev => prev.filter(v => v.id !== id));
    toast.success("Variant removed");
  };

  // Package management
  const addPackage = async (treatmentId: string) => {
    if (!newPackage.name || newPackage.total_price <= 0) { toast.error("Fill in package details"); return; }
    const { error } = await supabase.from("treatment_packages").insert({
      treatment_id: treatmentId, ...newPackage,
    });
    if (error) { toast.error("Failed to add package"); return; }
    toast.success("Package added");
    setNewPackage({ name: "", sessions_count: 3, total_price: 0, price_per_session: 0, valid_days: 365 });
    setShowNewPackage(null);
    fetchAll();
  };

  const deletePackage = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    await supabase.from("treatment_packages").delete().eq("id", id);
    setPackages(prev => prev.filter(p => p.id !== id));
    toast.success("Package removed");
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl">Treatments ({treatments.length})</h3>
        <div className="flex gap-2">
          <button onClick={() => setShowNewTreatment(!showNewTreatment)} className="flex items-center gap-1 px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
            <Plus size={12} /> Add Treatment
          </button>
          <p className="font-body text-xs text-muted-foreground self-center hidden md:block">Drag to reorder</p>
        </div>
      </div>

      {/* New Treatment Form */}
      {showNewTreatment && (
        <div className="border border-gold/30 bg-gold/5 p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-body text-sm font-medium">New Treatment</h4>
            <button onClick={() => setShowNewTreatment(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input value={newTreatment.name} onChange={e => setNewTreatment(p => ({ ...p, name: e.target.value, slug: generateSlug(e.target.value) }))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Treatment name" />
            <input value={newTreatment.category} onChange={e => setNewTreatment(p => ({ ...p, category: e.target.value }))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Category" list="category-list" />
            <datalist id="category-list">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
            <input type="number" value={newTreatment.price || ""} onChange={e => setNewTreatment(p => ({ ...p, price: Number(e.target.value) }))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Price (£)" />
            <input type="number" value={newTreatment.duration_mins} onChange={e => setNewTreatment(p => ({ ...p, duration_mins: Number(e.target.value) }))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Duration (mins)" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newTreatment.deposit_required} onChange={e => setNewTreatment(p => ({ ...p, deposit_required: e.target.checked }))} className="accent-[hsl(var(--gold))]" />
              <span className="font-body text-xs">Deposit required</span>
            </label>
            {newTreatment.deposit_required && (
              <input type="number" value={newTreatment.deposit_amount || ""} onChange={e => setNewTreatment(p => ({ ...p, deposit_amount: Number(e.target.value) }))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Deposit (£)" />
            )}
          </div>
          <textarea value={newTreatment.description || ""} onChange={e => setNewTreatment(p => ({ ...p, description: e.target.value }))} rows={2}
            className="w-full border border-border bg-transparent px-3 py-2 font-body text-xs focus:border-gold focus:outline-none resize-none" placeholder="Description (optional)" />
          <div className="flex gap-2">
            <button onClick={createTreatment} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">Create</button>
            <button onClick={() => setShowNewTreatment(false)} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setCategoryFilter(null)} className={`px-3 py-1 font-body text-xs tracking-wider uppercase border transition-colors ${!categoryFilter ? "bg-foreground text-background border-foreground" : "border-border hover:border-gold"}`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} className={`px-3 py-1 font-body text-xs tracking-wider uppercase border transition-colors ${categoryFilter === c ? "bg-foreground text-background border-foreground" : "border-border hover:border-gold"}`}>{c}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredTreatments.map((t, i) => {
          const tVariants = variants.filter(v => v.treatment_id === t.id);
          const tPackages = packages.filter(p => p.treatment_id === t.id);
          const isExpanded = expandedId === t.id;

          return (
            <div key={t.id}>
              <div
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
                      <input value={t.category} onChange={e => updateField(t.id, "category", e.target.value)} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Category" list="category-list" />
                      <input type="number" value={t.price} onChange={e => updateField(t.id, "price", Number(e.target.value))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Price" />
                      <input type="number" value={t.duration_mins} onChange={e => updateField(t.id, "duration_mins", Number(e.target.value))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Duration" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input value={t.slug} onChange={e => updateField(t.id, "slug", e.target.value)} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Slug" />
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={t.deposit_required} onChange={e => updateField(t.id, "deposit_required", e.target.checked)} className="accent-[hsl(var(--gold))]" />
                        <span className="font-body text-xs">Deposit required</span>
                      </label>
                      {t.deposit_required && (
                        <input type="number" value={t.deposit_amount || ""} onChange={e => updateField(t.id, "deposit_amount", Number(e.target.value))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Deposit £" />
                      )}
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={t.on_offer} onChange={e => updateField(t.id, "on_offer", e.target.checked)} className="accent-[hsl(var(--gold))]" />
                        <span className="font-body text-xs">On Offer</span>
                      </label>
                    </div>
                    {t.on_offer && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input type="number" value={t.offer_price || ""} onChange={e => updateField(t.id, "offer_price", Number(e.target.value))} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Offer Price £" />
                        <input value={t.offer_label || ""} onChange={e => updateField(t.id, "offer_label", e.target.value)} className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Offer label e.g. 'Spring Special'" />
                      </div>
                    )}
                    <div>
                      <label className="font-body text-xs text-muted-foreground block mb-1">Image URL</label>
                      <input value={t.image_url || ""} onChange={e => updateField(t.id, "image_url", e.target.value || null)} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="https://... or leave empty" />
                      {t.image_url && <img src={t.image_url} alt={t.name} className="mt-2 w-20 h-20 object-cover border border-border" />}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveOne(t)} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors"><Save size={12} className="inline mr-1" /> Save</button>
                      <button onClick={() => { setEditingId(null); fetchAll(); }} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-muted-foreground flex-shrink-0" />
                    <button onClick={() => setExpandedId(isExpanded ? null : t.id)} className="text-muted-foreground hover:text-gold transition-colors">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <span className="font-body text-xs text-muted-foreground w-6">{i + 1}</span>
                    <span className="font-body text-sm font-medium flex-1">{t.name}</span>
                    <span className="font-body text-xs text-muted-foreground">{t.category}</span>
                    {t.on_offer ? (
                      <span className="font-body text-xs">
                        <span className="line-through text-muted-foreground mr-1">£{Number(t.price).toFixed(0)}</span>
                        <span className="text-gold">£{Number(t.offer_price).toFixed(0)}</span>
                      </span>
                    ) : (
                      <span className="font-body text-xs">£{Number(t.price).toFixed(0)}</span>
                    )}
                    <span className="font-body text-xs text-muted-foreground">{t.duration_mins}m</span>
                    {t.deposit_required && <span className="font-body text-xs text-gold">Dep: £{Number(t.deposit_amount).toFixed(0)}</span>}
                    {tVariants.length > 0 && <span className="font-body text-xs text-muted-foreground"><Layers size={12} className="inline" /> {tVariants.length}</span>}
                    {tPackages.length > 0 && <span className="font-body text-xs text-muted-foreground"><Package size={12} className="inline" /> {tPackages.length}</span>}
                    {t.on_offer && <span className="px-2 py-0.5 bg-gold/20 text-gold font-body text-[10px] uppercase tracking-wider">{t.offer_label || "Offer"}</span>}
                    <button onClick={() => toggleOffer(t.id, t.on_offer)} className={`px-2 py-1 border font-body text-xs transition-colors ${t.on_offer ? "border-gold/30 text-gold" : "border-border text-muted-foreground hover:text-gold"}`}>
                      <Tag size={12} />
                    </button>
                    <button onClick={() => toggleActive(t.id, t.active)} className={`px-2 py-1 border font-body text-xs transition-colors ${t.active ? "border-green-600/30 text-green-600" : "border-border text-muted-foreground"}`}>
                      {t.active ? "Active" : "Off"}
                    </button>
                    <button onClick={() => setEditingId(t.id)} className="px-2 py-1 border border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteTreatment(t.id, t.name)} className="px-2 py-1 border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Expanded: Variants & Packages */}
              {isExpanded && (
                <div className="ml-8 border-l-2 border-gold/20 pl-4 py-2 space-y-3">
                  {/* Variants */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Layers size={12} /> Variants ({tVariants.length})</h4>
                      <button onClick={() => setShowNewVariant(showNewVariant === t.id ? null : t.id)} className="font-body text-xs text-gold hover:underline flex items-center gap-1"><Plus size={12} /> Add Variant</button>
                    </div>
                    {tVariants.map(v => (
                      <div key={v.id} className="flex items-center gap-3 py-1 font-body text-xs">
                        {editingVariantId === v.id ? (
                          <div className="flex gap-2 items-center flex-wrap flex-1">
                            <input value={v.name} onChange={e => setVariants(prev => prev.map(x => x.id === v.id ? { ...x, name: e.target.value } : x))} className="border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" />
                            <input type="number" value={v.price} onChange={e => setVariants(prev => prev.map(x => x.id === v.id ? { ...x, price: Number(e.target.value) } : x))} className="w-20 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" />
                            <input type="number" value={v.duration_mins} onChange={e => setVariants(prev => prev.map(x => x.id === v.id ? { ...x, duration_mins: Number(e.target.value) } : x))} className="w-16 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" />
                            <input type="number" value={v.deposit_amount || ""} onChange={e => setVariants(prev => prev.map(x => x.id === v.id ? { ...x, deposit_amount: Number(e.target.value) } : x))} className="w-20 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" placeholder="Dep" />
                            <button onClick={() => updateVariant(v)} className="px-2 py-0.5 bg-foreground text-background font-body text-xs"><Save size={10} /></button>
                            <button onClick={() => { setEditingVariantId(null); fetchAll(); }} className="text-muted-foreground hover:text-foreground"><X size={12} /></button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1">{v.name}</span>
                            <span>£{Number(v.price).toFixed(0)}</span>
                            <span className="text-muted-foreground">{v.duration_mins}m</span>
                            {v.deposit_amount > 0 && <span className="text-gold">Dep: £{Number(v.deposit_amount).toFixed(0)}</span>}
                            <button onClick={() => setEditingVariantId(v.id)} className="text-muted-foreground hover:text-gold transition-colors"><Pencil size={10} /></button>
                            <button onClick={() => deleteVariant(v.id)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                          </>
                        )}
                      </div>
                    ))}
                    {showNewVariant === t.id && (
                      <div className="flex gap-2 mt-2 items-end">
                        <input value={newVariant.name} onChange={e => setNewVariant(p => ({...p, name: e.target.value}))} className="border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" placeholder="e.g. 0.5ml" />
                        <input type="number" value={newVariant.price || ""} onChange={e => setNewVariant(p => ({...p, price: Number(e.target.value)}))} className="w-20 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" placeholder="Price" />
                        <input type="number" value={newVariant.duration_mins} onChange={e => setNewVariant(p => ({...p, duration_mins: Number(e.target.value)}))} className="w-16 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" placeholder="Mins" />
                        <input type="number" value={newVariant.deposit_amount || ""} onChange={e => setNewVariant(p => ({...p, deposit_amount: Number(e.target.value)}))} className="w-20 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" placeholder="Deposit" />
                        <button onClick={() => addVariant(t.id)} className="px-3 py-1 bg-foreground text-background font-body text-xs hover:bg-accent transition-colors">Add</button>
                      </div>
                    )}
                  </div>

                  {/* Packages */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Package size={12} /> Course Packages ({tPackages.length})</h4>
                      <button onClick={() => setShowNewPackage(showNewPackage === t.id ? null : t.id)} className="font-body text-xs text-gold hover:underline flex items-center gap-1"><Plus size={12} /> Add Package</button>
                    </div>
                    {tPackages.map(p => (
                      <div key={p.id} className="flex items-center gap-3 py-1 font-body text-xs">
                        <span className="flex-1">{p.name}</span>
                        <span>{p.sessions_count} sessions</span>
                        <span>£{Number(p.total_price).toFixed(0)}</span>
                        <span className="text-muted-foreground">(£{Number(p.price_per_session).toFixed(0)}/session)</span>
                        <button onClick={() => deletePackage(p.id)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                      </div>
                    ))}
                    {showNewPackage === t.id && (
                      <div className="flex gap-2 mt-2 items-end flex-wrap">
                        <input value={newPackage.name} onChange={e => setNewPackage(p => ({...p, name: e.target.value}))} className="border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" placeholder="e.g. Course of 3" />
                        <input type="number" value={newPackage.sessions_count} onChange={e => setNewPackage(p => ({...p, sessions_count: Number(e.target.value)}))} className="w-16 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" placeholder="Sessions" />
                        <input type="number" value={newPackage.total_price || ""} onChange={e => setNewPackage(p => ({...p, total_price: Number(e.target.value), price_per_session: Number(e.target.value) / (p.sessions_count || 3)}))} className="w-24 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" placeholder="Total £" />
                        <button onClick={() => addPackage(t.id)} className="px-3 py-1 bg-foreground text-background font-body text-xs hover:bg-accent transition-colors">Add</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminTreatmentsTab;
