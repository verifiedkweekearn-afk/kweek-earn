import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';
import TaskCard from '../components/tasks/TaskCard';
import LiveFeed from '../components/layout/LiveFeed';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const fetchTodayTasks = async () => {
    try {
      const response = await API.get('/tasks/today');
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = (completedTaskId) => {
    // Remove the completed task immediately
    setTasks(prev => prev.filter(t => t.id !== completedTaskId));
    // Optionally refetch to ensure sync
    fetchTodayTasks();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.length - completedCount;

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
              <div className={`px-4 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <span className="text-xs uppercase tracking-wider text-gray-500">Balance</span>
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
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-military-crimson hover:bg-military-crimson/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className={`p-6 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <h1 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back, <span className="text-military-olive">{user?.username}</span>
            </h1>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Complete tasks to earn money. Minimum withdrawal: ₦30,000
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <span className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Available Balance
            </span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-military-brass">
                ₦{user?.balance?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <span className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Tasks Completed
            </span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-military-olive">{completedCount}</span>
              <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                / {tasks.length}
              </span>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <span className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Pending Tasks
            </span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-military-taupe">{pendingCount}</span>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <span className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Today's Earnings
            </span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-military-brass">
                ₦{((user?.balance || 0) - (user?.originalBalance || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Today's Tasks
              </h2>
              <span className={`text-xs px-3 py-1.5 rounded-full border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}>
                Reset in 24h
              </span>
            </div>

            {loading ? (
              <div className={`p-12 text-center rounded-xl border ${
                theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              }`}>
                <div className="text-gray-500">Loading tasks...</div>
              </div>
            ) : tasks.length === 0 ? (
              <div className={`p-12 text-center rounded-xl border ${
                theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  All Tasks Completed
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Great job! New tasks available tomorrow.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleTaskComplete}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <LiveFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
