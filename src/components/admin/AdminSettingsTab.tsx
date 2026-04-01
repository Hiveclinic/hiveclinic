import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Save, Globe, Clock, Shield, Calendar, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const AdminSettingsTab = () => {
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    clinic_name: "Hive Clinic",
    clinic_email: "hello@hiveclinic.co.uk",
    clinic_phone: "",
    clinic_address: "Manchester, UK",
    booking_terms: "A deposit is required to secure your appointment. Cancellations must be made at least 48 hours before your appointment.",
    cancellation_hours: "48",
    max_reschedules: "2",
    deposit_default: "30",
  });
  const [bookingSettings, setBookingSettings] = useState({
    min_advance_hours: 48,
    max_advance_days: 60,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Save clinic settings to localStorage
    localStorage.setItem("hive_clinic_settings", JSON.stringify(settings));
    // Save booking settings to site_settings table
    const { error } = await supabase
      .from("site_settings")
      .update({
        min_advance_hours: bookingSettings.min_advance_hours,
        max_advance_days: bookingSettings.max_advance_days,
        calendar_view: 'monthly',
      })
      .eq("id", "global");
    setSaving(false);
    if (error) {
      toast.error("Failed to save booking settings");
    } else {
      toast.success("Settings saved");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("hive_clinic_settings");
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch {}
    }
    // Load booking settings from DB
    supabase.from("site_settings").select("min_advance_hours, max_advance_days").eq("id", "global").single().then(({ data }) => {
      if (data) {
        const d = data as any;
        setBookingSettings({
          min_advance_hours: d.min_advance_hours ?? 48,
          max_advance_days: d.max_advance_days ?? 60,
        });
      }
    });
  }, []);

  const sections = [
    {
      title: "Clinic Profile",
      icon: Globe,
      fields: [
        { key: "clinic_name", label: "Clinic Name", type: "text" },
        { key: "clinic_email", label: "Email", type: "email" },
        { key: "clinic_phone", label: "Phone", type: "tel" },
        { key: "clinic_address", label: "Address", type: "text" },
      ],
    },
    {
      title: "Booking Rules",
      icon: Clock,
      fields: [
        { key: "cancellation_hours", label: "Cancellation Notice (hours)", type: "number" },
        { key: "max_reschedules", label: "Max Reschedules", type: "number" },
        { key: "deposit_default", label: "Default Deposit (£)", type: "number" },
      ],
    },
  ];

  const integrations = [
    { name: "Stripe", desc: "Payment processing", status: "Configured" },
    { name: "Resend", desc: "Email delivery", status: "Configured" },
    { name: "WhatsApp", desc: "Client messaging", status: "Configured" },
    { name: "Calendar Feed", desc: "Outlook / iPhone sync", status: "Configured" },
    { name: "Meta Pixel", desc: "Ad tracking", status: "Configured" },
    { name: "Mailchimp", desc: "Email marketing", status: "Configured" },
  ];

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const feedToken = anonKey?.substring(0, 20) || "";
  const calendarFeedUrl = `https://${projectId}.supabase.co/functions/v1/calendar-feed?token=${feedToken}`;

  const copyFeedUrl = () => {
    navigator.clipboard.writeText(calendarFeedUrl);
    setCopied(true);
    toast.success("Calendar feed URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Settings</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-50">
          <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Setting Sections */}
      {sections.map(section => (
        <div key={section.title} className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <section.icon size={16} className="text-accent" />
            <h3 className="font-display text-lg">{section.title}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">{field.label}</label>
                <input
                  type={field.type}
                  value={(settings as any)[field.key]}
                  onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Booking Advance Settings */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-accent" />
          <h3 className="font-display text-lg">Booking Availability</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Minimum Advance Booking (hours)</label>
            <input
              type="number"
              min={0}
              value={bookingSettings.min_advance_hours}
              onChange={e => setBookingSettings(prev => ({ ...prev, min_advance_hours: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none"
            />
            <p className="font-body text-[10px] text-muted-foreground mt-1">Clients must book at least this many hours ahead (e.g. 48 = 2 days).</p>
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Max Advance Booking (days)</label>
            <input
              type="number"
              min={1}
              value={bookingSettings.max_advance_days}
              onChange={e => setBookingSettings(prev => ({ ...prev, max_advance_days: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none"
            />
            <p className="font-body text-[10px] text-muted-foreground mt-1">How far ahead clients can book (e.g. 60 = ~2 months).</p>
          </div>
        </div>
      </div>

      {/* Booking Terms */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-accent" />
          <h3 className="font-display text-lg">Booking Terms & Cancellation Policy</h3>
        </div>
        <textarea
          value={settings.booking_terms}
          onChange={e => setSettings(prev => ({ ...prev, booking_terms: e.target.value }))}
          rows={4}
          className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none resize-none"
        />
      </div>

      {/* Calendar Feed */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-accent" />
          <h3 className="font-display text-lg">Calendar Sync</h3>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-3">
          Subscribe to this URL in Outlook, iPhone Calendar, or Google Calendar to automatically see all bookings.
        </p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={calendarFeedUrl}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg font-body text-xs bg-background text-muted-foreground truncate"
          />
          <button onClick={copyFeedUrl} className="flex items-center gap-1.5 px-4 py-2.5 bg-foreground text-background rounded-lg font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors shrink-0">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="font-body text-[10px] text-muted-foreground mt-2">
          In Outlook: File → Account Settings → Internet Calendars → New → paste URL. On iPhone: Settings → Calendar → Accounts → Add Account → Other → Add Subscribed Calendar.
        </p>
      </div>

      {/* Integrations */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} className="text-accent" />
          <h3 className="font-display text-lg">Integrations</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {integrations.map(int => (
            <div key={int.name} className="flex items-center justify-between py-3 px-4 border border-border rounded-lg">
              <div>
                <p className="font-body text-sm font-medium">{int.name}</p>
                <p className="font-body text-[10px] text-muted-foreground">{int.desc}</p>
              </div>
              <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${int.status === "Configured" ? "bg-green-500/10 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                {int.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsTab;
