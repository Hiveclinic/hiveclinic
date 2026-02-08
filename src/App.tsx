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
import Pricing from "./pages/Pricing";
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
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/aftercare" element={<PageTransition><Aftercare /></PageTransition>} />
        <Route path="/my-appointments" element={<PageTransition><CustomerPortal /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
