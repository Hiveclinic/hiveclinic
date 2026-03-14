import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";

const About = () => {
  usePageMeta("About Hive Clinic | Aesthetic Clinic Manchester City Centre", "Meet Bianca, the practitioner behind Hive Clinic in Manchester City Centre. Specialising in advanced skin treatments and aesthetic procedures.");
  const heroImg = useSiteImage("about_hero", STOCK.about_hero);
  const secondaryImg = useSiteImage("about_secondary", STOCK.about_secondary);
  return (
  <Layout>
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-5xl md:text-6xl mb-6">Meet Bianca</h1>
            <div className="space-y-4 font-body text-foreground/80 leading-relaxed">
              <p>
                Hive Clinic was founded by Bianca with a clear vision: to create a space where luxury meets clinical
                excellence, and every client feels seen, heard, and confident in their care.
              </p>
              <p>
                With years of experience in advanced aesthetics, Bianca brings a meticulous eye for detail and a deep
                understanding of facial anatomy. Every treatment is approached with artistry - enhancing what's already
                there, never changing who you are.
              </p>
              <p>
                At Hive, safety isn't negotiable. All toxin-based treatments require a prescriber consultation, and every
                product used is fully regulated and premium-grade.
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="aspect-[3/4] overflow-hidden">
              <img src={heroImg} alt="Bianca - Hive Clinic founder" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="lg:order-2">
            <h2 className="font-display text-4xl mb-6">The Hive Ethos</h2>
            <div className="space-y-4 font-body text-foreground/80 leading-relaxed">
              <p>
                We believe aesthetics should be about confidence, not conformity. Our approach is rooted in enhancing your
                natural features with precision, discretion, and an unwavering commitment to safety.
              </p>
              <p>
                Located in the heart of Manchester's Deansgate, Hive is designed to feel like a sanctuary - a calm,
                luxurious space where you can trust you're in expert hands.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { label: "Safety First", value: "100%" },
                { label: "Client Satisfaction", value: "5★" },
                { label: "Manchester Based", value: "MCR" },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 border border-border">
                  <p className="font-display text-2xl text-gold">{s.value}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:order-1">
            <div className="aspect-[3/4] overflow-hidden">
              <img src={secondaryImg} alt="Hive Clinic treatment" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
  );
};

export default About;
