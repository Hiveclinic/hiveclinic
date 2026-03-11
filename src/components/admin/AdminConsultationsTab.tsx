import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Plus, Check, Clock, X, Search, Trash2, Printer, PenTool } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type FormTemplate = {
  id: string;
  name: string;
  form_type: string;
  treatment_id: string | null;
  fields: any[];
  active: boolean;
  version: number;
  created_at: string;
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

const FORM_TYPES = ["consent", "consultation", "medical_history", "photo_consent", "aftercare", "patch_test"];

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
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"submissions" | "templates">("submissions");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", form_type: "consent", treatment_id: "" });
  const [signingId, setSigningId] = useState<string | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const [tRes, sRes, trRes] = await Promise.all([
        supabase.from("consent_form_templates").select("*").order("created_at", { ascending: false }),
        supabase.from("consent_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("treatments").select("id, name").eq("active", true).order("name"),
      ]);
      if (tRes.data) setTemplates(tRes.data as FormTemplate[]);
      if (sRes.data) setSubmissions(sRes.data as FormSubmission[]);
      if (trRes.data) setTreatments(trRes.data as Treatment[]);
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

  const filteredSubmissions = submissions.filter(s => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (search && !s.customer_name.toLowerCase().includes(search.toLowerCase()) && !s.customer_email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.status === "completed" ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                        {s.status === "completed" ? <Check size={14} className="text-green-600" /> : <Clock size={14} className="text-yellow-600" />}
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium">{s.customer_name}</p>
                        <p className="font-body text-[11px] text-muted-foreground">{s.customer_email}</p>
                      </div>
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
                <div key={t.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-accent" />
                    <div>
                      <p className="font-body text-sm font-medium">{t.name}</p>
                      <p className="font-body text-[11px] text-muted-foreground">{t.form_type.replace("_", " ")} — v{t.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${t.active ? "bg-green-500/10 text-green-600" : "bg-secondary text-muted-foreground"}`}>{t.active ? "Active" : "Inactive"}</span>
                    <button onClick={() => handleDeleteTemplate(t.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
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
