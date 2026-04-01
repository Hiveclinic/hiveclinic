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
  { title: "Facial Balancing - 3ml", price: "£420", description: "Bespoke treatment to harmonise the entire face. Saves compared to booking individually.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=8ddf4b41-045f-4cae-a783-f784a6b3c702&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 4ml", price: "£550", description: "A combination treatment to improve overall facial balance and structure.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=c3c559ab-5406-4fdd-b453-7eb15b7856e9&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Facial Balancing - 5ml", price: "£650", description: "Complete transformation enhancing facial structure and definition.", category: "Dermal Filler", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=ea66b275-520e-4998-b6c3-dc2f837a296f&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
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

  // Skin Treatments
  { title: "Glass Skin Treatment", price: "£140", description: "BioRePeel combined with hyaluronic acid infusion to smooth, refine, and hydrate.", category: "Skin Treatments", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a8e75820-b5b7-422b-9af0-d821ef086115&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

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

  // Fat Dissolve
  { title: "Fat Dissolving - Small Area", price: "£150", description: "Suitable for chin or bra bulge. No surgery, minimal downtime.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a30c5362-956b-4139-b14d-9daaf9a5569a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving - Medium Area", price: "£200", description: "Suitable for lower abdomen or flanks.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a837e5e4-835a-4afc-8fb1-aebcadb3528b&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving - Large Area", price: "£250", description: "Target stubborn pockets of fat, safely and effectively.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b29b95c5-530c-4434-8928-3df67e208095&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving Course - Small (3 Sessions)", price: "£400", description: "Course of 3 for chin or bra bulge area.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=a7ef0048-4066-4026-8233-e32390994478&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving Course - Medium (3 Sessions)", price: "£540", description: "Course of 3 for lower abdomen or flanks.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=b8538016-6d33-4c98-bd7b-e30b3b96d6b9&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },
  { title: "Fat Dissolving Course - Large (3 Sessions)", price: "£700", description: "Course of 3 for larger stubborn areas.", category: "Fat Dissolve", setmoreUrl: "https://hiveclinicuk.setmore.com/book?step=additional-products&products=44b0a6b9-2281-4638-b4f4-ffb136f7e6d5&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false" },

  // Body Contouring

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
