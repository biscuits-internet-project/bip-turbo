import { Card, CardContent } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Terms of Service | Biscuits Internet Project" },
    {
      name: "description",
      content: "Terms of Service for the Biscuits Internet Project.",
    },
  ];
}

export default function Terms() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="page-heading">TERMS OF SERVICE</h1>
      </div>

      <Card variant="panel">
        <CardContent className="p-6">
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-content-text-secondary text-sm">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">1. Acceptance of Terms</h2>
              <p className="text-content-text-secondary">
                By accessing, using, or creating an account on the Biscuits Internet Project ("the BIP", "we", "us", or
                "our"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service
                ("Terms") and our Privacy Policy. If you do not agree with any part of these terms, you may not use our
                service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">2. Description of Service</h2>
              <p className="text-content-text-secondary">
                The BIP is an unofficial fan website dedicated to the Disco Biscuits community. We provide information
                about shows, setlists, songs, venues, and related content. Our service allows users to contribute
                reviews, track attendance, rate performances, and participate in community discussions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">3. User Accounts</h2>
              <p className="text-content-text-secondary mb-3">
                To access certain features, you must create an account by providing accurate information. You are
                responsible for:
              </p>
              <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate, current, and complete information</li>
                <li>Updating your information to keep it accurate and current</li>
              </ul>
              <p className="text-content-text-secondary mt-3">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in harmful
                behavior.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">4. User-Generated Content</h2>
              <p className="text-content-text-secondary mb-3">
                Users may submit reviews, comments, images, and other content ("User Content"). By submitting User
                Content, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                <li>You own or have the necessary rights to the content</li>
                <li>Your content does not infringe on third-party rights</li>
                <li>Your content complies with applicable laws and these Terms</li>
                <li>Your content is not defamatory, harassing, or harmful</li>
              </ul>
              <p className="text-content-text-secondary mt-3">
                You grant the BIP a non-exclusive, worldwide, royalty-free, perpetual license to use, display,
                reproduce, modify, and distribute your User Content in connection with our service. You retain ownership
                of your content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">
                5. Intellectual Property and Copyright
              </h2>
              <p className="text-content-text-secondary mb-3">
                <strong>Important Notice:</strong> All musical content, including but not limited to songs, lyrics,
                setlists, and performance recordings referenced on the BIP, are the intellectual property of the Disco
                Biscuits and their respective copyright holders. This material is protected by copyright law.
              </p>
              <p className="text-content-text-secondary mb-3">
                The BIP is an unofficial fan site operating under fair use principles for educational and informational
                purposes only. Users are strictly prohibited from:
              </p>
              <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                <li>Commercial use of any copyrighted material</li>
                <li>Distributing or selling copyrighted songs or recordings</li>
                <li>Using lyrics, setlists, or other copyrighted content for profit</li>
                <li>Reproducing copyrighted material beyond fair use limits</li>
              </ul>
              <p className="text-content-text-secondary mt-3">
                We respect intellectual property rights and will respond to valid DMCA notices. If you believe your
                copyrighted work has been infringed, please contact us through our contact form.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">6. Prohibited Uses and Conduct</h2>
              <p className="text-content-text-secondary mb-3">You agree not to use the BIP to:</p>
              <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Harass, threaten, or intimidate other users</li>
                <li>Post spam, advertisements, or commercial content</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Impersonate others or provide false information</li>
                <li>Scrape or harvest user data without permission</li>
                <li>Interfere with the operation of our service</li>
                <li>Use our service for any commercial purpose without authorization</li>
                <li>Violate copyright laws or intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">7. Privacy and Data Use</h2>
              <p className="text-content-text-secondary">
                We use cookies, Google Analytics, and other tracking technologies to improve our service and understand
                user behavior. We will never sell your personal data to third parties. For complete information about
                our data practices, please review our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">8. Content Moderation</h2>
              <p className="text-content-text-secondary">
                We reserve the right to review, edit, or remove any User Content that violates these Terms or is
                otherwise objectionable. We are not obligated to monitor content but may do so at our discretion. Users
                can report inappropriate content through our contact form.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">9. Disclaimers and Warranties</h2>
              <p className="text-content-text-secondary mb-3">
                The BIP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL
                WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                <li>MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
                <li>NON-INFRINGEMENT OF THIRD-PARTY RIGHTS</li>
                <li>ACCURACY, COMPLETENESS, OR RELIABILITY OF CONTENT</li>
                <li>UNINTERRUPTED OR ERROR-FREE SERVICE</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">10. Limitation of Liability</h2>
              <p className="text-content-text-secondary">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE BIP AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
                DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF OUR SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE
                POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">11. Indemnification</h2>
              <p className="text-content-text-secondary">
                You agree to indemnify, defend, and hold harmless the BIP and its operators from any claims, damages,
                losses, costs, or expenses arising from your use of our service, your User Content, or your violation of
                these Terms or applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">12. Governing Law and Disputes</h2>
              <p className="text-content-text-secondary">
                These Terms shall be governed by and construed in accordance with the laws of the Commonwealth of
                Massachusetts, without regard to its conflict of law principles. Any disputes arising under these Terms
                shall be subject to the exclusive jurisdiction of the courts of Massachusetts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">13. Modifications to Terms</h2>
              <p className="text-content-text-secondary">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by
                posting the updated Terms on our website with a new "Last updated" date. Your continued use of the BIP
                after such changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">14. Termination</h2>
              <p className="text-content-text-secondary">
                We may terminate or suspend your account and access to the BIP at our sole discretion, without prior
                notice, for conduct that violates these Terms or is otherwise harmful to the BIP or its users. You may
                terminate your account at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">15. Contact Information</h2>
              <p className="text-content-text-secondary">
                If you have questions about these Terms of Service, please contact us through our contact form. We will
                make reasonable efforts to respond to all inquiries.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">16. Severability</h2>
              <p className="text-content-text-secondary">
                If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will
                remain in full force and effect. The unenforceable provision will be replaced with an enforceable
                provision that most closely reflects the intent of the original provision.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
