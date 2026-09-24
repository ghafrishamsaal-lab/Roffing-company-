import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { PublicLayout } from './components/common/PublicLayout';
import { CustomerProtectedRoute, AdminProtectedRoute } from './components/common/AuthGuards';
import { db } from './firebase/config';
import { ensureDemoDataSeeded } from './services/seedData';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceDetailPage } from './pages/public/ServiceDetailPage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogDetailPage } from './pages/public/BlogDetailPage';
import { ContactPage } from './pages/public/ContactPage';
import { QuotePage } from './pages/public/QuotePage';
import { FAQPage } from './pages/public/FAQPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminQuotesPage } from './pages/admin/AdminQuotesPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminFAQPage } from './pages/admin/AdminFAQPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

export default function App() {
  useEffect(() => {
    // Seed initial business data to Firestore if not already seeded
    ensureDemoDataSeeded(db);
  }, []);

  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Customer Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <CustomerProtectedRoute>
                  <CustomerDashboard />
                </CustomerProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <CustomerProtectedRoute>
                  <CustomerProfilePage />
                </CustomerProtectedRoute>
              }
            />
          </Route>

          {/* Admin Login (Public for admins) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardOverview />} />
            <Route path="quotes" element={<AdminQuotesPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="testimonials" element={<AdminTestimonialsPage />} />
            <Route path="faq" element={<AdminFAQPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
