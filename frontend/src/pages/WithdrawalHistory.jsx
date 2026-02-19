import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const WithdrawalHistory = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await API.get('/withdrawals');
      setWithdrawals(res.data);
    } catch (err) {
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending_fee': return 'bg-yellow-100 text-yellow-800';
      case 'waitlist': return 'bg-blue-100 text-blue-800';
      case 'pin_generated': return 'bg-purple-100 text-purple-800';
      case 'pin_confirmed': return 'bg-indigo-100 text-indigo-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending_fee': return 'Pending Payment';
      case 'waitlist': return 'Under Review';
      case 'pin_generated': return 'PIN Ready';
      case 'pin_confirmed': return 'Processing';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  const handleViewDetails = (withdrawal) => {
    // Redirect based on status
    if (withdrawal.status === 'waitlist') {
      navigate(`/waitlist/${withdrawal.id}`);
    } else if (withdrawal.status === 'pin_generated') {
      navigate(`/pin-verification/${withdrawal.id}`);
    } else if (withdrawal.status === 'pin_confirmed') {
      navigate(`/funds-on-way/${withdrawal.id}`);
    } else if (withdrawal.status === 'completed') {
      navigate(`/withdrawal-success/${withdrawal.id}`);
    } else {
      // For pending_fee, show details or allow to continue
      toast('This withdrawal is pending payment');
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending_fee', 'waitlist', 'pin_generated', 'pin_confirmed'].includes(w.status);
    if (filter === 'completed') return w.status === 'completed';
    if (filter === 'failed') return w.status === 'failed';
    return true;
  });

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
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-lg border">
                <span className="text-xs uppercase text-gray-500">Balance</span>
                <span className="ml-2 font-bold text-military-brass">₦{user?.balance?.toLocaleString() || 0}</span>
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
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Withdrawal History</h1>
        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Track all your withdrawal requests
        </p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'completed', 'failed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                filter === f
                  ? 'bg-military-olive text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className={`p-12 text-center rounded-xl border ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <p className="text-gray-500">No withdrawals found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWithdrawals.map((w) => (
              <div
                key={w.id}
                onClick={() => handleViewDetails(w)}
                className={`p-6 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800 hover:border-military-olive'
                    : 'bg-white border-gray-200 hover:border-military-olive'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(w.status)}`}>
                        {getStatusText(w.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(w.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-military-brass">₦{w.amount?.toLocaleString()}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-sm">{w.bankName} ••••{w.accountNumber?.slice(-4)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-military-olive text-sm">View Details →</span>
                  </div>
                </div>

                {/* Show PIN if available */}
                {w.pin && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 mr-2">PIN:</span>
                    <span className="font-mono text-sm">{w.pin}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;
