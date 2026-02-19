import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const PinVerification = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [pinGroups, setPinGroups] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [withdrawal, setWithdrawal] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    fetchWithdrawal();
  }, [id]);

  useEffect(() => {
    if (locked && lockTimer > 0) {
      const timer = setTimeout(() => {
        setLockTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (lockTimer === 0 && locked) {
      setLocked(false);
      setAttempts(0);
    }
  }, [locked, lockTimer]);

  const fetchWithdrawal = async () => {
    try {
      const res = await API.get('/withdrawals');
      const found = res.data.find(w => w.id === id);
      if (found) {
        setWithdrawal(found);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handlePinChange = (index, value) => {
    // Allow uppercase letters and numbers
    const upperValue = value.toUpperCase();
    // Only allow 0-9 and A-F (hexadecimal)
    if (!/^[0-9A-F]*$/.test(upperValue)) return;
    if (upperValue.length > 4) return;

    const newPin = [...pinGroups];
    newPin[index] = upperValue;
    setPinGroups(newPin);

    if (upperValue.length === 4 && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && pinGroups[index].length === 0 && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    // Remove hyphens and non-hex characters, then uppercase
    const cleaned = pasted.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    
    if (cleaned.length === 16) {
      setPinGroups([
        cleaned.slice(0, 4),
        cleaned.slice(4, 8),
        cleaned.slice(8, 12),
        cleaned.slice(12, 16)
      ]);
      document.getElementById('pin-3')?.focus();
    } else {
      toast.error('Please paste a valid 16-digit PIN (letters A-F and numbers)');
    }
  };

  const handleVerify = async () => {
    const fullPin = pinGroups.join('');
    if (fullPin.length < 16) {
      toast.error('Please enter your complete 16-digit PIN');
      return;
    }

    if (locked) {
      toast.error(`Too many attempts. Try again in ${lockTimer} seconds`);
      return;
    }

    setLoading(true);
    try {
      const res = await API.post(`/withdrawals/${id}/verify-pin`, { pin: fullPin });
      toast.success('PIN verified successfully!');
      navigate(`/funds-on-way/${id}`);
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setLocked(true);
        setLockTimer(30);
        toast.error('Too many invalid attempts. Locked for 30 seconds');
      } else {
        toast.error(`Invalid PIN. ${3 - newAttempts} attempts remaining`);
      }
      
      setPinGroups(['', '', '', '']);
      document.getElementById('pin-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'}`}>
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        theme === 'dark' ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <KweekEarnLogo variant="horizontal" size="sm" />
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-lg">
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
      </nav>

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`p-8 rounded-2xl border-2 ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-military-olive/10 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-military-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Enter Your 16-Digit PIN</h1>
          <p className={`text-center text-sm mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Use letters A-F and numbers (hexadecimal)
          </p>

          {withdrawal && (
            <div className={`mb-8 p-4 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className="text-sm text-gray-500 mb-1">Withdrawal Amount</p>
              <p className="text-2xl font-bold text-military-brass">
                ₦{withdrawal.amount?.toLocaleString()}
              </p>
            </div>
          )}

          {/* PIN Input - accepts letters A-F and numbers */}
          <div className="mb-8">
            <div className="flex justify-center items-center gap-2 mb-2">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    id={`pin-${idx}`}
                    type="text"
                    inputMode="text"
                    maxLength={4}
                    value={pinGroups[idx]}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    disabled={locked}
                    placeholder="0000"
                    className={`w-20 h-16 text-center text-xl font-mono font-bold rounded-lg border-2 uppercase ${
                      locked
                        ? 'bg-gray-100 border-gray-200'
                        : theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-military-olive'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-military-olive'
                    }`}
                  />
                  {idx < 3 && (
                    <span className="mx-1 text-xl font-bold text-gray-400">-</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              Format: XXXX-XXXX-XXXX-XXXX (use letters A-F and numbers)
            </p>
          </div>

          {locked && (
            <p className="text-center text-red-500 text-sm mb-4">
              Too many attempts. Try again in {lockTimer} seconds.
            </p>
          )}

          <button
            onClick={handleVerify}
            disabled={loading || locked || pinGroups.join('').length < 16}
            className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-4 rounded-lg transition-colors disabled:opacity-50 text-lg"
          >
            {loading ? 'Verifying...' : 'Verify 16-Digit PIN'}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/contact')}
              className="text-sm text-military-olive hover:underline"
            >
              Didn't receive PIN? Contact support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinVerification;
