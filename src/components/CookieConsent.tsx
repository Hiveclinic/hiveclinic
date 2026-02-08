import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const accept = (type: "all" | "essential") => {
    localStorage.setItem("cookie-consent", type);
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-foreground text-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="font-body text-sm leading-relaxed">
            We use cookies to improve your experience and analyse site traffic. By clicking "Accept All", you consent to our use of cookies. 
            See our <Link to="/privacy" className="underline hover:text-gold transition-colors">Privacy Policy</Link> for more information.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => accept("essential")}
            className="px-5 py-2 border border-background/30 font-body text-xs tracking-wider uppercase hover:bg-background/10 transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={() => accept("all")}
            className="px-5 py-2 bg-gold text-white font-body text-xs tracking-wider uppercase hover:bg-gold-dark transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
