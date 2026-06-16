import { Card, CardContent } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Privacy Policy | Biscuits Internet Project" },
    {
      name: "description",
      content: "Privacy Policy for the Biscuits Internet Project.",
    },
  ];
}

export default function Privacy() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="page-heading">PRIVACY POLICY</h1>
      </div>

      <Card variant="panel">
        <CardContent className="p-6">
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-content-text-secondary text-sm">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <p className="text-content-text-secondary">
                The Biscuits Internet Project ("the BIP", "we", "us", or "our") respects your privacy and is committed
                to protecting your personal information. This Privacy Policy explains how we collect, use, share, and
                protect your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">1. Information We Collect</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">1.1 Account Information</h3>
                  <p className="text-content-text-secondary mb-2">When you create an account on the BIP, we collect:</p>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Email address (required for account creation)</li>
                    <li>Username and display name</li>
                    <li>Profile picture/avatar (if uploaded)</li>
                    <li>
                      Authentication information from third-party services (Google, Facebook) if you use social login
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">1.2 User-Generated Content</h3>
                  <p className="text-content-text-secondary mb-2">
                    We collect and store content you create on the BIP, including:
                  </p>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Show reviews and ratings</li>
                    <li>Comments and forum posts</li>
                    <li>Show attendance records</li>
                    <li>Images and files you upload</li>
                    <li>Profile information and bio</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">1.3 Usage and Analytics Data</h3>
                  <p className="text-content-text-secondary mb-2">
                    We automatically collect information about how you use the BIP:
                  </p>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>IP address and general location information</li>
                    <li>Browser type, operating system, and device information</li>
                    <li>Pages visited, time spent on pages, and click patterns</li>
                    <li>Referrer information (how you found the BIP)</li>
                    <li>Search queries within the BIP</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">
                    1.4 Cookies and Tracking Technologies
                  </h3>
                  <p className="text-content-text-secondary mb-2">
                    We use various technologies to collect information:
                  </p>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Essential cookies for website functionality</li>
                    <li>Authentication cookies to keep you logged in</li>
                    <li>Preference cookies to remember your settings</li>
                    <li>Google Analytics cookies for website analytics</li>
                    <li>Session storage and local storage for user experience</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">2. How We Use Your Information</h2>
              <p className="text-content-text-secondary mb-3">
                We use the information we collect for the following purposes:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">2.1 Service Provision</h3>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Create and manage your account</li>
                    <li>Enable you to contribute reviews, ratings, and comments</li>
                    <li>Track show attendance and build your profile</li>
                    <li>Provide personalized content recommendations</li>
                    <li>Enable communication with other users</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">2.2 Communication</h3>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Send important account notifications</li>
                    <li>Respond to your support requests</li>
                    <li>Notify you of website updates or changes</li>
                    <li>Send newsletter updates (if you opt in)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">2.3 Analytics and Improvement</h3>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Analyze website usage patterns</li>
                    <li>Improve our services and user experience</li>
                    <li>Generate aggregated statistics about the BIP community</li>
                    <li>Identify and fix technical issues</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">
                    2.4 Security and Legal Compliance
                  </h3>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Prevent fraud, spam, and abuse</li>
                    <li>Enforce our Terms of Service</li>
                    <li>Comply with legal obligations</li>
                    <li>Protect the rights and safety of users</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-content-text-secondary mb-3">
                <strong>We will never sell your personal data to third parties.</strong> We may share your information
                only in the following limited circumstances:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">3.1 Public Information</h3>
                  <p className="text-content-text-secondary">
                    Some information is publicly visible by design, including your username, profile information,
                    reviews, ratings, and show attendance records. This information is visible to other users and search
                    engines.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">3.2 Service Providers</h3>
                  <p className="text-content-text-secondary mb-2">
                    We share information with trusted service providers who help us operate the BIP:
                  </p>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Cloud hosting providers (for website infrastructure)</li>
                    <li>Database and storage providers</li>
                    <li>Analytics providers (Google Analytics)</li>
                    <li>Authentication providers (for social login)</li>
                    <li>Email service providers (for notifications)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">3.3 Legal Requirements</h3>
                  <p className="text-content-text-secondary mb-2">
                    We may disclose information when required by law or to:
                  </p>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Comply with legal process, court orders, or government requests</li>
                    <li>Enforce our Terms of Service</li>
                    <li>Protect the rights, safety, or property of the BIP or users</li>
                    <li>Investigate potential violations of our policies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">3.4 Aggregated Data</h3>
                  <p className="text-content-text-secondary">
                    We may share aggregated, anonymized statistics about the BIP community, such as total number of
                    reviews or popular shows, which cannot be used to identify individual users.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">4. Data Security</h2>
              <p className="text-content-text-secondary mb-3">
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and password hashing</li>
                <li>Regular security audits and monitoring</li>
                <li>Limited access to personal data on a need-to-know basis</li>
                <li>Secure hosting infrastructure with reputable providers</li>
              </ul>
              <p className="text-content-text-secondary mt-3">
                While we take security seriously, no method of transmission over the internet or electronic storage is
                100% secure. We cannot guarantee absolute security but will notify users of any significant data
                breaches.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">
                5. Cookies and Tracking Technologies
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">5.1 Types of Cookies We Use</h3>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>
                      <strong>Essential Cookies:</strong> Required for basic website functionality
                    </li>
                    <li>
                      <strong>Authentication Cookies:</strong> Keep you logged into your account
                    </li>
                    <li>
                      <strong>Preference Cookies:</strong> Remember your settings and preferences
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Google Analytics to understand website usage
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">5.2 Managing Cookies</h3>
                  <p className="text-content-text-secondary">
                    You can control cookies through your browser settings. However, disabling certain cookies may affect
                    website functionality, such as staying logged in or remembering your preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">5.3 Third-Party Analytics</h3>
                  <p className="text-content-text-secondary">
                    We use Google Analytics to understand how users interact with the BIP. Google Analytics may use
                    cookies to collect information about your usage patterns. You can opt out of Google Analytics
                    tracking by using Google's opt-out tools.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">6. Your Privacy Rights</h2>
              <p className="text-content-text-secondary mb-3">
                You have the following rights regarding your personal information:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">6.1 Access and Portability</h3>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Access your personal data through your account settings</li>
                    <li>Request a copy of your data in a portable format</li>
                    <li>View your activity history and contributions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">6.2 Correction and Updates</h3>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Update your profile information and preferences</li>
                    <li>Correct inaccurate information in your account</li>
                    <li>Edit or delete your reviews and comments</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">
                    6.3 Deletion and Account Termination
                  </h3>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Delete your account and associated personal data</li>
                    <li>Request removal of specific content you've contributed</li>
                    <li>Note: Some content may remain for community continuity (anonymized)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">6.4 Communication Preferences</h3>
                  <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                    <li>Opt out of non-essential email communications</li>
                    <li>Control notification settings</li>
                    <li>Manage your privacy settings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">7. Data Retention</h2>
              <p className="text-content-text-secondary mb-3">We retain your information as follows:</p>
              <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4">
                <li>
                  <strong>Account Information:</strong> Until you delete your account
                </li>
                <li>
                  <strong>User Content:</strong> Until you delete it or close your account
                </li>
                <li>
                  <strong>Usage Data:</strong> Up to 2 years for analytics purposes
                </li>
                <li>
                  <strong>Support Communications:</strong> Up to 3 years for customer service
                </li>
                <li>
                  <strong>Legal Compliance:</strong> As required by applicable law
                </li>
              </ul>
              <p className="text-content-text-secondary mt-3">
                When you delete your account, we will remove your personal information within 30 days, though some
                anonymized data may be retained for community continuity and historical purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">
                8. Children's Privacy (COPPA Compliance)
              </h2>
              <p className="text-content-text-secondary">
                The BIP is not directed at children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If we discover that we have collected information from a child under
                13, we will take immediate steps to delete such information. If you are a parent or guardian and believe
                your child has provided personal information to us, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">9. International Data Transfers</h2>
              <p className="text-content-text-secondary">
                The BIP is operated in the United States. If you are accessing our service from outside the US, please
                be aware that your information may be transferred to, stored, and processed in the US where our servers
                and databases are located. By using the BIP, you consent to this transfer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">
                10. Changes to This Privacy Policy
              </h2>
              <p className="text-content-text-secondary">
                We may update this Privacy Policy periodically to reflect changes in our practices or applicable law. We
                will notify users of material changes by:
              </p>
              <ul className="list-disc list-inside text-content-text-secondary space-y-1 ml-4 mt-2 mb-3">
                <li>Posting the updated policy on this page with a new "Last updated" date</li>
                <li>Sending email notifications for significant changes</li>
                <li>Displaying a prominent notice on the website</li>
              </ul>
              <p className="text-content-text-secondary">
                Your continued use of the BIP after changes become effective constitutes acceptance of the updated
                policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">11. California Privacy Rights</h2>
              <p className="text-content-text-secondary">
                If you are a California resident, you have additional rights under the California Consumer Privacy Act
                (CCPA), including the right to know what personal information we collect, the right to delete personal
                information, and the right to opt-out of the sale of personal information. We do not sell personal
                information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-content-text-primary mb-3">12. Contact Information</h2>
              <p className="text-content-text-secondary">
                If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices,
                please contact us through our contact form. We will respond to privacy-related inquiries within 30 days.
              </p>
              <p className="text-content-text-secondary mt-3">
                This Privacy Policy is governed by the laws of the Commonwealth of Massachusetts, consistent with our
                Terms of Service.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
