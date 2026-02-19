import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const Withdraw = () => {
  const { user, updateUserBalance } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);

  const MIN_WITHDRAWAL = 30000;
  const MAX_WITHDRAWAL = user?.balance || 0;

  useEffect(() => {
    checkPendingWithdrawal();
  }, []);

  const checkPendingWithdrawal = async () => {
    try {
      const response = await API.get('/withdrawals');
      const pending = response.data.find(
        (w) => ['pending_fee', 'fee_paid', 'pin_generated'].includes(w.status)
      );
      if (pending) {
        setPendingRequest(pending);
      }
    } catch (error) {
      console.error('Error checking pending withdrawal:', error);
    }
  };

  const handleMaxClick = () => {
    setAmount(MAX_WITHDRAWAL.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const numAmount = Number(amount);
    
    if (numAmount < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is ₦${MIN_WITHDRAWAL.toLocaleString()}`);
      return;
    }
    
    if (numAmount > MAX_WITHDRAWAL) {
      toast.error('Insufficient balance');
      return;
    }

    if (!accountName || !accountNumber || !bankName) {
      toast.error('Please provide all bank details');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/withdrawals/request', {
        amount: numAmount,
        accountName,
        accountNumber,
        bankName
      });

      toast.success('Withdrawal request created');
      updateUserBalance(user.balance - numAmount);
      
      // Navigate to fee payment
      navigate(`/fee-payment/${response.data.requestId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setLoading(false);
    }
  };

  const continuePending = () => {
    if (pendingRequest) {
      navigate(`/fee-payment/${pendingRequest.id}`);
    }
  };

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
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Withdraw Funds</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Transfer your earnings to your bank account
          </p>
        </div>

        {/* Pending Withdrawal Alert */}
        {pendingRequest && (
          <div className={`mb-8 p-6 rounded-xl border ${
            theme === 'dark'
              ? 'bg-gray-900 border-military-brass/30'
              : 'bg-white border-military-brass/30'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold mb-1">Pending Withdrawal</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  You have a pending withdrawal of ₦{pendingRequest.amount.toLocaleString()}
                </p>
              </div>
              <button
                onClick={continuePending}
                className="px-6 py-2 bg-military-olive hover:bg-military-olive/90 text-white rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Withdrawal Form */}
        <div className={`p-8 rounded-2xl border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Section */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-military-brass font-semibold">
                  ₦
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-10 pr-24 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-military-olive ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-transparent'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
                  }`}
                  placeholder="0"
                  min={MIN_WITHDRAWAL}
                  max={MAX_WITHDRAWAL}
                  step="1000"
                />
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-military-olive/10 hover:bg-military-olive/20 text-military-olive text-sm font-medium rounded transition-colors"
                >
                  MAX
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Minimum: ₦{MIN_WITHDRAWAL.toLocaleString()}
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Available: ₦{MAX_WITHDRAWAL.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="space-y-4">
              <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Bank Account Details
              </h3>
              
              <div>
                <label className={`block text-sm mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-military-olive ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-transparent'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
                  }`}
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-military-olive ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-transparent'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
                    }`}
                    placeholder="0123456789"
                    maxLength="10"
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-military-olive ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-transparent'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
                    }`}
                    placeholder="Access Bank"
                  />
                </div>
              </div>
            </div>

            {/* Fee Notice */}
            <div className={`p-4 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-military-brass mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    One-time processing fee: ₦7,000
                  </p>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    This fee is paid once per withdrawal and is non-refundable. You have 15 minutes to complete payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 text-lg"
            >
              {loading ? 'Processing...' : 'Continue to Fee Payment'}
            </button>

            {/* Cancel Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Return to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
