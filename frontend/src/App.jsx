import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { useAuthStore } from './stores/authStore.js';
import Navbar from './components/layout/Navbar.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import EventPage from './pages/EventPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';

function App() {
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-bg text-text-primary transition-colors duration-200">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <BookingsPage />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all route */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-bg text-text-primary text-center">
                    <h1 className="font-display font-extrabold text-6xl text-accent-glow/50 mb-4">404</h1>
                    <p className="font-body text-text-secondary">Page not found</p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  </ThemeProvider>
  );
}

export default App;
