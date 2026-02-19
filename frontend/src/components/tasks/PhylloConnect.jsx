import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

const PhylloConnect = ({ onSuccess }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [sdkToken, setSdkToken] = useState(null);
  const [showSDK, setShowSDK] = useState(false);
  const [hasConnected, setHasConnected] = useState(false);

  useEffect(() => {
    initializeConnection();
  }, []);

  const initializeConnection = async () => {
    setLoading(true);
    try {
      const response = await API.post('/phyllo/connect');
      setSdkToken(response.data.sdkToken);
      
      if (response.data.hasConnected) {
        setHasConnected(true);
        onSuccess();
      } else {
        setShowSDK(true);
      }
    } catch (error) {
      toast.error('Failed to initialize connection');
      console.error('Phyllo init error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPhylloSDK = () => {
    if (!sdkToken) return;

    // Check if script already loaded
    if (document.getElementById('phyllo-sdk')) {
      openPhylloSDK();
      return;
    }

    // Load Phyllo SDK script
    const script = document.createElement('script');
    script.id = 'phyllo-sdk';
    script.src = 'https://cdn.getphyllo.com/v1/sdk.js';
    script.async = true;
    script.onload = () => {
      openPhylloSDK();
    };
    script.onerror = () => {
      toast.error('Failed to load connection SDK');
    };
    document.body.appendChild(script);
  };

  const openPhylloSDK = () => {
    if (!window.PhylloSDK) {
      toast.error('SDK not loaded properly');
      return;
    }

    window.PhylloSDK.init({
      token: sdkToken,
      onSuccess: (data) => {
        toast.success('Account connected successfully!');
        setHasConnected(true);
        onSuccess(data);
      },
      onError: (error) => {
        toast.error('Connection failed. Please try again.');
        console.error('Phyllo error:', error);
      },
      onClose: () => {
        setShowSDK(false);
      }
    });

    window.PhylloSDK.open();
  };

  useEffect(() => {
    if (showSDK && sdkToken && !hasConnected) {
      loadPhylloSDK();
    }
  }, [showSDK, sdkToken, hasConnected]);

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-military-olive mx-auto mb-3"></div>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Preparing connection...
        </p>
      </div>
    );
  }

  if (hasConnected) {
    return (
      <div className={`text-center py-4 px-4 rounded-lg ${
        theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
      }`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className={`font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
            Account Connected
          </span>
        </div>
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Your social accounts are linked. You can now verify tasks automatically.
        </p>
      </div>
    );
  }

  if (showSDK) {
    return (
      <div className="text-center py-4">
        <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Click the button below to connect your social accounts
        </p>
        <button
          onClick={() => {
            if (window.PhylloSDK) {
              window.PhylloSDK.open();
            } else {
              loadPhylloSDK();
            }
          }}
          className="px-6 py-2 bg-military-olive hover:bg-military-olive/90 text-white rounded-lg transition-colors"
        >
          Open Connection Window
        </button>
        <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          A popup will open. Please allow popups for this site.
        </p>
      </div>
    );
  }

  return (
    <div className={`text-center py-4 px-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Connect your social media accounts to verify tasks automatically
      </p>
      <button
        onClick={() => setShowSDK(true)}
        className="px-6 py-2 bg-military-olive hover:bg-military-olive/90 text-white rounded-lg transition-colors"
      >
        Connect Accounts
      </button>
    </div>
  );
};

export default PhylloConnect;
