import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const Privacy = () => (
  <Layout>
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Privacy Policy</h1>
          <p className="font-body text-muted-foreground mb-12">Last updated: February 2026</p>

          <div className="space-y-12 font-body text-foreground/80 leading-relaxed">

            <div>
              <h2 className="font-display text-3xl mb-4">1. Data Controller</h2>
              <p>Hive Clinic, 25 Saint John Street, Manchester, M3 4DT ("we", "us", "our") is the data controller responsible for your personal data. You can contact our Data Protection contact at hello@hiveclinicuk.com or +44 7795 008 114.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">2. What Data We Collect</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Identity Data:</strong> Name, date of birth, photographic ID (for age verification).</li>
                <li><strong>Contact Data:</strong> Email address, telephone number, postal address.</li>
                <li><strong>Health Data:</strong> Medical history, allergies, medications, skin conditions, and treatment records (Special Category Data under UK GDPR Article 9).</li>
                <li><strong>Financial Data:</strong> Payment card details (processed securely via Stripe — we do not store full card numbers), payment history.</li>
                <li><strong>Visual Data:</strong> Before and after photographs (only with your explicit consent).</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies (see Section 8).</li>
                <li><strong>Communication Data:</strong> Enquiry messages, WhatsApp conversations, email correspondence.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">3. Lawful Basis for Processing</h2>
              <p>We process your data under the following legal bases (UK GDPR Article 6):</p>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Contract:</strong> To provide treatments you have booked and paid for.</li>
                <li><strong>Legitimate Interest:</strong> To manage our clinic operations, improve services, and send appointment reminders.</li>
                <li><strong>Consent:</strong> For marketing communications, before/after photographs, and non-essential cookies. You may withdraw consent at any time.</li>
                <li><strong>Legal Obligation:</strong> To comply with healthcare regulations and record-keeping requirements.</li>
                <li><strong>Vital Interest:</strong> In medical emergencies related to treatments administered.</li>
              </ul>
              <p className="mt-3">For health data (Special Category Data), we rely on <strong>explicit consent</strong> (Article 9(2)(a)) and <strong>provision of health care</strong> (Article 9(2)(h)).</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">4. How We Use Your Data</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li>To process and manage your bookings and payments.</li>
                <li>To provide safe, personalised aesthetic treatments.</li>
                <li>To send appointment confirmations, reminders, and aftercare instructions.</li>
                <li>To maintain accurate medical records as required by professional regulations.</li>
                <li>To communicate with you about your treatments and respond to enquiries.</li>
                <li>To send marketing communications (only with your consent — you can unsubscribe at any time).</li>
                <li>To improve our website and services through anonymised analytics.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">5. Data Sharing</h2>
              <p>We will <strong>never sell</strong> your personal data. We may share data with:</p>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Payment processors:</strong> Stripe, Klarna, Clearpay (for secure payment processing).</li>
                <li><strong>Email services:</strong> Resend (for transactional emails like confirmations and reminders).</li>
                <li><strong>Professional bodies:</strong> If required by healthcare regulations or law enforcement.</li>
                <li><strong>Insurance providers:</strong> In the event of a claim or incident.</li>
              </ul>
              <p className="mt-3">All third-party processors are GDPR-compliant and bound by data processing agreements.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">6. Data Retention</h2>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Medical records:</strong> 8 years from the date of last treatment (in line with GMC guidance).</li>
                <li><strong>Financial records:</strong> 7 years (HMRC requirements).</li>
                <li><strong>Marketing consent records:</strong> Until consent is withdrawn.</li>
                <li><strong>Website analytics:</strong> 26 months (anonymised).</li>
                <li><strong>Enquiry data:</strong> 2 years from initial contact.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">7. Your Rights (UK GDPR)</h2>
              <p>You have the following rights:</p>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Right of Access:</strong> Request a copy of all personal data we hold about you (Subject Access Request).</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data.</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data (subject to legal retention requirements).</li>
                <li><strong>Right to Restrict Processing:</strong> Request we limit how we use your data.</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time without affecting the lawfulness of prior processing.</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, contact us at hello@hiveclinicuk.com. We will respond within 30 days.</p>
              <p className="mt-2">If you are not satisfied with our response, you have the right to lodge a complaint with the <strong>Information Commissioner's Office (ICO)</strong> at <a href="https://ico.org.uk" className="underline hover:text-gold" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">8. Cookies</h2>
              <p>Our website uses the following types of cookies:</p>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Essential cookies:</strong> Required for the website to function (session management, authentication). Cannot be disabled.</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site (Google Analytics). Only set with your consent.</li>
                <li><strong>Marketing cookies:</strong> Used for targeted advertising (Meta Pixel). Only set with your consent.</li>
              </ul>
              <p className="mt-3">You can manage your cookie preferences at any time via the cookie banner or by clearing your browser cookies.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">9. International Transfers</h2>
              <p>Your data may be processed by third-party services based outside the UK (e.g., Stripe, Resend). Where this occurs, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) and adequacy decisions, in compliance with UK GDPR Chapter V.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">10. Data Security</h2>
              <p>We implement appropriate technical and organisational measures to protect your data, including encrypted storage, access controls, secure payment processing (PCI DSS compliant via Stripe), and regular security reviews. However, no method of electronic transmission or storage is 100% secure.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">11. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. The latest version will always be available on our website. Material changes will be communicated to you via email where possible.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl mb-4">12. Contact Us</h2>
              <p>For any privacy-related queries or to exercise your rights:</p>
              <div className="mt-4 space-y-2">
                <p className="font-semibold">Hive Clinic</p>
                <p>25 Saint John Street, Manchester, M3 4DT</p>
                <p>Email: hello@hiveclinicuk.com</p>
                <p>Phone: +44 7795 008 114</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default Privacy;
