import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { useAuth } from './context/AuthContext';
import { AboutPage, AuthPage, CategoriesPage, DashboardPage, HistoryPage, ProfilePage, QuizPage, ResultPage } from './pages/Pages';

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><span className="spinner" /> Loading your workspace</div>;
  return user ? children : <Navigate to="/login" replace />;
}
export default function App() {
  return <Routes><Route element={<AppShell />}>
    <Route path="/" element={<DashboardPage />} /><Route path="/about" element={<AboutPage />} />
    <Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} />
    <Route path="/categories" element={<Protected><CategoriesPage /></Protected>} /><Route path="/categories/:category" element={<Protected><CategoriesPage /></Protected>} />
    <Route path="/quiz/:id" element={<Protected><QuizPage /></Protected>} /><Route path="/results/:id" element={<Protected><ResultPage /></Protected>} />
    <Route path="/profile" element={<Protected><ProfilePage /></Protected>} /><Route path="/history" element={<Protected><HistoryPage /></Protected>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes>;
}
