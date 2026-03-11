import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, Shield, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type StaffMember = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  commission_rate: number;
  active: boolean;
  created_at: string;
};

const ROLES = ["admin", "practitioner", "receptionist", "marketing"];

const AdminStaffTab = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", role: "practitioner", commission_rate: "0" });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("staff_profiles").select("*").eq("active", true).order("full_name");
      if (data) setStaff(data as StaffMember[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const resetForm = () => setForm({ full_name: "", email: "", phone: "", role: "practitioner", commission_rate: "0" });

  const handleSave = async () => {
    if (!form.full_name.trim() || !form.email.trim()) { toast.error("Name and email required"); return; }
    const payload = {
      full_name: form.full_name,
      email: form.email,
      phone: form.phone || null,
      role: form.role,
      commission_rate: Number(form.commission_rate),
      user_id: "00000000-0000-0000-0000-000000000000",
    };

    if (editingId) {
      const { error } = await supabase.from("staff_profiles").update(payload).eq("id", editingId);
      if (error) { toast.error("Failed"); return; }
      setStaff(prev => prev.map(s => s.id === editingId ? { ...s, ...payload } as StaffMember : s));
      toast.success("Updated");
    } else {
      const { data, error } = await supabase.from("staff_profiles").insert(payload).select().single();
      if (error) { toast.error("Failed"); return; }
      if (data) setStaff(prev => [...prev, data as StaffMember]);
      toast.success("Staff member added");
    }
    setShowAdd(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (s: StaffMember) => {
    setEditingId(s.id);
    setForm({ full_name: s.full_name, email: s.email, phone: s.phone || "", role: s.role, commission_rate: String(s.commission_rate) });
    setShowAdd(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove staff member?")) return;
    const { error } = await supabase.from("staff_profiles").update({ active: false }).eq("id", id);
    if (error) { toast.error("Failed"); return; }
    setStaff(prev => prev.filter(s => s.id !== id));
    toast.success("Removed");
  };

  const roleColors: Record<string, string> = {
    admin: "bg-red-500/10 text-red-600",
    practitioner: "bg-blue-500/10 text-blue-600",
    receptionist: "bg-green-500/10 text-green-600",
    marketing: "bg-purple-500/10 text-purple-600",
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-2xl">Staff & Permissions</h2>
        <button onClick={() => { resetForm(); setEditingId(null); setShowAdd(!showAdd); }} className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
          <Plus size={14} /> Add Staff
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">{editingId ? "Edit Staff" : "New Staff Member"}</h3>
            <button onClick={() => { setShowAdd(false); setEditingId(null); }}><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Full name" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background">
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
            <input type="number" value={form.commission_rate} onChange={e => setForm(p => ({ ...p, commission_rate: e.target.value }))} placeholder="Commission %" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
          </div>
          <button onClick={handleSave} className="px-6 py-2.5 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">{editingId ? "Update" : "Add"}</button>
        </div>
      )}

      {/* Staff List */}
      {staff.length === 0 ? (
        <div className="py-12 text-center bg-card border border-border rounded-xl">
          <Users size={24} className="mx-auto text-muted-foreground mb-2" />
          <p className="font-body text-sm text-muted-foreground">No staff members added yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {staff.map(s => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-display text-lg">{s.full_name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-body text-sm font-medium">{s.full_name}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{s.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${roleColors[s.role] || "bg-secondary text-muted-foreground"}`}>{s.role}</span>
                {Number(s.commission_rate) > 0 && <span className="font-body text-[11px] text-muted-foreground">{s.commission_rate}%</span>}
                <button onClick={() => handleEdit(s)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permissions Info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-display text-lg mb-3">Permission Levels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { role: "Admin", access: "Full access to all sections", icon: Shield },
            { role: "Practitioner", access: "Calendar, clients, consultations, photos", icon: Users },
            { role: "Receptionist", access: "Bookings, calendar, client lookup", icon: Users },
            { role: "Marketing", access: "Marketing, reviews, media library", icon: Users },
          ].map(p => (
            <div key={p.role} className="flex items-start gap-3 py-2">
              <p.icon size={14} className="text-accent mt-0.5" />
              <div>
                <p className="font-body text-sm font-medium">{p.role}</p>
                <p className="font-body text-[11px] text-muted-foreground">{p.access}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStaffTab;
