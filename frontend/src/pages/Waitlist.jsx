import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const Waitlist = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [withdrawal, setWithdrawal] = useState(null);
  const [timeWaited, setTimeWaited] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pinRevealed, setPinRevealed] = useState(false);

  useEffect(() => {
    if (!id || id === 'undefined') {
      navigate('/dashboard');
      return;
    }
    fetchWithdrawal();
    
    // Timer for time waited (updates every minute)
    const timer = setInterval(() => {
      setTimeWaited(prev => prev + 1);
    }, 60000);

    // Check for updates every 5 seconds
    const interval = setInterval(fetchWithdrawal, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [id]);

  const fetchWithdrawal = async () => {
    try {
      const res = await API.get('/withdrawals');
      const found = res.data.find(w => w.id === id);
      
      if (found) {
        setWithdrawal(found);
        
        // If PIN is generated, reveal it on this page
        if (found.status === 'pin_generated') {
          setPinRevealed(true);
        }
        
        // If already verified, go to funds on way
        if (found.status === 'pin_confirmed') {
          navigate(`/funds-on-way/${id}`);
        }
        
        // If completed, go to success
        if (found.status === 'completed') {
          navigate(`/withdrawal-success/${id}`);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const copyToClipboard = () => {
    if (withdrawal?.pin) {
      navigator.clipboard.writeText(withdrawal.pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('PIN copied to clipboard');
    }
  };

  const handleVerifyPin = () => {
    if (withdrawal?.pin) {
      navigate(`/pin-verification/${id}`);
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 1) return 'Just started';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        theme === 'dark' ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <KweekEarnLogo variant="horizontal" size="sm" />
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <span className="text-xs uppercase tracking-wider text-gray-500">Balance</span>
                <span className="ml-2 font-bold text-military-brass">
                  ₦{user?.balance?.toLocaleString() || 0}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {theme === 'dark' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`p-8 rounded-2xl border-2 text-center ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          
          {/* Status Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              {!pinRevealed ? (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-military-olive/30"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-military-olive border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-military-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 5a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">
            {pinRevealed ? 'Your PIN is Ready!' : 'Payment Verification in Progress'}
          </h1>
          
          {/* Message */}
          {!pinRevealed ? (
            <div className={`mb-8 p-6 rounded-xl ${
              theme === 'dark' ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className="text-lg font-medium mb-2 text-blue-600 dark:text-blue-300">
                Your payment is being verified
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Our team is reviewing your payment proof. Your 16-digit PIN will appear here once approved.
              </p>
            </div>
          ) : (
            <div className={`mb-8 p-6 rounded-xl ${
              theme === 'dark' ? 'bg-green-900/20 border border-green-800/30' : 'bg-green-50 border border-green-200'
            }`}>
              <p className="text-lg font-medium mb-2 text-green-600 dark:text-green-300">
                Your withdrawal is approved!
              </p>
              <p className="text-sm text-green-700 dark:text-green-200">
                Copy your 16-digit PIN below and click Verify to continue.
              </p>
            </div>
          )}

          {/* Amount */}
          {withdrawal && (
            <div className={`mb-8 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className="text-sm text-gray-500 mb-1">Withdrawal Amount</p>
              <p className="text-3xl font-bold text-military-brass">
                ₦{withdrawal.amount?.toLocaleString()}
              </p>
            </div>
          )}

          {/* PIN Display (only when released) */}
          {pinRevealed && withdrawal?.pin && (
            <div className="mb-8">
              <div className={`p-6 rounded-xl border-2 ${
                theme === 'dark' ? 'bg-gray-800 border-military-brass/30' : 'bg-gray-50 border-military-brass/30'
              }`}>
                <p className="text-sm text-gray-500 mb-3">Your 16-Digit PIN</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="font-mono text-3xl font-bold tracking-wider text-military-brass">
                    {withdrawal.pin}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className={`p-3 rounded-lg transition-all ${
                      copied
                        ? 'bg-military-olive text-white'
                        : 'bg-military-olive/10 hover:bg-military-olive/20 text-military-olive border border-military-olive/30'
                    }`}
                    title="Copy PIN"
                  >
                    {copied ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Time Info (only show while waiting) */}
          {!pinRevealed && (
            <div className={`mb-8 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Time Waited</p>
              <p className="text-2xl font-bold text-military-brass">{formatTime(timeWaited)}</p>
            </div>
          )}

          {/* Verify Button (only when PIN is ready) */}
          {pinRevealed && (
            <button
              onClick={handleVerifyPin}
              className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-4 rounded-lg transition-all transform hover:scale-105 text-lg mb-4"
            >
              Verify PIN →
            </button>
          )}

          {/* Request ID */}
          {id && (
            <div className={`mb-6 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <p className="text-xs text-gray-500">Request ID</p>
              <p className="font-mono text-sm break-all">{id}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-4 rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-transparent hover:bg-gray-700/10 text-gray-500 font-medium py-3 rounded-lg transition-colors border border-gray-600/30"
            >
              Contact Support
            </button>
          </div>

          {/* Auto-refresh Note */}
          <p className="text-xs text-gray-500 mt-6">
            {!pinRevealed 
              ? 'This page checks for updates every 5 seconds. Your PIN will appear here once approved.'
              : 'Copy your PIN and click Verify to continue.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
