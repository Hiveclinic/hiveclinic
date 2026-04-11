import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Camera, ChevronDown, ExternalLink, MapPin, Check, MessageCircle, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";

type ModelService = {
  title: string;
  price: string;
  description: string;
  category: string;
  setmoreUrl: string;
};

const MODEL_SERVICES: ModelService[] = [
  { title: "1ml Lip Filler (Model)", price: "£99", description: "Tailored 1ml lip enhancement. Content will be taken for marketing and portfolio purposes. Full price of £150 charged if content is declined.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=2e89acbb-1de8-4c6b-abbb-eec917d72003&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "2ml Facial Balancing (Model)", price: "£199", description: "2ml facial balancing for subtle, tailored refinement. Areas may include lips, nose, cheeks, chin or jaw. Tear trough not included.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=1e555efd-5356-459b-9f80-44129d2debb6&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "3ml Facial Balancing (Model)", price: "£299", description: "3ml facial balancing to enhance overall facial structure and balance. Areas may include lips, nose, cheeks, chin or jaw.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a465b4d0-b24b-4f41-a01d-ae9d340fe569&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "4ml Facial Balancing (Model)", price: "£399", description: "4ml facial balancing for more advanced, full-face enhancement. Designed to create structure, definition and harmony.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a9ef4756-b061-4221-9c1a-12ee0fd4c09f&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Feature Refinement (Model)", price: "£120", description: "Targeted enhancement of a specific feature — nose, chin or jaw. Full price from £180 charged if content is declined.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=0929bfe0-279c-4e1f-91d1-d9457db9a168&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
];

const MODEL_CATEGORIES = [
  ...new Set(MODEL_SERVICES.map((s) => s.category)),
];

const WHATSAPP_GROUP = "https://chat.whatsapp.com/EghTmYahXgY6P2f1J1BD6I?mode=gi_t";

const UPCOMING_DATES = [
  { date: "Thursday 16th April", slots: "Limited" },
  { date: "Saturday 25th April", slots: "Limited" },
  { date: "Thursday 30th April", slots: "Limited" },
];

const isCourse = (title: string) =>
  /course|sessions\)/i.test(title) || /\d\s*sessions/i.test(title);

