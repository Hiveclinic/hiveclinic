import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const treatments = [
  "Lip Fillers",
  "Anti-Wrinkle Injections",
  "Dermal Filler (Cheeks/Jawline/Chin)",
  "HydraFacial",
  "Chemical Peel",
  "Microneedling",
  "Fat Dissolve",
  "Skin Boosters",
];

const AIAftercare = () => {
  const [treatment, setTreatment] = useState("");
  const [concerns, setConcerns] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!treatment) {
      toast.error("Please select a treatment first.");
      return;
    }

    setLoading(true);
    setAdvice("");

    const { data, error } = await supabase.functions.invoke("ai-aftercare", {
      body: { treatment, concerns: concerns.trim() || undefined },
    });

    setLoading(false);

    if (error || data?.error) {
      toast.error(data?.error || "Something went wrong. Please try again.");
      return;
    }

    setAdvice(data.advice);
  };

  return (
    <div className="border border-gold/30 p-8 md:p-10">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles size={18} className="text-gold" />
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold">AI-Powered</p>
      </div>
      <h2 className="font-display text-3xl mb-3">Personalised Aftercare</h2>
      <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
        Get tailored aftercare advice based on your specific treatment and concerns.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="font-body text-sm uppercase tracking-wider mb-2 block">Treatment</label>
          <select
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors appearance-none"
          >
            <option value="">Select your treatment</option>
            {treatments.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-body text-sm uppercase tracking-wider mb-2 block">
            Specific Concerns <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            placeholder="e.g. I have sensitive skin, slight bruising, first time having this treatment..."
            rows={3}
            maxLength={500}
            className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !treatment}
          className="w-full px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating Advice...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Get Personalised Advice
            </>
          )}
        </button>
      </div>

      {advice && (
        <div className="bg-secondary p-6 md:p-8 mt-6">
          <h3 className="font-display text-lg mb-4">Your Personalised Aftercare Plan</h3>
          <div className="font-body text-sm text-foreground/80 leading-relaxed prose prose-sm max-w-none [&_h2]:font-display [&_h2]:text-base [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:font-display [&_h3]:text-sm [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:space-y-1 [&_p]:mb-2 [&_strong]:font-semibold">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAftercare;
