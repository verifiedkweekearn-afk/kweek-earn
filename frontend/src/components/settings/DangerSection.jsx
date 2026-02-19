import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DeletePinModal from '../modals/DeletePinModal';
import toast from 'react-hot-toast';

const DangerSection = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const handleDeactivate = async () => {
    setDeactivating(true);
    // Simulate deactivation - in production, call API
    setTimeout(() => {
      toast.success('Account deactivated successfully');
      logout();
      navigate('/login');
      setDeactivating(false);
    }, 1000);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className={`p-6 rounded-xl border ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-lg font-semibold mb-4 text-military-crimson">Danger Zone</h2>
        
        <div className="space-y-4">
          {/* Deactivate Account */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Deactivate Account
                </p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Temporarily disable your account. You can reactivate by logging in.
                </p>
              </div>
              <button
                onClick={handleDeactivate}
                disabled={deactivating}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {deactivating ? 'Processing...' : 'Deactivate'}
              </button>
            </div>
          </div>

          {/* Delete Account - PIN Only */}
          <div className={`p-4 rounded-lg border-2 ${
            theme === 'dark'
              ? 'bg-military-crimson/5 border-military-crimson/30'
              : 'bg-military-crimson/5 border-military-crimson/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-military-crimson">
                  Delete Account Permanently
                </p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ⚠️ All funds will be forfeited. This action is IRREVERSIBLE.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-military-crimson hover:bg-military-crimson/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete PIN Modal */}
      <DeletePinModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
        userBalance={user?.balance || 0}
      />
    </>
  );
};

export default DangerSection;
