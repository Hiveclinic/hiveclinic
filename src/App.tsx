import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Treatments from "./pages/Treatments";
import LipFillers from "./pages/LipFillers";
import AntiWrinkle from "./pages/AntiWrinkle";
import DermalFiller from "./pages/DermalFiller";
import HydraFacial from "./pages/HydraFacial";
import ChemicalPeels from "./pages/ChemicalPeels";
import SkinBoosters from "./pages/SkinBoosters";
import FatDissolve from "./pages/FatDissolve";
import Microneedling from "./pages/Microneedling";
import Dermaplaning from "./pages/Dermaplaning";
import LEDTherapy from "./pages/LEDTherapy";
import Mesotherapy from "./pages/Mesotherapy";
import PRP from "./pages/PRP";
import FacialBalancing from "./pages/FacialBalancing";
import MicroSclerotherapy from "./pages/MicroSclerotherapy";
import Consultations from "./pages/Consultations";
import IntimatePeels from "./pages/IntimatePeels";

import About from "./pages/About";
import BookingSystem from "./pages/BookingSystem";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancelled from "./pages/BookingCancelled";
import Results from "./pages/Results";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Aftercare from "./pages/Aftercare";
import CustomerPortal from "./pages/CustomerPortal";
import Privacy from "./pages/Privacy";
import AcneTreatment from "./pages/AcneTreatment";
import HyperpigmentationTreatment from "./pages/HyperpigmentationTreatment";
import LipFillerLanding from "./pages/LipFillerLanding";
import MuseLanding from "./pages/MuseLanding";
import Offers from "./pages/Offers";
import ConsentForm from "./pages/ConsentForm";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/treatments" element={<PageTransition><Treatments /></PageTransition>} />
          <Route path="/treatments/lip-fillers-manchester" element={<PageTransition><LipFillers /></PageTransition>} />
          <Route path="/treatments/anti-wrinkle-injections-manchester" element={<PageTransition><AntiWrinkle /></PageTransition>} />
          <Route path="/treatments/dermal-filler-manchester" element={<PageTransition><DermalFiller /></PageTransition>} />
          <Route path="/treatments/hydrafacial-manchester" element={<PageTransition><HydraFacial /></PageTransition>} />
          <Route path="/treatments/chemical-peels-manchester" element={<PageTransition><ChemicalPeels /></PageTransition>} />
          <Route path="/treatments/skin-boosters-manchester" element={<PageTransition><SkinBoosters /></PageTransition>} />
          <Route path="/treatments/fat-dissolving-manchester" element={<PageTransition><FatDissolve /></PageTransition>} />
          <Route path="/treatments/microneedling-manchester" element={<PageTransition><Microneedling /></PageTransition>} />
          <Route path="/treatments/dermaplaning-manchester" element={<PageTransition><Dermaplaning /></PageTransition>} />
          <Route path="/treatments/led-light-therapy-manchester" element={<PageTransition><LEDTherapy /></PageTransition>} />
          <Route path="/treatments/mesotherapy-manchester" element={<PageTransition><Mesotherapy /></PageTransition>} />
          <Route path="/treatments/prp-manchester" element={<PageTransition><PRP /></PageTransition>} />
          <Route path="/treatments/facial-balancing-manchester" element={<PageTransition><FacialBalancing /></PageTransition>} />
          <Route path="/treatments/micro-sclerotherapy-manchester" element={<PageTransition><MicroSclerotherapy /></PageTransition>} />
          <Route path="/treatments/consultations" element={<PageTransition><Consultations /></PageTransition>} />
          <Route path="/treatments/intimate-peels-manchester" element={<PageTransition><IntimatePeels /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/bookings" element={<PageTransition><BookingSystem /></PageTransition>} />
          <Route path="/booking-success" element={<PageTransition><BookingSuccess /></PageTransition>} />
          <Route path="/booking-cancelled" element={<PageTransition><BookingCancelled /></PageTransition>} />
          <Route path="/results" element={<PageTransition><Results /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/hive-admin-login" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/hive-admin" element={<PageTransition><Admin /></PageTransition>} />
          <Route path="/aftercare" element={<PageTransition><Aftercare /></PageTransition>} />
          <Route path="/my-appointments" element={<PageTransition><CustomerPortal /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/acne-treatment-manchester" element={<PageTransition><AcneTreatment /></PageTransition>} />
          <Route path="/hyperpigmentation-treatment-manchester" element={<PageTransition><HyperpigmentationTreatment /></PageTransition>} />
          <Route path="/lip-filler-manchester" element={<PageTransition><LipFillerLanding /></PageTransition>} />
          <Route path="/muse" element={<PageTransition><MuseLanding /></PageTransition>} />
          <Route path="/offers" element={<PageTransition><Offers /></PageTransition>} />
          <Route path="/consent-form" element={<PageTransition><ConsentForm /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
