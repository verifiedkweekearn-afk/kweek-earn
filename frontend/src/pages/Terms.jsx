import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';
import { useState } from 'react';

const Terms = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const lastUpdated = 'February 13, 2026';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'}`}>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className={`p-8 rounded-2xl border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          
          <div className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Welcome to Kweek Earn. By accessing or using our platform, you agree to be bound by these Terms of Service. 
              Please read them carefully. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </div>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">1. Eligibility</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>1.1 You must be at least 18 years old to use Kweek Earn.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>1.2 You must be a resident of Nigeria and possess a valid Nigerian bank account for withdrawals.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>1.3 You are responsible for maintaining the confidentiality of your account credentials.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>1.4 Each user may maintain only one account. Multiple accounts are strictly prohibited.</p>
            </div>
          </section>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">2. Account Responsibilities</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.1 You are solely responsible for all activities that occur under your account.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.2 You must provide accurate, current, and complete information during registration.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.3 You agree to notify us immediately of any unauthorized use of your account.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>2.4 We reserve the right to suspend or terminate accounts that violate these terms.</p>
            </div>
          </section>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">3. Task Completion</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.1 Users earn rewards by completing social media tasks including follows, likes, and shares.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.2 Current reward rates: Follow (₦300), Like (₦150), Share (₦200).</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.3 Rewards are credited immediately upon task completion verification.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.4 Users are limited to 55 tasks per day. Tasks reset at 00:01 WAT daily.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>3.5 Automated bots, scripts, or any form of task automation is strictly prohibited.</p>
            </div>
          </section>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">4. Withdrawal Policy</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.1 Minimum withdrawal amount: ₦30,000.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.2 A non-refundable processing fee of ₦7,000 is required per withdrawal.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.3 Fee payment must be completed within 15 minutes. Expired requests are refunded.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.4 A 16-digit unique PIN is generated upon successful fee payment.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.5 PIN must be entered to confirm withdrawal. PIN is one-time use only.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>4.6 Withdrawals are processed within 1-2 business days after PIN confirmation.</p>
            </div>
          </section>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">5. Fee Structure</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>5.1 Withdrawal processing fee: ₦7,000 (one-time per withdrawal, non-refundable).</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>5.2 No fees for task completion or account maintenance.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>5.3 Bank transfer charges are borne by Kweek Earn.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>5.4 Fee structure is subject to change with 14 days notice to users.</p>
            </div>
          </section>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">6. Prohibited Activities</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.1 Creating multiple accounts to abuse referral bonuses or task limits.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.2 Using bots, scripts, or automated tools to complete tasks.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.3 Attempting to manipulate or falsify task completion.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.4 Engaging in fraudulent activities or providing false information.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.5 Attempting to bypass the fee payment system with fake receipts.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>6.6 Any attempt to hack, decompile, or reverse engineer our platform.</p>
            </div>
          </section>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">7. Account Termination & Deletion</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.1 Users may delete their account at any time via Settings → Danger Zone.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.2 Account deletion requires verification with your 4-digit withdrawal PIN.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.3 UPON DELETION: All funds in your account are PERMANENTLY FORFEITED.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.4 Pending withdrawals are automatically cancelled and funds forfeited.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.5 Account deletion is IRREVERSIBLE. No refunds or recoveries are possible.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>7.6 We reserve the right to terminate accounts violating these terms without notice.</p>
            </div>
          </section>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">8. Limitation of Liability</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>8.1 Kweek Earn is not liable for any indirect, incidental, or consequential damages.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>8.2 We do not guarantee uninterrupted or error-free service.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>8.3 We are not responsible for losses due to third-party banking delays or failures.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>8.4 Maximum liability shall not exceed the amount of fees paid by the user.</p>
            </div>
          </section>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">9. Governing Law</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>9.1 These Terms shall be governed by the laws of the Federal Republic of Nigeria.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>9.2 Any disputes arising shall be resolved through arbitration in Lagos, Nigeria.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>9.3 These terms comply with the Nigeria Data Protection Regulation (NDPR).</p>
            </div>
          </section>

          <section className="mb-8 pb-8 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <h2 className="text-xl font-semibold mb-4 text-military-olive">10. Modifications to Terms</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>10.1 We reserve the right to modify these terms at any time.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>10.2 Significant changes will be communicated via email or platform notice.</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>10.3 Continued use of the platform constitutes acceptance of modified terms.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-military-olive">11. Contact Information</h2>
            <div className="space-y-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>For questions regarding these Terms of Service, please contact:</p>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email: support@kweekearn.ng</p>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Address: Lagos, Nigeria</p>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Response Time: 24-48 hours</p>
              </div>
            </div>
          </section>

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
                I have read, understood, and agree to be bound by these Terms of Service.
              </label>
            </div>
          </div>

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

export default Terms;
