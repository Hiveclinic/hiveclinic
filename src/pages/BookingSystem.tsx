import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ExternalLink, Clock, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";

type Service = {
  title: string;
  price: string;
  description: string;
  category: string;
  setmoreUrl: string;
};

const SERVICES: Service[] = [
  // Consultations
  { title: "Skin Consultation", price: "£25", description: "Full skin assessment and personalised treatment plan. Suitable if you are unsure what to book.", category: "Consultations", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Prescriber Consultation (Anti-Wrinkle)", price: "£25", description: "Required before anti-wrinkle treatments. Includes medical assessment.", category: "Consultations", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=dd88f406-0705-4cf0-a38a-39163a47d63b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Anti-Wrinkle Consultation", price: "£30", description: "Face-to-face consultation with our prescriber. Redeemable if you proceed within 14 days.", category: "Consultations", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a5750435-49e2-4958-b48c-b87b91a55b5e&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Repeat Session Booking", price: "Free", description: "For returning clients scheduling a repeat session within their treatment plan.", category: "Consultations", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=38c99c41-0af9-4b81-b67d-aae0369d51a4&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Review Appointment (2-3 Weeks)", price: "Free", description: "Complimentary follow-up to ensure results have settled. Minor adjustments included if required.", category: "Consultations", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=5650870b-f532-42d1-b12b-640f7d4cb8ae&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Dermal Filler
  { title: "Lip Filler - 1ml", price: "£150", description: "Enhances shape, symmetry, and definition while maintaining a natural balance.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=8316cf5c-ce1f-4868-83be-6e95c9390c75&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Lip Filler - 0.5ml", price: "£120", description: "Subtle volume, hydration and natural shape enhancement. Ideal for first-time clients.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=ac84c482-efa0-4be7-a28a-4e25bf08afaf&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 2ml", price: "£200", description: "Combination of lips, chin, cheeks and jawline to improve overall facial balance.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=cb094103-11f5-475c-8c06-d30ea7f30dfe&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 3ml", price: "£350", description: "Bespoke treatment to harmonise the entire face. Saves compared to booking individually.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a90f7b38-7cbd-4761-8810-ced8f6aa817c&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 4ml", price: "£550", description: "A combination treatment to improve overall facial balance and structure.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=c3c559ab-5406-4fdd-b453-7eb15b7856e9&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 5ml", price: "£500", description: "Complete transformation enhancing facial structure and definition.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=e8b58213-6566-4cb6-a7fc-f654bb3eaede&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 7ml", price: "£650", description: "Signature sculpting experience. Includes complimentary skin booster top-up.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b4bc4ffc-ce67-4c01-9484-8a7a3256b36e&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Nose Filler (Non-surgical Rhinoplasty)", price: "£200", description: "Balances and refines the nose shape for a more symmetrical profile.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=61946dbc-165f-4da0-a937-42fffdb940ca&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Tear Trough Filler", price: "£200", description: "Brightens under-eye hollows, reducing tired appearance and restoring volume.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=3925ea1d-538d-4586-a273-ae7f3d12935b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Jawline Filler (Per ML)", price: "£170", description: "Creates definition and structure through precise contouring.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=543f6a92-b63b-426d-8f1e-386e0f6f16ec&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Cheek Filler (Per ML)", price: "£160", description: "Restores volume and lift to the mid-face, enhancing contour and structure.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=474efd20-68cf-4214-a750-6b44c51759b4&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Chin Filler", price: "£160", description: "Refines the facial profile, balances proportions, and defines the jawline.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=11778a78-5033-4823-a394-924b62d5d859&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Marionette Lines", price: "£150", description: "Targets lines from mouth corners to chin, lifting the lower face.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=63dbac2f-2b18-463b-90bd-7bcce84e10ea&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Smile Lines (Nasolabial Folds)", price: "£150", description: "Softens deep creases around the mouth, restoring smoothness.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=6e0a1319-e929-43bf-a70f-ab404877f86c&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Filler Dissolve", price: "£100", description: "Removes unwanted or migrated filler safely. Patch test required 24hr prior.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=182a2a64-610e-4762-82d5-e1dd88d16e47&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Touch Up / Refresh (Existing Clients)", price: "£95", description: "Small refinements or maintenance of existing filler within 6 months.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=39c8518c-bf5f-41a4-8bd3-a8a2a66b0def&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Anti-Wrinkle
  { title: "Anti-Wrinkle - 1 Area", price: "£140", description: "Targets forehead lines, frown lines, or crow's feet to soften fine lines.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=6a7d267b-5d4a-4845-a095-0b5a70f28c8b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Anti-Wrinkle - 2 Areas", price: "£179", description: "Includes prescriber consultation and free top-up if required.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=5fff4c03-6f97-4eb4-8c56-fd97af50a8a2&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Anti-Wrinkle - 3 Areas", price: "£220", description: "Full upper-face treatment covering forehead, frown, and eyes. Free top-up included.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=5db265df-79a5-4d69-bf35-9e5dea52b94b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Anti-Wrinkle - 6 Areas", price: "£360", description: "Full facial rejuvenation including forehead, lower face and neck.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b12a0bbf-58d7-4a87-a6aa-0d9847fa7887&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Masseter (Jaw Slimming)", price: "£240", description: "Relaxes the jaw muscle for a slimmer, more contoured lower face.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=9fb8c05a-02d8-42e3-8655-d5cef41642cc&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Lip Flip", price: "£85", description: "Enhances the upper lip without adding volume for a soft, lifted look.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a726318a-1942-45b7-a888-38c38ffb72cb&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Bunny Lines", price: "£140", description: "Softens fine lines on the nose.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=34455ba8-5667-48e9-bd97-2e4b3839675a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Gummy Smile", price: "£140", description: "Reduces gum visibility when smiling.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=56c75086-15ad-43a5-a79f-096c15231f81&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Brow Lift", price: "£170", description: "Creates a subtle lift to the brow area.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=efd05bed-8c75-40b4-a081-efc69d87d263&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Excessive Sweating (Underarms)", price: "£350", description: "Targets excessive sweating in the underarm area.", category: "Anti-Wrinkle", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=f270ee63-8fe4-4688-a951-ebe96369801f&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Chemical Peels
  { title: "BioRePeel Face", price: "£95", description: "Medical-grade peel to improve acne, texture, and pigmentation with minimal downtime.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=e065bcdb-44e5-4f70-bb9c-6c62fdcc5490%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "BioRePeel Body", price: "£110", description: "Targets back, chest, or shoulders for acne and pigmentation.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b87df557-d48b-404c-bd76-c148fa8cc78f%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Level 1 Chemical Peel (Face)", price: "£85", description: "Treats hormonal breakouts, scarring and rough texture. Includes cleanse and mask.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=f8a3e462-233e-45cf-833d-ecf8c1eb870d&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Level 1 Chemical Peel (Back)", price: "£95", description: "Treats hormonal breakouts, scarring and rough texture on the back.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=88651283-8e16-464b-ab93-47bdbaa2dc69&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Level 2 Chemical Peel (Face)", price: "£110", description: "Strong depigmenting peel for dark spots, melasma and uneven tone.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=5345012f-74ea-4ac4-b607-23fa74fe5752&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Level 2 Chemical Peel (Back)", price: "£125", description: "Intensive peel to treat hyperpigmentation and textural buildup on the back.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=0c80f5fc-b09c-41bf-8ff6-e0ef83495683&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "BioRePeel Face Course (3 Sessions)", price: "£270", description: "Course of 3 treatments. Recommended for ongoing skin concerns.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=90aa375d-c263-4b5b-a0c8-91de5ee0b069%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "BioRePeel Body Course (3 Sessions)", price: "£300", description: "Course of 3 treatments for one body area.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=2de6d961-d715-452d-9b75-81889ce871e0%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Level 1 Peel Course of 3 (Face)", price: "£230", description: "Course of 3 for hormonal breakouts, scarring and texture.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=59cadb1d-77f7-4c22-accf-15df8a830dcf&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Level 1 Peel Course of 3 (Back)", price: "£260", description: "Course of 3 for back breakouts, scarring and texture.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=08ae34ae-c60b-4025-b842-009e175deb71&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Level 2 Peel Course of 3 (Face)", price: "£300", description: "Course of 3 for dark spots, melasma and uneven tone.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=718b17e6-3064-4a2f-8a75-22c5dad2fb0e&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Level 2 Peel Course of 3 (Back)", price: "£330", description: "Course of 3 for back hyperpigmentation and scarring.", category: "Chemical Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=d25a3b1e-1cdc-476a-9751-a9316a9b258a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Skin Treatments
  { title: "Glass Skin Treatment", price: "£140", description: "BioRePeel combined with hyaluronic acid infusion to smooth, refine, and hydrate.", category: "Skin Treatments", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a8e75820-b5b7-422b-9af0-d821ef086115&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Skin Boosters
  { title: "Seventy Hyal Skin Booster", price: "£160", description: "Deep hydration to improve glow, elasticity, and skin firmness.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=e73733a7-2ab0-42be-996a-3e616266aea4&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Polynucleotides Skin Booster", price: "£180", description: "Regenerates skin at a cellular level for long-term rejuvenation and repair.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=f4ee526e-ca38-4a06-ab87-c7b08fc8cb83&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Profhilo Skin Booster", price: "£250", description: "Advanced injectable for skin laxity and hydration. Course of 2 recommended.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=0a80a52a-8c1f-412a-ab23-5e5ffb82ee00&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Under Eye Skin Booster", price: "£130", description: "Injectable treatment for dark circles and fine lines.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=709029cc-37c0-47cd-b569-0e4d834be3b2&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Lumi Eyes", price: "£140", description: "Brightens, hydrates, and reduces dark circles and fine lines under the eyes.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=83d549d7-424b-49ef-b2b3-64e77065748f&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Seventy Hyal Course (3 Sessions)", price: "£380", description: "3 sessions, 4 weeks apart for best results.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=757adde3-e573-4304-acaf-6cb21bb3bc16&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Under Eye Booster Course (3 Sessions)", price: "£360", description: "3 sessions targeting dark circles and fine lines.", category: "Skin Boosters", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=6a9f3d91-c97a-4051-a8be-6b5642049183&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Microneedling
  { title: "Microneedling with Hydrating Serum", price: "£160", description: "Dr Pen microneedling with hyaluronic acid serum.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=63c50b04-45cf-4989-a970-7c9462548d27&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Microneedling with Skin Booster", price: "£200", description: "Microneedling combined with mesotherapy or booster infusion.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=45f07d61-f94a-4934-b79c-9a6b7f9b4000&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Microneedling + Skin Booster", price: "£85", description: "Precision microneedling with infused skin booster serum for deep rejuvenation.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=d22757cb-ae98-4cf8-b412-0810c0b380c6&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Face Texture Repair (Scars + Pores + Glow)", price: "£130", description: "Microneedling and chemical peel combination to improve texture and scarring.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=0ceb2b04-a476-47af-85ea-8ca892a2f9c0&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Stretch Mark Microneedling", price: "£180", description: "Stimulates collagen to improve stretch mark texture. 3-6 sessions recommended.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=c488f018-6641-441b-87e4-31cd909d2289&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Stretch Mark Repair (Salmon DNA)", price: "£150", description: "Microneedling with Salmon DNA and hyaluronic acid to fade and repair stretch marks.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=ef804aa8-97f7-488e-a2e0-0818c4ced8b0&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Microneedling Course (3 Sessions)", price: "£420", description: "3 sessions to improve texture, tone, and mild scarring.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=3ce99ae1-9115-406b-9adf-04b589cb24b7&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Microneedling + Booster Course (3 Sessions)", price: "£540", description: "3 sessions for deeper skin rejuvenation.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=6f934644-312c-4a60-a34e-5d1f73c61404&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Stretch Mark Course (3 Sessions)", price: "£480", description: "Course of 3 treatments for improved results.", category: "Microneedling", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=eea78d4a-22f3-4495-a1bb-29d1511c1379&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // HydroFacial
  { title: "Hydrafacial", price: "£150", description: "Deep cleansing facial to exfoliate, extract, and hydrate. All skin types.", category: "HydroFacial", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=1b7e4418-5f0a-452a-96b2-11fe4e558825&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Glass Skin Hydrafacial", price: "£190", description: "Hydrafacial cleanse, gentle exfoliation, and targeted skin booster injection.", category: "HydroFacial", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=960394ee-c6d8-4f5f-8831-fd0fa67319de&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Intimate Pigment Treatment
  { title: "Bikini Line Pigment Treatment", price: "£110", description: "Chemical exfoliation and pigment control for bikini line discolouration.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a0cb1ac1-c09b-4216-9aaa-95cd11165fba&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Underarm Pigment Treatment", price: "£110", description: "Improves underarm pigmentation using controlled exfoliation.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=7c6b3268-02d3-40e9-bf3f-d89bb16cd463&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Inner Thigh Pigment Treatment", price: "£120", description: "Targets pigmentation caused by friction between the thighs.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=f9096089-1667-4630-b51d-457fd894278b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Bikini Line Course (3 Sessions)", price: "£300", description: "Course of 3 to improve pigmentation over time.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=5dabccef-7bf7-45ee-a467-77eb05bf6e27&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Underarm Course (3 Sessions)", price: "£300", description: "Course of 3 to improve pigmentation over time.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=685903fd-8552-4de3-a743-b50cf5f05ca9&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Inner Thigh Course (3 Sessions)", price: "£330", description: "Course of 3 to improve pigmentation over time.", category: "Intimate Pigment Treatment", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=af12aff6-88a0-4fe4-90a9-d98b58dfe0f7&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Intimate Peels
  { title: "Intimate Peel - Small Areas", price: "£75", description: "Underarms, knees, elbows. 3-6 sessions recommended.", category: "Intimate Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=03d204e6-3e03-4171-a325-8a904a1ad586&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Medium Areas", price: "£95", description: "Bikini line, inner thighs, chest. 3-6 sessions recommended.", category: "Intimate Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=7d648b0f-31e5-4b47-a878-ac50723b64fc&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Large Areas", price: "£120", description: "Full intimate area, stomach. 3-6 sessions recommended.", category: "Intimate Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=4be48be9-6bd7-4ad5-bb79-7f6b109d7cdc&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Small (Course of 3)", price: "£210", description: "Underarms, knees, elbows. Course of 3 sessions.", category: "Intimate Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=226e134d-8341-46ea-9822-0b87a9d7610a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Medium (Course of 3)", price: "£265", description: "Bikini line, inner thighs, chest. Course of 3 sessions.", category: "Intimate Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=595463fc-3581-4f56-926a-2cce30920e92&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Intimate Peel - Large (Course of 3)", price: "£330", description: "Full intimate area, stomach. Course of 3 sessions.", category: "Intimate Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=f72dbb04-f6b4-4106-b973-af2c1df9e749&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Melanostop
  { title: "Melanostop - Hands", price: "£120", description: "Depigmenting peel for sun damage, dark spots and uneven tone on hands.", category: "Melanostop Body Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=ee852217-6fae-464d-9baa-5535886f5b32&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Melanostop - Underarms", price: "£150", description: "Peel for underarm pigmentation and uneven tone.", category: "Melanostop Body Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=804528a4-4ac9-47b7-9300-1ce35dbbc931&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Melanostop - Elbows and Knees", price: "£130", description: "Depigmenting peel for dark elbows and knees.", category: "Melanostop Body Peels", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=51751850-aa49-49d8-9305-aefc7b77a1de&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Fat Dissolve
  { title: "Fat Dissolving - Small Area", price: "£150", description: "Suitable for chin or bra bulge. No surgery, minimal downtime.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a30c5362-956b-4139-b14d-9daaf9a5569a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving - Medium Area", price: "£200", description: "Suitable for lower abdomen or flanks.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a837e5e4-835a-4afc-8fb1-aebcadb3528b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving - Large Area", price: "£250", description: "Target stubborn pockets of fat, safely and effectively.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b29b95c5-530c-4434-8928-3df67e208095&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving Course - Small (3 Sessions)", price: "£400", description: "Course of 3 for chin or bra bulge area.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a7ef0048-4066-4026-8233-e32390994478&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving Course - Medium (3 Sessions)", price: "£540", description: "Course of 3 for lower abdomen or flanks.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b8538016-6d33-4c98-bd7b-e30b3b96d6b9&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving Course - Large (3 Sessions)", price: "£700", description: "Course of 3 for larger stubborn areas.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=44b0a6b9-2281-4638-b4f4-ffb136f7e6d5&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Body Contouring
  { title: "Body Sculpting - Single Area", price: "£75", description: "Non-invasive sculpting for stomach, waist, thighs or arms. No downtime.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=3944f21d-0b8f-4b4b-a443-a10d99824810&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Body Sculpting - Two Areas", price: "£110", description: "Two areas in one session, ideal for stomach and waist or hips and thighs.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=760d7916-217b-46ce-8b44-adcdcdb0c48d&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Lymphatic Drainage - Stomach and Waist", price: "£95", description: "Reduces bloating, flushes toxins, and enhances body contours.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=5cbf58a0-7bec-4b10-8ea7-436cd4eddf5e&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Lymphatic Drainage - Full Body", price: "£135", description: "Full body lymphatic drainage excluding face.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=14e21cfe-2d39-489e-8c8f-74641c0787c7&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Body Sculpting + Lymphatic Drainage", price: "£120", description: "Sculpting followed by lymphatic drainage for enhanced results.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=04c3e044-763b-4a0d-8e61-e360db1a46ea&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolve + Body Sculpting", price: "£220", description: "Fat dissolving injections followed by body sculpting for enhanced results.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=2d23bfcd-995f-4b3c-8946-c9085f8a3182&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolve + Sculpting + Lymphatic Drainage", price: "£260", description: "Full body contouring session combining all three treatments.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=36a7f662-d39f-44a2-9caa-880129299f86&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Body Sculpting Course of 3 (Single Area)", price: "£260", description: "3 sessions for one area. Gradual fat reduction and skin firmness.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b501e818-aae8-4cc8-87ac-63eab36bcc24&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Body Sculpting Course of 6 (Single Area)", price: "£380", description: "6 sessions for one area. Best value for visible results.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=20d7af19-9c30-4b07-847d-9e959a399e53&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Body Sculpting Course of 3 (Two Areas)", price: "£300", description: "3 sessions treating two areas per session.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=48a27801-f025-400c-92b4-ee112e4639f5&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Body Sculpting Course of 6 (Two Areas)", price: "£540", description: "6 sessions treating two areas. Maximum contouring results.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=eee38f01-442f-4325-b017-30ad74817bd3&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Lymphatic Drainage - 3 Session Package", price: "£255", description: "3 targeted sessions to reduce bloating and define shape.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=892a3242-9637-4dd7-9643-7170551cbf5b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Lymphatic Drainage - 5 Session Package", price: "£400", description: "5 sessions for visible results in bloating and shape definition.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=6b5576ad-d5d7-4014-a243-76e319229b53&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolve + Body Sculpting Course", price: "£420", description: "1 fat dissolve session + 3 body sculpting sessions for one area.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=c4510428-19e9-477f-b248-ad1b428bc536&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Ultimate Body Reset Programme", price: "£600", description: "1 fat dissolve + 6 body sculpting + 1 lymphatic drainage session.", category: "Body Contouring", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=fd4bd0da-4a9a-44bd-8b4d-15009718728a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Wellness
  { title: "B12 Injection", price: "£35", description: "Supports energy levels and general wellbeing.", category: "Wellness", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=180d9d60-d61b-4f6c-bef1-935b5b4e45c6&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Biotin Injection", price: "£35", description: "Supports hair, skin, and nail health.", category: "Wellness", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=ee9b76d4-aaf0-470f-b877-6339d92a6426&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // IV Drip Therapy
  { title: "IV Vitamin Drip", price: "£180", description: "Vitamin infusion delivered directly into the bloodstream.", category: "IV Drip Therapy", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b8d150c4-4a99-4ac3-8e78-a82fbe3b6245&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "IV Booster Add-On", price: "£40", description: "Add Vitamin C, Biotin, or Glutathione to your treatment.", category: "IV Drip Therapy", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=98f98970-3e24-4d61-87ee-ad7ae464d5c5&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
];

const CATEGORIES = [
  "Consultations",
  "Dermal Filler",
  "Anti-Wrinkle",
  "Chemical Peels",
  "Skin Treatments",
  "Skin Boosters",
  "Microneedling",
  "HydroFacial",
  "Intimate Pigment Treatment",
  "Intimate Peels",
  "Melanostop Body Peels",
  "Fat Dissolve",
  "Body Contouring",
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
  { number: "01", title: "Choose your treatment", description: "Browse our full menu and select the service that suits you." },
  { number: "02", title: "Select your time", description: "Pick an available date and time that works for your schedule." },
  { number: "03", title: "Secure your appointment", description: "Pay your 20% deposit to confirm your booking." },
  { number: "04", title: "Receive confirmation", description: "You will receive a confirmation email with all the details." },
];

const ServiceCard = ({ service }: { service: Service }) => (
  <div className="group border border-border p-6 flex flex-col justify-between h-full hover:border-accent/40 transition-colors">
    <div>
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-display text-lg leading-tight">{service.title}</h3>
        <span className="font-body text-sm text-accent whitespace-nowrap font-medium">{service.price}</span>
      </div>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{service.description}</p>
    </div>
    <div>
      <a
        href={service.setmoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm font-body tracking-wide hover:bg-primary/90 transition-colors w-full justify-center"
      >
        Book Now
        <ExternalLink size={14} />
      </a>
      <p className="text-xs text-muted-foreground mt-3 text-center font-body">
        By booking, you agree to our{" "}
        <Link to="/terms" className="underline hover:text-foreground transition-colors">booking policies</Link>
      </p>
    </div>
  </div>
);

const isCourse = (title: string) =>
  /course|sessions\)/i.test(title) || /\d\s*sessions/i.test(title);

const CategorySection = ({ category, services }: { category: string; services: Service[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const singles = services.filter((s) => !isCourse(s.title));
  const courses = services.filter((s) => isCourse(s.title));

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-2 text-left group"
      >
        <div className="flex items-center gap-4">
          <h2 className="font-display text-xl md:text-2xl">{category}</h2>
          <span className="font-body text-xs text-muted-foreground tracking-wide">
            {services.length} {services.length === 1 ? "service" : "services"}
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-8 px-2"
        >
          {singles.length > 0 && (
            <>
              {courses.length > 0 && (
                <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-4">Single Sessions</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {singles.map((service, i) => (
                  <ServiceCard key={i} service={service} />
                ))}
              </div>
            </>
          )}
          {courses.length > 0 && (
            <>
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-4 mt-8">Courses</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((service, i) => (
                  <ServiceCard key={i} service={service} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

const BookingSystem = () => {
  usePageMeta(
    "Book Your Treatment | Hive Clinic Manchester",
    "Book your aesthetic treatment at Hive Clinic, Manchester City Centre. Lip fillers, skin treatments, anti-wrinkle, body contouring and more."
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-5xl md:text-7xl mb-6">Book Your Treatment</h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Refined, natural results. Select your treatment below to book directly.
            </p>
            <button
              onClick={scrollToServices}
              className="inline-flex items-center gap-2 border border-foreground px-8 py-3 font-body text-sm tracking-wide hover:bg-foreground hover:text-background transition-colors"
            >
              View Treatments
              <ArrowDown size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 border-b border-border">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-2xl text-center mb-8">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border p-8 hover:border-accent/40 transition-colors text-center"
            >
              <div className="w-10 h-10 border border-accent/30 flex items-center justify-center mx-auto mb-4">
                <Clock size={18} className="text-accent" />
              </div>
              <h3 className="font-display text-xl mb-2">Skin Consultation</h3>
              <p className="font-body text-sm text-muted-foreground mb-1">20 mins - £25</p>
              <p className="font-body text-xs text-muted-foreground">Not sure what treatment you need? Start here.</p>
            </a>
            <a
              href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=38c99c41-0af9-4b81-b67d-aae0369d51a4&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border p-8 hover:border-accent/40 transition-colors text-center"
            >
              <div className="w-10 h-10 border border-accent/30 flex items-center justify-center mx-auto mb-4">
                <Clock size={18} className="text-accent" />
              </div>
              <h3 className="font-display text-xl mb-2">Returning Client</h3>
              <p className="font-body text-sm text-muted-foreground mb-1">30 mins - Free</p>
              <p className="font-body text-xs text-muted-foreground">Book your next session within a treatment course.</p>
            </a>
          </div>
        </div>
      </section>

      {/* Treatment Categories */}
      <section id="services" className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl text-center mb-12">All Treatments</h2>
          <div>
            {CATEGORIES.map((category) => {
              const services = SERVICES.filter((s) => s.category === category);
              if (services.length === 0) return null;
              return <CategorySection key={category} category={category} services={services} />;
            })}
          </div>
        </div>
      </section>

      {/* How Booking Works */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl text-center mb-14">How Booking Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <span className="font-display text-3xl text-accent/60 block mb-3">{step.number}</span>
                <h3 className="font-display text-lg mb-2">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl text-center mb-12">Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="font-body font-medium">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 ml-4 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pb-5"
                  >
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Policy */}
      <section className="py-12 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            20% deposit required to secure your appointment. Deposits are non-refundable. 48 hours notice required to reschedule.
            No-shows lose their deposit. Treatments are non-refundable; results vary. Cash or card accepted.
          </p>
          <Link to="/terms" className="font-body text-xs text-accent underline mt-3 inline-block">
            View full booking policies
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default BookingSystem;
