import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const PinConfirmation = () => {
  const { requestId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [pin, setPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [generatedPin, setGeneratedPin] = useState(location.state?.pin || '');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    if (!generatedPin) {
      toast.error('Payment verification required');
      navigate(`/fee-payment/${requestId}`);
    }
  }, [generatedPin, requestId, navigate]);

  useEffect(() => {
    if (locked) {
      const timer = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [locked]);

  const handlePinChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('');
    
    if (digits.length >= 4) {
      const newPin = digits.slice(0, 4).map((d, i) => d || '');
      setPin(newPin);
      
      if (newPin[3]) {
        document.getElementById('pin-3')?.blur();
      } else {
        const nextEmptyIndex = newPin.findIndex(d => !d);
        if (nextEmptyIndex !== -1) {
          document.getElementById(`pin-${nextEmptyIndex}`)?.focus();
        }
      }
    }
  };

  const handleConfirm = async () => {
    const enteredPin = pin.join('');
    
    if (enteredPin.length < 4) {
      toast.error('Please enter your complete PIN');
      return;
    }

    if (locked) {
      toast.error(`Too many attempts. Try again in ${lockTimer} seconds`);
      return;
    }

    setLoading(true);
    try {
      const response = await API.post(`/withdrawals/${requestId}/confirm-pin`, {
        pin: enteredPin
      });

      toast.success('PIN confirmed successfully');
      navigate(`/pin-success/${requestId}`, {
        state: { pin: generatedPin }
      });
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setLocked(true);
        setLockTimer(30);
        toast.error('Too many invalid attempts. Please wait 30 seconds');
      } else {
        toast.error(`Invalid PIN. ${3 - newAttempts} attempts remaining`);
      }

      setPin(['', '', '', '']);
      document.getElementById('pin-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    toast.success('PIN has been resent to your email');
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

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`p-8 rounded-2xl border-2 ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-military-olive/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-military-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Enter Your PIN</h1>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              A 4-digit PIN has been generated for your withdrawal
            </p>
          </div>

          {/* PIN Display Reference */}
          <div className={`mb-8 p-4 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Your PIN was sent to:
              </span>
              <span className="font-mono text-sm">
                {user?.email?.replace(/(.{3})(.*)(?=@)/, '$1***')}
              </span>
            </div>
          </div>

          {/* PIN Input Grid */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={pin[index]}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={locked}
                className={`w-16 h-16 text-center text-2xl font-mono font-bold rounded-lg border-2 transition-all ${
                  locked
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-military-olive focus:ring-2 focus:ring-military-olive'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-military-olive focus:ring-2 focus:ring-military-olive'
                }`}
              />
            ))}
          </div>

          {/* Error State */}
          {locked && (
            <div className={`mb-6 p-3 rounded-lg bg-military-crimson/10 border border-military-crimson/30`}>
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-military-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-military-crimson font-medium">
                  Too many attempts. Try again in {lockTimer} seconds
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              disabled={loading || locked || pin.join('').length < 4}
              className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verifying PIN
                </span>
              ) : (
                'Confirm Withdrawal'
              )}
            </button>

            <button
              onClick={handleResend}
              className="w-full bg-transparent hover:bg-gray-700/10 text-gray-500 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-600/30"
            >
              Resend PIN
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                Return to Dashboard
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Your PIN is encrypted and one-time use only
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinConfirmation;
