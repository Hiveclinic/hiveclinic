import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Download, Send } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";
import { toast } from "sonner";

const ConsentForm = () => {
  usePageMeta(
    "Consent Form | Hive Clinic Manchester",
    "Complete your treatment consent form digitally before your appointment at Hive Clinic, Manchester."
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Client info
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Medical
  const [pregnant, setPregnant] = useState(false);
  const [allergies, setAllergies] = useState(false);
  const [autoimmune, setAutoimmune] = useState(false);
  const [keloid, setKeloid] = useState(false);
  const [skinInfections, setSkinInfections] = useState(false);
  const [bloodThinners, setBloodThinners] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState(false);
  const [medicationsList, setMedicationsList] = useState("");

  // Consents
  const [understandTreatment, setUnderstandTreatment] = useState(false);
  const [understandResults, setUnderstandResults] = useState(false);
  const [understandMultiple, setUnderstandMultiple] = useState(false);
  const [understandDiscussed, setUnderstandDiscussed] = useState(false);
  const [understandRisks, setUnderstandRisks] = useState(false);
  const [understandAftercare, setUnderstandAftercare] = useState(false);
  const [understandNoGuarantee, setUnderstandNoGuarantee] = useState(false);
  const [understandRefusal, setUnderstandRefusal] = useState(false);
  const [consentPhotos, setConsentPhotos] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [understandPayment, setUnderstandPayment] = useState(false);
  const [declaration, setDeclaration] = useState(false);

  // Signature canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#0d0d0d";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, []);

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
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const endDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const isValid = () => {
    return (
      fullName.trim().length > 1 &&
      dob &&
      phone.trim().length >= 10 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      understandTreatment &&
      understandResults &&
      understandDiscussed &&
      understandRisks &&
      understandAftercare &&
      understandNoGuarantee &&
      understandRefusal &&
      consentPhotos &&
      understandPayment &&
      declaration &&
      hasSigned
    );
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      toast.error("Please complete all required fields and sign the form.");
      return;
    }
    setSubmitting(true);

    const signatureData = canvasRef.current?.toDataURL("image/png") || "";

    const formData = {
      client_info: { fullName, dob, address, phone, email, emergencyName, emergencyPhone },
      medical: { pregnant, allergies, autoimmune, keloid, skinInfections, bloodThinners, diabetes, medicalConditions, medicationsList },
      consents: {
        understandTreatment, understandResults, understandMultiple, understandDiscussed,
        understandRisks, understandAftercare, understandNoGuarantee, understandRefusal,
        consentPhotos, consentMarketing, understandPayment, declaration,
      },
    };

    try {
      const { error } = await supabase.from("consent_submissions").insert({
        customer_name: fullName,
        customer_email: email,
        form_data: formData,
        signature_url: signatureData,
        signed_at: new Date().toISOString(),
        status: "signed",
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Consent form submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => window.print();

  const sectionStyle = "border border-border p-6 md:p-8";
  const headingStyle = "font-display text-2xl mb-4";
  const labelStyle = "font-body text-sm block mb-2";
  const inputStyle = "w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors";
  const checkboxRow = "flex items-start gap-3 py-2";
  const checkboxStyle = "mt-0.5 h-4 w-4 shrink-0 accent-gold";

  if (submitted) {
    return (
      <Layout>
        <section className="py-24">
          <div className="max-w-lg mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-gold" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl mb-4">Form Submitted</h1>
              <p className="font-body text-muted-foreground mb-8">
                Thank you, {fullName}. Your consent form has been received. You're all set for your appointment.
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24 print:py-4">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="text-center mb-12 print:mb-6">
              <h1 className="font-display text-4xl md:text-5xl mb-2">Hive Clinic</h1>
              <h2 className="font-display text-2xl md:text-3xl text-gold mb-4">Master Treatment Consent Form</h2>
              <div className="w-16 h-[1px] bg-gold mx-auto mb-4" />
              <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">
                This consent form applies to aesthetic treatments including but not limited to: dermal filler, anti-wrinkle injections, skin boosters, polynucleotides, microneedling, chemical peels, hydrofacial treatments, fat dissolving injections, sclerotherapy, PRP treatments, facials and skin treatments.
              </p>
            </div>

            <div className="space-y-8">
              {/* Section 1: Client Information */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>1. Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Full Name *</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Date of Birth *</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputStyle} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Address</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Phone Number *</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Email Address *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Emergency Contact Name</label>
                    <input type="text" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Emergency Contact Phone</label>
                    <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} className={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Section 2: Medical Questionnaire */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>2. Medical Questionnaire</h3>
                <div className="space-y-1">
                  {[
                    { label: "Are you pregnant or breastfeeding?", state: pregnant, set: setPregnant },
                    { label: "Do you have any allergies (especially lidocaine or medications)?", state: allergies, set: setAllergies },
                    { label: "Do you suffer from autoimmune disorders?", state: autoimmune, set: setAutoimmune },
                    { label: "Do you have a history of keloid scarring?", state: keloid, set: setKeloid },
                    { label: "Do you have active skin infections or cold sores?", state: skinInfections, set: setSkinInfections },
                    { label: "Do you take blood thinning medication?", state: bloodThinners, set: setBloodThinners },
                    { label: "Do you have diabetes?", state: diabetes, set: setDiabetes },
                    { label: "Do you have any known medical conditions?", state: medicalConditions, set: setMedicalConditions },
                  ].map(({ label, state, set }) => (
                    <label key={label} className={checkboxRow}>
                      <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className={checkboxStyle} />
                      <span className="font-body text-sm">{label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <label className={labelStyle}>Please list all medications, supplements, and relevant medical conditions:</label>
                  <textarea value={medicationsList} onChange={e => setMedicationsList(e.target.value)} rows={4} className={`${inputStyle} resize-none`} />
                </div>
              </div>

              {/* Section 3: Treatment Understanding */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>3. Treatment Understanding</h3>
                <div className="space-y-1">
                  {[
                    { label: "I confirm that I have had the opportunity to discuss the treatment with my practitioner.", state: understandDiscussed, set: setUnderstandDiscussed },
                    { label: "I understand the nature of the treatment and the procedure being performed.", state: understandTreatment, set: setUnderstandTreatment },
                    { label: "I understand that results vary between individuals and cannot be guaranteed.", state: understandResults, set: setUnderstandResults },
                    { label: "I understand that multiple sessions may be required to achieve desired outcomes.", state: understandMultiple, set: setUnderstandMultiple },
                  ].map(({ label, state, set }) => (
                    <label key={label} className={checkboxRow}>
                      <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className={checkboxStyle} />
                      <span className="font-body text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 4: Risks and Side Effects */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>4. Risks and Side Effects</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Possible risks include: swelling, redness, bruising, tenderness, temporary lumps or irregularities, skin sensitivity, peeling or dryness, temporary breakouts or purging, infection, and rare vascular complications in injectable treatments.
                </p>
                <label className={checkboxRow}>
                  <input type="checkbox" checked={understandRisks} onChange={e => setUnderstandRisks(e.target.checked)} className={checkboxStyle} />
                  <span className="font-body text-sm">I understand these risks and confirm that they have been explained to me prior to treatment. *</span>
                </label>
              </div>

              {/* Section 5: Aftercare */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>5. Aftercare Responsibility</h3>
                <label className={checkboxRow}>
                  <input type="checkbox" checked={understandAftercare} onChange={e => setUnderstandAftercare(e.target.checked)} className={checkboxStyle} />
                  <span className="font-body text-sm">I understand that following the aftercare advice given by Hive Clinic is essential for safe healing and optimal results. Failure to follow aftercare instructions may affect treatment outcomes. *</span>
                </label>
              </div>

              {/* Section 6: No Guarantee */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>6. No Guarantee Clause</h3>
                <label className={checkboxRow}>
                  <input type="checkbox" checked={understandNoGuarantee} onChange={e => setUnderstandNoGuarantee(e.target.checked)} className={checkboxStyle} />
                  <span className="font-body text-sm">I understand that aesthetic treatments aim to improve appearance but results cannot be guaranteed. Hive Clinic does not guarantee specific outcomes. *</span>
                </label>
              </div>

              {/* Section 7: Treatment Refusal */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>7. Treatment Refusal Rights</h3>
                <label className={checkboxRow}>
                  <input type="checkbox" checked={understandRefusal} onChange={e => setUnderstandRefusal(e.target.checked)} className={checkboxStyle} />
                  <span className="font-body text-sm">I acknowledge that Hive Clinic reserves the right to refuse or discontinue treatment if it is deemed unsuitable or unsafe. *</span>
                </label>
              </div>

              {/* Section 8: Photography */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>8. Photography and Marketing Consent</h3>
                <div className="space-y-1">
                  <label className={checkboxRow}>
                    <input type="checkbox" checked={consentPhotos} onChange={e => setConsentPhotos(e.target.checked)} className={checkboxStyle} />
                    <span className="font-body text-sm">I consent to clinical photographs being taken for medical records. *</span>
                  </label>
                  <label className={checkboxRow}>
                    <input type="checkbox" checked={consentMarketing} onChange={e => setConsentMarketing(e.target.checked)} className={checkboxStyle} />
                    <span className="font-body text-sm">I consent to my photographs or videos being used for educational and marketing purposes including website, Instagram, advertising, and training materials. (Optional)</span>
                  </label>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-3 italic">
                  Images used publicly will not identify the client unless written permission is given.
                </p>
              </div>

              {/* Section 9: Payment Policy */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>9. Payment and Appointment Policy</h3>
                <label className={checkboxRow}>
                  <input type="checkbox" checked={understandPayment} onChange={e => setUnderstandPayment(e.target.checked)} className={checkboxStyle} />
                  <span className="font-body text-sm">I acknowledge that booking fees are non-refundable, late cancellations or missed appointments may result in booking fee loss, and full payment is required before treatment unless a payment plan has been agreed. *</span>
                </label>
              </div>

              {/* Section 10: Declaration */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>10. Client Declaration</h3>
                <label className={checkboxRow}>
                  <input type="checkbox" checked={declaration} onChange={e => setDeclaration(e.target.checked)} className={checkboxStyle} />
                  <span className="font-body text-sm">I confirm that the information provided is accurate and complete. I confirm that I have read and understood this consent form. I agree to proceed with treatment. *</span>
                </label>
              </div>

              {/* Signature */}
              <div className={sectionStyle}>
                <h3 className={headingStyle}>Signature</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">Please sign below using your finger or mouse.</p>
                <div className="border border-border bg-white">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="w-full cursor-crosshair touch-none"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                  />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button onClick={clearSignature} className="font-body text-xs text-muted-foreground hover:text-foreground underline">
                    Clear Signature
                  </button>
                  {hasSigned && (
                    <span className="font-body text-xs text-gold flex items-center gap-1">
                      <Check size={12} /> Signed
                    </span>
                  )}
                </div>
                <p className="font-body text-sm mt-4"><strong>Date:</strong> {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !isValid()}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-40"
                >
                  {submitting ? <span className="animate-pulse">Submitting...</span> : <><Send size={14} /> Submit Consent Form</>}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-8 py-4 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors"
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ConsentForm;
