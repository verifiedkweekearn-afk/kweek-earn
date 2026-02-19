import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const DeletePinModal = ({ isOpen, onClose, onSuccess, userBalance }) => {
  const { theme } = useTheme();
  const [pin, setPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockTimer, setLockTimer] = useState(0);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (lockTimer > 0) {
      const timer = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockTimer]);

  if (!isOpen) return null;

  const handlePinChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('');
    
    if (digits.length >= 4) {
      const newPin = digits.slice(0, 4).map(d => d || '');
      setPin(newPin);
      inputRefs[3].current?.focus();
    }
  };

  const handleDelete = async () => {
    const enteredPin = pin.join('');
    
    if (enteredPin.length < 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }

    if (lockTimer > 0) {
      toast.error(`Too many attempts. Try again in ${lockTimer} seconds`);
      return;
    }

    setLoading(true);
    try {
      await userService.deleteAccount(enteredPin);
      toast.success('Account permanently deleted');
      onSuccess();
    } catch (error) {
      if (error.response?.data?.locked) {
        setLockTimer(error.response.data.waitSeconds || 300);
        toast.error(error.response.data.message);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        toast.error(error.response?.data?.message || 'Invalid PIN');
        
        setPin(['', '', '', '']);
        inputRefs[0].current?.focus();

        if (newAttempts >= 3) {
          setLockTimer(300);
          setAttempts(0);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`max-w-md w-full rounded-2xl border-2 ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'
      } p-6`}>
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-military-crimson/10 flex items-center justify-center mx-auto mb-4 border-2 border-military-crimson/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-military-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-2">Permanently Delete Account</h2>
        
        {/* Warning Message */}
        <div className={`mb-6 p-4 rounded-lg ${
          theme === 'dark'
            ? 'bg-military-crimson/5 border border-military-crimson/30'
            : 'bg-military-crimson/5 border border-military-crimson/30'
        }`}>
          <p className="text-sm text-military-crimson font-medium mb-2">
            ⚠️ This action is IRREVERSIBLE
          </p>
          <ul className={`text-xs space-y-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <li>• All funds (₦{userBalance?.toLocaleString()}) will be PERMANENTLY FORFEITED</li>
            <li>• All personal data will be permanently deleted</li>
            <li>• You will not be able to recover this account</li>
            <li>• Pending withdrawals will be cancelled</li>
          </ul>
        </div>

        {/* PIN Input */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-3 text-center ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Enter your 4-digit withdrawal PIN to confirm
          </label>
          
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={pin[index]}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={lockTimer > 0 || loading}
                className={`w-14 h-14 text-center text-2xl font-mono font-bold rounded-lg border-2 transition-all ${
                  lockTimer > 0
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-military-olive focus:ring-2 focus:ring-military-olive'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-military-olive focus:ring-2 focus:ring-military-olive'
                }`}
              />
            ))}
          </div>

          {lockTimer > 0 && (
            <p className="text-center text-military-crimson text-sm mt-3">
              Too many attempts. Try again in {lockTimer} seconds.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || lockTimer > 0 || pin.join('').length < 4}
            className="flex-1 px-4 py-3 bg-military-crimson hover:bg-military-crimson/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Permanently Delete'}
          </button>
        </div>

        {/* Security Note */}
        <p className={`text-xs text-center mt-4 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          This action cannot be undone. All data will be permanently removed.
        </p>
      </div>
    </div>
  );
};

export default DeletePinModal;
