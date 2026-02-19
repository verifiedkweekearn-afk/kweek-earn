import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const Leaderboard = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('week');
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);

  // Mock data – replace with API calls
  useEffect(() => {
    // Generate mock leaderboard data
    const mockData = [
      { id: 1, username: 'Ola****', earnings: 84500, rank: 1, avatar: null },
      { id: 2, username: 'Chi****', earnings: 72300, rank: 2, avatar: null },
      { id: 3, username: 'Ayo****', earnings: 69150, rank: 3, avatar: null },
      { id: 4, username: 'Eme****', earnings: 58400, rank: 4, avatar: null },
      { id: 5, username: 'Tun****', earnings: 52750, rank: 5, avatar: null },
      { id: 6, username: 'Nne****', earnings: 48900, rank: 6, avatar: null },
      { id: 7, username: 'Ike****', earnings: 45200, rank: 7, avatar: null },
      { id: 8, username: 'Zik****', earnings: 41800, rank: 8, avatar: null },
      { id: 9, username: 'Ada****', earnings: 39500, rank: 9, avatar: null },
      { id: 10, username: 'Kay****', earnings: 36200, rank: 10, avatar: null },
    ];
    setLeaderboard(mockData);
    setUserRank({ rank: 42, earnings: 18400, username: user?.username || 'You' });
  }, [period, user]);

  const getRankColor = (rank) => {
    switch(rank) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-amber-600';
      default:
        return theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 2:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 3:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      default:
        return (
          <span className="font-mono text-sm font-bold w-6 text-center">
            {rank}
          </span>
        );
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        theme === 'dark'
          ? 'bg-gray-900/95 border-gray-800'
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <KweekEarnLogo variant="horizontal" size="sm" />
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Balance
                </span>
                <span className="ml-2 font-bold text-military-brass">
                  ₦{(user?.balance || 0).toLocaleString()}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {theme === 'dark' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-military-olive hover:bg-military-olive/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Top earners on Kweek Earn
          </p>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                period === p.id
                  ? 'bg-military-olive text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* User Rank Card */}
        {userRank && (
          <div className={`mb-8 p-6 rounded-xl border-2 border-military-brass/30 ${
            theme === 'dark'
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  {userRank.rank}
                </div>
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {userRank.username}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your current ranking
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Earnings
                </p>
                <p className="text-2xl font-bold text-military-brass">
                  ₦{userRank.earnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className={`rounded-xl border overflow-hidden ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <div className={`px-6 py-4 border-b ${
            theme === 'dark' ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                Rank
              </div>
              <div className="col-span-6 text-xs font-medium uppercase tracking-wider text-gray-500">
                User
              </div>
              <div className="col-span-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">
                Earnings
              </div>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={`px-6 py-4 ${
                  entry.username === user?.username
                    ? theme === 'dark'
                      ? 'bg-military-olive/10'
                      : 'bg-military-olive/5'
                    : ''
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="col-span-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <span className="text-sm font-medium">
                          {entry.username.charAt(0)}
                        </span>
                      </div>
                      <span className={`font-medium ${
                        entry.username === user?.username
                          ? 'text-military-brass'
                          : theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {entry.username}
                        {entry.username === user?.username && ' (You)'}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-4 text-right">
                    <span className="font-bold text-military-brass">
                      ₦{entry.earnings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anonymous Mode Notice */}
        <div className={`mt-8 p-4 rounded-lg ${
          theme === 'dark'
            ? 'bg-gray-900 border border-gray-800'
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Usernames are anonymized for privacy. Your real username is never displayed publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
