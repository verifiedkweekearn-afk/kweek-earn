import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import DesktopModeNotification from './components/DesktopModeNotification';
import InstallReminder from './components/InstallReminder';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// User
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import FeePayment from './pages/FeePayment';
import Waitlist from './pages/Waitlist';
import PinVerification from './pages/PinVerification';
import FundsOnWay from './pages/FundsOnWay';
import WithdrawalSuccess from './pages/WithdrawalSuccess';
import WithdrawalHistory from './pages/WithdrawalHistory';
import FAQ from './pages/FAQ';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Referrals from './pages/Referrals';
import Leaderboard from './pages/Leaderboard';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DesktopModeNotification />
          <InstallReminder />
          <Toaster position="top-center" />
          <Routes>
            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

            {/* User */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
            <Route path="/fee-payment/:id" element={<ProtectedRoute><FeePayment /></ProtectedRoute>} />
            <Route path="/waitlist/:id" element={<ProtectedRoute><Waitlist /></ProtectedRoute>} />
            <Route path="/pin-verification/:id" element={<ProtectedRoute><PinVerification /></ProtectedRoute>} />
            <Route path="/funds-on-way/:id" element={<ProtectedRoute><FundsOnWay /></ProtectedRoute>} />
            <Route path="/withdrawal-success/:id" element={<ProtectedRoute><WithdrawalSuccess /></ProtectedRoute>} />
            <Route path="/withdrawal-history" element={<ProtectedRoute><WithdrawalHistory /></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
            <Route path="/privacy" element={<ProtectedRoute><Privacy /></ProtectedRoute>} />
            <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
