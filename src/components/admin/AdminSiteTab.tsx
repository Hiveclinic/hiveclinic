import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Pencil, Save, X, Megaphone, Layers, Image, Upload, RefreshCw } from "lucide-react";
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

type SiteImage = {
  id: string;
  key: string;
  image_url: string;
  alt_text: string;
};

const IMAGE_SLOTS: Record<string, { label: string; location: string }> = {
  hero_home: { label: "Homepage Hero", location: "Large banner at top of homepage" },
  gallery_1: { label: "Gallery Image 1", location: "Homepage gallery section" },
  gallery_2: { label: "Gallery Image 2", location: "Homepage gallery section" },
  gallery_3: { label: "Gallery Image 3", location: "Homepage gallery section" },
  gallery_4: { label: "Gallery Image 4", location: "Homepage gallery section" },
  gallery_5: { label: "Gallery Image 5", location: "Homepage gallery section" },
  gallery_6: { label: "Gallery Image 6", location: "Homepage gallery section" },
  about_hero: { label: "About Page Hero", location: "Banner on the About page" },
  treatments_hero: { label: "Treatments Hero", location: "Banner on the Treatments page" },
  booking_hero: { label: "Booking Hero", location: "Banner on the Booking page" },
  results_hero: { label: "Results Hero", location: "Banner on the Results page" },
  contact_hero: { label: "Contact Hero", location: "Banner on the Contact page" },
};

const getSlotInfo = (key: string) => {
  if (IMAGE_SLOTS[key]) return IMAGE_SLOTS[key];
  return { label: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), location: "Custom image slot" };
};

