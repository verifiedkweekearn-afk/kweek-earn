import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';
import { useState } from 'react';

const Privacy = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const lastUpdated = 'February 13, 2026';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        theme === 'dark'
          ? 'bg-gray-900/95 border-gray-800'
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <KweekEarnLogo variant="horizontal" size="sm" />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {theme === 'dark' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-military-olive hover:bg-military-olive/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Privacy Document Container */}
        <div className={`p-8 rounded-2xl border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          
          {/* Introduction */}
          <div className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Kweek Earn ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully. By using Kweek Earn, you consent to the practices described in this policy.
            </p>
          </div>

          {/* Section 1 - Information We Collect */}
          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium mb-2">1.1 Personal Information</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  We collect information you provide directly to us, including:
                </p>
                <ul className={`list-disc ml-6 mt-2 text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>Full name and username</li>
                  <li>Email address</li>
                  <li>Bank account details (for withdrawals)</li>
                  <li>4-digit withdrawal PIN (encrypted)</li>
                  <li>Communication with our support team</li>
                </ul>
              </div>
              <div>
                <h3 className="text-md font-medium mb-2">1.2 Usage Information</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  We automatically collect certain information about your device and usage:
                </p>
                <ul className={`list-disc ml-6 mt-2 text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>IP address and location (approximate)</li>
                  <li>Device type, browser, operating system</li>
                  <li>Pages visited, tasks completed, earnings history</li>
                  <li>Login timestamps and session duration</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 - How We Use Your Information */}
          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">2. How We Use Your Information</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.1 To process your withdrawals and fee payments</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.2 To verify your identity and prevent fraud</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.3 To communicate with you about your account and transactions</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.4 To improve our platform and user experience</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.5 To comply with legal obligations and regulatory requirements</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.6 To send you important updates about our terms, policies, or security</p>
            </div>
          </section>

          {/* Section 3 - Data Storage and Security */}
          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">3. Data Storage and Security</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.1 All passwords are hashed using bcrypt encryption</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.2 Withdrawal PINs are encrypted before storage</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.3 Your data is stored on secure servers located in data centers</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.4 We implement SSL/TLS encryption for all data transmissions</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.5 Regular security audits and penetration testing are conducted</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.6 We do not store your full bank account numbers after withdrawal processing</p>
            </div>
          </section>

          {/* Section 4 - Third-Party Services */}
          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">4. Third-Party Services</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.1 We use Flutterwave for payment processing. Your payment information is handled according to their privacy policy.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.2 We use PostgreSQL for database management hosted on secure cloud infrastructure.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.3 We do not sell, rent, or trade your personal information to third parties.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.4 We may share information with law enforcement if required by Nigerian law.</p>
            </div>
          </section>

          {/* Section 5 - Cookies and Tracking */}
          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">5. Cookies and Tracking</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>5.1 We use essential cookies to maintain your login session and preferences.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>5.2 Local storage is used to remember your theme preference (dark/light mode).</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>5.3 We do not use third-party tracking cookies for advertising.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>5.4 You can clear your browser data at any time; this will log you out of your session.</p>
            </div>
          </section>

          {/* Section 6 - Your Rights (NDPR/GDPR) */}
          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">6. Your Rights (NDPR/GDPR)</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.1 Right to Access: You can request a copy of your personal data.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.2 Right to Rectification: You can update your account information.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.3 Right to Erasure: You can delete your account permanently via Settings → Danger Zone.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.4 Right to Restrict Processing: You can deactivate your account temporarily.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.5 Right to Data Portability: You can request your data in JSON format.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.6 To exercise these rights, contact support@kweekearn.ng</p>
            </div>
          </section>

          {/* Section 7 - Data Retention */}
          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">7. Data Retention</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.1 We retain your personal information as long as your account is active.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.2 Upon account deletion, personal information is permanently removed within 30 days.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.3 Transaction records may be anonymized and retained for legal compliance (7 years).</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.4 Anonymized data cannot be linked back to you and is used for analytics only.</p>
            </div>
          </section>

          {/* Section 8 - Children's Privacy */}
          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">8. Children's Privacy</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                8.1 Kweek Earn is not intended for individuals under the age of 18.
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                8.2 We do not knowingly collect information from minors. If we discover such data, it will be deleted immediately.
              </p>
            </div>
          </section>

          {/* Section 9 - Changes to This Policy */}
          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">9. Changes to This Privacy Policy</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                9.1 We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                9.2 We will notify you of significant changes via email or prominent notice on our platform.
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                9.3 Your continued use of Kweek Earn after changes constitutes acceptance of the revised policy.
              </p>
            </div>
          </section>

          {/* Section 10 - Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-military-olive">10. Contact Information</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                If you have questions or concerns about this Privacy Policy or your data, please contact our Data Protection Officer:
              </p>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email: privacy@kweekearn.ng</p>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Address: Lagos, Nigeria</p>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Response Time: Within 48 hours</p>
              </div>
            </div>
          </section>

          {/* Acceptance Acknowledgement */}
          <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="accept"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-military-olive focus:ring-military-olive"
              />
              <label htmlFor="accept" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                I have read and understood the Privacy Policy.
              </label>
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-military-olive/10 hover:bg-military-olive/20 text-military-olive text-sm font-medium rounded-lg transition-colors border border-military-olive/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
