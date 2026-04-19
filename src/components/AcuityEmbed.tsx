import { useEffect, useRef, useState } from "react";

const ACUITY_OWNER = "39098354";
const EMBED_SCRIPT_SRC = "https://embed.acuityscheduling.com/js/embed.js";

interface AcuityEmbedProps {
  /** Optional Acuity appointment type ID to deep-link to a single service. */
  appointmentTypeId?: string | number;
  /** Optional Acuity category slug. */
  category?: string;
  /** Iframe min-height in pixels. Default 760. */
  minHeight?: number;
  /** Anchor id for scroll-to. */
  id?: string;
  className?: string;
  /** Render without an outer section/background (for use inside other layouts). */
  bare?: boolean;
}

/**
 * AcuityEmbed
 *
 * Renders the Acuity scheduler with a tight, branded wrapper so the iframe
 * blends into the page (no harsh borders, no background mismatch).
 *
 * IMPORTANT: To strip Acuity's own header/footer/branding, paste the CSS in
 * /docs/acuity-custom.css (see project) into Acuity:
 *   Customize Appearance → Advanced CSS
 */
const AcuityEmbed = ({
  appointmentTypeId,
  category,
  minHeight = 760,
  id = "book",
  className = "",
  bare = false,
}: AcuityEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Load Acuity's embed script once globally (handles auto-resize messages).
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    s.type = "text/javascript";
    document.body.appendChild(s);
  }, []);

  const params = new URLSearchParams({ owner: ACUITY_OWNER, ref: "embedded_csp" });
  if (appointmentTypeId) params.set("appointmentType", String(appointmentTypeId));
  if (category) params.set("category", category);
  const src = `https://app.acuityscheduling.com/schedule.php?${params.toString()}`;

  const iframe = (
    <div ref={containerRef} className="relative bg-background">
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
          style={{ minHeight }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border border-accent border-t-transparent rounded-full animate-spin" />
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              Loading scheduler
            </span>
          </div>
        </div>
      )}
      <iframe
        src={src}
        title="Schedule Appointment - Hive Clinic"
        width="100%"
        height={minHeight}
        frameBorder={0}
        allow="payment"
        onLoad={() => setLoaded(true)}
        style={{
          border: 0,
          display: "block",
          width: "100%",
          minHeight,
          background: "transparent",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );

  if (bare) {
    return (
      <div id={id} className={className}>
        {iframe}
      </div>
    );
  }

  return (
    <section
      id={id}
      aria-label="Book an appointment"
      className={`bg-background py-12 md:py-16 ${className}`}
    >
      <div className="max-w-[880px] mx-auto px-3 md:px-4">{iframe}</div>
    </section>
  );
};

export default AcuityEmbed;
