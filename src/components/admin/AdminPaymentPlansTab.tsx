import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Save, Trash2, CreditCard, Pencil, X } from "lucide-react";
import { format } from "date-fns";

type PaymentPlan = {
  id: string;
  booking_id: string;
  total_amount: number;
  instalment_amount: number;
  total_instalments: number;
  paid_instalments: number;
  status: string;
  next_payment_date: string | null;
  created_at: string;
  bookings?: { customer_name: string; customer_email: string; treatments: { name: string } | null } | null;
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-blue-600 border-blue-600/30",
  completed: "text-green-600 border-green-600/30",
  defaulted: "text-red-500 border-red-500/30",
  cancelled: "text-muted-foreground border-border",
};

const AdminPaymentPlansTab = () => {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [bookings, setBookings] = useState<{ id: string; customer_name: string; total_price: number }[]>([]);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ instalment_amount: number; total_instalments: number; total_amount: number; next_payment_date: string }>({ instalment_amount: 0, total_instalments: 3, total_amount: 0, next_payment_date: "" });
  const [customPaymentAmount, setCustomPaymentAmount] = useState<number | null>(null);
  const [showCustomPayment, setShowCustomPayment] = useState<string | null>(null);

  const [newBookingId, setNewBookingId] = useState("");
  const [newTotal, setNewTotal] = useState(0);
  const [newInstalments, setNewInstalments] = useState(3);
  const [newFirstPayment, setNewFirstPayment] = useState(0);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from("payment_plans")
      .select("*, bookings(customer_name, customer_email, treatments(name))")
      .order("created_at", { ascending: false });
    if (data) setPlans(data as unknown as PaymentPlan[]);
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data } = await supabase.from("bookings").select("id, customer_name, total_price").in("status", ["confirmed", "completed"]).order("created_at", { ascending: false }).limit(50);
    if (data) setBookings(data);
  };

  useEffect(() => { fetchPlans(); fetchBookings(); }, []);

  const createPlan = async () => {
    if (!newBookingId || newTotal <= 0 || newInstalments < 2) { toast.error("Fill in all fields"); return; }
    const remaining = newTotal - newFirstPayment;
    const instalmentAmount = Math.ceil((remaining / (newInstalments - (newFirstPayment > 0 ? 1 : 0))) * 100) / 100;
    const nextDate = new Date(); nextDate.setMonth(nextDate.getMonth() + 1);
    const { error } = await supabase.from("payment_plans").insert({
      booking_id: newBookingId, total_amount: newTotal, instalment_amount: instalmentAmount,
      total_instalments: newInstalments, paid_instalments: newFirstPayment > 0 ? 1 : 0,
      next_payment_date: nextDate.toISOString().slice(0, 10), status: "active",
    });
    if (error) { toast.error("Failed to create plan"); return; }
    toast.success("Payment plan created");
    setShowCreate(false); setNewBookingId(""); setNewTotal(0); setNewInstalments(3); setNewFirstPayment(0);
    fetchPlans();
  };

  const recordPayment = async (plan: PaymentPlan, customAmount?: number) => {
    const newPaid = plan.paid_instalments + 1;
    const isComplete = newPaid >= plan.total_instalments;
    const nextDate = isComplete ? null : (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toISOString().slice(0, 10); })();
    const { error } = await supabase.from("payment_plans").update({
      paid_instalments: newPaid, status: isComplete ? "completed" : "active", next_payment_date: nextDate,
      ...(customAmount ? { instalment_amount: customAmount } : {}),
    }).eq("id", plan.id);
    if (error) { toast.error("Failed to record payment"); return; }
    toast.success(isComplete ? "Plan completed!" : `Payment ${newPaid}/${plan.total_instalments} recorded${customAmount ? ` (£${customAmount})` : ""}`);
    setShowCustomPayment(null); setCustomPaymentAmount(null);
    fetchPlans();
  };

  const saveEdit = async (planId: string) => {
    const { error } = await supabase.from("payment_plans").update({
      instalment_amount: editForm.instalment_amount, total_instalments: editForm.total_instalments,
      total_amount: editForm.total_amount, next_payment_date: editForm.next_payment_date || null,
    }).eq("id", planId);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Plan updated");
    setEditingPlan(null); fetchPlans();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("payment_plans").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Status updated to ${status}`); fetchPlans();
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading...</p></div>;

  const stats = {
    active: plans.filter(p => p.status === "active").length,
    completed: plans.filter(p => p.status === "completed").length,
    outstanding: plans.filter(p => p.status === "active").reduce((s, p) => s + (Number(p.total_amount) - (p.paid_instalments * Number(p.instalment_amount))), 0),
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="border border-border p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Active Plans</p>
          <p className="font-display text-2xl text-blue-600">{stats.active}</p>
        </div>
        <div className="border border-border p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Completed</p>
          <p className="font-display text-2xl text-green-600">{stats.completed}</p>
        </div>
        <div className="border border-border p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Outstanding</p>
          <p className="font-display text-2xl text-gold">£{stats.outstanding.toFixed(0)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl">Payment Plans ({plans.length})</h3>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
          <Plus size={14} /> New Plan
        </button>
      </div>

      {showCreate && (
        <div className="border border-gold bg-gold/5 p-6 mb-6 space-y-4">
          <h4 className="font-display text-lg">Create Payment Plan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs block mb-1">Booking</label>
              <select value={newBookingId} onChange={e => { setNewBookingId(e.target.value); const b = bookings.find(b => b.id === e.target.value); if (b) setNewTotal(Number(b.total_price)); }} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none">
                <option value="">Select booking...</option>
                {bookings.map(b => <option key={b.id} value={b.id}>{b.customer_name} - £{Number(b.total_price).toFixed(0)}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs block mb-1">Total Amount (£)</label>
              <input type="number" value={newTotal} onChange={e => setNewTotal(Number(e.target.value))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="font-body text-xs block mb-1">Number of Instalments</label>
              <input type="number" min={2} max={12} value={newInstalments} onChange={e => setNewInstalments(Number(e.target.value))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="font-body text-xs block mb-1">First Payment Amount (£)</label>
              <input type="number" value={newFirstPayment} onChange={e => setNewFirstPayment(Number(e.target.value))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="e.g. 150" />
            </div>
          </div>
          {newTotal > 0 && newInstalments >= 2 && (
            <div className="bg-secondary p-3 font-body text-xs">
              {newFirstPayment > 0 ? <p>£{newFirstPayment} today, then {newInstalments - 1}x £{((newTotal - newFirstPayment) / (newInstalments - 1)).toFixed(2)}/month</p>
                : <p>{newInstalments}x £{(newTotal / newInstalments).toFixed(2)}/month</p>}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={createPlan} className="px-6 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">Create Plan</button>
            <button onClick={() => setShowCreate(false)} className="px-6 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="p-12 bg-secondary text-center"><p className="font-body text-muted-foreground">No payment plans yet.</p></div>
      ) : (
        <div className="space-y-3">
          {plans.map(p => {
            const remaining = Number(p.total_amount) - (p.paid_instalments * Number(p.instalment_amount));
            return (
              <div key={p.id} className="border border-border p-5 hover:border-gold/30 transition-colors">
                <div className="flex flex-wrap gap-4 items-center mb-3">
                  <CreditCard size={16} className="text-gold" />
                  <span className="font-body text-sm font-medium">{(p.bookings as any)?.customer_name || "Customer"}</span>
                  <span className="font-body text-xs text-muted-foreground">{(p.bookings as any)?.customer_email}</span>
                  <span className="font-body text-xs bg-secondary px-2 py-1">{(p.bookings as any)?.treatments?.name || "Treatment"}</span>
                  <span className={`ml-auto px-2 py-1 border font-body text-xs uppercase tracking-wider ${STATUS_COLORS[p.status] || ""}`}>{p.status}</span>
                </div>

                {editingPlan === p.id ? (
                  <div className="space-y-3 border-t border-border pt-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="font-body text-[10px] text-muted-foreground block mb-1">Total Amount</label>
                        <input type="number" value={editForm.total_amount} onChange={e => setEditForm(f => ({ ...f, total_amount: Number(e.target.value) }))} className="w-full border border-border bg-transparent px-2 py-1 font-body text-sm focus:border-gold focus:outline-none" />
                      </div>
                      <div>
                        <label className="font-body text-[10px] text-muted-foreground block mb-1">Instalment £</label>
                        <input type="number" value={editForm.instalment_amount} onChange={e => setEditForm(f => ({ ...f, instalment_amount: Number(e.target.value) }))} className="w-full border border-border bg-transparent px-2 py-1 font-body text-sm focus:border-gold focus:outline-none" />
                      </div>
                      <div>
                        <label className="font-body text-[10px] text-muted-foreground block mb-1">Total Instalments</label>
                        <input type="number" value={editForm.total_instalments} onChange={e => setEditForm(f => ({ ...f, total_instalments: Number(e.target.value) }))} className="w-full border border-border bg-transparent px-2 py-1 font-body text-sm focus:border-gold focus:outline-none" />
                      </div>
                      <div>
                        <label className="font-body text-[10px] text-muted-foreground block mb-1">Next Payment</label>
                        <input type="date" value={editForm.next_payment_date} onChange={e => setEditForm(f => ({ ...f, next_payment_date: e.target.value }))} className="w-full border border-border bg-transparent px-2 py-1 font-body text-sm focus:border-gold focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(p.id)} className="px-3 py-1 bg-foreground text-background font-body text-xs hover:bg-accent transition-colors"><Save size={10} className="inline mr-1" /> Save</button>
                      <button onClick={() => setEditingPlan(null)} className="px-3 py-1 border border-border font-body text-xs hover:border-foreground transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="font-body text-sm">£{Number(p.total_amount).toFixed(0)} total</span>
                    <span className="font-body text-xs text-muted-foreground">£{Number(p.instalment_amount).toFixed(2)} × {p.total_instalments}</span>
                    {remaining > 0 && <span className="font-body text-xs text-gold">£{remaining.toFixed(0)} remaining</span>}
                    <div className="flex-1 min-w-[120px]">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gold transition-all" style={{ width: `${(p.paid_instalments / p.total_instalments) * 100}%` }} />
                      </div>
                      <p className="font-body text-xs text-muted-foreground mt-1">{p.paid_instalments}/{p.total_instalments} paid</p>
                    </div>
                    {p.next_payment_date && <span className="font-body text-xs text-muted-foreground">Next: {p.next_payment_date}</span>}

                    {p.status === "active" && (
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => { setEditingPlan(p.id); setEditForm({ instalment_amount: Number(p.instalment_amount), total_instalments: p.total_instalments, total_amount: Number(p.total_amount), next_payment_date: p.next_payment_date || "" }); }}
                          className="px-3 py-1 border border-border text-muted-foreground font-body text-xs uppercase tracking-wider hover:border-gold hover:text-gold transition-colors">
                          <Pencil size={10} className="inline mr-1" /> Edit
                        </button>
                        <button onClick={() => recordPayment(p)} className="px-3 py-1 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
                          Record £{Number(p.instalment_amount).toFixed(0)}
                        </button>
                        {showCustomPayment === p.id ? (
                          <div className="flex gap-1 items-center">
                            <input type="number" value={customPaymentAmount || ""} onChange={e => setCustomPaymentAmount(Number(e.target.value))} placeholder="£" className="w-20 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none" />
                            <button onClick={() => { if (customPaymentAmount && customPaymentAmount > 0) recordPayment(p, customPaymentAmount); }} className="px-2 py-1 bg-gold text-white font-body text-[10px] hover:bg-gold/80 transition-colors">OK</button>
                            <button onClick={() => { setShowCustomPayment(null); setCustomPaymentAmount(null); }} className="text-muted-foreground hover:text-foreground"><X size={12} /></button>
                          </div>
                        ) : (
                          <button onClick={() => setShowCustomPayment(p.id)} className="px-3 py-1 border border-border text-muted-foreground font-body text-xs uppercase tracking-wider hover:border-gold transition-colors">
                            Custom £
                          </button>
                        )}
                        <button onClick={() => updateStatus(p.id, "defaulted")} className="px-3 py-1 border border-red-500/30 text-red-500 font-body text-xs uppercase tracking-wider hover:bg-red-500/10 transition-colors">
                          Default
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPaymentPlansTab;
