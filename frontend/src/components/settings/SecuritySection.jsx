import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const SecuritySection = () => {
  const { theme } = useTheme();
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const fetchLoginHistory = async () => {
    setLoading(true);
    try {
      const data = await userService.getLoginHistory();
      setLoginHistory(data.history || []);
    } catch (error) {
      toast.error('Failed to load login history');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`p-6 rounded-xl border ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      <h2 className="text-lg font-semibold mb-4">Security</h2>
      
      <div className="space-y-6">
        {/* Login History */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Login History
            </p>
            <button
              onClick={fetchLoginHistory}
              className="text-military-olive hover:text-military-olive/80 text-sm transition-colors"
            >
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Loading...
              </p>
            </div>
          ) : loginHistory.length === 0 ? (
            <div className={`p-4 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                No login history available
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {loginHistory.slice(0, 5).map((entry, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {entry.device}
                      </p>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {entry.ip} • {entry.location || 'Nigeria'}
                      </p>
                    </div>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Two Factor Authentication - Coming Soon */}
        <div className={`p-4 rounded-lg ${
          theme === 'dark'
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Two-Factor Authentication
              </p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Add an extra layer of security to your account
              </p>
            </div>
            <span className="px-3 py-1 bg-gray-600/20 text-gray-500 text-xs font-medium rounded-full border border-gray-600/30">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Withdrawal PIN Reset */}
        <div className={`p-4 rounded-lg ${
          theme === 'dark'
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Withdrawal PIN Reset
              </p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Forgot your PIN? Contact support to reset it
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/contact'}
              className="text-military-olive hover:text-military-olive/80 text-sm transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;
