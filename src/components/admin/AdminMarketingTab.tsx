import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageSquare, Users, Plus, Calendar, Send, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { format, subDays } from "date-fns";

type Campaign = {
  id: string;
  name: string;
  campaign_type: string;
  segment_filter: any;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  target_count: number;
  sent_count: number;
  created_at: string;
};

type ClientSegment = {
  label: string;
  description: string;
  filter: string;
  count: number;
};

const AdminMarketingTab = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<ClientSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: "", campaign_type: "email" });

  useEffect(() => {
    const fetch = async () => {
      const [campRes, bookingsRes] = await Promise.all([
        supabase.from("marketing_campaigns").select("*").order("created_at", { ascending: false }),
        supabase.from("bookings").select("customer_email, booking_date, status"),
      ]);
      if (campRes.data) setCampaigns(campRes.data as Campaign[]);

      // Calculate segments
      const bookings = bookingsRes.data || [];
      const emails = new Map<string, { lastDate: string; count: number }>();
      bookings.forEach((b: any) => {
        const existing = emails.get(b.customer_email);
        if (!existing || b.booking_date > existing.lastDate) {
          emails.set(b.customer_email, { lastDate: b.booking_date, count: (existing?.count || 0) + 1 });
        } else {
          existing.count++;
        }
      });

      const ninetyDaysAgo = format(subDays(new Date(), 90), "yyyy-MM-dd");
      const inactive = [...emails.entries()].filter(([_, v]) => v.lastDate < ninetyDaysAgo).length;
      const repeats = [...emails.values()].filter(v => v.count > 1).length;
      const highValue = [...emails.values()].filter(v => v.count >= 5).length;
      const newClients = [...emails.values()].filter(v => v.count === 1).length;

      setSegments([
        { label: "Inactive 90+ Days", description: "Clients who haven't booked in 90 days", filter: "inactive_90", count: inactive },
        { label: "Repeat Clients", description: "Clients with 2+ bookings", filter: "repeat", count: repeats },
        { label: "High Value", description: "Clients with 5+ bookings", filter: "high_value", count: highValue },
        { label: "New Clients", description: "Only 1 booking so far", filter: "new", count: newClients },
      ]);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleCreate = async () => {
    if (!newCampaign.name.trim()) { toast.error("Name required"); return; }
    const { data, error } = await supabase.from("marketing_campaigns").insert({
      name: newCampaign.name,
      campaign_type: newCampaign.campaign_type,
    }).select().single();
    if (error) { toast.error("Failed"); return; }
    if (data) setCampaigns(prev => [data as Campaign, ...prev]);
    toast.success("Campaign created");
    setShowNew(false);
    setNewCampaign({ name: "", campaign_type: "email" });
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-2xl">Marketing & Retention</h2>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
          <Plus size={14} /> New Campaign
        </button>
      </div>

      {/* Segments */}
      <div>
        <h3 className="font-display text-lg mb-3">Client Segments</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {segments.map(seg => (
            <div key={seg.filter} className="bg-card border border-border rounded-xl p-4 hover:border-accent/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-accent" />
                <span className="font-body text-xs font-medium">{seg.label}</span>
              </div>
              <p className="font-display text-2xl mb-1">{seg.count}</p>
              <p className="font-body text-[10px] text-muted-foreground">{seg.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Reminders */}
      <div>
        <h3 className="font-display text-lg mb-3">Automated Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Post-Treatment Follow-up", desc: "24h after appointment completion", icon: Clock, active: true },
            { label: "Review Request", desc: "48h after completed appointment", icon: TrendingUp, active: true },
            { label: "Rebooking Reminder", desc: "Sent when treatment cycle is due", icon: Calendar, active: false },
            { label: "Birthday Offers", desc: "Automated birthday discount email", icon: Mail, active: false },
            { label: "Win-Back Campaign", desc: "Targets clients inactive 90+ days", icon: Send, active: false },
            { label: "Abandoned Booking", desc: "Follow up on incomplete bookings", icon: MessageSquare, active: false },
          ].map(action => (
            <div key={action.label} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.active ? "bg-green-500/10" : "bg-secondary"}`}>
                  <action.icon size={14} className={action.active ? "text-green-600" : "text-muted-foreground"} />
                </div>
                <div>
                  <p className="font-body text-sm font-medium">{action.label}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{action.desc}</p>
                </div>
              </div>
              <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${action.active ? "bg-green-500/10 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                {action.active ? "Active" : "Coming Soon"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New Campaign Form */}
      {showNew && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-display text-lg">Create Campaign</h3>
          <input value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))} placeholder="Campaign name..." className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
          <select value={newCampaign.campaign_type} onChange={e => setNewCampaign(p => ({ ...p, campaign_type: e.target.value }))} className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background">
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-6 py-2.5 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">Create</button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-foreground transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Campaign List */}
      {campaigns.length > 0 && (
        <div>
          <h3 className="font-display text-lg mb-3">Campaigns</h3>
          <div className="space-y-2">
            {campaigns.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-body text-sm font-medium">{c.name}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{c.campaign_type} — {format(new Date(c.created_at), "d MMM yyyy")}</p>
                </div>
                <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  c.status === "sent" ? "bg-green-500/10 text-green-600" : c.status === "scheduled" ? "bg-blue-500/10 text-blue-600" : "bg-secondary text-muted-foreground"
                }`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMarketingTab;
