import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

// Mock withdrawal data - realistic Nigerian usernames and amounts
const MOCK_WITHDRAWALS = [
  { username: 'Ola****', amount: 45200 },
  { username: 'Ayo****', amount: 62750 },
  { username: 'Chi****', amount: 38100 },
  { username: 'Eme****', amount: 55900 },
  { username: 'Tun****', amount: 70350 },
  { username: 'Nne****', amount: 49800 },
  { username: 'Ike****', amount: 84500 },
  { username: 'Zik****', amount: 51200 },
  { username: 'Ada****', amount: 66900 },
  { username: 'Kay****', amount: 73500 }
];

const LiveFeed = () => {
  const { theme } = useTheme();
  const [withdrawals, setWithdrawals] = useState([]);
  const [timeStamps, setTimeStamps] = useState({});

  useEffect(() => {
    // Initialize with 3 random withdrawals
    const initial = MOCK_WITHDRAWALS
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w, i) => ({
        ...w,
        id: i + 1
      }));
    
    setWithdrawals(initial);
    
    // Initialize timestamps
    const times = {};
    initial.forEach(w => {
      times[w.id] = 'Just now';
    });
    setTimeStamps(times);

    // Rotate withdrawals every 10 seconds
    const interval = setInterval(() => {
      setWithdrawals(prev => {
        const random = MOCK_WITHDRAWALS[Math.floor(Math.random() * MOCK_WITHDRAWALS.length)];
        const newWithdrawal = {
          ...random,
          id: Date.now()
        };
        
        // Update timestamps
        setTimeStamps(current => ({
          ...current,
          [newWithdrawal.id]: 'Just now',
          [prev[0]?.id]: '2m ago',
          [prev[1]?.id]: '5m ago',
          [prev[2]?.id]: '8m ago'
        }));
        
        return [newWithdrawal, ...prev].slice(0, 4);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-5 rounded-xl border ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Recent Withdrawals
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          theme === 'dark'
            ? 'bg-green-900/30 text-green-400 border border-green-800'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          Live
        </span>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {withdrawals.map((withdrawal) => (
          <div
            key={withdrawal.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
            style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}
          >
            {/* User */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                theme === 'dark' ? 'bg-green-500' : 'bg-green-600'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {withdrawal.username}
              </span>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-military-brass">
                ₦{withdrawal.amount.toLocaleString()}
              </span>
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {timeStamps[withdrawal.id] || 'Just now'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
        <div className="flex items-center justify-between text-xs">
          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
            Total withdrawn today
          </span>
          <span className="font-semibold text-military-brass">
            ₦{withdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
