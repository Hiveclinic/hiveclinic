import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Plus, Check, Clock, X, Search, Trash2, Printer, PenTool, Pencil, Save, Upload, Download, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type FormField = {
  type: string;
  label: string;
  required: boolean;
  [key: string]: any;
};

type FormTemplate = {
  id: string;
  name: string;
  form_type: string;
  treatment_id: string | null;
  fields: FormField[];
  active: boolean;
  version: number;
  created_at: string;
  document_url?: string | null;
};

type FormSubmission = {
  id: string;
  template_id: string | null;
  booking_id: string | null;
  customer_email: string;
  customer_name: string;
  form_data: any;
  signature_url: string | null;
  signed_at: string | null;
  practitioner_sign_off: boolean;
  status: string;
  created_at: string;
};

type Treatment = { id: string; name: string };
type ClientProfile = { id: string; email: string; full_name: string | null };

const FORM_TYPES = ["consent", "consultation", "medical_history", "photo_consent", "aftercare", "patch_test"];
const FIELD_TYPES = ["text", "textarea", "checkbox", "signature"];

// Signature Pad Component
const SignaturePad = ({ onSave, onCancel }: { onSave: (dataUrl: string) => void; onCancel: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrawing(true);
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDraw = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-3">
      <p className="font-body text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><PenTool size={12} /> E-Signature</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="w-full border border-border rounded-lg bg-white cursor-crosshair touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <div className="flex gap-2">
        <button onClick={clear} className="px-3 py-1.5 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-foreground transition-colors">Clear</button>
        <button onClick={() => onSave(canvasRef.current!.toDataURL())} className="px-3 py-1.5 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">Save Signature</button>
        <button onClick={onCancel} className="px-3 py-1.5 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-foreground transition-colors">Cancel</button>
      </div>
    </div>
  );
};

