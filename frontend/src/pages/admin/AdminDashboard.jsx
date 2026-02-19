import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import API from '../../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../../components/KweekEarnLogo';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await API.get('/admin/withdrawals');
      setWithdrawals(res.data.withdrawals || []);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePin = async (id) => {
    try {
      const res = await API.post(`/admin/withdrawals/${id}/generate-pin`);
      toast.success(`PIN: ${res.data.pin}`);
      fetchWithdrawals();
    } catch (err) {
      toast.error('Failed to generate PIN');
    }
  };

  const handleMarkSent = async (id) => {
    try {
      await API.post(`/admin/withdrawals/${id}/mark-sent`);
      toast.success('Marked as sent');
      fetchWithdrawals();
    } catch (err) {
      toast.error('Failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending_fee': return 'bg-yellow-100 text-yellow-800';
      case 'waitlist': return 'bg-blue-100 text-blue-800';
      case 'pin_generated': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'}`}>
      <nav className="bg-gray-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <KweekEarnLogo variant="horizontal" size="sm" />
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Withdrawal Requests</h1>

        {withdrawals.length === 0 ? (
          <p className="text-gray-500">No withdrawals found</p>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{w.User?.username || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{w.accountName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-military-brass">₦{w.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{w.bankName}</div>
                      <div className="text-sm text-gray-500">{w.accountNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(w.status)}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {w.pin || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {w.status === 'pending_fee' && (
                        <button
                          onClick={() => handleGeneratePin(w.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Release PIN
                        </button>
                      )}
                      {w.status === 'waitlist' && (
                        <button
                          onClick={() => handleGeneratePin(w.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve & Release PIN
                        </button>
                      )}
                      {w.status === 'pin_generated' && (
                        <button
                          onClick={() => handleMarkSent(w.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Mark Sent
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
