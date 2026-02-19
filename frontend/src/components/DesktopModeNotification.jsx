import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const DesktopModeNotification = () => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const ua = navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobile(mobile);
      
      // Check if already dismissed today
      const lastDismissed = localStorage.getItem('desktopNotificationDismissed');
      const today = new Date().toDateString();
      
      if (lastDismissed !== today && mobile) {
        // Show after 3 seconds
        setTimeout(() => {
          setShow(true);
        }, 3000);
      }
    };

    checkMobile();
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('desktopNotificationDismissed', new Date().toDateString());
  };

  const handleDismissForever = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('desktopNotificationDismissed', 'forever');
  };

  if (!isMobile || !show || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className={`relative p-5 rounded-xl shadow-2xl border ${
        theme === 'dark'
          ? 'bg-gray-900 border-military-brass/30'
          : 'bg-white border-military-brass/30'
      }`}>
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-700/20 transition-colors"
          aria-label="Dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-military-brass/10' : 'bg-military-brass/10'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-military-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Desktop Mode Recommended
            </h4>
            <p className={`text-sm mb-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              For the best experience with Kweek Earn, please switch to desktop mode in your browser settings.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDismissForever}
                className="text-xs text-military-olive hover:text-military-olive/80 transition-colors"
              >
                Don't show again
              </button>
              <span className="text-xs text-gray-500">•</span>
              <button
                onClick={handleDismiss}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>

        {/* How to enable desktop mode - dropdown */}
        <details className="mt-3 pt-3 border-t" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
          <summary className={`text-xs cursor-pointer ${
            theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
          }`}>
            How to enable desktop mode
          </summary>
          <div className="mt-3 text-xs space-y-2">
            <div className={`p-2 rounded ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Chrome / Android:
              </p>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                1. Tap the ⋮ menu (three dots)<br />
                2. Check "Desktop site"<br />
                3. Refresh the page
              </p>
            </div>
            <div className={`p-2 rounded ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Safari / iOS:
              </p>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                1. Tap the 'Aa' button in address bar<br />
                2. Select "Request Desktop Website"<br />
                3. Refresh the page
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default DesktopModeNotification;
