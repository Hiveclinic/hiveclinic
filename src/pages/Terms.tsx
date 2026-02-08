import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const Terms = () => (
  <Layout>
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Terms & Conditions</h1>
          <p className="font-body text-muted-foreground mb-12">Last updated: February 2026</p>

          <div className="space-y-12 font-body text-foreground/80 leading-relaxed">

            <div>
              <h2 className="font-display text-3xl mb-4">1. Introduction</h2>
              <p>These Terms and Conditions govern the provision of all aesthetic treatments, consultations, and related services by Hive Clinic ("we", "us", "our"), located at 25 Saint John Street, Manchester, M3 4DT. By booking an appointment or receiving treatment, you ("the client") agree to be bound by these terms in full. Please read them carefully before proceeding.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">2. Booking & Deposits</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>A non-refundable deposit of 20% of the total treatment cost is required at the time of booking to secure your appointment.</li>
                <li>The remaining balance is payable on the day of your appointment, prior to treatment commencing.</li>
                <li>Deposits are non-refundable and non-transferable under any circumstances.</li>
                <li>Bookings are not confirmed until the deposit has been received and a confirmation has been issued by Hive Clinic.</li>
                <li>We accept payment by cash, debit card, and credit card. Pay-later options are available through Klarna and Clearpay for eligible treatments, subject to their own terms and conditions.</li>
                <li>All prices listed on our website and marketing materials are subject to change without prior notice. The price confirmed at the time of booking will be honoured for that appointment.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">3. Cancellations & Rescheduling</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>A minimum of 48 hours' notice is required to reschedule or cancel your appointment without penalty.</li>
                <li>Cancellations or rescheduling requests made with less than 48 hours' notice will result in the full forfeiture of your deposit.</li>
                <li>No-shows (failure to attend without any prior notice) will result in the complete loss of the deposit paid. No further communication regarding refunds will be entered into.</li>
                <li>Repeated no-shows (two or more) or persistent late cancellations may result in being required to pay the full treatment cost in advance to book future appointments, or being refused service at the discretion of Hive Clinic.</li>
                <li>Hive Clinic reserves the right to cancel or reschedule appointments due to unforeseen circumstances, illness, or emergencies. In such cases, your deposit will be transferred to a rescheduled date or refunded in full at your choice.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">4. Refund Policy</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>All treatments are non-refundable once administered. By consenting to treatment, you acknowledge that results cannot be guaranteed and individual outcomes may vary.</li>
                <li>Deposits are non-refundable regardless of the reason for cancellation, except where Hive Clinic cancels the appointment (see Section 3).</li>
                <li>If you are dissatisfied with your results, we encourage you to contact us to discuss your concerns. A complimentary review appointment may be offered where clinically appropriate, but this does not constitute entitlement to a refund.</li>
                <li>Prepaid treatment courses or packages are non-refundable and non-transferable once purchased. Unused sessions will expire 12 months from the date of purchase unless otherwise agreed in writing.</li>
                <li>Gift vouchers are non-refundable and must be used within 6 months of the date of issue. No change will be given for unused portions of a voucher.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">5. Consultations</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Online consultations (via WhatsApp or video call) are available free of charge for all new and returning clients.</li>
                <li>In-person consultations are priced at £25. This fee is fully redeemable against the cost of treatment if you choose to proceed on the same day or within 30 days of the consultation.</li>
                <li>If you cancel, no-show, or do not follow up by booking a treatment within 30 days, the £25 consultation fee is non-refundable.</li>
                <li>A consultation is mandatory for all injectable treatments (including but not limited to lip fillers, anti-wrinkle injections, dermal fillers, skin boosters, and fat dissolving injections) to assess suitability, discuss expectations, and ensure your safety.</li>
                <li>Hive Clinic reserves the right to refuse treatment following a consultation if the practitioner deems the treatment unsuitable or unsafe for the client.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">6. Treatments & Results</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>All treatments carry inherent risks and potential side effects, which will be discussed with you during your consultation. By proceeding with treatment, you confirm that you understand and accept these risks.</li>
                <li>Results vary from person to person and are influenced by individual factors including skin type, age, lifestyle, medical history, and adherence to aftercare instructions.</li>
                <li>Hive Clinic does not guarantee specific outcomes. Expected results and realistic timelines will be discussed during your consultation.</li>
                <li>Photographs may be taken before and after treatment for clinical records and quality assurance purposes. These images will be stored securely and will not be shared publicly, on social media, or with third parties without your explicit written consent.</li>
                <li>Top-up treatments (where applicable) must be booked within the timeframe advised by your practitioner. Top-ups requested outside this window may incur an additional charge.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">7. Aftercare</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Comprehensive aftercare instructions are provided following every treatment, both verbally and in writing. It is the client's responsibility to read, understand, and follow these guidelines.</li>
                <li>Failure to adhere to aftercare advice may adversely affect your results, increase the risk of complications, and invalidate any claim for corrective treatment.</li>
                <li>If you experience any unexpected side effects, swelling, pain, or concerns post-treatment, please contact us immediately on +44 7795 008 114. We aim to respond within 24 hours.</li>
                <li>Clients must avoid certain activities (e.g., intense exercise, alcohol, sun exposure) as directed in their aftercare plan. Specific restrictions vary by treatment.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">8. Medical History & Suitability</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Clients must provide accurate, complete, and up-to-date medical history prior to any treatment. This includes disclosing all medications, supplements, allergies, and pre-existing medical conditions.</li>
                <li>Failure to disclose relevant medical information may compromise the safety of your treatment and releases Hive Clinic from liability for any resulting adverse effects.</li>
                <li>Certain medical conditions, medications, or allergies may render you unsuitable for specific treatments. Hive Clinic reserves the absolute right to refuse treatment if it is deemed medically unsafe or inappropriate.</li>
                <li>Clients must be aged 18 years or older to receive any injectable treatment. Valid photographic identification may be requested.</li>
                <li>Clients who are pregnant, breastfeeding, or trying to conceive are not eligible for injectable treatments or certain skin treatments. Please inform us if this applies to you.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">9. Conduct & Clinic Etiquette</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>We kindly ask that clients arrive on time. Late arrivals of more than 15 minutes may result in a shortened treatment or rescheduling at the practitioner's discretion, with no refund of the deposit.</li>
                <li>Hive Clinic operates a zero-tolerance policy towards abusive, threatening, or disrespectful behaviour towards any member of our team. Clients who breach this policy will be refused service and may be banned from future appointments.</li>
                <li>Children are not permitted in the treatment room during procedures for health and safety reasons.</li>
                <li>We ask that mobile phones are switched to silent during your appointment.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">10. Complaints Procedure</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>If you are dissatisfied with any aspect of your treatment or experience at Hive Clinic, please contact us within 14 days at hello@hiveclinicuk.com or +44 7795 008 114.</li>
                <li>All complaints will be acknowledged within 48 hours and investigated thoroughly and fairly.</li>
                <li>Where appropriate, a review appointment will be offered at no additional cost to assess and address your concerns.</li>
                <li>Refunds are not offered for treatments already administered, but corrective or follow-up treatment may be recommended at the discretion of the practitioner.</li>
                <li>If a complaint cannot be resolved directly, Hive Clinic may recommend referral to an independent mediator or relevant professional body.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">11. Liability & Insurance</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Hive Clinic is fully insured for all treatments offered. Proof of insurance is available upon request.</li>
                <li>Hive Clinic accepts no liability for adverse reactions that fall within the normal range of expected side effects as discussed during your consultation and detailed in your aftercare information.</li>
                <li>Hive Clinic is not liable for any loss, damage, or theft of personal belongings whilst on our premises.</li>
                <li>Our total liability in connection with any treatment shall not exceed the total amount paid by you for that specific treatment.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">12. Privacy & Data Protection</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>All personal, medical, and financial information is stored securely in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</li>
                <li>Your data will never be shared with, sold to, or disclosed to third parties without your explicit consent, except where required by law or for the purposes of professional regulation.</li>
                <li>Client records (including medical history, consent forms, and treatment records) are retained for a minimum of 8 years in line with medical record-keeping guidelines issued by the General Medical Council (GMC).</li>
                <li>You have the right to request access to, correction of, or deletion of your personal data at any time by contacting us in writing.</li>
                <li>By providing your contact details, you consent to receiving appointment reminders, aftercare follow-ups, and occasional marketing communications. You may opt out of marketing communications at any time.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">13. Social Media & Marketing</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Before and after photographs will only be used for marketing or social media purposes with your explicit written consent.</li>
                <li>Testimonials and reviews shared on our platforms are genuine and published with client permission. We do not edit or fabricate reviews.</li>
                <li>By engaging with our social media content or submitting reviews, you grant Hive Clinic a non-exclusive licence to use this content for promotional purposes.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">14. Force Majeure</h2>
              <p>Hive Clinic shall not be liable for any failure to perform or delay in performing our obligations where such failure or delay results from events beyond our reasonable control, including but not limited to: natural disasters, pandemics, government restrictions, acts of terrorism, fire, flood, or power failure. In such circumstances, we will use reasonable endeavours to reschedule affected appointments.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">15. Payment Plans</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Hive Clinic offers 0% interest payment plans on selected treatments, allowing you to spread the cost of your treatment into manageable monthly instalments with no additional charges or hidden fees.</li>
                <li>Payment plans are available at the discretion of Hive Clinic and are subject to eligibility. Not all treatments qualify for payment plan options.</li>
                <li>A minimum initial payment (deposit) is required at the time of booking. The remaining balance will be divided into equal monthly instalments as agreed between you and Hive Clinic.</li>
                <li>For example, a £300 treatment may be split as £150 on the day, followed by 3 monthly payments of £50. The exact payment schedule will be confirmed prior to treatment.</li>
                <li>All instalment payments must be made on the agreed dates. Failure to make a payment on time may result in the suspension of future appointments and the outstanding balance becoming immediately due in full.</li>
                <li>Payment plans are separate from Klarna and Clearpay "buy now, pay later" options, which are also available on eligible treatments and are subject to their own terms and conditions.</li>
                <li>Payment plans are non-transferable and apply only to the specific treatment and client for which they were agreed.</li>
                <li>If you wish to cancel a treatment that is on a payment plan, any payments already made are non-refundable. The remaining balance may still be due depending on the stage of treatment.</li>
                <li>Hive Clinic reserves the right to withdraw or amend payment plan offerings at any time without prior notice.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">16. Multi-Session Courses & Packages</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Certain treatments are available as multi-session courses at a discounted rate compared to booking individual sessions separately.</li>
                <li>Course packages must be paid for in full at the time of purchase, unless a payment plan has been agreed (see Section 15).</li>
                <li>All sessions within a course must be completed within 12 months of the purchase date unless otherwise agreed in writing. Unused sessions after this period will expire without refund.</li>
                <li>Course packages are non-refundable and non-transferable once purchased. Sessions cannot be exchanged for alternative treatments.</li>
                <li>If a course is partially completed and the client wishes to discontinue, no refund will be given for remaining sessions.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">17. Changes to These Terms</h2>
              <p>Hive Clinic reserves the right to update, amend, or modify these Terms and Conditions at any time without prior notice. The most current version will always be available on our website. By continuing to book appointments or receive treatment after any changes, you agree to be bound by the updated terms.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">16. Governing Law</h2>
              <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">17. Contact Us</h2>
              <p>For any questions regarding these terms, or to raise a concern, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p className="font-semibold">Hive Clinic</p>
                <p>25 Saint John Street, Manchester, M3 4DT</p>
                <p>Phone: +44 7795 008 114</p>
                <p>Email: hello@hiveclinicuk.com</p>
                <p>WhatsApp: +44 7795 008 114</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default Terms;
