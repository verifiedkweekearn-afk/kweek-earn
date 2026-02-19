import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../components/KweekEarnLogo';
import SmartCashLogo from '../components/SmartCashLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const FeePayment = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);
  const [expired, setExpired] = useState(false);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Account number copied');
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        toast.error('File too large (max 5MB)');
        return;
      }
      if (!selected.type.match(/image\/(jpeg|jpg|png)/)) {
        toast.error('Only JPG/PNG allowed');
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please upload a screenshot');
      return;
    }

    setVerifying(true);
    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      const res = await API.post(`/withdrawals/${id}/verify`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Proof uploaded');
      // Use the requestId from response, or fallback to the id from params
      const redirectId = res.data.requestId || id;
      navigate(`/waitlist/${redirectId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setVerifying(false);
    }
  };

  if (expired) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'
      }`}>
        <div className={`max-w-md w-full p-8 rounded-2xl border text-center ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <h2 className="text-2xl font-bold mb-2">Payment Window Expired</h2>
          <p className="mb-6 text-gray-500">Please create a new withdrawal.</p>
          <button
            onClick={() => navigate('/withdraw')}
            className="w-full bg-military-olive hover:bg-military-olive/90 text-white py-3 rounded-lg"
          >
            New Withdrawal
          </button>
        </div>
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
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-lg border">
                <span className="text-xs uppercase text-gray-500">Balance</span>
                <span className="ml-2 font-bold text-military-brass">
                  ₦{user?.balance?.toLocaleString() || 0}
                </span>
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Transfer to Bank Account</h1>
          <p className="text-gray-500">Complete within 15 minutes</p>
        </div>

        {/* Timer */}
        <div className={`mb-8 p-6 rounded-xl border-2 ${
          timeLeft < 300 ? 'border-military-crimson/50' : 'border-military-brass/50'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Time Remaining</p>
              <p className={`text-3xl font-mono font-bold ${
                timeLeft < 300 ? 'text-military-crimson' : 'text-military-brass'
              }`}>{formatTime(timeLeft)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-3xl font-bold text-military-brass">₦7,000</p>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className={`p-8 rounded-2xl border-2 mb-6 ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-4 mb-8">
            <SmartCashLogo size="lg" />
            <div>
              <h2 className="text-xl font-bold">SmartCash PSB</h2>
              <p className="text-sm text-gray-500">Payment Service Bank</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
              <span className="text-gray-500">Account Number</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold text-military-brass">0346988943</span>
                <button
                  onClick={() => copyToClipboard('0346988943')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    copied ? 'bg-military-olive text-white' : 'bg-military-olive/10 text-military-olive'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex justify-between p-4 border-b">
              <span className="text-gray-500">Account Name</span>
              <span className="font-medium">SIDIKAT FAROJOYE</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Transfer exactly ₦7,000 to the account above. Upload your proof of payment below.
            </p>
          </div>
        </div>

        {/* Screenshot Upload */}
        <div className={`mb-6 p-6 rounded-xl border-2 ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-bold mb-4">Upload Payment Proof</h3>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="w-full p-4 border rounded-lg"
          />
          {file && (
            <p className="text-sm text-green-600 mt-2">✓ {file.name} selected</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={verifying || !file}
          className="w-full bg-military-olive hover:bg-military-olive/90 text-white py-4 rounded-lg text-lg disabled:opacity-50"
        >
          {verifying ? 'Uploading...' : 'I HAVE PAID'}
        </button>
      </div>
    </div>
  );
};

export default FeePayment;
