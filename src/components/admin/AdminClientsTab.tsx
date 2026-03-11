import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Phone, Search, Download, Upload, Plus, Trash2, StickyNote, Image, ChevronDown, ChevronRight, X, RefreshCw, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Client = {
  email: string;
  name: string;
  phone: string | null;
  bookingCount: number;
  totalSpent: number;
  lastVisit: string | null;
  profileId?: string;
  dateOfBirth?: string | null;
  medicalNotes?: string | null;
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

type ClientPackage = {
  id: string;
  customer_email: string;
  package_id: string | null;
  package_name: string;
  sessions_total: number;
  sessions_used: number;
  expiry_date: string | null;
  created_at: string;
};

const AdminClientsTab = () => {
  const navigate = useNavigate();
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

  // New client form
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", dob: "", medicalNotes: "" });

  // Edit client
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", dob: "", medicalNotes: "" });

  const fetchData = async () => {
    setLoading(true);
    const [bookingsRes, notesRes, imagesRes, profilesRes] = await Promise.all([
      supabase.from("bookings").select("customer_email, customer_name, customer_phone, total_price, booking_date, status"),
      supabase.from("admin_client_notes").select("*").order("created_at", { ascending: false }),
      supabase.from("client_images").select("*").order("uploaded_at", { ascending: false }),
      supabase.from("customer_profiles").select("id, email, full_name, phone, date_of_birth, medical_notes"),
    ]);

    const clientMap = new Map<string, Client>();

    // Build from bookings
    if (bookingsRes.data) {
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
    }

    // Merge customer_profiles (add profiles that don't exist in bookings, enrich existing)
    if (profilesRes.data) {
      for (const p of profilesRes.data) {
        const email = p.email.toLowerCase();
        const existing = clientMap.get(email);
        if (existing) {
          existing.profileId = p.id;
          existing.dateOfBirth = p.date_of_birth;
          existing.medicalNotes = p.medical_notes;
          if (!existing.name && p.full_name) existing.name = p.full_name;
          if (!existing.phone && p.phone) existing.phone = p.phone;
        } else {
          clientMap.set(email, {
            email,
            name: p.full_name || "",
            phone: p.phone,
            bookingCount: 0,
            totalSpent: 0,
            lastVisit: null,
            profileId: p.id,
            dateOfBirth: p.date_of_birth,
            medicalNotes: p.medical_notes,
          });
        }
      }
    }

    setClients(Array.from(clientMap.values()).sort((a, b) => (b.lastVisit || "").localeCompare(a.lastVisit || "")));
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
    const { error } = await supabase.from("client_images").insert({
      customer_email: email, image_url: path, image_type: imageType, treatment_name: imageTreatment || null,
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

  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const loadSignedUrl = async (path: string) => {
    if (signedUrls[path]) return;
    const { data } = await supabase.storage.from("client-images").createSignedUrl(path, 3600);
    if (data?.signedUrl) setSignedUrls(prev => ({ ...prev, [path]: data.signedUrl }));
  };

  const handleCreateClient = async () => {
    if (!newClient.name.trim() || !newClient.email.trim()) { toast.error("Name and email required"); return; }
    const { error } = await supabase.from("customer_profiles").insert({
      email: newClient.email.toLowerCase().trim(),
      full_name: newClient.name.trim(),
      phone: newClient.phone || null,
      date_of_birth: newClient.dob || null,
      medical_notes: newClient.medicalNotes || null,
      user_id: "00000000-0000-0000-0000-000000000000",
    });
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Client with this email already exists" : "Failed to create client");
      return;
    }
    toast.success("Client created");
    setNewClient({ name: "", email: "", phone: "", dob: "", medicalNotes: "" });
    setShowNewClient(false);
    fetchData();
  };

  const startEdit = (client: Client) => {
    setEditingClient(client.email);
    setEditForm({
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      dob: client.dateOfBirth || "",
      medicalNotes: client.medicalNotes || "",
    });
  };

  const saveEdit = async (originalEmail: string) => {
    // Update or create profile
    const client = clients.find(c => c.email === originalEmail);
    if (client?.profileId) {
      const { error } = await supabase.from("customer_profiles").update({
        full_name: editForm.name, phone: editForm.phone || null,
        date_of_birth: editForm.dob || null, medical_notes: editForm.medicalNotes || null,
      }).eq("id", client.profileId);
      if (error) { toast.error("Failed to update"); return; }
    } else {
      const { error } = await supabase.from("customer_profiles").insert({
        email: originalEmail, full_name: editForm.name, phone: editForm.phone || null,
        date_of_birth: editForm.dob || null, medical_notes: editForm.medicalNotes || null,
        user_id: "00000000-0000-0000-0000-000000000000",
      });
      if (error && !error.message.includes("duplicate")) { toast.error("Failed to save"); return; }
    }
    toast.success("Client updated");
    setEditingClient(null);
    fetchData();
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
      const existing = clients.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (existing) continue;
      const { error } = await supabase.from("customer_profiles").insert({
        email: email.toLowerCase(), full_name: name, phone: phone || null,
        user_id: "00000000-0000-0000-0000-000000000000",
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
        <div className="border border-border p-3 sm:p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Clients</p>
          <p className="font-display text-2xl">{clients.length}</p>
        </div>
        <div className="border border-border p-3 sm:p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="font-display text-2xl text-gold">£{clients.reduce((s, c) => s + c.totalSpent, 0).toFixed(0)}</p>
        </div>
        <div className="border border-border p-3 sm:p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg Spend</p>
          <p className="font-display text-2xl">£{clients.length ? (clients.reduce((s, c) => s + c.totalSpent, 0) / clients.length).toFixed(0) : 0}</p>
        </div>
        <div className="border border-border p-3 sm:p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
          <p className="font-display text-2xl">{notes.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-4 py-2 border border-border bg-transparent font-body text-sm focus:border-gold focus:outline-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNewClient(!showNewClient)} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-body text-xs tracking-wider uppercase hover:bg-accent transition-colors">
            <Plus size={14} /> New Client
          </button>
          <button onClick={() => setShowImport(!showImport)} className="flex items-center gap-2 px-3 py-2 border border-border font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            <Upload size={14} />
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-border font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* New Client Form */}
      {showNewClient && (
        <div className="border border-gold/30 bg-gold/5 p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-body text-sm font-medium">New Client</h4>
            <button onClick={() => setShowNewClient(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Full Name *" />
            <input value={newClient.email} onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Email *" type="email" />
            <input value={newClient.phone} onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Phone" />
            <input value={newClient.dob} onChange={e => setNewClient(p => ({ ...p, dob: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Date of Birth" type="date" />
          </div>
          <textarea value={newClient.medicalNotes} onChange={e => setNewClient(p => ({ ...p, medicalNotes: e.target.value }))} rows={2}
            className="w-full border border-border bg-transparent px-3 py-2 font-body text-xs focus:border-gold focus:outline-none resize-none" placeholder="Medical notes (optional)" />
          <div className="flex gap-2">
            <button onClick={handleCreateClient} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">Create Client</button>
            <button onClick={() => setShowNewClient(false)} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
          </div>
        </div>
      )}

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
            const isEditing = editingClient === client.email;

            return (
              <div key={client.email}>
                <div
                  onClick={() => {
                    setExpandedClient(isExpanded ? null : client.email);
                    if (!isExpanded) clientImages.forEach(img => loadSignedUrl(img.image_url));
                  }}
                  className={`border p-3 sm:p-4 cursor-pointer transition-colors ${isExpanded ? "border-gold bg-gold/5" : "border-border hover:border-gold/30"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 sm:items-center">
                    <span className="text-muted-foreground">{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gold" />
                      <span className="font-body text-sm font-medium">{client.name || "Unknown"}</span>
                    </div>
                    <a href={`mailto:${client.email}`} className="font-body text-xs hover:text-gold transition-colors flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <Mail size={12} /> {client.email}
                    </a>
                    {client.phone && (
                      <a href={`tel:${client.phone}`} className="font-body text-xs flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <Phone size={12} /> {client.phone}
                      </a>
                    )}
                    <div className="flex items-center gap-3 sm:ml-auto">
                      <span className="font-body text-xs text-muted-foreground">{client.bookingCount} bookings</span>
                      <span className="font-body text-xs font-medium text-gold">£{client.totalSpent.toFixed(0)}</span>
                      {clientNotes.length > 0 && <span className="font-body text-xs text-muted-foreground"><StickyNote size={12} className="inline" /> {clientNotes.length}</span>}
                      {clientImages.length > 0 && <span className="font-body text-xs text-muted-foreground"><Image size={12} className="inline" /> {clientImages.length}</span>}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="ml-0 sm:ml-4 border-l-2 border-gold/20 pl-3 sm:pl-4 py-3 space-y-4">
                    {/* Edit Client Info */}
                    {isEditing ? (
                      <div className="border border-gold/30 bg-gold/5 p-3 space-y-3">
                        <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground">Edit Client</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Full Name" />
                          <input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Phone" />
                          <input type="date" value={editForm.dob} onChange={e => setEditForm(p => ({ ...p, dob: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
                          <textarea value={editForm.medicalNotes} onChange={e => setEditForm(p => ({ ...p, medicalNotes: e.target.value }))} className="w-full border border-border bg-transparent px-3 py-2 font-body text-xs focus:border-gold focus:outline-none resize-none" placeholder="Medical notes" rows={2} />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(client.email)} className="px-3 py-1.5 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">Save</button>
                          <button onClick={() => setEditingClient(null)} className="px-3 py-1.5 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => startEdit(client)} className="flex items-center gap-1 px-3 py-1.5 border border-border text-muted-foreground hover:text-gold hover:border-gold font-body text-xs uppercase tracking-wider transition-colors">
                          <Pencil size={12} /> Edit Client
                        </button>
                        {client.dateOfBirth && <span className="font-body text-xs text-muted-foreground self-center">DOB: {new Date(client.dateOfBirth + "T00:00:00").toLocaleDateString("en-GB")}</span>}
                        {client.medicalNotes && <span className="font-body text-xs text-muted-foreground self-center italic">Medical: {client.medicalNotes.slice(0, 50)}...</span>}
                      </div>
                    )}

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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
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
                      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
                        <select value={imageType} onChange={e => setImageType(e.target.value as "before" | "after")}
                          className="border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none">
                          <option value="before">Before</option>
                          <option value="after">After</option>
                        </select>
                        <input value={imageTreatment} onChange={e => setImageTreatment(e.target.value)}
                          className="border border-border bg-transparent px-2 py-1 font-body text-xs focus:border-gold focus:outline-none flex-1"
                          placeholder="Treatment name" />
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                          onChange={e => { if (e.target.files?.[0]) uploadImage(client.email, e.target.files[0]); }} />
                        <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                          className="flex items-center justify-center gap-1 px-3 py-1 bg-foreground text-background font-body text-xs hover:bg-accent transition-colors disabled:opacity-50">
                          <Upload size={12} /> {uploading ? "Uploading..." : "Upload"}
                        </button>
                      </div>
                    </div>

                    {/* Last Visit + Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="font-body text-xs text-muted-foreground">
                        Last visit: {client.lastVisit ? new Date(client.lastVisit + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}
                      </p>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => navigate(`/bookings?email=${encodeURIComponent(client.email)}&name=${encodeURIComponent(client.name)}`)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 sm:py-1 border border-gold/30 text-gold hover:bg-gold/10 font-body text-xs tracking-wider uppercase transition-colors"
                        >
                          <RefreshCw size={12} /> Rebook
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm(`Delete ${client.name || client.email} and all their data (bookings, notes, images)? This cannot be undone.`)) return;
                            await Promise.all([
                              supabase.from("bookings").delete().eq("customer_email", client.email),
                              supabase.from("admin_client_notes").delete().eq("customer_email", client.email),
                              supabase.from("client_images").delete().eq("customer_email", client.email),
                              ...(client.profileId ? [supabase.from("customer_profiles").delete().eq("id", client.profileId)] : []),
                            ]);
                            setClients(prev => prev.filter(c => c.email !== client.email));
                            toast.success("Client deleted");
                          }}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 sm:py-1 border border-red-500/30 text-red-500 hover:bg-red-500/10 font-body text-xs tracking-wider uppercase transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
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
