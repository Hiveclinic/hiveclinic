import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Save, Globe, Clock, Shield, Mail, MessageSquare, CreditCard, Palette } from "lucide-react";
import { toast } from "sonner";

const AdminSettingsTab = () => {
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
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Save to localStorage for now (could be moved to site_settings table)
    localStorage.setItem("hive_clinic_settings", JSON.stringify(settings));
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved");
    }, 500);
  };

  useEffect(() => {
    const saved = localStorage.getItem("hive_clinic_settings");
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch {}
    }
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
    { name: "Stripe", desc: "Payment processing", connected: true, icon: CreditCard },
    { name: "Resend", desc: "Email delivery", connected: true, icon: Mail },
    { name: "WhatsApp", desc: "Client messaging", connected: true, icon: MessageSquare },
    { name: "Google Calendar", desc: "Calendar sync", connected: false, icon: Clock },
    { name: "Meta Pixel", desc: "Ad tracking", connected: true, icon: Globe },
    { name: "Mailchimp", desc: "Email marketing", connected: true, icon: Mail },
  ];

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

      {/* Integrations */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} className="text-accent" />
          <h3 className="font-display text-lg">Integrations</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {integrations.map(int => (
            <div key={int.name} className="flex items-center justify-between py-3 px-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <int.icon size={16} className="text-muted-foreground" />
                <div>
                  <p className="font-body text-sm font-medium">{int.name}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{int.desc}</p>
                </div>
              </div>
              <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${int.connected ? "bg-green-500/10 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                {int.connected ? "Connected" : "Setup"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsTab;
