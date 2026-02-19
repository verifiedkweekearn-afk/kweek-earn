import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const FundsOnWay = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState('');

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }
    
    fetchWithdrawal();
    
    // Calculate estimated arrival (1-2 hours from now)
    const arrival = new Date();
    arrival.setHours(arrival.getHours() + Math.floor(Math.random() * 2) + 1);
    setEta(arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Check for status changes every 5 seconds
    const interval = setInterval(fetchWithdrawal, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchWithdrawal = async () => {
    try {
      const res = await API.get('/withdrawals');
      const found = res.data.find(w => w.id === id);
      
      if (found) {
        setWithdrawal(found);
        
        // ✅ If admin marked as sent, go to success page
        if (found.status === 'completed') {
          navigate(`/withdrawal-success/${id}`);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mask account number (show last 4 digits)
  const maskAccount = (acc) => {
    if (!acc) return '';
    return '••••' + acc.slice(-4);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'
      }`}>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`p-8 rounded-2xl border-2 text-center ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-blue-500/40 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Funds Are On The Way!</h1>
          
          <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Your withdrawal has been approved and is being processed.
          </p>

          {withdrawal && (
            <div className={`mb-8 p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className="text-sm font-medium mb-4">Sending To:</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank:</span>
                  <span className="font-medium">{withdrawal.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Number:</span>
                  <span className="font-mono font-medium">{maskAccount(withdrawal.accountNumber)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Name:</span>
                  <span className="font-medium">{withdrawal.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-bold text-military-brass">₦{withdrawal.amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* ETA */}
          <div className={`mb-8 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Estimated arrival: <span className="font-bold">{eta}</span>
            </p>
            <p className="text-xs text-blue-500 mt-1">
              This page automatically updates when your transfer is complete.
            </p>
          </div>

          {/* Status Indicator */}
          <p className="text-sm text-gray-500 mb-6">
            Checking for updates every 5 seconds...
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-4 rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/withdrawal-history')}
              className="w-full bg-transparent hover:bg-gray-700/10 text-gray-500 font-medium py-3 rounded-lg transition-colors border border-gray-600/30"
            >
              View Withdrawal History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundsOnWay;