const AdminConsultationsTab = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"submissions" | "templates">("submissions");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", form_type: "consent", treatment_id: "" });
  const [signingId, setSigningId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [showNewSubmission, setShowNewSubmission] = useState(false);
  const [newSubmission, setNewSubmission] = useState({ template_id: "", client_id: "", manual_name: "", manual_email: "" });
  const [clientSearch, setClientSearch] = useState("");
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const [tRes, sRes, trRes, cRes] = await Promise.all([
        supabase.from("consent_form_templates").select("*").order("created_at", { ascending: false }),
        supabase.from("consent_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("treatments").select("id, name").eq("active", true).order("name"),
        supabase.from("customer_profiles").select("id, email, full_name").order("full_name"),
      ]);
      if (tRes.data) setTemplates(tRes.data as unknown as FormTemplate[]);
      if (sRes.data) setSubmissions(sRes.data as FormSubmission[]);
      if (trRes.data) setTreatments(trRes.data as Treatment[]);
      if (cRes.data) setClients(cRes.data as ClientProfile[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) { toast.error("Name required"); return; }
    const { data, error } = await supabase.from("consent_form_templates").insert({
      name: newTemplate.name,
      form_type: newTemplate.form_type,
      treatment_id: newTemplate.treatment_id || null,
      fields: [
        { type: "text", label: "Full Name", required: true },
        { type: "text", label: "Date of Birth", required: true },
        { type: "textarea", label: "Medical History", required: true },
        { type: "textarea", label: "Allergies", required: false },
        { type: "checkbox", label: "I confirm all information is accurate", required: true },
        { type: "signature", label: "Signature", required: true },
      ],
    }).select().single();
    if (error) { toast.error("Failed to create"); return; }
    if (data) setTemplates(prev => [data as FormTemplate, ...prev]);
    toast.success("Template created");
    setShowNewTemplate(false);
    setNewTemplate({ name: "", form_type: "consent", treatment_id: "" });
  };

  const handleUpdateTemplate = async (template: FormTemplate) => {
    const { error } = await supabase.from("consent_form_templates").update({
      name: template.name,
      form_type: template.form_type,
      treatment_id: template.treatment_id || null,
      fields: template.fields as any,
      updated_at: new Date().toISOString(),
    }).eq("id", template.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Template updated");
    setEditingTemplateId(null);
  };

  const handleDocUpload = async (templateId: string, file: File) => {
    setUploadingDocId(templateId);
    const ext = file.name.split(".").pop() || "pdf";
    const path = `${templateId}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("consent-documents").upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) { toast.error("Upload failed"); setUploadingDocId(null); return; }

    // Store path for signed URL generation
    const { error } = await supabase.from("consent_form_templates").update({
      document_url: path,
      updated_at: new Date().toISOString(),
    }).eq("id", templateId);
    if (error) { toast.error("Failed to save document reference"); setUploadingDocId(null); return; }

    setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, document_url: path } : t));
    toast.success("Document uploaded");
    setUploadingDocId(null);
  };

  const getDocDownloadUrl = async (path: string) => {
    const { data, error } = await supabase.storage.from("consent-documents").createSignedUrl(path, 3600);
    if (error || !data) { toast.error("Failed to generate download link"); return; }
    window.open(data.signedUrl, "_blank");
  };

  const handleCreateSubmission = async () => {
    if (!newSubmission.template_id) { toast.error("Select a template"); return; }
    const selectedClient = clients.find(c => c.id === newSubmission.client_id);
    const name = selectedClient?.full_name || newSubmission.manual_name;
    const email = selectedClient?.email || newSubmission.manual_email;
    if (!name || !email) { toast.error("Client name and email required"); return; }

    const template = templates.find(t => t.id === newSubmission.template_id);
    const formData: Record<string, string> = {};
    if (template?.fields) {
      template.fields.forEach((f: FormField) => {
        formData[f.label] = "";
      });
    }

    const { data, error } = await supabase.from("consent_submissions").insert({
      template_id: newSubmission.template_id,
      customer_name: name,
      customer_email: email,
      form_data: formData,
      status: "pending",
    }).select().single();
    if (error) { toast.error("Failed to create submission"); return; }
    if (data) setSubmissions(prev => [data as FormSubmission, ...prev]);
    toast.success("Submission created");
    setShowNewSubmission(false);
    setNewSubmission({ template_id: "", client_id: "", manual_name: "", manual_email: "" });
  };

  const handleSignOff = async (id: string) => {
    const { error } = await supabase.from("consent_submissions").update({
      practitioner_sign_off: true,
      practitioner_signed_at: new Date().toISOString(),
      status: "completed",
    }).eq("id", id);
    if (error) { toast.error("Failed"); return; }
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, practitioner_sign_off: true, status: "completed" } : s));
    toast.success("Signed off");
  };

  const handleSaveSignature = async (id: string, dataUrl: string) => {
    const { error } = await supabase.from("consent_submissions").update({
      signature_url: dataUrl,
      signed_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) { toast.error("Failed to save signature"); return; }
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, signature_url: dataUrl, signed_at: new Date().toISOString() } : s));
    setSigningId(null);
    toast.success("Signature saved");
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    const { error } = await supabase.from("consent_form_templates").delete().eq("id", id);
    if (error) { toast.error("Failed"); return; }
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast.success("Deleted");
  };

  const handlePrintPDF = (submission: FormSubmission) => {
    const template = templates.find(t => t.id === submission.template_id);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const formDataEntries = typeof submission.form_data === "object" && submission.form_data
      ? Object.entries(submission.form_data as Record<string, any>).map(([k, v]) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:500;width:200px">${k}</td><td style="padding:8px;border-bottom:1px solid #eee">${v}</td></tr>`).join("")
      : "<tr><td>No data</td></tr>";

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Consent Form - ${submission.customer_name}</title>
      <style>body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#333}
      h1{font-size:22px;margin-bottom:4px}h2{font-size:16px;color:#666;margin-bottom:24px}
      table{width:100%;border-collapse:collapse}
      .sig{margin-top:30px;border-top:2px solid #333;padding-top:10px}
      .meta{color:#999;font-size:12px;margin-top:40px}
      @media print{body{margin:20px}}</style></head><body>
      <h1>Hive Clinic — ${template?.name || "Consent Form"}</h1>
      <h2>${submission.customer_name} — ${format(new Date(submission.created_at), "d MMMM yyyy")}</h2>
      <table>${formDataEntries}</table>
      ${submission.signature_url ? `<div class="sig"><p style="font-size:12px;color:#666">Client Signature:</p><img src="${submission.signature_url}" style="max-height:80px" /></div>` : ""}
      <p class="meta">Status: ${submission.status} | Practitioner sign-off: ${submission.practitioner_sign_off ? "Yes" : "No"}${submission.signed_at ? ` | Signed: ${format(new Date(submission.signed_at), "d MMM yyyy HH:mm")}` : ""}</p>
      </body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const addField = (templateId: string) => {
    setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, fields: [...t.fields, { type: "text", label: "", required: false }] } : t));
  };

  const removeField = (templateId: string, index: number) => {
    setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, fields: t.fields.filter((_, i) => i !== index) } : t));
  };

  const updateField = (templateId: string, index: number, updates: Partial<FormField>) => {
    setTemplates(prev => prev.map(t => t.id === templateId ? {
      ...t,
      fields: t.fields.map((f, i) => i === index ? { ...f, ...updates } : f),
    } : t));
  };

  const filteredSubmissions = submissions.filter(s => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (search && !s.customer_name.toLowerCase().includes(search.toLowerCase()) && !s.customer_email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredClients = clients.filter(c =>
    !clientSearch || (c.full_name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.email.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  if (loading) return <div className="py-12 text-center"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-2xl">Consultations & Consent</h2>
        <div className="flex gap-2">
          <button onClick={() => setTab("submissions")} className={`px-4 py-2 font-body text-xs uppercase tracking-wider rounded-lg border transition-colors ${tab === "submissions" ? "bg-foreground text-background border-foreground" : "border-border hover:border-accent"}`}>
            Submissions ({submissions.length})
          </button>
          <button onClick={() => setTab("templates")} className={`px-4 py-2 font-body text-xs uppercase tracking-wider rounded-lg border transition-colors ${tab === "templates" ? "bg-foreground text-background border-foreground" : "border-border hover:border-accent"}`}>
            Templates ({templates.length})
          </button>
        </div>
      </div>

      {tab === "submissions" && (
        <>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setShowNewSubmission(!showNewSubmission)} className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
              <Plus size={14} /> New Submission
            </button>
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client..." className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
            </div>
            {["all", "pending", "completed"].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-2 font-body text-xs uppercase tracking-wider rounded-lg border transition-colors ${statusFilter === f ? "border-accent text-accent" : "border-border text-muted-foreground"}`}>
                {f}
              </button>
            ))}
          </div>

          {/* New Submission Form */}
          {showNewSubmission && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg">New Submission</h3>
                <button onClick={() => setShowNewSubmission(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Template</label>
                <select value={newSubmission.template_id} onChange={e => setNewSubmission(p => ({ ...p, template_id: e.target.value }))} className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background">
                  <option value="">Select template...</option>
                  {templates.filter(t => t.active).map(t => <option key={t.id} value={t.id}>{t.name} ({t.form_type.replace("_", " ")})</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Client</label>
                <input value={clientSearch} onChange={e => { setClientSearch(e.target.value); setNewSubmission(p => ({ ...p, client_id: "" })); }} placeholder="Search existing clients..." className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none mb-2" />
                {clientSearch && filteredClients.length > 0 && !newSubmission.client_id && (
                  <div className="border border-border rounded-lg max-h-32 overflow-y-auto">
                    {filteredClients.slice(0, 8).map(c => (
                      <button key={c.id} onClick={() => { setNewSubmission(p => ({ ...p, client_id: c.id })); setClientSearch(c.full_name || c.email); }} className="w-full text-left px-3 py-2 hover:bg-secondary font-body text-sm transition-colors">
                        {c.full_name || "—"} <span className="text-muted-foreground text-xs">({c.email})</span>
                      </button>
                    ))}
                  </div>
                )}
                {!newSubmission.client_id && (
                  <div className="mt-3 space-y-2">
                    <p className="font-body text-xs text-muted-foreground">Or enter manually:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input value={newSubmission.manual_name} onChange={e => setNewSubmission(p => ({ ...p, manual_name: e.target.value }))} placeholder="Client name" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
                      <input value={newSubmission.manual_email} onChange={e => setNewSubmission(p => ({ ...p, manual_email: e.target.value }))} placeholder="Client email" className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleCreateSubmission} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">Create Submission</button>
            </div>
          )}

          {filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center bg-card border border-border rounded-xl">
              <FileText size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-body text-sm text-muted-foreground">No form submissions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubmissions.map(s => (
                <div key={s.id} className="bg-card border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.status === "completed" ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                        {s.status === "completed" ? <Check size={14} className="text-green-600" /> : <Clock size={14} className="text-yellow-600" />}
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium">{s.customer_name}</p>
                        <p className="font-body text-[11px] text-muted-foreground">{s.customer_email}</p>
                      </div>
                      {expandedId === s.id ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${s.status === "completed" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>{s.status}</span>
                      {s.signature_url && <span className="font-body text-[10px] text-green-600">✓ Signed</span>}
                      <span className="font-body text-[11px] text-muted-foreground">{format(new Date(s.created_at), "d MMM yyyy")}</span>
                      <button onClick={() => handlePrintPDF(s)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Print / PDF">
                        <Printer size={14} />
                      </button>
                      {!s.signature_url && (
                        <button onClick={() => setSigningId(signingId === s.id ? null : s.id)} className="px-3 py-1 border border-border font-body text-[10px] uppercase tracking-wider rounded-lg hover:border-accent transition-colors">
                          <PenTool size={10} className="inline mr-1" /> Sign
                        </button>
                      )}
                      {s.status === "pending" && (
                        <button onClick={() => handleSignOff(s.id)} className="px-3 py-1 bg-foreground text-background font-body text-[10px] uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">
                          Sign Off
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded form data view */}
                  {expandedId === s.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground">Form Data</h4>
                      {typeof s.form_data === "object" && s.form_data ? (
                        <div className="space-y-1">
                          {Object.entries(s.form_data as Record<string, any>).map(([key, value]) => (
                            <div key={key} className="flex gap-3 py-1.5 border-b border-border/50 last:border-0">
                              <span className="font-body text-xs font-medium w-40 shrink-0">{key}</span>
                              <span className="font-body text-xs text-muted-foreground">{String(value) || "—"}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-body text-xs text-muted-foreground">No form data</p>
                      )}
                      {s.signature_url && (
                        <div>
                          <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Signature</p>
                          <img src={s.signature_url} alt="Client signature" className="max-h-16 border border-border rounded" />
                          {s.signed_at && <p className="font-body text-[10px] text-muted-foreground mt-1">Signed: {format(new Date(s.signed_at), "d MMM yyyy HH:mm")}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {signingId === s.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <SignaturePad onSave={(dataUrl) => handleSaveSignature(s.id, dataUrl)} onCancel={() => setSigningId(null)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "templates" && (
        <>
          <button onClick={() => setShowNewTemplate(!showNewTemplate)} className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
            <Plus size={14} /> New Template
          </button>

          {showNewTemplate && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <input value={newTemplate.name} onChange={e => setNewTemplate(prev => ({ ...prev, name: e.target.value }))} placeholder="Template name..." className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={newTemplate.form_type} onChange={e => setNewTemplate(prev => ({ ...prev, form_type: e.target.value }))} className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background">
                  {FORM_TYPES.map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
                <select value={newTemplate.treatment_id} onChange={e => setNewTemplate(prev => ({ ...prev, treatment_id: e.target.value }))} className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background">
                  <option value="">All treatments</option>
                  {treatments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCreateTemplate} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">Create</button>
                <button onClick={() => setShowNewTemplate(false)} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-foreground transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {templates.length === 0 ? (
            <div className="py-12 text-center bg-card border border-border rounded-xl">
              <FileText size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-body text-sm text-muted-foreground">No templates yet — create your first one</p>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map(t => (
                <div key={t.id} className="bg-card border border-border rounded-xl p-4">
                  {editingTemplateId === t.id ? (
                    /* Inline Template Editor */
                    <div className="space-y-4">
                      <input value={t.name} onChange={e => setTemplates(prev => prev.map(tp => tp.id === t.id ? { ...tp, name: e.target.value } : tp))} className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background focus:border-accent outline-none" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select value={t.form_type} onChange={e => setTemplates(prev => prev.map(tp => tp.id === t.id ? { ...tp, form_type: e.target.value } : tp))} className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background">
                          {FORM_TYPES.map(ft => <option key={ft} value={ft}>{ft.replace("_", " ")}</option>)}
                        </select>
                        <select value={t.treatment_id || ""} onChange={e => setTemplates(prev => prev.map(tp => tp.id === t.id ? { ...tp, treatment_id: e.target.value || null } : tp))} className="px-4 py-2.5 border border-border rounded-lg font-body text-sm bg-background">
                          <option value="">All treatments</option>
                          {treatments.map(tr => <option key={tr.id} value={tr.id}>{tr.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider">Fields</label>
                          <button onClick={() => addField(t.id)} className="flex items-center gap-1 px-2 py-1 border border-border rounded font-body text-[10px] uppercase tracking-wider hover:border-accent transition-colors">
                            <Plus size={10} /> Add Field
                          </button>
                        </div>
                        <div className="space-y-2">
                          {t.fields.map((field, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input value={field.label} onChange={e => updateField(t.id, idx, { label: e.target.value })} placeholder="Field label" className="flex-1 px-3 py-1.5 border border-border rounded font-body text-xs bg-background focus:border-accent outline-none" />
                              <select value={field.type} onChange={e => updateField(t.id, idx, { type: e.target.value })} className="px-2 py-1.5 border border-border rounded font-body text-xs bg-background">
                                {FIELD_TYPES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                              </select>
                              <label className="flex items-center gap-1 font-body text-[10px] text-muted-foreground whitespace-nowrap">
                                <input type="checkbox" checked={field.required} onChange={e => updateField(t.id, idx, { required: e.target.checked })} className="accent-accent" />
                                Req
                              </label>
                              <button onClick={() => removeField(t.id, idx)} className="text-muted-foreground hover:text-red-500"><X size={12} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateTemplate(t)} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">
                          <Save size={10} className="inline mr-1" /> Save
                        </button>
                        <button onClick={() => setEditingTemplateId(null)} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-foreground transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* Template Card View */
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-accent" />
                        <div>
                          <p className="font-body text-sm font-medium">{t.name}</p>
                          <p className="font-body text-[11px] text-muted-foreground">{t.form_type.replace("_", " ")} — v{t.version} — {t.fields.length} fields</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {t.document_url && (
                          <button onClick={() => getDocDownloadUrl(t.document_url!)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Download document">
                            <Download size={14} />
                          </button>
                        )}
                        <label className={`p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${uploadingDocId === t.id ? "animate-pulse" : ""}`} title="Upload PDF">
                          <Upload size={14} />
                          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { if (e.target.files?.[0]) handleDocUpload(t.id, e.target.files[0]); }} disabled={uploadingDocId === t.id} />
                        </label>
                        <button onClick={() => setEditingTemplateId(t.id)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${t.active ? "bg-green-500/10 text-green-600" : "bg-secondary text-muted-foreground"}`}>{t.active ? "Active" : "Inactive"}</span>
                        <button onClick={() => handleDeleteTemplate(t.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminConsultationsTab;
