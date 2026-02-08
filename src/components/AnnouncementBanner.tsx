import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { X, Megaphone } from "lucide-react";

const AnnouncementBanner = () => {
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [active, setActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("announcement_text, announcement_active, announcement_link")
        .eq("id", "global")
        .single();
      if (data) {
        setText(data.announcement_text || "");
        setActive(data.announcement_active || false);
        setLink(data.announcement_link || "");
      }
    };
    fetchSettings();
  }, []);

  if (!active || !text || dismissed) return null;

  return (
    <div className="bg-gold text-background relative z-[60]">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3">
        <Megaphone size={14} className="flex-shrink-0" />
        {link ? (
          <Link to={link} className="font-body text-xs tracking-wider text-center hover:underline">
            {text}
          </Link>
        ) : (
          <p className="font-body text-xs tracking-wider text-center">{text}</p>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
