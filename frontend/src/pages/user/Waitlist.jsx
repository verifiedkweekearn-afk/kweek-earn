import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../../components/KweekEarnLogo';
import HamburgerMenu from '../../components/layout/HamburgerMenu';

const Waitlist = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [withdrawal, setWithdrawal] = useState(null);
  const [timeWaited, setTimeWaited] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('5-10 minutes');

  useEffect(() => {
    fetchWithdrawalStatus();
    
    // Timer to show how long they've been waiting
    const timer = setInterval(() => {
      setTimeWaited(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [requestId]);

  useEffect(() => {
    // Poll for status changes every 30 seconds
    const interval = setInterval(() => {
      checkStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [requestId]);

  const fetchWithdrawalStatus = async () => {
    setLoading(true);
    try {
      // In production, call API to get withdrawal status
      // For now, simulate
      setTimeout(() => {
        setWithdrawal({
          id: requestId,
          amount: 35000,
          status: 'waitlist',
          waitlistedAt: new Date().toISOString(),
          estimatedWaitTime: '5-10 minutes'
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to load withdrawal status');
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      // In production, check if status changed to 'pin_generated'
      // For demo, we'll simulate after 2 minutes
      if (timeWaited >= 2) {
        // This would be replaced with actual API call
        console.log('Checking status...');
      }
    } catch (error) {
      console.error('Status check failed');
    }
  };

  const formatTimeWaited = (minutes) => {
    if (minutes < 1) return 'Just started';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-military-olive mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Loading verification status...
          </p>
        </div>
      </div>
    );
  }

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
              <div className={`px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Balance
                </span>
                <span className="ml-2 font-bold text-military-brass">
                  ₦{(user?.balance || 0).toLocaleString()}
                </span>
              </div>
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
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Waiting Card */}
        <div className={`p-8 rounded-2xl border-2 ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        } text-center`}>
          
          {/* Waiting Animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-4 border-military-olive/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-military-olive border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-military-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-3">Payment Verification in Progress</h1>
          
          {/* Amount */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-military-brass">
              ₦{withdrawal?.amount.toLocaleString()}
            </span>
            <span className={`block text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Withdrawal request
            </span>
          </div>

          {/* Encouraging Message */}
          <div className={`mb-8 p-6 rounded-xl ${
            theme === 'dark' ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
              Your payment is being verified
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
              Our team is manually reviewing your payment proof. 
              You will receive your 16-digit withdrawal PIN within 24 hours.
            </p>
          </div>

          {/* Wait Time Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className={`text-xs uppercase tracking-wider mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Time Waited
              </p>
              <p className="text-xl font-bold text-military-brass">
                {formatTimeWaited(timeWaited)}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className={`text-xs uppercase tracking-wider mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Estimated Wait
              </p>
              <p className="text-xl font-bold text-military-brass">
                {estimatedTime}
              </p>
            </div>
          </div>

          {/* Request ID */}
          <div className={`mb-6 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
          }`}>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Request ID
            </p>
            <p className="font-mono text-sm break-all">
              {requestId}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-transparent hover:bg-gray-700/10 text-gray-500 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-600/30"
            >
              Contact Support
            </button>
          </div>

          {/* Auto-refresh Note */}
          <p className={`text-xs mt-6 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
            This page updates automatically every 30 seconds.
            You will be redirected when your PIN is ready.
          </p>
        </div>

        {/* FAQ Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/faq')}
            className={`text-sm hover:underline ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}
          >
            Why is verification taking time? See FAQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
