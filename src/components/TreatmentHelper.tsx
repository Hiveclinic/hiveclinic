import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const questions = [
  {
    q: "What's your main concern right now?",
    options: [
      { label: "Fine lines & wrinkles", icon: "✨" },
      { label: "I want fuller lips or more defined features", icon: "💋" },
      { label: "My skin looks dull, tired or dehydrated", icon: "🪞" },
      { label: "Acne scarring or uneven texture", icon: "🔬" },
      { label: "Stubborn fat I can't shift", icon: "🎯" },
      { label: "Pigmentation or dark spots", icon: "🌟" },
    ],
  },
  {
    q: "What kind of result are you after?",
    options: [
      { label: "Subtle - no one needs to know", icon: "🤫" },
      { label: "Noticeable but natural", icon: "✨" },
      { label: "A real transformation", icon: "💫" },
      { label: "I just want healthy, glowing skin", icon: "🌿" },
    ],
  },
  {
    q: "Have you had aesthetic treatments before?",
    options: [
      { label: "No, this would be my first", icon: "🆕" },
      { label: "Yes, a few times", icon: "👍" },
      { label: "Yes, I'm experienced", icon: "⭐" },
    ],
  },
  {
    q: "How soon do you want to see results?",
    options: [
      { label: "Immediately", icon: "⚡" },
      { label: "Within a few weeks", icon: "📅" },
      { label: "I'm happy to build results over time", icon: "🌱" },
    ],
  },
];

interface Recommendation {
  category: string;
  tagline: string;
  description: string;
  benefits: string[];
  testimonial: { text: string; name: string };
}

const recommendations: Record<string, Recommendation> = {
  "Fine lines & wrinkles": {
    category: "Anti-Wrinkle Treatments",
    tagline: "Turn back the clock without anyone knowing",
    description: "Our precision anti-wrinkle injections smooth lines and restore a naturally refreshed look. From subtle brow lifts to full facial rejuvenation - results you'll love.",
    benefits: ["Results visible in 3-7 days", "No downtime needed", "Lasts 3-4 months", "Prices from just £120"],
    testimonial: { text: "I look 10 years younger but completely natural. Bianca is amazing!", name: "Sarah T." },
  },
  "I want fuller lips or more defined features": {
    category: "Dermal Filler",
    tagline: "Enhance what you already have",
    description: "Expert filler treatments for lips, cheeks, jawline, and full facial balancing. We specialise in natural-looking results that enhance your features.",
    benefits: ["Instant results", "Natural-looking enhancement", "Lasts 6-12 months", "Prices from just £80"],
    testimonial: { text: "My lips look incredible - subtle and natural. Everyone asks what my secret is!", name: "Emily R." },
  },
  "My skin looks dull, tired or dehydrated": {
    category: "HydraFacial",
    tagline: "Wake up your skin",
    description: "Our deep cleansing HydraFacials deliver instant glass-skin results. Choose from Glass Skin Boost, Acne Refresh, or Glow Reset treatments.",
    benefits: ["Instant glow", "Zero downtime", "Deep hydration", "Prices from just £120"],
    testimonial: { text: "My skin has never looked this good. The Glass Skin Boost is life-changing!", name: "Aisha M." },
  },
  "Acne scarring or uneven texture": {
    category: "Microneedling",
    tagline: "Rebuild your skin from within",
    description: "Advanced microneedling combined with chemical peels for powerful texture repair. Targets scarring, enlarged pores, and uneven skin for smoother, clearer results.",
    benefits: ["Clinically proven results", "Stimulates natural collagen", "Visible improvement in 2-4 weeks", "Prices from just £130"],
    testimonial: { text: "After 3 sessions my acne scars have practically disappeared. Wish I'd done it sooner!", name: "Jordan L." },
  },
  "Stubborn fat I can't shift": {
    category: "Fat Dissolve",
    tagline: "Contour without surgery",
    description: "Non-surgical fat reduction for chin, jawline, abdomen, flanks, and more. Permanent results with no downtime - the body contouring solution you've been looking for.",
    benefits: ["Permanent fat cell reduction", "No surgery required", "Multiple areas treatable", "Prices from just £120"],
    testimonial: { text: "My double chin is gone! I can't believe the difference. So glad I found Hive.", name: "Priya K." },
  },
  "Pigmentation or dark spots": {
    category: "Chemical Peels",
    tagline: "Reveal your best skin",
    description: "Targeted chemical peels and melanostop treatments to even out skin tone, reduce pigmentation, and restore clarity. Available for face, body, and intimate areas.",
    benefits: ["Visible results after first session", "Suitable for all skin types", "Courses available for best results", "Prices from just £75"],
    testimonial: { text: "The difference in my skin tone is unreal. Even my friends have noticed!", name: "Georgia L." },
  },
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

  const result = recommendations[answers[0]] || recommendations["My skin looks dull, tired or dehydrated"];

  return (
    <div className="bg-background border border-border p-8 md:p-12 max-w-2xl mx-auto shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-gold" />
        <h3 className="font-display text-2xl">Find Your Perfect Treatment</h3>
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
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= step ? "bg-gold" : "bg-border"
                  }`}
                />
              ))}
            </div>

            <p className="font-body text-sm text-muted-foreground mb-1">
              Step {step + 1} of {questions.length}
            </p>
            <h4 className="font-display text-xl mb-6">{questions[step].q}</h4>

            <div className="grid gap-3">
              {questions[step].options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.label)}
                  className="text-left px-5 py-4 border border-border hover:border-gold hover:bg-accent/5 font-body text-sm transition-all flex items-center gap-3 group"
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="group-hover:text-gold transition-colors">{option.label}</span>
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
            <div className="mb-8">
              <p className="font-body text-sm text-gold uppercase tracking-widest mb-2">Your personalised recommendation</p>
              <h4 className="font-display text-3xl mb-2">{result.category}</h4>
              <p className="font-display text-lg text-muted-foreground italic mb-4">{result.tagline}</p>
              <p className="font-body text-foreground/80 leading-relaxed">{result.description}</p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {result.benefits.map((b) => (
                <div key={b} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-gold mt-0.5 flex-shrink-0" />
                  <span className="font-body text-sm">{b}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="bg-secondary p-5 mb-8 border-l-2 border-gold">
              <p className="font-body text-sm italic text-foreground/80 mb-2">"{result.testimonial.text}"</p>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">- {result.testimonial.name}</p>
            </div>

            {/* Urgency + CTA */}
            <div className="flex items-center gap-2 mb-4 text-gold">
              <Clock size={14} />
              <p className="font-body text-sm">Limited availability this week - book now to secure your slot</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors flex-1"
              >
                Book Free Consultation <ArrowRight size={14} />
              </Link>
              <button
                onClick={reset}
                className="px-6 py-4 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors"
              >
                Retake Quiz
              </button>
            </div>

            <p className="font-body text-xs text-muted-foreground mt-4 text-center">
              No obligation - just a friendly chat about your goals.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreatmentHelper;
