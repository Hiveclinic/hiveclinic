import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const questions = [
  {
    q: "What's your main skin concern?",
    options: ["Fine lines & wrinkles", "Volume loss or facial contouring", "Dull / tired skin", "Acne scarring or texture", "Stubborn fat areas", "Pigmentation or uneven tone"],
  },
  {
    q: "What's your goal?",
    options: ["Preventative care", "Subtle enhancement", "Noticeable transformation", "Skin health & glow", "Body contouring"],
  },
  {
    q: "How much downtime can you manage?",
    options: ["None at all", "A day or two", "Up to a week", "Flexible"],
  },
  {
    q: "What's your budget range?",
    options: ["Under £150", "£150 - £300", "£300 - £500", "£500+"],
  },
];

const recommendations: Record<string, { category: string; description: string }> = {
  "Fine lines & wrinkles": { category: "Anti-Wrinkle", description: "Precision anti-wrinkle injections to smooth lines and refresh your look - from brow lifts to full facial treatments." },
  "Volume loss or facial contouring": { category: "Dermal Filler", description: "Expert filler treatments for lips, cheeks, jawline, and facial balancing packages for natural contouring." },
  "Dull / tired skin": { category: "HydraFacial", description: "Deep cleansing facials like Glass Skin Boost and Glow Reset to bring back your radiance." },
  "Acne scarring or texture": { category: "Microneedling", description: "Face texture repair with microneedling and chemical peel combination for scars, pores, and glow." },
  "Stubborn fat areas": { category: "Fat Dissolve", description: "Non-surgical fat reduction for chin, jawline, abdomen, flanks, and more - no downtime required." },
  "Pigmentation or uneven tone": { category: "Chemical Peels", description: "Targeted chemical peels and melanostop treatments to even out skin tone and restore clarity." },
};

const TreatmentHelper = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  const result = recommendations[answers[0]] || recommendations["Dull / tired skin"];

  return (
    <div className="bg-secondary p-8 md:p-12 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-gold" />
        <h3 className="font-display text-2xl">Treatment Finder</h3>
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Progress */}
            <div className="flex gap-1 mb-6">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 transition-colors ${
                    i <= step ? "bg-gold" : "bg-border"
                  }`}
                />
              ))}
            </div>

            <p className="font-body text-sm text-muted-foreground mb-2">
              Question {step + 1} of {questions.length}
            </p>
            <h4 className="font-display text-xl mb-6">{questions[step].q}</h4>

            <div className="grid gap-3">
              {questions[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="text-left px-5 py-3.5 border border-border hover:border-gold hover:bg-accent/5 font-body text-sm transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={goBack}
                className="mt-4 flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm"
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="border-l-2 border-gold pl-6 mb-8">
              <p className="font-body text-sm text-muted-foreground mb-1">We recommend</p>
              <h4 className="font-display text-3xl mb-2">{result.category}</h4>
              <p className="font-body text-foreground/70">{result.description}</p>
            </div>

            <p className="font-body text-sm text-muted-foreground mb-6">
              This is a general suggestion only. Book a consultation for personalised advice from our prescribers.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
              >
                Book Consultation <ArrowRight size={14} />
              </Link>
              <button
                onClick={reset}
                className="px-8 py-3 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors"
              >
                Start Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreatmentHelper;
