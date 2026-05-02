import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, Search, AlertTriangle, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  supplier: string | null;
  stock_level: number;
  low_stock_threshold: number;
  cost_price: number;
  retail_price: number | null;
  expiry_date: string | null;
  batch_number: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
};

const CATEGORIES = ["General", "Injectables", "Skincare", "Consumables", "Equipment", "Other"];

const AdminInventoryTab = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "General", supplier: "", stock_level: "0", low_stock_threshold: "5", cost_price: "0", retail_price: "", expiry_date: "", batch_number: "", notes: "" });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("inventory_items").select("*").eq("active", true).order("name");
      if (data) setItems(data as InventoryItem[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const resetForm = () => setForm({ name: "", category: "General", supplier: "", stock_level: "0", low_stock_threshold: "5", cost_price: "0", retail_price: "", expiry_date: "", batch_number: "", notes: "" });

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    const payload = {
      name: form.name,
      category: form.category,
      supplier: form.supplier || null,
      stock_level: Number(form.stock_level),
      low_stock_threshold: Number(form.low_stock_threshold),
      cost_price: Number(form.cost_price),
      retail_price: form.retail_price ? Number(form.retail_price) : null,
      expiry_date: form.expiry_date || null,
      batch_number: form.batch_number || null,
      notes: form.notes || null,
    };

    if (editingId) {
      const { error } = await supabase.from("inventory_items").update(payload).eq("id", editingId);
      if (error) { toast.error("Failed"); return; }
      setItems(prev => prev.map(i => i.id === editingId ? { ...i, ...payload } as InventoryItem : i));
      toast.success("Updated");
    } else {
      const { data, error } = await supabase.from("inventory_items").insert(payload).select().single();
      if (error) { toast.error("Failed"); return; }
      if (data) setItems(prev => [...prev, data as InventoryItem]);
      toast.success("Added");
    }
    setShowAdd(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name, category: item.category, supplier: item.supplier || "",
      stock_level: String(item.stock_level), low_stock_threshold: String(item.low_stock_threshold),
      cost_price: String(item.cost_price), retail_price: item.retail_price ? String(item.retail_price) : "",
      expiry_date: item.expiry_date || "", batch_number: item.batch_number || "", notes: item.notes || "",
    });
    setShowAdd(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("inventory_items").update({ active: false }).eq("id", id);
    if (error) { toast.error("Failed"); return; }
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success("Deleted");
  };

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));
  const lowStock = items.filter(i => i.stock_level <= i.low_stock_threshold);
  const totalValue = items.reduce((s, i) => s + (i.cost_price * i.stock_level), 0);

  if (loading) return <div className="py-12 text-center"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-2xl">Inventory</h2>
        <button onClick={() => { resetForm(); setEditingId(null); setShowAdd(!showAdd); }} className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Total Items</p>
          <p className="font-display text-2xl">{items.length}</p>
        </div>
        <div className={`bg-card border rounded-xl p-4 ${lowStock.length > 0 ? "border-orange-500/30" : "border-border"}`}>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Low Stock</p>
          <p className={`font-display text-2xl ${lowStock.length > 0 ? "text-orange-500" : ""}`}>{lowStock.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Total Value</p>
          <p className="font-display text-2xl">£{totalValue.toLocaleString("en-GB", { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-orange-500" />
            <span className="font-body text-sm font-medium text-orange-600">Low Stock Alert</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(i => (
              <span key={i.id} className="font-body text-xs px-2 py-1 bg-orange-500/10 rounded-lg">{i.name} ({i.stock_level})</span>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">{editingId ? "Edit Item" : "New Item"}</h3>
            <button onClick={() => { setShowAdd(false); setEditingId(null); }}><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Product name" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} placeholder="Supplier" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <input value={form.batch_number} onChange={e => setForm(p => ({ ...p, batch_number: e.target.value }))} placeholder="Batch number" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <input type="number" value={form.stock_level} onChange={e => setForm(p => ({ ...p, stock_level: e.target.value }))} placeholder="Stock level" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <input type="number" value={form.low_stock_threshold} onChange={e => setForm(p => ({ ...p, low_stock_threshold: e.target.value }))} placeholder="Low stock alert at" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <input type="number" value={form.cost_price} onChange={e => setForm(p => ({ ...p, cost_price: e.target.value }))} placeholder="Cost price (£)" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <input type="number" value={form.retail_price} onChange={e => setForm(p => ({ ...p, retail_price: e.target.value }))} placeholder="Retail price (£)" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <input type="date" value={form.expiry_date} onChange={e => setForm(p => ({ ...p, expiry_date: e.target.value }))} className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
          </div>
          <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes..." rows={2} className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none resize-none" />
          <button onClick={handleSave} className="px-6 py-2.5 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">{editingId ? "Update" : "Add Item"}</button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory..." className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
      </div>

      {/* Items List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center bg-card border border-border rounded-xl">
          <Package size={24} className="mx-auto text-muted-foreground mb-2" />
          <p className="font-body text-sm text-muted-foreground">No inventory items</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className={`bg-card border rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 ${item.stock_level <= item.low_stock_threshold ? "border-orange-500/30" : "border-border"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.stock_level <= item.low_stock_threshold ? "bg-orange-500/10" : "bg-secondary"}`}>
                  <Package size={16} className={item.stock_level <= item.low_stock_threshold ? "text-orange-500" : "text-muted-foreground"} />
                </div>
                <div>
                  <p className="font-body text-sm font-medium">{item.name}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{item.category}{item.supplier ? ` - ${item.supplier}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-body text-sm font-medium ${item.stock_level <= item.low_stock_threshold ? "text-orange-500" : ""}`}>{item.stock_level} in stock</p>
                  <p className="font-body text-[11px] text-muted-foreground">£{Number(item.cost_price).toFixed(2)} cost</p>
                </div>
                <button onClick={() => handleEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInventoryTab;
