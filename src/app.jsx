import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';

import Home from './pages/Home';
import Services from './pages/Services';
import Events from './pages/Events';
import About from './pages/About';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import Login from './pages/Login';

import Dashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminEvents from './pages/admin/AdminEvents';
import AdminBoard from './pages/admin/AdminBoard';
import AdminMessages from './pages/admin/AdminMessages';
import AdminDonations from './pages/admin/AdminDonations';

const AuthenticatedApp = () => {
  const { isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin pages */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/board" element={<AdminBoard />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/donations" element={<AdminDonations />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App