const ServiceCard = ({ service }: { service: ModelService }) => (
  <div className="group border border-border p-6 flex flex-col justify-between h-full hover:border-accent/40 transition-colors">
    <div>
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-display text-lg leading-tight">{service.title}</h3>
        <span className="font-body text-sm text-accent whitespace-nowrap font-medium">{service.price}</span>
      </div>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{service.description}</p>
    </div>
    <div>
      <a
        href={service.setmoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm font-body tracking-wide hover:bg-primary/90 transition-colors w-full justify-center"
      >
        Book Now
        <ExternalLink size={14} />
      </a>
      <p className="text-xs text-muted-foreground mt-3 text-center font-body">
        By booking, you agree to our{" "}
        <Link to="/terms" className="underline hover:text-foreground transition-colors">booking policies</Link>
      </p>
    </div>
  </div>
);

const CategorySection = ({ category, services }: { category: string; services: ModelService[] }) => {
  const [isOpen, setIsOpen] = useState(true);
  const singles = services.filter((s) => !isCourse(s.title));
  const courses = services.filter((s) => isCourse(s.title));

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-2 text-left group"
      >
        <div className="flex items-center gap-4">
          <h2 className="font-display text-xl md:text-2xl">{category}</h2>
          <span className="font-body text-xs text-muted-foreground tracking-wide">
            {services.length} {services.length === 1 ? "service" : "services"}
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="pb-8 px-2"
        >
          {singles.length > 0 && (
            <>
              {courses.length > 0 && (
                <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-4">Single Sessions</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {singles.map((service, i) => (
                  <ServiceCard key={i} service={service} />
                ))}
              </div>
            </>
          )}
          {courses.length > 0 && (
            <>
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-4 mt-8">Courses</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((service, i) => (
                  <ServiceCard key={i} service={service} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const MuseLanding = () => {
  usePageMeta(
    "Content Models | Hive Clinic Manchester",
    "Exclusive content pricing on aesthetic treatments at Hive Clinic, Deansgate Manchester. Book your model session for reduced rates on lip filler, dermal filler, anti-wrinkle and more."
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Camera size={14} className="text-accent" />
              <p className="font-body text-sm text-accent uppercase tracking-[0.2em]">Content Sessions</p>
            </div>
            <h1 className="font-display text-5xl md:text-7xl mb-6">Become a Content Model</h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
              Receive exclusive content pricing on selected aesthetic treatments when featured in Hive Clinic photography and video content.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <MapPin size={14} className="text-accent" />
              <span className="font-body text-sm text-muted-foreground">Deansgate, Manchester</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Dates */}
      <section className="py-16 bg-accent/5 border-y border-accent/20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CalendarDays size={16} className="text-accent" />
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-accent font-semibold">Next Available Dates</p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl">April Model Sessions</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {UPCOMING_DATES.map((d) => (
              <motion.div key={d.date} {...fadeIn} className="border border-accent/30 bg-background p-6 text-center">
                <p className="font-display text-lg mb-1">{d.date}</p>
                <p className="font-body text-xs text-accent uppercase tracking-wider">{d.slots}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center font-body text-xs text-muted-foreground mt-6">
            Book below or join the WhatsApp group for instant notifications when new dates drop.
          </p>
        </div>
      </section>

      {/* What Are Model Sessions */}
      <section className="py-20 bg-secondary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="font-display text-4xl md:text-5xl mb-6">What Are Model Sessions?</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Model sessions are limited appointments where treatments are offered at exclusive content rates in exchange for allowing Hive Clinic to photograph or film the treatment and results for social media and marketing.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Content may include before and after photos, treatment clips, or short video content.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Available Treatments */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          {MODEL_SERVICES.length > 0 ? (
            <>
              <h2 className="font-display text-3xl text-center mb-12">Model Pricing</h2>
              <div>
                {MODEL_CATEGORIES.map((category) => {
                  const services = MODEL_SERVICES.filter((s) => s.category === category);
                  if (services.length === 0) return null;
                  return <CategorySection key={category} category={category} services={services} />;
                })}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-8 font-body max-w-lg mx-auto">
                By booking a model appointment, you agree to content being taken for marketing and portfolio purposes. If you do not wish for content to be taken, the full price will be charged on arrival.
              </p>
            </>
          ) : (
            <motion.div {...fadeIn} className="text-center max-w-xl mx-auto">
              <div className="border border-border p-12">
                <Camera size={32} className="text-muted-foreground mx-auto mb-6" strokeWidth={1} />
                <h2 className="font-display text-3xl mb-4">No Slots Available</h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-8">
                  Sorry, we have no more model slots available at the moment. Sign up to our WhatsApp group chat to be notified when new dates are added.
                </p>
                <a
                  href={WHATSAPP_GROUP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
                >
                  <MessageCircle size={16} />
                  Join WhatsApp Group
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Important Information */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <h2 className="font-display text-4xl text-center mb-12">Important Information</h2>
            <div className="space-y-5">
              {[
                "Content sessions require consent for photos and video",
                "If you do not wish for content to be taken, the full treatment price will apply",
                "Please send a clear front and side profile photo before your appointment via WhatsApp or Instagram DM",
                "Treatments are carried out at Hive Clinic in Deansgate",
                "Limited availability each month",
                "Full consultation is carried out before treatment",
                "Klarna available — message us on WhatsApp or Instagram to arrange",
              ].map((point) => (
                <div key={point} className="flex items-start gap-4">
                  <Check size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-background/80">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-secondary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <p className="font-display text-3xl md:text-5xl leading-tight mb-8">
              Limited model appointments available each month
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=cca90b33-33e4-473a-8255-038617ac5368&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
              >
                Book Model Slot <ArrowRight size={14} />
              </a>
              <a
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 border border-foreground/20 text-foreground font-body text-sm tracking-widest uppercase hover:bg-foreground/5 transition-colors"
              >
                <MessageCircle size={16} />
                Join WhatsApp Group
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MuseLanding;