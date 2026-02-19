import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const FAQ = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState('withdrawals');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (category, index) => {
    const key = `${category}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const categories = [
    {
      id: 'withdrawals',
      name: 'Withdrawals',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      questions: [
        {
          q: 'What is the minimum withdrawal amount?',
          a: 'The minimum withdrawal amount is ₦30,000. You must reach this balance before you can request a withdrawal.'
        },
        {
          q: 'How long do withdrawals take?',
          a: 'Withdrawals are typically processed within 1-2 business days after PIN confirmation. Bank transfer times may vary depending on your bank.'
        },
        {
          q: 'Why is there a ₦7,000 fee?',
          a: 'The ₦7,000 is a one-time processing fee that covers verification, security, and bank transfer charges. This fee is paid per withdrawal and is non-refundable.'
        },
        {
          q: 'What is the 16-digit PIN used for?',
          a: 'The PIN is your unique withdrawal authorization code. It is generated after successful fee payment and must be entered to confirm your withdrawal. This is a one-time use PIN for security.'
        },
        {
          q: 'What happens if I dont pay the fee within 15 minutes?',
          a: 'Your withdrawal request will expire and the amount will be automatically refunded to your Kweek Earn balance. You can create a new withdrawal request at any time.'
        },
        {
          q: 'Can I cancel a withdrawal request?',
          a: 'Yes, you can cancel a withdrawal request while it is in "Pending Fee" status. The full amount will be returned to your balance immediately.'
        }
      ]
    },
    {
      id: 'tasks',
      name: 'Tasks & Earnings',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-5',
      questions: [
        {
          q: 'How do I earn money on Kweek Earn?',
          a: 'You earn money by completing social media tasks: Follow (₦300), Like (₦150), and Share (₦200). Each task takes less than a minute to complete.'
        },
        {
          q: 'How many tasks can I do per day?',
          a: 'You are assigned 55 tasks per day. Tasks reset automatically at 00:01 WAT (12:01 AM) every day.'
        },
        {
          q: 'Are the social media accounts verified?',
          a: 'We provide a mix of verified and regular accounts. Verified accounts are marked with a "Verified" badge on the task card.'
        },
        {
          q: 'What platforms are supported?',
          a: 'We support Facebook, Instagram, TikTok, Twitter/X, Threads, YouTube, and Snapchat. More platforms will be added regularly.'
        },
        {
          q: 'What happens if I complete all tasks?',
          a: 'You will receive a confirmation message: "All tasks completed, [username]!" New tasks will be available the following day.'
        }
      ]
    },
    {
      id: 'account',
      name: 'Account & Security',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      questions: [
        {
          q: 'How do I change my password?',
          a: 'Go to Settings > Profile Settings. Enter your current password and new password, then click Save Changes.'
        },
        {
          q: 'I forgot my password. How do I reset it?',
          a: 'Click "Forgot Password" on the login page. Enter your email address and you will receive a password reset link within 5 minutes.'
        },
        {
          q: 'Can I change my email address?',
          a: 'Yes, go to Settings > Profile Settings. Enter your new email address and verify it with the confirmation code sent to your inbox.'
        },
        {
          q: 'Is my personal information secure?',
          a: 'Yes. All passwords are hashed with bcrypt, your PIN is encrypted, and all communications use secure HTTPS. We never store your bank details after withdrawal.'
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes, go to Settings > Danger Zone. Click "Delete Account" and confirm. This action is irreversible and all your data will be permanently removed.'
        }
      ]
    },
    {
      id: 'payments',
      name: 'Payments & Fees',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      questions: [
        {
          q: 'What payment methods are accepted for fees?',
          a: 'We accept bank transfers via Flutterwave. You will receive a unique virtual account number for each payment. The account number expires after 15 minutes.'
        },
        {
          q: 'How do I know my fee payment was received?',
          a: 'After you click "I HAVE PAID", our system verifies the payment instantly. You will receive a 16-digit PIN and a success confirmation.'
        },
        {
          q: 'Is the fee refundable if my withdrawal fails?',
          a: 'No, the ₦7,000 processing fee is non-refundable once paid. It covers verification and security costs regardless of withdrawal outcome.'
        },
        {
          q: 'Why did I receive an error about payment verification?',
          a: 'Common reasons: Incorrect amount transferred, transfer to wrong account, or expired account number. Ensure you transfer exactly ₦7,000 within 15 minutes.'
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Find answers to common questions about Kweek Earn
          </p>
        </div>

        {/* Search Bar */}
        <div className={`mb-8 p-4 rounded-xl border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-military-olive ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-transparent'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-transparent'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setOpenCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                openCategory === category.id
                  ? 'bg-military-olive text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
              </svg>
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {searchQuery ? (
            // Search results - show all matching questions grouped by category
            filteredCategories.map((category) => (
              <div key={category.id} className={`rounded-xl border overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`px-6 py-4 border-b ${
                  theme === 'dark' ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-military-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                    </svg>
                    <h2 className="font-semibold">{category.name}</h2>
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
                  {category.questions.map((item, index) => (
                    <div key={index} className="px-6 py-4">
                      <button
                        onClick={() => toggleItem(category.id, index)}
                        className="flex justify-between items-start w-full text-left"
                      >
                        <span className="font-medium text-military-olive">Q:</span>
                        <span className={`flex-1 ml-2 font-medium ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {item.q}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ml-4 flex-shrink-0 transition-transform ${
                            openItems[`${category.id}-${index}`] ? 'rotate-180' : ''
                          } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openItems[`${category.id}-${index}`] && (
                        <div className="mt-3 ml-6">
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="font-medium text-military-brass">A:</span> {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Normal view - show only selected category
            categories.filter(c => c.id === openCategory).map((category) => (
              <div key={category.id} className={`rounded-xl border overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`px-6 py-4 border-b ${
                  theme === 'dark' ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-military-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                    </svg>
                    <h2 className="font-semibold">{category.name}</h2>
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
                  {category.questions.map((item, index) => (
                    <div key={index} className="px-6 py-4">
                      <button
                        onClick={() => toggleItem(category.id, index)}
                        className="flex justify-between items-start w-full text-left"
                      >
                        <span className="font-medium text-military-olive">Q:</span>
                        <span className={`flex-1 ml-2 font-medium ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {item.q}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ml-4 flex-shrink-0 transition-transform ${
                            openItems[`${category.id}-${index}`] ? 'rotate-180' : ''
                          } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openItems[`${category.id}-${index}`] && (
                        <div className="mt-3 ml-6">
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="font-medium text-military-brass">A:</span> {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {searchQuery && filteredCategories.length === 0 && (
            <div className={`p-12 rounded-xl border text-center ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
            }`}>
              <div className="w-20 h-20 rounded-full bg-gray-700/10 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className={`mt-12 p-6 rounded-xl border text-center ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <h2 className="text-xl font-bold mb-2">Still need help?</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Can't find the answer you're looking for? Contact our support team.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 bg-military-olive hover:bg-military-olive/90 text-white font-medium rounded-lg transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
