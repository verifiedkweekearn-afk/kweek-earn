import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const NotificationSection = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    email: true,
    withdrawal: true,
    tasks: true,
    marketing: false
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const data = await userService.getNotifications();
      setPreferences(data.preferences);
    } catch (error) {
      toast.error('Failed to load notification preferences');
    }
  };

  const handleToggle = async (key) => {
    const updated = {
      ...preferences,
      [key]: !preferences[key]
    };

    setPreferences(updated);
    setLoading(true);

    try {
      await userService.updateNotifications(updated);
      toast.success('Preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
      // Revert on error
      setPreferences({
        ...preferences,
        [key]: !updated[key]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Email Notifications
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Receive account updates via email
            </p>
          </div>
          <button
            onClick={() => handleToggle('email')}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.email ? 'bg-military-olive' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.email ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Withdrawal Confirmations
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Get notified when withdrawals are processed
            </p>
          </div>
          <button
            onClick={() => handleToggle('withdrawal')}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.withdrawal ? 'bg-military-olive' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.withdrawal ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Task Completion Alerts
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Daily summary of completed tasks
            </p>
          </div>
          <button
            onClick={() => handleToggle('tasks')}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.tasks ? 'bg-military-olive' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.tasks ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Marketing Communications
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Promotions, bonuses, and special offers
            </p>
          </div>
          <button
            onClick={() => handleToggle('marketing')}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.marketing ? 'bg-military-olive' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.marketing ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;
