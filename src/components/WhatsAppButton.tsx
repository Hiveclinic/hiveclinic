import whatsappLogo from "@/assets/whatsapp-logo.png";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/447795008114"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
  >
    <img src={whatsappLogo} alt="WhatsApp" className="w-14 h-14" />
  </a>
);

export default WhatsAppButton;