const AdminSiteTab = () => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ announcement_text: "", announcement_active: false, announcement_link: "" });
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewAddon, setShowNewAddon] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAddon, setNewAddon] = useState({ name: "", description: "", price: 0, duration_mins: 0, applicable_categories: "" });
  const [categories, setCategories] = useState<string[]>([]);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const fetchAll = async () => {
    const [addonsRes, settingsRes, treatRes, imagesRes] = await Promise.all([
      supabase.from("treatment_addons").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").eq("id", "global").single(),
      supabase.from("treatments").select("category"),
      supabase.from("site_images").select("*").order("key"),
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
    if (imagesRes.data) setSiteImages(imagesRes.data as SiteImage[]);
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

  const handleImageUpload = async (key: string, blob: Blob, fileName?: string) => {
    setUploadingKey(key);
    const ext = fileName?.split(".").pop() || "jpg";
    const path = `${key}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("site-images").upload(path, blob, { upsert: true, contentType: blob.type || "image/jpeg" });
    if (uploadError) { toast.error("Upload failed"); setUploadingKey(null); return; }

    const { data: { publicUrl } } = supabase.storage.from("site-images").getPublicUrl(path);

    // Check if image slot exists in DB, if not create it
    const existing = siteImages.find(img => img.key === key);
    if (existing) {
      const { error } = await supabase.from("site_images").update({
        image_url: publicUrl,
        updated_at: new Date().toISOString(),
      }).eq("key", key);
      if (error) { toast.error("Failed to save image URL"); setUploadingKey(null); return; }
      setSiteImages(prev => prev.map(img => img.key === key ? { ...img, image_url: publicUrl } : img));
    } else {
      const { data, error } = await supabase.from("site_images").insert({ key, image_url: publicUrl, alt_text: "" }).select().single();
      if (error) { toast.error("Failed to save image URL"); setUploadingKey(null); return; }
      if (data) setSiteImages(prev => [...prev, data as SiteImage]);
    }

    toast.success("Image updated");
    setUploadingKey(null);
  };

  const onFileSelected = (key: string, file: File) => {
    handleImageUpload(key, file, file.name);
  };

  const handleDrop = useCallback((key: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverKey(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(key, file, file.name);
    }
  }, [siteImages]);

  const updateAltText = async (key: string, altText: string) => {
    await supabase.from("site_images").update({ alt_text: altText }).eq("key", key);
    setSiteImages(prev => prev.map(img => img.key === key ? { ...img, alt_text: altText } : img));
  };

  const deleteImageSlot = async (key: string) => {
    if (!confirm(`Delete image slot "${getSlotInfo(key).label}"?`)) return;
    await supabase.from("site_images").delete().eq("key", key);
    setSiteImages(prev => prev.filter(img => img.key !== key));
    toast.success("Image slot removed");
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
      name: addon.name, description: addon.description, price: addon.price,
      duration_mins: addon.duration_mins, applicable_categories: addon.applicable_categories, active: addon.active,
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

  // Merge predefined slots with existing DB images
  const allSlotKeys = Object.keys(IMAGE_SLOTS);
  const existingKeys = new Set(siteImages.map(img => img.key));
  const displayImages: (SiteImage | { id: null; key: string; image_url: string; alt_text: string })[] = [
    ...allSlotKeys.map(key => {
      const existing = siteImages.find(img => img.key === key);
      return existing || { id: null, key, image_url: "", alt_text: "" };
    }),
    ...siteImages.filter(img => !allSlotKeys.includes(img.key)),
  ];

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

      {/* Website Images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl flex items-center gap-2"><Image size={18} /> Website Images ({displayImages.length})</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayImages.map(img => {
            const slot = getSlotInfo(img.key);
            const isPredefined = !!IMAGE_SLOTS[img.key];
            return (
              <div key={img.key} className="border border-border overflow-hidden">
                {/* Large Preview / Drop Zone */}
                <div
                  className={`relative aspect-video bg-secondary flex items-center justify-center cursor-pointer transition-colors ${dragOverKey === img.key ? "ring-2 ring-gold bg-gold/10" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragOverKey(img.key); }}
                  onDragLeave={() => setDragOverKey(null)}
                  onDrop={e => handleDrop(img.key, e)}
                >
                  {img.image_url ? (
                    <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <Upload size={24} className="text-muted-foreground mx-auto mb-2" />
                      <p className="font-body text-xs text-muted-foreground">Drag image here or click Upload</p>
                    </div>
                  )}
                  {uploadingKey === img.key && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <RefreshCw size={20} className="text-gold animate-spin" />
                    </div>
                  )}
                  {img.image_url && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors cursor-pointer group">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-white text-black font-body text-xs uppercase tracking-wider">
                        <RefreshCw size={12} /> Replace
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onFileSelected(img.key, e.target.files[0]); }} disabled={uploadingKey === img.key} />
                    </label>
                  )}
                </div>
                {/* Info */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-xs font-medium">{slot.label}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{slot.location}</p>
                    </div>
                    {!isPredefined && (
                      <button onClick={() => deleteImageSlot(img.key)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                    )}
                  </div>
                  <input
                    value={img.alt_text}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteImages(prev => prev.map(i => i.key === img.key ? { ...i, alt_text: val } : i));
                    }}
                    onBlur={() => {
                      if (img.id) updateAltText(img.key, img.alt_text);
                    }}
                    className="w-full border border-border bg-transparent px-3 py-1.5 font-body text-xs focus:border-gold focus:outline-none"
                    placeholder="Alt text for accessibility"
                  />
                  {!img.image_url && (
                    <label className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors cursor-pointer w-full">
                      <Upload size={14} />
                      <span className="font-body text-xs uppercase tracking-wider">Upload Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onFileSelected(img.key, e.target.files[0]); }} />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <div key={addon.id} className={`border p-3 sm:p-4 transition-colors ${addon.active ? "border-border" : "border-border/50 opacity-60"}`}>
                {editingId === addon.id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-body text-sm font-medium">{addon.name}</p>
                      <p className="font-body text-[11px] text-muted-foreground">£{addon.price} — {addon.duration_mins} mins{addon.description ? ` — ${addon.description}` : ""}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => toggleActive(addon.id, addon.active)} className={`px-2 py-1 border font-body text-xs transition-colors ${addon.active ? "border-green-600/30 text-green-600" : "border-border text-muted-foreground"}`}>
                        {addon.active ? "Active" : "Inactive"}
                      </button>
                      <button onClick={() => setEditingId(addon.id)} className="text-muted-foreground hover:text-gold transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => deleteAddon(addon.id, addon.name)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
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
