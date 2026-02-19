import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const ProfileSection = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`p-6 rounded-xl border ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Username</span>
          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user?.username}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</span>
          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user?.email}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</span>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {formatDate(user?.createdAt)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Account Status</span>
          <span className="px-3 py-1 bg-green-600/10 text-green-600 text-xs font-medium rounded-full border border-green-600/30">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
