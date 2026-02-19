import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const InstallReminder = () => {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has seen this before
    const hasSeen = localStorage.getItem('installReminderSeen');
    if (!hasSeen) {
      // Show after 2 seconds
      setTimeout(() => {
        setShow(true);
      }, 2000);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('installReminderSeen', 'true');
  };

  const handleDismissForever = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('installReminderSeen', 'forever');
  };

  if (!show || dismissed) return null;

  const platforms = [
    { 
      name: 'Facebook', 
      package: 'com.facebook.katana',
      icon: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      package: 'com.instagram.android',
      icon: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
        </svg>
      )
    },
    { 
      name: 'TikTok', 
      package: 'com.zhiliaoapp.musically',
      icon: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
        </svg>
      )
    },
    { 
      name: 'Twitter', 
      package: 'com.twitter.android',
      icon: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.775-4.744 13.787 13.787 0 001.303-5.589c0-.21-.005-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    { 
      name: 'Threads', 
      package: 'com.instagram.barcelona',
      icon: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M14.54 10.79c.03-.18.05-.36.05-.54 0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c.64 0 1.25-.12 1.82-.34.34-.13.68-.28 1-.46.24.48.52.93.85 1.36-.82.38-1.72.6-2.67.6-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6c0 .21-.01.42-.03.62-.31.01-.62.04-.92.09l.8-1.33z"/>
        </svg>
      )
    },
    { 
      name: 'YouTube', 
      package: 'com.google.android.youtube',
      icon: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    { 
      name: 'Snapchat', 
      package: 'com.snapchat.android',
      icon: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12.001.001C6.481.001 2.017 4.011 2.017 9.5c0 1.428.335 2.781.918 4.009-.173.242-.364.473-.557.674-.638.664-1.065 1.386-1.065 1.963 0 .538.335.959.818 1.209.466.241 1.045.373 1.628.469.461.076.94.124 1.397.18.472.058.922.124 1.281.252.345.122.614.324.785.703.115.256.168.544.168.862 0 .736-.459 1.112-.93 1.289-.369.139-.79.188-1.208.224-.772.067-1.537.125-2.259.281-.729.158-1.504.475-1.834 1.218-.226.507-.176 1.042.115 1.485.32.486.904.819 1.586.966.74.159 1.512.182 2.292.182.777 0 1.566-.023 2.328-.084.576-.046 1.143-.125 1.684-.285.448-.132.89-.324 1.312-.572.428-.25.835-.57 1.223-.916.39.346.796.666 1.225.916.42.248.863.44 1.312.572.541.16 1.108.239 1.684.285.762.061 1.55.084 2.328.084.78 0 1.552-.023 2.292-.182.682-.147 1.266-.48 1.586-.966.291-.443.341-.978.115-1.485-.33-.743-1.105-1.06-1.834-1.218-.722-.156-1.487-.214-2.259-.281-.418-.036-.839-.085-1.208-.224-.471-.177-.93-.553-.93-1.289 0-.318.053-.606.168-.862.171-.379.44-.581.785-.703.359-.128.809-.194 1.281-.252.457-.056.936-.104 1.397-.18.583-.096 1.162-.228 1.628-.469.483-.25.818-.671.818-1.209 0-.577-.427-1.299-1.065-1.963-.193-.201-.384-.432-.557-.674.583-1.228.918-2.581.918-4.009 0-5.489-4.464-9.5-9.983-9.5z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`max-w-lg w-full rounded-2xl border-2 ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'
      } p-6 max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sticky top-0 bg-inherit pt-2">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${
              theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Install Required Apps</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Install these apps before starting tasks for the best experience
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-700/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Platform List */}
        <div className="space-y-3 mb-6">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className={`flex items-center justify-between p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 text-military-olive">
                  <platform.icon className="w-full h-full" />
                </div>
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {platform.name}
                </span>
              </div>
              <a
                href={`https://play.google.com/store/apps/details?id=${platform.package}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-military-olive hover:bg-military-olive/90 text-white px-3 py-1 rounded-lg transition-colors"
              >
                Install
              </a>
            </div>
          ))}
        </div>

        {/* Why This Matters */}
        <div className={`mb-6 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
                Why install these apps?
              </p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                Tasks open directly in the mobile app for a smoother experience. 
                If an app is not installed, it will open in your browser instead.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDismissForever}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Don't show again
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 bg-military-olive hover:bg-military-olive/90 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Got it, continue
          </button>
        </div>

        {/* Note */}
        <p className={`text-xs text-center mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          You only need to install apps you plan to use for tasks
        </p>
      </div>
    </div>
  );
};

export default InstallReminder;
