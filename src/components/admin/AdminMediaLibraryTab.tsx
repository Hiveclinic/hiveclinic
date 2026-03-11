import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Image, Upload, Trash2, Search, FolderOpen, X, Check, Tag } from "lucide-react";
import { toast } from "sonner";

type MediaItem = {
  id: string;
  key: string;
  image_url: string;
  alt_text: string | null;
  updated_at: string;
  source: "site" | "client";
  customer_email?: string;
  treatment_name?: string;
  image_type?: string;
};

const AdminMediaLibraryTab = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "site" | "client">("all");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetch = async () => {
      const [siteRes, clientRes] = await Promise.all([
        supabase.from("site_images").select("*").order("updated_at", { ascending: false }),
        supabase.from("client_images").select("*").order("uploaded_at", { ascending: false }),
      ]);

      const siteItems: MediaItem[] = (siteRes.data || []).map((s: any) => ({
        id: s.id, key: s.key, image_url: s.image_url, alt_text: s.alt_text, updated_at: s.updated_at, source: "site" as const,
      }));

      const clientItems: MediaItem[] = (clientRes.data || []).map((c: any) => ({
        id: c.id, key: c.customer_email, image_url: c.image_url, alt_text: c.notes, updated_at: c.uploaded_at, source: "client" as const,
        customer_email: c.customer_email, treatment_name: c.treatment_name, image_type: c.image_type,
      }));

      setItems([...siteItems, ...clientItems]);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `site/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("site-images").upload(path, file);
    if (uploadError) { toast.error("Upload failed"); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from("site-images").getPublicUrl(path);

    const { data, error } = await supabase.from("site_images").insert({
      key: `upload-${Date.now()}`,
      image_url: publicUrl,
      alt_text: file.name,
    }).select().single();

    if (error) { toast.error("Failed to save"); setUploading(false); return; }
    if (data) setItems(prev => [{ ...data, source: "site" as const } as MediaItem, ...prev]);
    toast.success("Uploaded");
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm("Delete this image?")) return;
    const table = item.source === "site" ? "site_images" : "client_images";
    const { error } = await supabase.from(table).delete().eq("id", item.id);
    if (error) { toast.error("Failed"); return; }
    setItems(prev => prev.filter(i => i.id !== item.id));
    toast.success("Deleted");
  };

  const filtered = items.filter(i => {
    if (filter !== "all" && i.source !== filter) return false;
    if (search && !i.key.toLowerCase().includes(search.toLowerCase()) && !(i.alt_text || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="py-12 text-center"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-2xl">Media Library</h2>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-50">
            <Upload size={14} /> {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
        </div>
        {(["all", "site", "client"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 font-body text-xs uppercase tracking-wider rounded-lg border transition-colors ${filter === f ? "border-accent text-accent" : "border-border text-muted-foreground"}`}>
            {f === "all" ? `All (${items.length})` : f === "site" ? "Site Images" : "Client Photos"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center bg-card border border-border rounded-xl">
          <Image size={24} className="mx-auto text-muted-foreground mb-2" />
          <p className="font-body text-sm text-muted-foreground">No images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden group relative">
              <div className="aspect-square bg-secondary">
                <img src={item.image_url} alt={item.alt_text || ""} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="font-body text-xs truncate">{item.alt_text || item.key}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`font-body text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full ${item.source === "site" ? "bg-blue-500/10 text-blue-600" : "bg-accent/10 text-accent"}`}>{item.source}</span>
                  {item.image_type && <span className="font-body text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{item.image_type}</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(item)} className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMediaLibraryTab;
