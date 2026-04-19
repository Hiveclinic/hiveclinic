import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

const ACUITY_OWNER = "39098354";
const EMBED_SCRIPT_SRC = "https://embed.acuityscheduling.com/js/embed.js";

interface AcuityEmbedProps {
  /** Optional Acuity appointmentType ID to deep-link to a single service. */
  appointmentTypeId?: string | number;
  /** Optional Acuity category slug. */
  category?: string;
  /** Initial iframe height in pixels (auto-grows via postMessage). Default 760. */
  minHeight?: number;
  /** Anchor id for scroll-to. */
  id?: string;
  className?: string;
  /** Render without an outer section/background. */
  bare?: boolean;
  /** Show the "open in new tab" fallback link below the iframe. Default true. */
  showFallback?: boolean;
}

/**
 * AcuityEmbed
 *
 * Renders the Acuity scheduler with a tight, branded wrapper. Auto-resizes
 * via Acuity's postMessage events so there's no inner scrollbar. Includes a
 * fallback link to open the full scheduler in a new tab.
 *
 * To strip Acuity's own header/footer/branding, paste docs/acuity-custom.css
 * into Acuity → Customize Appearance → Advanced CSS.
 */
const AcuityEmbed = ({
  appointmentTypeId,
  category,
  minHeight = 760,
  id = "book",
  className = "",
  bare = false,
  showFallback = true,
}: AcuityEmbedProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [height, setHeight] = useState(minHeight);

  // Load Acuity's embed script once globally.
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    s.type = "text/javascript";
    document.body.appendChild(s);
  }, []);

  // Listen to Acuity postMessage events for auto-resize.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (typeof e.origin !== "string" || !e.origin.includes("acuityscheduling.com")) return;
      const data = e.data;
      // Acuity sends either a number, { height: N }, or a string like "acuity:height:1234".
      let h: number | null = null;
      if (typeof data === "number") h = data;
      else if (data && typeof data === "object" && typeof data.height === "number") h = data.height;
      else if (typeof data === "string") {
        const m = data.match(/(\d+)/);
        if (m) h = parseInt(m[1], 10);
      }
      if (h && h > 200 && h < 5000) {
        setHeight(Math.max(h + 40, minHeight)); // small buffer
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [minHeight]);

  const params = new URLSearchParams({ owner: ACUITY_OWNER, ref: "embedded_csp" });
  if (appointmentTypeId) params.set("appointmentType", String(appointmentTypeId));
  if (category) params.set("category", category);
  const src = `https://app.acuityscheduling.com/schedule.php?${params.toString()}`;

  // Public scheduler URL (no embed param) for the new-tab fallback.
  const publicParams = new URLSearchParams({ owner: ACUITY_OWNER });
  if (appointmentTypeId) publicParams.set("appointmentType", String(appointmentTypeId));
  if (category) publicParams.set("category", category);
  const publicUrl = `https://app.acuityscheduling.com/schedule.php?${publicParams.toString()}`;

  const content = (
    <>
      <div className="relative bg-background">
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
          ref={iframeRef}
          src={src}
          title="Schedule Appointment - Hive Clinic"
          width="100%"
          height={height}
          frameBorder={0}
          allow="payment"
          scrolling="no"
          onLoad={() => setLoaded(true)}
          style={{
            border: 0,
            display: "block",
            width: "100%",
            height,
            minHeight,
            background: "transparent",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease, height 0.3s ease",
          }}
        />
      </div>

      {showFallback && (
        <div className="text-center pt-6">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-accent transition-colors"
          >
            Trouble booking? Open in new tab
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </>
  );

  if (bare) {
    return (
      <div id={id} className={className}>
        {content}
      </div>
    );
  }

  return (
    <section
      id={id}
      aria-label="Book an appointment"
      className={`bg-background py-12 md:py-16 ${className}`}
    >
      <div className="max-w-[880px] mx-auto px-3 md:px-4">{content}</div>
    </section>
  );
};

export default AcuityEmbed;
