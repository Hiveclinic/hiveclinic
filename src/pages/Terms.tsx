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
              <h2 className="font-display text-3xl mb-4">1. Booking & Deposits</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>A 20% deposit is required at the time of booking to secure your appointment. The remaining balance is payable on arrival.</li>
                <li>Deposits are strictly non-refundable.</li>
                <li>We accept cash and card payments.</li>
                <li>Pay-later options are available through Klarna and Clearpay for eligible treatments.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">2. Cancellations & Rescheduling</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>A minimum of 48 hours' notice is required to reschedule or cancel your appointment.</li>
                <li>Cancellations made with less than 48 hours' notice will result in forfeiture of your deposit.</li>
                <li>No-shows (failure to attend without prior notice) will result in full loss of the deposit paid.</li>
                <li>Repeated no-shows or late cancellations may result in being unable to book future appointments.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">3. Consultations</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Online consultations are available free of charge for all new and returning clients.</li>
                <li>In-person consultations are priced at £25. This fee is redeemable against the cost of treatment if you proceed.</li>
                <li>If you cancel, no-show, or do not follow up by booking a treatment, the £25 consultation fee is non-refundable.</li>
                <li>A consultation is required for all injectable treatments to assess suitability and ensure your safety.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">4. Treatments & Results</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>All treatments are non-refundable once administered.</li>
                <li>Results vary from person to person and are influenced by individual factors including skin type, lifestyle, and aftercare adherence.</li>
                <li>Hive Clinic does not guarantee specific outcomes. During your consultation, expected results will be discussed in detail.</li>
                <li>Photographs may be taken before and after treatment for clinical records. These will not be shared without your explicit written consent.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">5. Aftercare</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Full aftercare instructions are provided following every treatment. It is the client's responsibility to follow these guidelines.</li>
                <li>Failure to adhere to aftercare advice may affect results and Hive Clinic cannot be held liable for complications arising from non-compliance.</li>
                <li>If you experience any concerns post-treatment, please contact us immediately on +44 7795 008 114.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">6. Medical History & Suitability</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Clients must provide accurate and complete medical history prior to treatment.</li>
                <li>Certain medical conditions, medications, or allergies may render you unsuitable for specific treatments. Hive Clinic reserves the right to refuse treatment if it is deemed unsafe.</li>
                <li>Clients must be 18 years or older to receive injectable treatments.</li>
                <li>Pregnant or breastfeeding clients are not eligible for injectable treatments.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">7. Complaints</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>If you are dissatisfied with any aspect of your treatment or experience, please contact us within 14 days at hello@hiveclinicuk.com or +44 7795 008 114.</li>
                <li>All complaints will be investigated promptly and fairly. A review appointment may be offered where appropriate.</li>
                <li>Refunds are not offered for treatments already administered, but we will work with you to address any concerns.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">8. Liability</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>Hive Clinic is fully insured for all treatments offered.</li>
                <li>Hive Clinic accepts no liability for adverse reactions that fall within the normal range of expected side effects as discussed during consultation.</li>
                <li>Hive Clinic is not liable for any loss of personal belongings whilst on the premises.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">9. Privacy & Data</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>All personal and medical information is stored securely in accordance with UK GDPR regulations.</li>
                <li>Your data will never be shared with third parties without your explicit consent, except where required by law.</li>
                <li>Client records are retained for a minimum of 8 years in line with medical record-keeping guidelines.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">10. Contact</h2>
              <p>For any questions regarding these terms, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p>Hive Clinic</p>
                <p>25 Saint John Street, Manchester, M3 4DT</p>
                <p>Phone: +44 7795 008 114</p>
                <p>Email: hello@hiveclinicuk.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default Terms;
