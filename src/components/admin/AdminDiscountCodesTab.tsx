import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tag, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type Treatment = { id: string; name: string; category: string };

type DiscountCode = {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_spend: number | null;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  applicable_treatments: string[] | null;
  excluded_treatments: string[] | null;
  created_at: string;
};

const AdminDiscountCodesTab = () => {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [mode, setMode] = useState<"all" | "include" | "exclude">("all");
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState<string[]>([]);

  const fetchData = async () => {
    const [codesRes, treatmentsRes] = await Promise.all([
      supabase.from("discount_codes").select("*").order("created_at", { ascending: false }),
      supabase.from("treatments").select("id, name, category").eq("active", true).order("category").order("name"),
    ]);
    if (codesRes.data) setCodes(codesRes.data as DiscountCode[]);
    if (treatmentsRes.data) setTreatments(treatmentsRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleTreatment = (id: string) => {
    setSelectedTreatmentIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const selectCategory = (category: string) => {
    const catIds = treatments.filter(t => t.category === category).map(t => t.id);
    const allSelected = catIds.every(id => selectedTreatmentIds.includes(id));
    if (allSelected) {
      setSelectedTreatmentIds(prev => prev.filter(id => !catIds.includes(id)));
    } else {
      setSelectedTreatmentIds(prev => [...new Set([...prev, ...catIds])]);
    }
  };

  const createCode = async () => {
    if (!code.trim() || !discountValue) { toast.error("Code and value are required"); return; }

    const insertData: Record<string, unknown> = {
      code: code.toUpperCase().trim(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_spend: minSpend ? Number(minSpend) : null,
      max_uses: maxUses ? Number(maxUses) : null,
      valid_until: validUntil || null,
      applicable_treatments: mode === "include" ? selectedTreatmentIds : [],
      excluded_treatments: mode === "exclude" ? selectedTreatmentIds : [],
    };

    const { error } = await supabase.from("discount_codes").insert(insertData as any);
    if (error) { toast.error("Failed to create discount code"); return; }
    toast.success("Discount code created");
    setShowForm(false);
    setCode(""); setDiscountValue(""); setMinSpend(""); setMaxUses(""); setValidUntil("");
    setMode("all"); setSelectedTreatmentIds([]);
    fetchData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("discount_codes").update({ active: !current }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setCodes(prev => prev.map(c => c.id === id ? { ...c, active: !current } : c));
    toast.success(!current ? "Code activated" : "Code deactivated");
  };

  const deleteCode = async (id: string) => {
    if (!confirm("Delete this discount code?")) return;
    const { error } = await supabase.from("discount_codes").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setCodes(prev => prev.filter(c => c.id !== id));
    toast.success("Code deleted");
  };

  const getTreatmentName = (id: string) => treatments.find(t => t.id === id)?.name || id.slice(0, 8);

  const categories = [...new Set(treatments.map(t => t.category))];

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl flex items-center gap-2"><Tag size={18} /> Discount Codes</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-2 bg-foreground text-background font-body text-sm tracking-wider uppercase hover:bg-accent transition-colors"
        >
          <Plus size={14} /> New Code
        </button>
      </div>

      {showForm && (
        <div className="border border-gold/30 bg-gold/5 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-xs block mb-1 text-muted-foreground">Code *</label>
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="E.g. HIVE20" className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm uppercase focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="font-body text-xs block mb-1 text-muted-foreground">Type</label>
              <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (£)</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs block mb-1 text-muted-foreground">Value *</label>
              <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === "percentage" ? "20" : "10.00"} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-xs block mb-1 text-muted-foreground">Min Spend (£)</label>
              <input type="number" value={minSpend} onChange={e => setMinSpend(e.target.value)} placeholder="0" className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="font-body text-xs block mb-1 text-muted-foreground">Max Uses</label>
              <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="Unlimited" className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="font-body text-xs block mb-1 text-muted-foreground">Expires</label>
              <input type="datetime-local" value={validUntil} onChange={e => setValidUntil(e.target.value)} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
            </div>
          </div>

          {/* Treatment scope */}
          <div>
            <label className="font-body text-xs block mb-2 text-muted-foreground">Applies To</label>
            <div className="flex gap-2 mb-3">
              {(["all", "include", "exclude"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setSelectedTreatmentIds([]); }}
                  className={`px-4 py-1.5 border font-body text-xs tracking-wider uppercase transition-colors ${mode === m ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground"}`}>
                  {m === "all" ? "All Treatments" : m === "include" ? "Only These" : "Exclude These"}
                </button>
              ))}
            </div>

            {mode !== "all" && (
              <div className="border border-border p-4 max-h-60 overflow-y-auto space-y-3">
                {categories.map(cat => (
                  <div key={cat}>
                    <button onClick={() => selectCategory(cat)} className="font-body text-xs text-gold uppercase tracking-wider mb-1 hover:underline">
                      {cat}
                    </button>
                    <div className="flex flex-wrap gap-1.5 ml-2">
                      {treatments.filter(t => t.category === cat).map(t => (
                        <button key={t.id} onClick={() => toggleTreatment(t.id)}
                          className={`px-2 py-0.5 border font-body text-[11px] transition-colors ${selectedTreatmentIds.includes(t.id) ? "border-gold bg-gold/10 text-foreground" : "border-border/50 text-muted-foreground"}`}>
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {selectedTreatmentIds.length > 0 && (
                  <p className="font-body text-xs text-muted-foreground mt-2">
                    {selectedTreatmentIds.length} treatment{selectedTreatmentIds.length !== 1 ? "s" : ""} {mode === "include" ? "included" : "excluded"}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={createCode} className="px-6 py-2 bg-foreground text-background font-body text-sm tracking-wider uppercase hover:bg-accent transition-colors">Create</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 border border-border font-body text-sm tracking-wider uppercase hover:border-foreground transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {codes.length === 0 ? (
        <div className="p-12 bg-secondary text-center"><p className="font-body text-muted-foreground">No discount codes yet.</p></div>
      ) : (
        <div className="space-y-3">
          {codes.map(c => (
            <div key={c.id} className={`border p-4 flex flex-wrap gap-4 items-center transition-colors ${c.active ? "border-border" : "border-border/50 opacity-60"}`}>
              <span className="font-body text-sm font-medium tracking-wider uppercase bg-secondary px-3 py-1">{c.code}</span>
              <span className="font-body text-xs text-gold">
                {c.discount_type === "percentage" ? `${c.discount_value}% off` : `£${Number(c.discount_value).toFixed(2)} off`}
              </span>
              {c.min_spend && Number(c.min_spend) > 0 && <span className="font-body text-xs text-muted-foreground">Min: £{Number(c.min_spend)}</span>}
              <span className="font-body text-xs text-muted-foreground">
                Used: {c.used_count}{c.max_uses ? `/${c.max_uses}` : ""}
              </span>
              {c.valid_until && <span className="font-body text-xs text-muted-foreground">Expires: {new Date(c.valid_until).toLocaleDateString("en-GB")}</span>}
              
              {/* Show scope info */}
              {c.applicable_treatments && c.applicable_treatments.length > 0 && (
                <span className="font-body text-xs text-green-600">Only: {c.applicable_treatments.length} treatments</span>
              )}
              {c.excluded_treatments && c.excluded_treatments.length > 0 && (
                <span className="font-body text-xs text-red-400">Excludes: {c.excluded_treatments.map(id => getTreatmentName(id)).join(", ")}</span>
              )}

              <div className="ml-auto flex gap-2">
                <button onClick={() => toggleActive(c.id, c.active)} className={`px-3 py-1 border font-body text-xs tracking-wider uppercase transition-colors ${c.active ? "border-green-600/30 text-green-600" : "border-border text-muted-foreground"}`}>
                  {c.active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => deleteCode(c.id)} className="px-2 py-1 border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDiscountCodesTab;
