import { useEffect, useRef } from "react";

const ACUITY_OWNER = "39098354";
const EMBED_SCRIPT_SRC = "https://embed.acuityscheduling.com/js/embed.js";

interface AcuityEmbedProps {
  /** Optional Acuity appointment type ID to filter the scheduler to one category. */
  appointmentTypeId?: string | number;
  /** Optional Acuity category slug (alternative to appointmentTypeId). */
  category?: string;
  /** Min height of the iframe in pixels. Default 900. */
  minHeight?: number;
  /** Anchor id for scroll-to. */
  id?: string;
  className?: string;
}

const AcuityEmbed = ({
  appointmentTypeId,
  category,
  minHeight = 900,
  id = "book",
  className = "",
}: AcuityEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Acuity's embed script once globally.
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

  return (
    <section
      id={id}
      aria-label="Book an appointment"
      className={`bg-secondary py-20 md:py-[80px] ${className}`}
    >
      <div className="max-w-[900px] mx-auto px-4 md:px-6">
        <div ref={containerRef} className="bg-background overflow-hidden">
          <iframe
            src={src}
            title="Schedule Appointment - Hive Clinic"
            width="100%"
            height={minHeight}
            frameBorder={0}
            allow="payment"
            style={{ border: 0, display: "block", width: "100%", minHeight }}
          />
        </div>
      </div>
    </section>
  );
};

export default AcuityEmbed;
