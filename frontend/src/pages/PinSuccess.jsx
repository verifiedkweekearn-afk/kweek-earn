import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const PinSuccess = () => {
  const { requestId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [pin, setPin] = useState(location.state?.pin || '');
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!pin) {
      toast.error('No PIN found');
      navigate('/dashboard');
    }
  }, [pin, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    toast.success('PIN copied to clipboard');
  };

  const downloadPin = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `KWEEK EARN WITHDRAWAL PIN\n`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`,
        `Request ID: ${requestId}\n`,
        `Date: ${new Date().toLocaleDateString()}\n`,
        `Time: ${new Date().toLocaleTimeString()}\n`,
        `Amount: ₦${location.state?.amount?.toLocaleString() || '30,000+'}\n\n`,
        `WITHDRAWAL PIN: ${pin}\n\n`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`,
        `This PIN is one-time use only.\n`,
        `Keep this file secure. Do not share.\n`,
        `Kweek Earn - Professional Withdrawal System\n`
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `kweek-earn-pin-${requestId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('PIN downloaded as text file');
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

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
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Card */}
        <div className={`p-8 rounded-2xl border-2 ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-600/10 flex items-center justify-center mx-auto mb-4 border-2 border-green-600/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 5a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Withdrawal Authorized</h1>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your 16-digit PIN has been generated successfully
            </p>
          </div>

          {/* PIN Display Card */}
          <div className={`mb-8 p-6 rounded-xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="text-center mb-4">
              <span className={`text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Your Withdrawal PIN
              </span>
            </div>
            
            <div className="bg-military-dark rounded-xl p-6 mb-4 border border-military-brass/30">
              <div className="flex items-center justify-center gap-4">
                <span className="font-mono text-3xl md:text-4xl font-bold tracking-[0.5em] text-military-brass">
                  {pin}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 bg-military-olive/10 hover:bg-military-olive/20 text-military-olive font-medium py-3 px-4 rounded-lg transition-colors border border-military-olive/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copied ? 'Copied!' : 'Copy PIN'}
              </button>
              <button
                onClick={downloadPin}
                className="flex-1 flex items-center justify-center gap-2 bg-military-olive/10 hover:bg-military-olive/20 text-military-olive font-medium py-3 px-4 rounded-lg transition-colors border border-military-olive/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>

          {/* Important Notice */}
          <div className={`mb-8 p-5 rounded-lg ${
            theme === 'dark'
              ? 'bg-military-crimson/5 border border-military-crimson/30'
              : 'bg-military-crimson/5 border border-military-crimson/30'
          }`}>
            <div className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-military-crimson flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className={`text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  One-Time Use PIN
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  This PIN is required to complete your withdrawal. It will be invalid after use. 
                  Save this PIN now. It will not be shown again.
                </p>
              </div>
            </div>
          </div>

          {/* Withdrawal Summary */}
          <div className={`mb-8 p-5 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h3 className="text-sm font-medium mb-3">Withdrawal Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Request ID
                </span>
                <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {requestId?.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Amount
                </span>
                <span className="text-sm font-bold text-military-brass">
                  ₦{location.state?.amount?.toLocaleString() || '30,000+'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Status
                </span>
                <span className="text-sm font-medium text-green-600">
                  Processing
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Estimated Arrival
                </span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  1-2 business days
                </span>
              </div>
            </div>
          </div>

          {/* Auto-redirect Notice */}
          <div className="text-center mb-6">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Redirecting to dashboard in {countdown} seconds
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleComplete}
            className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Return to Dashboard
          </button>

          {/* Security Footer */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                PIN encrypted and stored securely. One-time use only.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinSuccess;
