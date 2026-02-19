import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const AppearanceSection = () => {
  const { theme, toggleTheme } = useTheme();
  const [compact, setCompact] = useState(() => {
    return localStorage.getItem('compactView') === 'true';
  });

  const handleThemeChange = async (newTheme) => {
    if (newTheme === theme) return;
    
    toggleTheme();
    
    try {
      await userService.updateTheme(newTheme);
    } catch (error) {
      toast.error('Failed to sync theme preference');
    }
  };

  const handleCompactToggle = () => {
    const newValue = !compact;
    setCompact(newValue);
    localStorage.setItem('compactView', String(newValue));
    toast.success(`${newValue ? 'Compact' : 'Comfortable'} view enabled`);
  };

  return (
    <div className={`p-6 rounded-xl border ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      <h2 className="text-lg font-semibold mb-4">Appearance</h2>
      
      <div className="space-y-4">
        <div>
          <p className={`font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Theme
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-military-olive bg-military-olive/10'
                  : theme === 'dark'
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Light</span>
              </div>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-military-olive bg-military-olive/10'
                  : theme === 'dark'
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>Dark</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Compact View
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Reduce spacing for more content
            </p>
          </div>
          <button
            onClick={handleCompactToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              compact ? 'bg-military-olive' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                compact ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSection;
