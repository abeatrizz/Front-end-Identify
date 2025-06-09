
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DashboardScreen from './screens/DashboardScreen';
import CasesScreen from './screens/CasesScreen';
import CaseDetailScreen from './screens/CaseDetailScreen';
import NewCaseScreen from './screens/NewCaseScreen';
import EvidenceScreen from './screens/EvidenceScreen';
import EvidenceDetailScreen from './screens/EvidenceDetailScreen';
import ReportsScreen from './screens/ReportsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminUsersScreen from './screens/AdminUsersScreen';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/cases" element={<CasesScreen />} />
        <Route path="/cases/:id" element={<CaseDetailScreen />} />
        <Route path="/new-case" element={<NewCaseScreen />} />
        <Route path="/evidence/:caseId" element={<EvidenceScreen />} />
        <Route path="/evidence/:caseId/:evidenceId" element={<EvidenceDetailScreen />} />
        <Route path="/reports" element={<ReportsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/admin/users" element={<AdminUsersScreen />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
