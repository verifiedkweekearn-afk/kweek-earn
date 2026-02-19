import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const HamburgerMenu = () => {
  const { theme } = useTheme();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={`absolute left-0 mt-2 w-64 rounded-xl shadow-xl py-2 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <div className="px-4 py-3 border-b border-gray-700/50">
            <p className={`text-xs font-medium uppercase tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Navigation
            </p>
          </div>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/withdraw"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Withdraw
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/withdrawal-history"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Withdrawal History
              </Link>
            )}
          </Menu.Item>

          <div className="border-t my-2" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}></div>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/referrals"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Referrals
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/leaderboard"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Leaderboard
              </Link>
            )}
          </Menu.Item>

          <div className="border-t my-2" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}></div>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/faq"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQ
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/contact"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/settings"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            )}
          </Menu.Item>

          <div className="border-t my-2" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}></div>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/terms"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Terms of Service
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/privacy"
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active 
                    ? theme === 'dark'
                      ? 'bg-military-olive/20 text-military-olive'
                      : 'bg-military-olive/10 text-military-olive'
                    : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacy Policy
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default HamburgerMenu;
