import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ChevronDown, ExternalLink, Clock, ArrowDown, Sparkles, Search, Shield, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";

type Service = {
  title: string;
  price: string;
  description: string;
  category: string;
  setmoreUrl: string;
  isOffer?: boolean;
  offerLabel?: string;
};

const SERVICES: Service[] = [
  // Offers
  { title: "Signature 1ml Lip Filler Package", price: "£99", description: "Tailored 1ml lip enhancement. Includes personalised lip shaping and full aftercare. Limited availability — content may be taken for portfolio.", category: "Offers", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=02998549-483a-4e15-a0a5-13c25bfb587f&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false", isOffer: true, offerLabel: "LIMITED OFFER" },
  { title: "2ml Facial Balance Package", price: "£220", description: "2ml dermal filler placed across lips, chin, cheeks, or jawline for overall facial harmony. Includes facial assessment and aftercare.", category: "Offers", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=96efd2da-f3e5-4cf9-a0af-1c6ef46d8c4c&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false", isOffer: true, offerLabel: "LIMITED OFFER" },

  // Consultations
  { title: "In-Person Consultation", price: "£25", description: "Full skin assessment and personalised treatment plan. Suitable if you are unsure what to book.", category: "Consultations", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Repeat Session Booking", price: "Free", description: "For returning clients scheduling a repeat session within their treatment plan.", category: "Consultations", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=38c99c41-0af9-4b81-b67d-aae0369d51a4&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Dermal Filler
  { title: "Lip Filler - 1ml", price: "£150", description: "Enhances shape, symmetry, and definition while maintaining a natural balance.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=8316cf5c-ce1f-4868-83be-6e95c9390c75&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Lip Filler - 0.5ml", price: "£120", description: "Subtle volume, hydration and natural shape enhancement. Ideal for first-time clients.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=ac84c482-efa0-4be7-a28a-4e25bf08afaf&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 2ml", price: "£200", description: "Combination of lips, chin, cheeks and jawline to improve overall facial balance.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=cb094103-11f5-475c-8c06-d30ea7f30dfe&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 3ml", price: "£420", description: "Bespoke treatment to harmonise the entire face. Saves compared to booking individually.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=8ddf4b41-045f-4cae-a783-f784a6b3c702&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 4ml", price: "£550", description: "A combination treatment to improve overall facial balance and structure.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=c3c559ab-5406-4fdd-b453-7eb15b7856e9&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 5ml", price: "£650", description: "Complete transformation enhancing facial structure and definition.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=ea66b275-520e-4998-b6c3-dc2f837a296f&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Nose Filler (Non-surgical Rhinoplasty)", price: "£200", description: "Balances and refines the nose shape for a more symmetrical profile.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=61946dbc-165f-4da0-a937-42fffdb940ca&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Tear Trough Filler", price: "£200", description: "Brightens under-eye hollows, reducing tired appearance and restoring volume.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=3925ea1d-538d-4586-a273-ae7f3d12935b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Jawline Filler (Per ML)", price: "£170", description: "Creates definition and structure through precise contouring.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=543f6a92-b63b-426d-8f1e-386e0f6f16ec&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Cheek Filler (Per ML)", price: "£160", description: "Restores volume and lift to the mid-face, enhancing contour and structure.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=474efd20-68cf-4214-a750-6b44c51759b4&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Chin Filler", price: "£160", description: "Refines the facial profile, balances proportions, and defines the jawline.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=11778a78-5033-4823-a394-924b62d5d859&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Smile Lines (Nasolabial Folds)", price: "£150", description: "Softens deep creases around the mouth, restoring smoothness and youthful balance.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=6e0a1319-e929-43bf-a70f-ab404877f86c&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Marionette Lines", price: "£150", description: "Targets lines from mouth corners to chin, lifting and rejuvenating the lower face.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=63dbac2f-2b18-463b-90bd-7bcce84e10ea&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Touch Up / Refresh (Existing Clients)", price: "£95", description: "Small refinements or maintenance of existing filler within 6 months.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=39c8518c-bf5f-41a4-8bd3-a8a2a66b0def&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Filler Dissolve", price: "£100", description: "Removes unwanted or migrated filler safely. Patch test required 24hr prior.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=182a2a64-610e-4762-82d5-e1dd88d16e47&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Anti-Wrinkle
  { title: "Anti-Wrinkle - 1 Area", price: "£140", description: "Targets forehead lines, frown lines, or crow's feet to soften fine lines.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=6a7d267b-5d4a-4845-a095-0b5a70f28c8b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Anti-Wrinkle - 2 Areas", price: "£180", description: "Includes prescriber consultation and free top-up if required.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=94be7341-00b5-4981-973d-d5fdc2dbdafb&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Anti-Wrinkle - 3 Areas", price: "£220", description: "Full upper-face treatment covering forehead, frown, and eyes. Free top-up included.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=d2084bfc-66cf-4893-bf51-aefbd24f8049&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Masseter (Jaw Slimming)", price: "£230", description: "Relaxes the jaw muscle for a slimmer, more contoured lower face.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=9e571ef0-594c-495f-b717-3d82b0ec8e88&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Lip Flip", price: "£140", description: "Enhances the upper lip without adding volume for a soft, lifted look.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=53f18fbc-e9b6-4277-897a-b0466584183d&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Bunny Lines", price: "£140", description: "Softens fine lines on the nose.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=34455ba8-5667-48e9-bd97-2e4b3839675a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Gummy Smile", price: "£140", description: "Reduces gum visibility when smiling.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=56c75086-15ad-43a5-a79f-096c15231f81&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Brow Lift", price: "£170", description: "Creates a subtle lift to the brow area.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=efd05bed-8c75-40b4-a081-efc69d87d263&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Excessive Sweating (Underarms)", price: "£350", description: "Targets excessive sweating in the underarm area.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=f270ee63-8fe4-4688-a951-ebe96369801f&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Chemical Peels
  { title: "BioRePeel Face", price: "£95", description: "Medical-grade peel to improve acne, texture, and pigmentation with minimal downtime.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=e065bcdb-44e5-4f70-bb9c-6c62fdcc5490%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "BioRePeel Body", price: "£110", description: "Targets back, chest, or shoulders for acne and pigmentation.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b87df557-d48b-404c-bd76-c148fa8cc78f%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "BioRePeel Face Course (3 Sessions)", price: "£270", description: "Course of 3 treatments. Recommended for ongoing skin concerns.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=90aa375d-c263-4b5b-a0c8-91de5ee0b069%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "BioRePeel Body Course (3 Sessions)", price: "£300", description: "Course of 3 treatments for one body area.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=2de6d961-d715-452d-9b75-81889ce871e0%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Intimate Pigment Treatment
  { title: "Bikini Line Pigment Treatment", price: "£110", description: "Chemical exfoliation and pigment control for bikini line discolouration.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a0cb1ac1-c09b-4216-9aaa-95cd11165fba&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Underarm Pigment Treatment", price: "£110", description: "Improves underarm pigmentation using controlled exfoliation.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=7c6b3268-02d3-40e9-bf3f-d89bb16cd463&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Inner Thigh Pigment Treatment", price: "£120", description: "Targets pigmentation caused by friction between the thighs.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=f9096089-1667-4630-b51d-457fd894278b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Small Areas", price: "£75", description: "Underarms, knees, elbows. 3-6 sessions recommended.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=03d204e6-3e03-4171-a325-8a904a1ad586&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Medium Areas", price: "£95", description: "Bikini line, inner thighs, chest. 3-6 sessions recommended.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=7d648b0f-31e5-4b47-a878-ac50723b64fc&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Large Areas", price: "£120", description: "Full intimate area, stomach. 3-6 sessions recommended.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=4be48be9-6bd7-4ad5-bb79-7f6b109d7cdc&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Bikini Line Course (3 Sessions)", price: "£300", description: "Course of 3 to improve pigmentation over time.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=5dabccef-7bf7-45ee-a467-77eb05bf6e27&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Underarm Course (3 Sessions)", price: "£300", description: "Course of 3 to improve pigmentation over time.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=685903fd-8552-4de3-a743-b50cf5f05ca9&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Inner Thigh Course (3 Sessions)", price: "£330", description: "Course of 3 to improve pigmentation over time.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=af12aff6-88a0-4fe4-90a9-d98b58dfe0f7&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Small (Course of 3)", price: "£210", description: "Underarms, knees, elbows. Course of 3 sessions.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=226e134d-8341-46ea-9822-0b87a9d7610a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Medium (Course of 3)", price: "£265", description: "Bikini line, inner thighs, chest. Course of 3 sessions.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=595463fc-3581-4f56-926a-2cce30920e92&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Large (Course of 3)", price: "£330", description: "Full intimate area, stomach. Course of 3 sessions.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=f72dbb04-f6b4-4106-b973-af2c1df9e749&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Skin Treatments
  { title: "BioRePeel Face", price: "£95", description: "Medical-grade peel to improve acne, texture, and pigmentation.", category: "Skin Treatments", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=e065bcdb-44e5-4f70-bb9c-6c62fdcc5490%7C3c6e1b69-0f48-4607-96e4-97ecfbcdb4ee&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "BioRePeel Body", price: "£110", description: "Targets back, chest, or shoulders for acne and pigmentation.", category: "Skin Treatments", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b87df557-d48b-404c-bd76-c148fa8cc78f%7C3c6e1b69-0f48-4607-96e4-97ecfbcdb4ee&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Glass Skin Treatment", price: "£140", description: "BioRePeel combined with hyaluronic acid infusion to smooth, refine, and hydrate.", category: "Skin Treatments", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a8e75820-b5b7-422b-9af0-d821ef086115&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "BioRePeel Face Course (3 Sessions)", price: "£270", description: "Course of 3 treatments for the full face.", category: "Skin Treatments", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=90aa375d-c263-4b5b-a0c8-91de5ee0b069%7C3c6e1b69-0f48-4607-96e4-97ecfbcdb4ee&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "BioRePeel Body Course (3 Sessions)", price: "£300", description: "Course of 3 treatments for one body area.", category: "Skin Treatments", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=2de6d961-d715-452d-9b75-81889ce871e0%7C3c6e1b69-0f48-4607-96e4-97ecfbcdb4ee&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Skin Boosters
  { title: "Seventy Hyal Skin Booster", price: "£140", description: "Deep hydration to improve glow, elasticity, and skin firmness.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=feb7a509-46e1-4e37-a041-837bf98ec763&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Polynucleotides Skin Booster", price: "£180", description: "Regenerates skin at a cellular level for long-term rejuvenation and repair.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=18543952-71ff-4fd0-ab66-7e89a4dac593&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Profhilo Skin Booster", price: "£280", description: "Advanced injectable for skin laxity and hydration. Course of 2 recommended.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=8557d3a9-75bd-48e9-80f6-bb4acf756d8e&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Under Eye Skin Booster", price: "£130", description: "Injectable treatment for dark circles and fine lines.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=709029cc-37c0-47cd-b569-0e4d834be3b2&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Seventy Hyal Course (3 Sessions)", price: "£380", description: "3 sessions, 4 weeks apart for best results.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=757adde3-e573-4304-acaf-6cb21bb3bc16&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Under Eye Booster Course (3 Sessions)", price: "£360", description: "3 sessions targeting dark circles and fine lines.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=6a9f3d91-c97a-4051-a8be-6b5642049183&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Microneedling
  { title: "Microneedling with Hydrating Serum", price: "£160", description: "Dr Pen microneedling with hyaluronic acid serum.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=63c50b04-45cf-4989-a970-7c9462548d27&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Microneedling with Skin Booster", price: "£200", description: "Microneedling combined with mesotherapy or booster infusion.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=45f07d61-f94a-4934-b79c-9a6b7f9b4000&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Stretch Mark Microneedling", price: "£180", description: "Stimulates collagen to improve stretch mark texture. 3-6 sessions recommended.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=c488f018-6641-441b-87e4-31cd909d2289&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Microneedling Course (3 Sessions)", price: "£420", description: "3 sessions to improve texture, tone, and mild scarring.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=3ce99ae1-9115-406b-9adf-04b589cb24b7&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Microneedling + Booster Course (3 Sessions)", price: "£540", description: "3 sessions for deeper skin rejuvenation.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=6f934644-312c-4a60-a34e-5d1f73c61404&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Stretch Mark Course (3 Sessions)", price: "£480", description: "Course of 3 treatments for improved results.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=eea78d4a-22f3-4495-a1bb-29d1511c1379&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // HydroFacial
  { title: "Hydrafacial", price: "£150", description: "Deep cleansing facial to exfoliate, extract, and hydrate. All skin types.", category: "HydroFacial", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=1b7e4418-5f0a-452a-96b2-11fe4e558825&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Glass Skin Hydrafacial", price: "£190", description: "Hydrafacial cleanse, gentle exfoliation, and targeted skin booster injection.", category: "HydroFacial", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=960394ee-c6d8-4f5f-8831-fd0fa67319de&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Fat Dissolve
  { title: "Fat Dissolving - Small Area", price: "£150", description: "Suitable for chin or bra bulge. No surgery, minimal downtime.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a30c5362-956b-4139-b14d-9daaf9a5569a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving - Medium Area", price: "£200", description: "Suitable for lower abdomen or flanks.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a837e5e4-835a-4afc-8fb1-aebcadb3528b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving - Large Area", price: "£250", description: "Target stubborn pockets of fat, safely and effectively.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b29b95c5-530c-4434-8928-3df67e208095&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving Course - Small (3 Sessions)", price: "£400", description: "Course of 3 for chin or bra bulge area.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a7ef0048-4066-4026-8233-e32390994478&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving Course - Medium (3 Sessions)", price: "£540", description: "Course of 3 for lower abdomen or flanks.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b8538016-6d33-4c98-bd7b-e30b3b96d6b9&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving Course - Large (3 Sessions)", price: "£700", description: "Course of 3 for larger stubborn areas.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=44b0a6b9-2281-4638-b4f4-ffb136f7e6d5&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Wellness
  { title: "B12 Injection", price: "£35", description: "Supports energy levels and general wellbeing.", category: "Wellness", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=180d9d60-d61b-4f6c-bef1-935b5b4e45c6&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Biotin Injection", price: "£35", description: "Supports hair, skin, and nail health.", category: "Wellness", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=ee9b76d4-aaf0-470f-b877-6339d92a6426&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // IV Drip Therapy
  { title: "IV Vitamin Drip", price: "£180", description: "Vitamin infusion delivered directly into the bloodstream.", category: "IV Drip Therapy", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b8d150c4-4a99-4ac3-8e78-a82fbe3b6245&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "IV Booster Add-On", price: "£40", description: "Add Vitamin C, Biotin, or Glutathione to your treatment.", category: "IV Drip Therapy", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=98f98970-3e24-4d61-87ee-ad7ae464d5c5&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
];

const CATEGORIES = [
  "Offers",
  "Consultations",
  "Dermal Filler",
  "Anti-Wrinkle",
  "Chemical Peels",
  "Intimate Pigment Treatment",
  "Skin Treatments",
  "Skin Boosters",
  "Microneedling",
  "HydroFacial",
  "Fat Dissolve",
  "Wellness",
  "IV Drip Therapy",
];

const faqs = [
  { q: "Do I need a consultation first?", a: "Yes - for all injectable treatments, an initial consultation is required. This ensures your safety and allows us to create a personalised treatment plan." },
  { q: "Is there any downtime?", a: "It depends on the treatment. Most facial treatments have minimal downtime. Injectables may involve slight swelling for 24-48 hours. We will discuss this during your consultation." },
  { q: "How do I prepare for my appointment?", a: "Avoid alcohol 24 hours before, arrive with a clean face if possible, and let us know about any medications or allergies." },
  { q: "Can I pay in instalments?", a: "Yes. We offer flexible payment plans for eligible treatments, so you can spread the cost." },
  { q: "What if I need to reschedule?", a: "We ask for at least 48 hours notice for cancellations or rescheduling. Late cancellations may incur a fee." },
  { q: "What is the deposit policy?", a: "A 20% deposit is required to secure your appointment. Deposits are non-refundable. The remaining balance is paid on the day of your treatment." },
];

const steps = [
  { number: "01", title: "Choose", description: "Browse our full menu and select." },
  { number: "02", title: "Schedule", description: "Pick your preferred date and time." },
  { number: "03", title: "Confirm", description: "Pay your 20% deposit to secure." },
  { number: "04", title: "Arrive", description: "We handle the rest on the day." },
];

const isCourse = (title: string) =>
  /course|sessions\)/i.test(title) || /\d\s*sessions/i.test(title);

const OfferCard = ({ service }: { service: Service }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="group relative bg-background border-2 border-accent/50 hover:border-accent transition-all duration-300 overflow-hidden"
  >
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/80 to-accent" />
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <Flame size={14} className="text-accent" />
        <span className="font-body text-[10px] tracking-[0.25em] uppercase text-accent font-semibold">{service.offerLabel}</span>
      </div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display text-lg leading-snug">{service.title}</h3>
        <span className="font-display text-2xl text-accent whitespace-nowrap">{service.price}</span>
      </div>
      <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">{service.description}</p>
      <a
        href={service.setmoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-accent-foreground text-xs font-body tracking-wider uppercase hover:bg-accent/90 transition-colors duration-300"
      >
        Book This Offer
        <ExternalLink size={12} />
      </a>
    </div>
  </motion.div>
);

const ServiceCard = ({ service, index }: { service: Service; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    className="group relative bg-background border border-border hover:border-accent/40 transition-all duration-300"
  >
    <div className="p-5 pb-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display text-base leading-snug">{service.title}</h3>
        <span className="font-display text-lg text-accent whitespace-nowrap">{service.price}</span>
      </div>
      <p className="font-body text-xs text-muted-foreground leading-relaxed">{service.description}</p>
    </div>
    <div className="px-5 pb-5">
      <a
        href={service.setmoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-foreground text-background text-xs font-body tracking-wider uppercase hover:bg-accent transition-colors duration-300"
      >
        Book Now
        <ExternalLink size={12} />
      </a>
    </div>
  </motion.div>
);

const CategorySection = ({ category, services, isActive, onToggle, index }: { 
  category: string; services: Service[]; isActive: boolean; onToggle: () => void; index: number 
}) => {
  const isOffers = category === "Offers";
  const singles = services.filter((s) => !isCourse(s.title));
  const courses = services.filter((s) => isCourse(s.title));
  const priceRange = services.reduce(
    (acc, s) => {
      const num = parseInt(s.price.replace(/[^0-9]/g, ""));
      if (isNaN(num) || s.price === "Free") return acc;
      return { min: Math.min(acc.min, num), max: Math.max(acc.max, num) };
    },
    { min: Infinity, max: 0 }
  );

  if (isOffers) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-border last:border-b-0"
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between py-6 text-left group/cat"
        >
          <div className="flex items-center gap-5">
            <Flame size={18} className="text-accent" />
            <h2 className="font-display text-xl md:text-2xl text-accent group-hover/cat:text-accent transition-colors">{category}</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body text-[10px] tracking-wider text-accent font-semibold uppercase hidden sm:inline">
              Limited Time
            </span>
            <span className="font-body text-[10px] tracking-wider text-muted-foreground">
              {services.length}
            </span>
            <ChevronDown
              size={16}
              className={`text-accent transition-transform duration-500 ${isActive ? "rotate-180" : ""}`}
            />
          </div>
        </button>
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-10 pl-0 md:pl-11">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <OfferCard key={service.title} service={service} />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-5 font-body">
                  Limited availability. Content may be taken for portfolio and marketing purposes. A consultation will be carried out prior to treatment.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-border last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group/cat"
      >
        <div className="flex items-center gap-5">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground w-6">{String(index).padStart(2, "0")}</span>
          <h2 className="font-display text-xl md:text-2xl group-hover/cat:text-accent transition-colors">{category}</h2>
        </div>
        <div className="flex items-center gap-4">
          {priceRange.min !== Infinity && (
            <span className="font-body text-xs text-muted-foreground hidden sm:inline">
              from £{priceRange.min}
            </span>
          )}
          <span className="font-body text-[10px] tracking-wider text-muted-foreground">
            {services.length}
          </span>
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform duration-500 ${isActive ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-10 pl-0 md:pl-11">
              {singles.length > 0 && (
                <>
                  {courses.length > 0 && (
                    <div className="flex items-center gap-3 mb-5">
                      <span className="font-body text-[10px] tracking-[0.25em] uppercase text-accent">Single Sessions</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {singles.map((service, i) => (
                      <ServiceCard key={i} service={service} index={i} />
                    ))}
                  </div>
                </>
              )}
              {courses.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-5 mt-8">
                    <span className="font-body text-[10px] tracking-[0.25em] uppercase text-accent">Courses</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {courses.map((service, i) => (
                      <ServiceCard key={i} service={service} index={i} />
                    ))}
                  </div>
                </>
              )}
              <p className="text-[10px] text-muted-foreground mt-5 font-body">
                By booking, you agree to our{" "}
                <Link to="/terms" className="underline hover:text-foreground transition-colors">clinic policies</Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BookingSystem = () => {
  usePageMeta(
    "Book Your Treatment | Hive Clinic Manchester",
    "Book your aesthetic treatment at Hive Clinic, Manchester City Centre. Lip fillers, skin treatments, anti-wrinkle, body contouring and more."
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>("Offers");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery && !filterCategory) return CATEGORIES;
    return CATEGORIES.filter((cat) => {
      if (filterCategory && cat !== filterCategory) return false;
      if (!searchQuery) return true;
      const services = SERVICES.filter((s) => s.category === cat);
      return services.some(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, filterCategory]);

  const filteredServices = (category: string) => {
    const services = SERVICES.filter((s) => s.category === category);
    if (!searchQuery) return services;
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  const totalTreatments = SERVICES.filter(s => s.category !== "Offers").length;

  return (
    <Layout>
      {/* Hero — dramatic full-bleed */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-foreground text-background">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-background/50 mb-8">Manchester City Centre</p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mb-6 leading-[0.95] tracking-tight">
              Book Your<br />
              <span className="italic font-light">Treatment</span>
            </h1>
            <p className="font-body text-sm md:text-base text-background/60 max-w-md mx-auto mb-12 leading-relaxed">
              {totalTreatments} treatments across {CATEGORIES.length - 1} categories. Browse, select, and secure your appointment.
            </p>
          </motion.div>

          {/* Quick action row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <a
              href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-background/20 px-8 py-3.5 text-xs font-body tracking-[0.2em] uppercase hover:bg-background hover:text-foreground transition-all duration-300"
            >
              <Clock size={14} />
              Book a Consultation — £25
            </a>
            <a
              href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=38c99c41-0af9-4b81-b67d-aae0369d51a4&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-background/20 px-8 py-3.5 text-xs font-body tracking-[0.2em] uppercase hover:bg-background hover:text-foreground transition-all duration-300"
            >
              <Sparkles size={14} />
              Returning Client — Free
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            onClick={scrollToServices}
            className="mx-auto flex flex-col items-center gap-2 text-background/30 hover:text-background/60 transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <span className="font-body text-[9px] tracking-[0.3em] uppercase">Browse Menu</span>
            <ArrowDown size={16} />
          </motion.button>
        </div>
      </section>

      {/* How it works — horizontal strip */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`p-6 md:p-8 ${i < 3 ? "border-r border-border" : ""} ${i < 2 ? "border-b md:border-b-0 border-border" : i === 2 ? "border-b md:border-b-0" : ""}`}
              >
                <span className="font-display text-2xl text-accent/40 block mb-2">{step.number}</span>
                <h3 className="font-display text-base mb-1">{step.title}</h3>
                <p className="font-body text-[11px] text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter bar */}
      <section className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border-0 font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              <button
                onClick={() => setFilterCategory(null)}
                className={`whitespace-nowrap px-3 py-1.5 font-body text-[10px] tracking-wider uppercase transition-colors ${
                  !filterCategory ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterCategory(filterCategory === "Offers" ? null : "Offers")}
                className={`whitespace-nowrap px-3 py-1.5 font-body text-[10px] tracking-wider uppercase transition-colors flex items-center gap-1 ${
                  filterCategory === "Offers" ? "bg-accent text-accent-foreground" : "bg-secondary/50 text-accent hover:text-accent"
                }`}
              >
                <Flame size={10} /> Offers
              </button>
              {CATEGORIES.slice(1, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                  className={`whitespace-nowrap px-3 py-1.5 font-body text-[10px] tracking-wider uppercase transition-colors ${
                    filterCategory === cat ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => {
                  const el = document.getElementById("services");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="whitespace-nowrap px-3 py-1.5 font-body text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground bg-secondary/50"
              >
                More ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Categories — accordion */}
      <section id="services" className="py-0">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="flex items-center justify-between py-10 border-b border-border">
            <div>
              <h2 className="font-display text-3xl md:text-4xl">Treatment Menu</h2>
              <p className="font-body text-xs text-muted-foreground mt-1">{totalTreatments} treatments available</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <Shield size={14} />
              <span className="font-body text-[10px] tracking-wider uppercase">CQC Compliant</span>
            </div>
          </div>

          <div>
            {filteredCategories.map((category, index) => {
              const services = filteredServices(category);
              if (services.length === 0) return null;
              return (
                <CategorySection
                  key={category}
                  category={category}
                  services={services}
                  isActive={activeCategory === category}
                  onToggle={() => setActiveCategory(activeCategory === category ? null : category)}
                  index={index}
                />
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-body text-sm text-muted-foreground">No treatments match your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setFilterCategory(null); }}
                className="font-body text-xs text-accent underline mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ — two-column layout */}
      <section className="py-24 mt-16 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-accent mb-4">Support</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">Common Questions</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Everything you need to know before your appointment.
              </p>
            </div>
            <div className="md:col-span-8">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border/60">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="font-body text-sm font-medium group-hover:text-accent transition-colors">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 ml-4 text-muted-foreground transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="font-body text-sm text-muted-foreground leading-relaxed pb-5">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Policy — minimal footer strip */}
      <section className="py-10 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
            20% deposit required to secure your appointment. Deposits are non-refundable. 48 hours notice required to reschedule.
            No-shows lose their deposit. Treatments are non-refundable; results vary. Cash or card accepted.
          </p>
          <Link to="/terms" className="font-body text-[10px] text-accent tracking-wider uppercase underline mt-3 inline-block hover:text-foreground transition-colors">
            View full booking policies
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default BookingSystem;
