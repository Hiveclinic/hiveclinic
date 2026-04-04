import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Send } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";
import { toast } from "sonner";

const TOTAL_STEPS = 7;

const ConsentForm = () => {
  usePageMeta(
    "Medical & Consent Form | Hive Clinic Manchester",
    "Complete your medical and consent form digitally before your appointment at Hive Clinic, Manchester."
  );

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Treatment type
  const [treatmentType, setTreatmentType] = useState("");
  const [treatments, setTreatments] = useState<{ id: string; name: string; category: string }[]>([]);

  // Section 1 – Personal Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    supabase
      .from("treatments")
      .select("id, name, category")
      .eq("active", true)
      .order("category")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setTreatments(data);
      });
  }, []);

  // Section 2 – Medical Information
  const [medicalConditions, setMedicalConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [pregnant, setPregnant] = useState<"yes" | "no" | "">("");
  const [previousTreatment, setPreviousTreatment] = useState<"yes" | "no" | "">("");

  // Section 4 – Risks & Liability (required checkboxes)
  const [resultsVary, setResultsVary] = useState(false);
  const [risksUnderstood, setRisksUnderstood] = useState(false);
  const [disclosedAll, setDisclosedAll] = useState(false);
  const [treatmentRefused, setTreatmentRefused] = useState(false);
  const [consentTreatment, setConsentTreatment] = useState(false);

  // Section 5 – GDPR
  const [gdprConsent, setGdprConsent] = useState(false);

  // Section 6 – Marketing (optional)
  const [consentPhotos, setConsentPhotos] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentWithdraw, setConsentWithdraw] = useState(false);

  // Section 7 – Signature
  const [signatureName, setSignatureName] = useState("");

  const sectionStyle = "border border-border p-6 md:p-8 bg-card";
  const headingStyle = "font-display text-2xl mb-1";
  const subStyle = "font-body text-sm text-muted-foreground mb-6";
  const labelStyle = "font-body text-sm block mb-2";
  const inputStyle =
    "w-full border border-border bg-transparent px-4 py-3.5 font-body text-sm focus:border-gold focus:outline-none transition-colors";
  const checkboxRow = "flex items-start gap-3 py-2.5 cursor-pointer";
  const checkboxStyle = "mt-0.5 h-5 w-5 shrink-0 accent-gold cursor-pointer";
  const radioRow = "flex items-center gap-3 py-2 cursor-pointer";

  const canGoNext = (): boolean => {
    switch (step) {
      case 1:
        return (
          fullName.trim().length > 1 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
          phone.trim().length >= 10 &&
          !!dob &&
          !!treatmentType
        );
      case 2:
        return pregnant !== "" && previousTreatment !== "";
      case 3:
        return true; // read-only statement
      case 4:
        return resultsVary && risksUnderstood && disclosedAll && treatmentRefused && consentTreatment;
      case 5:
        return gdprConsent;
      case 6:
        return true; // optional
      case 7:
        return signatureName.trim().length > 1;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext()) {
      toast.error("Please complete all required fields.");
      return;
    }
    setSubmitting(true);

    const now = new Date().toISOString();
    const formData = {
      treatmentType,
      personal: { fullName, email, phone, dob },
      medical: { medicalConditions, medications, allergies, pregnant, previousTreatment },
      risksConsent: { resultsVary, risksUnderstood, disclosedAll, treatmentRefused, consentTreatment },
      gdprConsent,
      marketing: { consentPhotos, consentMarketing, consentWithdraw },
      signature: { name: signatureName, date: now },
    };

    try {
      // Save to database
      const { error } = await supabase.from("consent_submissions").insert({
        customer_name: fullName,
        customer_email: email,
        form_data: formData,
        signed_at: now,
        status: "signed",
      });
      if (error) throw error;

      // Send admin email
      const adminHtml = buildAdminEmail(formData);
      supabase.functions.invoke("send-email", {
        body: {
          to: "hello@hiveclinicuk.com",
          subject: `📋 New Consent Form — ${fullName}`,
          html: adminHtml,
        },
      });

      // Send client confirmation email
      const clientHtml = buildClientEmail(formData);
      supabase.functions.invoke("send-email", {
        body: {
          to: email,
          subject: "Your Hive Clinic Consent Form Confirmation",
          html: clientHtml,
        },
      });

      setSubmitted(true);
      toast.success("Consent form submitted successfully!");
    } catch {
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-24">
          <div className="max-w-lg mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-gold" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl mb-4">Forms Submitted</h1>
              <p className="font-body text-muted-foreground mb-4">
                Your forms have been successfully submitted.
              </p>
              <p className="font-body text-sm text-muted-foreground">
                A confirmation email has been sent to <strong>{email}</strong>. If you have any questions, please contact us at{" "}
                <a href="mailto:hello@hiveclinicuk.com" className="text-gold underline">hello@hiveclinicuk.com</a>.
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl md:text-5xl mb-2">Hive Clinic</h1>
              <h2 className="font-display text-xl md:text-2xl text-gold mb-4">Medical & Consent Form</h2>
              <div className="w-16 h-[1px] bg-gold mx-auto" />
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-8">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                const s = i + 1;
                const isActive = s === step;
                const isDone = s < step;
                return (
                  <button
                    key={s}
                    onClick={() => s < step && setStep(s)}
                    className={`w-9 h-9 rounded-full text-xs font-body font-medium flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-gold text-white"
                        : isDone
                        ? "bg-gold/20 text-gold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check size={14} /> : s}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* STEP 1 – Personal Details */}
                {step === 1 && (
                  <div className={sectionStyle}>
                    <h3 className={headingStyle}>Personal Details</h3>
                    <p className={subStyle}>Please provide your contact information.</p>
                    <div className="space-y-4">
                      <div>
                        <label className={labelStyle}>Full Name *</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputStyle} placeholder="Your full name" />
                      </div>
                      <div>
                        <label className={labelStyle}>Email Address *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyle} placeholder="you@email.com" />
                      </div>
                      <div>
                        <label className={labelStyle}>Phone Number *</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputStyle} placeholder="07xxx xxxxxx" />
                      </div>
                      <div>
                        <label className={labelStyle}>Date of Birth *</label>
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputStyle} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 – Medical Information */}
                {step === 2 && (
                  <div className={sectionStyle}>
                    <h3 className={headingStyle}>Medical Information</h3>
                    <p className={subStyle}>Please provide accurate medical information for your safety.</p>
                    <div className="space-y-4">
                      <div>
                        <label className={labelStyle}>Do you have any medical conditions?</label>
                        <textarea value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} rows={3} className={`${inputStyle} resize-none`} placeholder="Please list any conditions or write 'None'" />
                      </div>
                      <div>
                        <label className={labelStyle}>Are you currently taking any medication?</label>
                        <textarea value={medications} onChange={(e) => setMedications(e.target.value)} rows={3} className={`${inputStyle} resize-none`} placeholder="Please list any medications or write 'None'" />
                      </div>
                      <div>
                        <label className={labelStyle}>Do you have any allergies?</label>
                        <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} rows={3} className={`${inputStyle} resize-none`} placeholder="Please list any allergies or write 'None'" />
                      </div>
                      <div>
                        <label className={labelStyle}>Are you pregnant or breastfeeding? *</label>
                        <div className="flex gap-6">
                          <label className={radioRow}>
                            <input type="radio" name="pregnant" checked={pregnant === "yes"} onChange={() => setPregnant("yes")} className={checkboxStyle} />
                            <span className="font-body text-sm">Yes</span>
                          </label>
                          <label className={radioRow}>
                            <input type="radio" name="pregnant" checked={pregnant === "no"} onChange={() => setPregnant("no")} className={checkboxStyle} />
                            <span className="font-body text-sm">No</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className={labelStyle}>Have you had this treatment before? *</label>
                        <div className="flex gap-6">
                          <label className={radioRow}>
                            <input type="radio" name="previousTreatment" checked={previousTreatment === "yes"} onChange={() => setPreviousTreatment("yes")} className={checkboxStyle} />
                            <span className="font-body text-sm">Yes</span>
                          </label>
                          <label className={radioRow}>
                            <input type="radio" name="previousTreatment" checked={previousTreatment === "no"} onChange={() => setPreviousTreatment("no")} className={checkboxStyle} />
                            <span className="font-body text-sm">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 – Treatment Understanding */}
                {step === 3 && (
                  <div className={sectionStyle}>
                    <h3 className={headingStyle}>Treatment Understanding</h3>
                    <p className={subStyle}>Please read the following statement carefully.</p>
                    <div className="bg-secondary/50 border border-border p-5">
                      <p className="font-body text-sm leading-relaxed">
                        "I confirm that I understand the nature of the treatment, including potential risks, side effects, and expected outcomes."
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4 – Risks & Liability */}
                {step === 4 && (
                  <div className={sectionStyle}>
                    <h3 className={headingStyle}>Risks & Liability Consent</h3>
                    <p className={subStyle}>All of the following must be agreed before proceeding.</p>
                    <div className="space-y-1">
                      {[
                        { label: "I understand that results may vary and are not guaranteed *", state: resultsVary, set: setResultsVary },
                        { label: "I understand the potential risks and side effects *", state: risksUnderstood, set: setRisksUnderstood },
                        { label: "I confirm I have disclosed all relevant medical information *", state: disclosedAll, set: setDisclosedAll },
                        { label: "I understand that treatment may be refused if deemed unsuitable *", state: treatmentRefused, set: setTreatmentRefused },
                        { label: "I consent to the treatment being carried out *", state: consentTreatment, set: setConsentTreatment },
                      ].map(({ label, state, set }) => (
                        <label key={label} className={checkboxRow}>
                          <input type="checkbox" checked={state} onChange={(e) => set(e.target.checked)} className={checkboxStyle} />
                          <span className="font-body text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5 – GDPR */}
                {step === 5 && (
                  <div className={sectionStyle}>
                    <h3 className={headingStyle}>Data Protection (GDPR)</h3>
                    <p className={subStyle}>Your data is stored securely and used only for treatment purposes.</p>
                    <label className={checkboxRow}>
                      <input type="checkbox" checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className={checkboxStyle} />
                      <span className="font-body text-sm">I consent to Hive Clinic storing my personal and medical information for treatment purposes *</span>
                    </label>
                  </div>
                )}

                {/* STEP 6 – Marketing (Optional) */}
                {step === 6 && (
                  <div className={sectionStyle}>
                    <h3 className={headingStyle}>Marketing & Media Consent</h3>
                    <p className={subStyle}>These are optional — you can skip this step.</p>
                    <div className="space-y-1">
                      <label className={checkboxRow}>
                        <input type="checkbox" checked={consentPhotos} onChange={(e) => setConsentPhotos(e.target.checked)} className={checkboxStyle} />
                        <span className="font-body text-sm">I consent to before and after photos being taken</span>
                      </label>
                      <label className={checkboxRow}>
                        <input type="checkbox" checked={consentMarketing} onChange={(e) => setConsentMarketing(e.target.checked)} className={checkboxStyle} />
                        <span className="font-body text-sm">I consent to images/videos being used for marketing purposes</span>
                      </label>
                      <label className={checkboxRow}>
                        <input type="checkbox" checked={consentWithdraw} onChange={(e) => setConsentWithdraw(e.target.checked)} className={checkboxStyle} />
                        <span className="font-body text-sm">I understand I can withdraw consent at any time</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 7 – Signature */}
                {step === 7 && (
                  <div className={sectionStyle}>
                    <h3 className={headingStyle}>Digital Signature</h3>
                    <p className={subStyle}>Type your full name below as your digital signature.</p>
                    <div className="space-y-4">
                      <div>
                        <label className={labelStyle}>Full Name (Digital Signature) *</label>
                        <input type="text" value={signatureName} onChange={(e) => setSignatureName(e.target.value)} className={inputStyle} placeholder="Type your full name" />
                      </div>
                      <div className="bg-secondary/50 border border-border p-4">
                        <p className="font-body text-sm">
                          <strong>Date:</strong> {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="bg-secondary/30 border border-border p-4">
                        <p className="font-body text-sm italic leading-relaxed">
                          "I confirm that the information provided is accurate and I agree to proceed."
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={14} /> Back
              </button>

              {step < TOTAL_STEPS ? (
                <button
                  onClick={() => canGoNext() && setStep((s) => s + 1)}
                  disabled={!canGoNext()}
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-40"
                >
                  Next <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !canGoNext()}
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-40"
                >
                  {submitting ? <span className="animate-pulse">Submitting…</span> : <><Send size={14} /> Submit</>}
                </button>
              )}
            </div>

            <p className="font-body text-xs text-muted-foreground text-center mt-4">
              Step {step} of {TOTAL_STEPS}
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

/* ── Email builders ── */

function yesNo(v: string) {
  return v === "yes" ? "Yes" : v === "no" ? "No" : "Not answered";
}
function tick(v: boolean) {
  return v ? "✅ Yes" : "❌ No";
}

function buildAdminEmail(d: any) {
  const p = d.personal;
  const m = d.medical;
  const r = d.risksConsent;
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
  <h1 style="font-size:22px;color:#0d0d0d;border-bottom:2px solid #b8860b;padding-bottom:10px">📋 New Consent Form Submission</h1>
  <p style="color:#666;font-size:13px">Submitted: ${new Date().toLocaleString("en-GB")}</p>

  <h2 style="font-size:16px;margin-top:20px;color:#b8860b">Personal Details</h2>
  <table style="width:100%;font-size:13px;border-collapse:collapse">
    <tr><td style="padding:4px 8px;font-weight:bold">Name</td><td>${p.fullName}</td></tr>
    <tr><td style="padding:4px 8px;font-weight:bold">Email</td><td>${p.email}</td></tr>
    <tr><td style="padding:4px 8px;font-weight:bold">Phone</td><td>${p.phone}</td></tr>
    <tr><td style="padding:4px 8px;font-weight:bold">DOB</td><td>${p.dob}</td></tr>
  </table>

  <h2 style="font-size:16px;margin-top:20px;color:#b8860b">Medical Information</h2>
  <table style="width:100%;font-size:13px;border-collapse:collapse">
    <tr><td style="padding:4px 8px;font-weight:bold">Conditions</td><td>${m.medicalConditions || "None"}</td></tr>
    <tr><td style="padding:4px 8px;font-weight:bold">Medications</td><td>${m.medications || "None"}</td></tr>
    <tr><td style="padding:4px 8px;font-weight:bold">Allergies</td><td>${m.allergies || "None"}</td></tr>
    <tr><td style="padding:4px 8px;font-weight:bold">Pregnant/Breastfeeding</td><td>${yesNo(m.pregnant)}</td></tr>
    <tr><td style="padding:4px 8px;font-weight:bold">Previous Treatment</td><td>${yesNo(m.previousTreatment)}</td></tr>
  </table>

  <h2 style="font-size:16px;margin-top:20px;color:#b8860b">Consent Responses</h2>
  <table style="width:100%;font-size:13px;border-collapse:collapse">
    <tr><td style="padding:4px 8px">Results may vary</td><td>${tick(r.resultsVary)}</td></tr>
    <tr><td style="padding:4px 8px">Risks understood</td><td>${tick(r.risksUnderstood)}</td></tr>
    <tr><td style="padding:4px 8px">Disclosed all info</td><td>${tick(r.disclosedAll)}</td></tr>
    <tr><td style="padding:4px 8px">Treatment may be refused</td><td>${tick(r.treatmentRefused)}</td></tr>
    <tr><td style="padding:4px 8px">Consent to treatment</td><td>${tick(r.consentTreatment)}</td></tr>
  </table>

  <h2 style="font-size:16px;margin-top:20px;color:#b8860b">Data & Marketing</h2>
  <p style="font-size:13px">GDPR Consent: ${tick(d.gdprConsent)}</p>
  <p style="font-size:13px">Photos: ${tick(d.marketing.consentPhotos)} | Marketing: ${tick(d.marketing.consentMarketing)} | Withdraw understood: ${tick(d.marketing.consentWithdraw)}</p>

  <h2 style="font-size:16px;margin-top:20px;color:#b8860b">Signature</h2>
  <p style="font-size:13px"><strong>${d.signature.name}</strong> — ${new Date(d.signature.date).toLocaleString("en-GB")}</p>
</div>`;
}

function buildClientEmail(d: any) {
  const p = d.personal;
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
  <h1 style="font-size:22px;color:#0d0d0d;border-bottom:2px solid #b8860b;padding-bottom:10px">Hive Clinic</h1>
  <h2 style="font-size:18px;color:#b8860b;margin-top:16px">Consent Form Confirmation</h2>

  <p style="font-size:14px;color:#333;line-height:1.6">
    Dear ${p.fullName},<br/><br/>
    Thank you for completing your medical and consent form. We have received your submission and it has been securely stored.
  </p>

  <div style="background:#f8f6f0;padding:16px;margin:20px 0;border-left:3px solid #b8860b">
    <p style="font-size:13px;margin:0"><strong>Your Details</strong></p>
    <p style="font-size:13px;margin:4px 0">Name: ${p.fullName}</p>
    <p style="font-size:13px;margin:4px 0">Email: ${p.email}</p>
    <p style="font-size:13px;margin:4px 0">Phone: ${p.phone}</p>
    <p style="font-size:13px;margin:4px 0">Signed: ${new Date(d.signature.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
  </div>

  <p style="font-size:14px;color:#333;line-height:1.6">
    If you have any questions or need to update your information, please don't hesitate to contact us.
  </p>

  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #eee">
    <p style="font-size:13px;color:#666;margin:2px 0"><strong>Hive Clinic</strong></p>
    <p style="font-size:13px;color:#666;margin:2px 0">Manchester City Centre</p>
    <p style="font-size:13px;color:#666;margin:2px 0">Email: hello@hiveclinicuk.com</p>
    <p style="font-size:13px;color:#666;margin:2px 0">Web: hiveclinicuk.com</p>
  </div>
</div>`;
}

export default ConsentForm;
