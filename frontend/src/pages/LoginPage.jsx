import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useAuthStore } from '../stores/authStore.js';

const LoginPage = () => {
  const { login, error, clearError, loading } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation States
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [shakeField, setShakeField] = useState(null);

  // Clear global errors on mount/unmount
  useEffect(() => {
    clearError();
    return () => {
      clearError();
    };
  }, [clearError]);

  const validateField = (name, value) => {
    if (name === 'email') {
      if (!value.trim()) {
        return "Enter your email to continue.";
      }
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(value)) {
        return "That doesn't look like a valid email.";
      }
    }
    if (name === 'password') {
      if (!value) {
        return "Choose a password to secure your account.";
      }
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);

    if (touched[name] || errors[name]) {
      const errMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errMsg }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Mark all as touched
    setTouched({ email: true, password: true });

    const emailErr = validateField('email', email);
    const passwordErr = validateField('password', password);

    const newErrors = { email: emailErr, password: passwordErr };
    setErrors(newErrors);

    if (emailErr || passwordErr) {
      const firstInvalid = emailErr ? 'email' : 'password';
      
      // Auto-focus + smooth scroll
      const inputEl = document.getElementById(firstInvalid);
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Shake animation
      setShakeField(firstInvalid);
      setTimeout(() => setShakeField(null), 300);
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2 bg-bg transition-colors duration-200">
      {/* Left panel: Form */}
      <div className="flex flex-col justify-center px-6 py-12 md:py-24 sm:px-12 lg:px-20 z-10">
        <div className="mx-auto w-full max-w-[380px]">
          {/* Wordmark (mobile) */}
          <div className="mb-8 block md:hidden select-none">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-extrabold text-3xl text-text-primary">
                <span className="text-accent">e</span>ventflow
              </span>
            </div>
          </div>

          <h2 className="font-display font-bold text-[28px] text-text-primary leading-snug mb-1">
            Welcome back
          </h2>
          <p className="font-body text-text-secondary text-[15px] mb-8">
            Log in to manage your bookings.
          </p>

          {/* Server/Network Error Banner */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 rounded-sm bg-error-bg border border-error animate-fadeIn" role="alert">
              <FontAwesomeIcon icon={faCircleXmark} className="text-error w-5 h-5 flex-shrink-0" />
              <span className="font-body text-[14px] font-medium text-error">
                {error === 'Invalid credentials' ? 'Incorrect email or password. Try again.' : error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-body font-semibold text-[12px] text-text-secondary uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-text-muted">
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@example.com"
                  disabled={loading}
                  className={`w-full h-12 pl-10 bg-surface-elevated border rounded-sm font-body text-[15px] text-text-primary placeholder-text-muted focus:outline-none transition-all duration-200 disabled:opacity-50
                    ${errors.email && touched.email
                      ? 'border-error shadow-[0_0_0_3px_var(--color-error-bg)] focus:border-error'
                      : 'border-border focus:border-accent focus:ring-3 focus:ring-accent-glow'
                    }
                    ${shakeField === 'email' ? 'animate-shake' : ''}
                    ${(touched.email && !errors.email && email) ? 'pr-10' : 'pr-4'}
                  `}
                  required
                />
                {/* Positive feedback checkmark */}
                {touched.email && !errors.email && email && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-success">
                    <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
                  </span>
                )}
              </div>
              {/* Error Message */}
              {errors.email && touched.email && (
                <span aria-live="polite" className="font-body text-[12px] text-error flex items-center gap-1.5 mt-1 animate-fadeIn">
                  <FontAwesomeIcon icon={faCircleXmark} className="w-3.5 h-3.5" />
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="font-body font-semibold text-[12px] text-text-secondary uppercase tracking-widest">
                  Password
                </label>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset functionality is not implemented in this phase.');
                  }}
                  className="font-body font-medium text-[12px] text-accent hover:underline focus:outline-none"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-text-muted">
                  <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full h-12 pl-10 pr-10 bg-surface-elevated border rounded-sm font-body text-[15px] text-text-primary placeholder-text-muted focus:outline-none transition-all duration-200 disabled:opacity-50
                    ${errors.password && touched.password
                      ? 'border-error shadow-[0_0_0_3px_var(--color-error-bg)] focus:border-error'
                      : 'border-border focus:border-accent focus:ring-3 focus:ring-accent-glow'
                    }
                    ${shakeField === 'password' ? 'animate-shake' : ''}
                  `}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-muted hover:text-text-secondary focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
              {/* Error Message */}
              {errors.password && touched.password && (
                <span aria-live="polite" className="font-body text-[12px] text-error flex items-center gap-1.5 mt-1 animate-fadeIn">
                  <FontAwesomeIcon icon={faCircleXmark} className="w-3.5 h-3.5" />
                  {errors.password}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 flex items-center justify-center bg-accent-fill text-white font-body font-semibold text-[15px] rounded-sm hover:bg-accent-fill-hover focus:outline-none focus:ring-3 focus:ring-accent-glow transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Log in'
              )}
            </button>
          </form>

          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative px-3 bg-bg text-[12px] font-semibold text-text-muted uppercase tracking-widest">
              or
            </span>
          </div>

          {/* Decorative Google Login */}
          <button
            type="button"
            onClick={() => alert('Google authentication is a placeholder for styling.')}
            className="w-full h-12 flex items-center justify-center gap-3 border border-border bg-transparent text-text-primary font-body font-semibold text-[15px] rounded-sm hover:border-accent hover:text-accent transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-accent-glow"
          >
            <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 text-text-secondary hover:text-accent" />
            Continue with Google
          </button>

          {/* Footer Navigation */}
          <p className="mt-8 text-center font-body text-[14px] text-text-secondary">
            New here?{' '}
            <Link to="/register" className="font-semibold text-accent hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel: Visual Banner */}
      <div className="hidden md:flex relative flex-col justify-between p-12 bg-surface border-l border-border overflow-hidden select-none">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
          <span className="font-display font-extrabold text-[15vw] tracking-tighter text-text-primary uppercase leading-none rotate-[-10deg]">
            events
          </span>
        </div>

        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/12 w-[340px] h-[220px] flex flex-col gap-6 items-center pointer-events-none">
          <div className="w-[300px] h-[90px] rounded-md bg-surface-elevated/40 border border-border/30 backdrop-blur-md rotate-[-4deg] -translate-x-6 flex items-center px-4 gap-4 opacity-80">
            <div className="w-12 h-12 rounded bg-accent/10 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-3/4 rounded bg-text-muted/20" />
              <div className="h-2 w-1/2 rounded bg-text-muted/10" />
            </div>
          </div>
          <div className="w-[300px] h-[90px] rounded-md bg-surface-elevated/60 border border-border/40 backdrop-blur-lg rotate-[3deg] translate-x-4 flex items-center px-4 gap-4 shadow-xl">
            <div className="w-12 h-12 rounded bg-accent/20 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-2/3 rounded bg-accent/20" />
              <div className="h-2 w-1/3 rounded bg-text-muted/20" />
            </div>
          </div>
          <div className="w-[300px] h-[90px] rounded-md bg-surface-elevated/30 border border-border/20 backdrop-blur-sm rotate-[-2deg] -translate-x-2 flex items-center px-4 gap-4 opacity-50">
            <div className="w-12 h-12 rounded bg-text-muted/10 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-1/2 rounded bg-text-muted/20" />
              <div className="h-2 w-1/4 rounded bg-text-muted/10" />
            </div>
          </div>
        </div>

        <div className="mt-auto max-w-[340px]">
          <h3 className="font-display font-bold text-2xl text-text-primary leading-tight mb-2">
            Your next great night out starts here.
          </h3>
          <p className="font-body text-text-secondary text-[14px]">
            Access thousands of ticketed events, keep track of bookings, and secure seats in real time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
