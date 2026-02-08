import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Phone, Search, Download, Upload, Plus, Trash2, StickyNote, Image, ChevronDown, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";

type Client = {
  email: string;
  name: string;
  phone: string | null;
  bookingCount: number;
  totalSpent: number;
  lastVisit: string | null;
};

type AdminNote = {
  id: string;
  customer_email: string;
  note: string;
  created_at: string;
};

type ClientImage = {
  id: string;
  customer_email: string;
  image_url: string;
  image_type: string;
  treatment_name: string | null;
  notes: string | null;
  uploaded_at: string;
};

const AdminClientsTab = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [images, setImages] = useState<ClientImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageType, setImageType] = useState<"before" | "after">("before");
  const [imageTreatment, setImageTreatment] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    const [bookingsRes, notesRes, imagesRes] = await Promise.all([
      supabase.from("bookings").select("customer_email, customer_name, customer_phone, total_price, booking_date, status"),
      supabase.from("admin_client_notes").select("*").order("created_at", { ascending: false }),
      supabase.from("client_images").select("*").order("uploaded_at", { ascending: false }),
    ]);

    if (bookingsRes.data) {
      const clientMap = new Map<string, Client>();
      for (const b of bookingsRes.data) {
        const email = b.customer_email.toLowerCase();
        const existing = clientMap.get(email);
        if (existing) {
          existing.bookingCount++;
          existing.totalSpent += Number(b.total_price);
          if (!existing.lastVisit || b.booking_date > existing.lastVisit) existing.lastVisit = b.booking_date;
          if (!existing.phone && b.customer_phone) existing.phone = b.customer_phone;
          if (!existing.name && b.customer_name) existing.name = b.customer_name;
        } else {
          clientMap.set(email, {
            email,
            name: b.customer_name || "",
            phone: b.customer_phone,
            bookingCount: 1,
            totalSpent: Number(b.total_price),
            lastVisit: b.booking_date,
          });
        }
      }
      setClients(Array.from(clientMap.values()).sort((a, b) => (b.lastVisit || "").localeCompare(a.lastVisit || "")));
    }
    if (notesRes.data) setNotes(notesRes.data as AdminNote[]);
    if (imagesRes.data) setImages(imagesRes.data as ClientImage[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = clients.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.email.includes(s) || c.name.toLowerCase().includes(s) || (c.phone || "").includes(s);
  });

  const addNote = async (email: string) => {
    if (!newNote.trim()) return;
    const { error } = await supabase.from("admin_client_notes").insert({ customer_email: email, note: newNote.trim() });
    if (error) { toast.error("Failed to add note"); return; }
    toast.success("Note added");
    setNewNote("");
    fetchData();
  };

  const deleteNote = async (id: string) => {
    await supabase.from("admin_client_notes").delete().eq("id", id);
    setNotes(prev => prev.filter(n => n.id !== id));
    toast.success("Note deleted");
  };

  const uploadImage = async (email: string, file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${email}/${Date.now()}.${ext}`;
    
    const { error: uploadError } = await supabase.storage.from("client-images").upload(path, file);
    if (uploadError) { toast.error("Upload failed"); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from("client-images").getPublicUrl(path);
    
    const { error } = await supabase.from("client_images").insert({
      customer_email: email,
      image_url: path,
      image_type: imageType,
      treatment_name: imageTreatment || null,
    });
    if (error) { toast.error("Failed to save image record"); setUploading(false); return; }
    toast.success(`${imageType} image uploaded`);
    setUploading(false);
    setImageTreatment("");
    fetchData();
  };

  const deleteImage = async (img: ClientImage) => {
    await supabase.storage.from("client-images").remove([img.image_url]);
    await supabase.from("client_images").delete().eq("id", img.id);
    setImages(prev => prev.filter(i => i.id !== img.id));
    toast.success("Image deleted");
  };

  const getSignedUrl = async (path: string): Promise<string | null> => {
    const { data } = await supabase.storage.from("client-images").createSignedUrl(path, 3600);
    return data?.signedUrl || null;
  };

  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const loadSignedUrl = async (path: string) => {
    if (signedUrls[path]) return;
    const url = await getSignedUrl(path);
    if (url) setSignedUrls(prev => ({ ...prev, [path]: url }));
  };

  const handleImport = async () => {
    if (!importData.trim()) return;
    const lines = importData.trim().split("\n");
    let imported = 0;
    for (const line of lines) {
      const parts = line.split(",").map(s => s.trim().replace(/^"|"$/g, ""));
      if (parts.length < 2) continue;
      const [name, email, phone] = parts;
      if (!email || !email.includes("@")) continue;
      
      // Check if client already exists via a booking
      const existing = clients.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (existing) continue;

      // Create a placeholder profile entry via customer_profiles
      const { error } = await supabase.from("customer_profiles").insert({
        email: email.toLowerCase(),
        full_name: name,
        phone: phone || null,
        user_id: "00000000-0000-0000-0000-000000000000", // placeholder for imported clients
      });
      if (!error) imported++;
    }
    toast.success(`${imported} clients imported`);
    setShowImport(false);
    setImportData("");
    fetchData();
  };

  const exportCSV = () => {
    const rows = filtered.map(c => ({
      Name: c.name, Email: c.email, Phone: c.phone || "",
      Bookings: c.bookingCount, "Total Spent": `£${c.totalSpent.toFixed(2)}`,
      "Last Visit": c.lastVisit || "N/A",
    }));
    const headers = Object.keys(rows[0] || {});
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${(r as any)[h]}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `clients-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading clients...</p></div>;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="border border-border p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Clients</p>
          <p className="font-display text-2xl">{clients.length}</p>
        </div>
        <div className="border border-border p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="font-display text-2xl text-gold">£{clients.reduce((s, c) => s + c.totalSpent, 0).toFixed(0)}</p>
        </div>
        <div className="border border-border p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg Spend</p>
          <p className="font-display text-2xl">£{clients.length ? (clients.reduce((s, c) => s + c.totalSpent, 0) / clients.length).toFixed(0) : 0}</p>
        </div>
        <div className="border border-border p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
          <p className="font-display text-2xl">{notes.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-4 py-2 border border-border bg-transparent font-body text-sm focus:border-gold focus:outline-none" />
        </div>
        <button onClick={() => setShowImport(!showImport)} className="flex items-center gap-2 px-4 py-2 border border-border font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
          <Upload size={14} /> Import
        </button>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-border font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Import Panel */}
      {showImport && (
        <div className="border border-gold/30 bg-gold/5 p-4 mb-6">
          <h4 className="font-body text-sm font-medium mb-2">Import Clients (CSV format)</h4>
          <p className="font-body text-xs text-muted-foreground mb-3">Paste CSV data: Name, Email, Phone (one per line)</p>
          <textarea value={importData} onChange={e => setImportData(e.target.value)} rows={5}
            className="w-full border border-border bg-transparent px-3 py-2 font-body text-xs focus:border-gold focus:outline-none resize-none mb-2"
            placeholder={'Jane Smith, jane@email.com, 07123456789\nJohn Doe, john@email.com, 07987654321'} />
          <div className="flex gap-2">
            <button onClick={handleImport} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">Import</button>
            <button onClick={() => setShowImport(false)} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Client List */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-secondary text-center"><p className="font-body text-muted-foreground">No clients found.</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map(client => {
            const isExpanded = expandedClient === client.email;
            const clientNotes = notes.filter(n => n.customer_email === client.email);
            const clientImages = images.filter(i => i.customer_email === client.email);

            return (
              <div key={client.email}>
                <div
                  onClick={() => {
                    setExpandedClient(isExpanded ? null : client.email);
                    if (!isExpanded) {
                      clientImages.forEach(img => loadSignedUrl(img.image_url));
                    }
                  }}
                  className={`border p-4 cursor-pointer transition-colors ${isExpanded ? "border-gold bg-gold/5" : "border-border hover:border-gold/30"}`}
                >
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="text-muted-foreground">{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gold" />
                      <span className="font-body text-sm font-medium">{client.name || "Unknown"}</span>
                    </div>
                    <a href={`mailto:${client.email}`} className="font-body text-xs hover:text-gold transition-colors flex items-center gap-1">
                      <Mail size={12} /> {client.email}
                    </a>
                    {client.phone && (
                      <a href={`tel:${client.phone}`} className="font-body text-xs flex items-center gap-1">
                        <Phone size={12} /> {client.phone}
                      </a>
                    )}
                    <span className="ml-auto font-body text-xs text-muted-foreground">{client.bookingCount} bookings</span>
                    <span className="font-body text-xs font-medium text-gold">£{client.totalSpent.toFixed(0)}</span>
                    {clientNotes.length > 0 && <span className="font-body text-xs text-muted-foreground"><StickyNote size={12} className="inline" /> {clientNotes.length}</span>}
                    {clientImages.length > 0 && <span className="font-body text-xs text-muted-foreground"><Image size={12} className="inline" /> {clientImages.length}</span>}
                  </div>
                </div>

                {isExpanded && (
                  <div className="ml-4 border-l-2 border-gold/20 pl-4 py-3 space-y-4">
                    {/* Admin Notes */}
                    <div>
                      <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                        <StickyNote size={12} /> Admin Notes ({clientNotes.length})
                      </h4>
                      {clientNotes.map(n => (
                        <div key={n.id} className="flex items-start gap-2 mb-2 bg-secondary/50 p-2">
                          <p className="font-body text-xs flex-1">{n.note}</p>
                          <span className="font-body text-[10px] text-muted-foreground whitespace-nowrap">
                            {new Date(n.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                          <button onClick={() => deleteNote(n.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={10} /></button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote(client.email)}
                          className="flex-1 border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none"
                          placeholder="Add a private note..." />
                        <button onClick={() => addNote(client.email)} className="px-3 py-1 bg-foreground text-background font-body text-xs hover:bg-accent transition-colors">Add</button>
                      </div>
                    </div>

                    {/* Before/After Images */}
                    <div>
                      <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                        <Image size={12} /> Before & After Images ({clientImages.length})
                      </h4>
                      {clientImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                          {clientImages.map(img => (
                            <div key={img.id} className="relative group border border-border">
                              {signedUrls[img.image_url] ? (
                                <img src={signedUrls[img.image_url]} alt={img.image_type} className="w-full h-24 object-cover" />
                              ) : (
                                <div className="w-full h-24 bg-secondary flex items-center justify-center">
                                  <Image size={16} className="text-muted-foreground" />
                                </div>
                              )}
                              <div className="absolute top-1 left-1">
                                <span className={`px-1.5 py-0.5 font-body text-[9px] uppercase tracking-wider ${img.image_type === "before" ? "bg-orange-500/80 text-white" : "bg-green-500/80 text-white"}`}>
                                  {img.image_type}
                                </span>
                              </div>
                              <button onClick={() => deleteImage(img)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500/80 text-white p-0.5 transition-opacity">
                                <X size={10} />
                              </button>
                              {img.treatment_name && (
                                <p className="font-body text-[9px] text-muted-foreground p-1 truncate">{img.treatment_name}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 items-end">
                        <select value={imageType} onChange={e => setImageType(e.target.value as "before" | "after")}
                          className="border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none">
                          <option value="before">Before</option>
                          <option value="after">After</option>
                        </select>
                        <input value={imageTreatment} onChange={e => setImageTreatment(e.target.value)}
                          className="border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none"
                          placeholder="Treatment name" />
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                          onChange={e => { if (e.target.files?.[0]) uploadImage(client.email, e.target.files[0]); }} />
                        <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                          className="flex items-center gap-1 px-3 py-1 bg-foreground text-background font-body text-xs hover:bg-accent transition-colors disabled:opacity-50">
                          <Upload size={12} /> {uploading ? "Uploading..." : "Upload"}
                        </button>
                      </div>
                    </div>

                    {/* Last Visit */}
                    <p className="font-body text-xs text-muted-foreground">
                      Last visit: {client.lastVisit ? new Date(client.lastVisit + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}
                    </p>
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

export default AdminClientsTab;
