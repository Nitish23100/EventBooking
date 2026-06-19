import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useAuthStore } from '../stores/authStore.js';

const RegisterPage = () => {
  const { register, error, clearError, loading } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation States
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [shakeField, setShakeField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({ percent: 0, color: '', text: '' });

  // Clear errors when mounting/unmounting
  useEffect(() => {
    clearError();
    return () => {
      clearError();
    };
  }, [clearError]);

  // Compute password strength in real time
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ percent: 0, color: 'bg-transparent', text: '' });
      return;
    }

    if (password.length < 8) {
      setPasswordStrength({
        percent: 25,
        color: 'bg-error',
        text: 'Weak (minimum 8 characters)',
      });
      return;
    }

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const hasCaseDifference = /[a-z]/.test(password) && /[A-Z]/.test(password);

    if (password.length >= 10 && hasLetters && hasNumbers && hasSpecial && hasCaseDifference) {
      setPasswordStrength({
        percent: 100,
        color: 'bg-success',
        text: 'Strong password',
      });
    } else {
      setPasswordStrength({
        percent: 60,
        color: 'bg-warning',
        text: 'Medium strength',
      });
    }
  }, [password]);

  const validateField = (fieldName, value) => {
    if (fieldName === 'name') {
      if (!value.trim()) {
        return "We'll need your name to get started.";
      }
      if (value.trim().length < 2) {
        return "Name must be at least 2 characters.";
      }
    }
    if (fieldName === 'email') {
      if (!value.trim()) {
        return "Enter your email to continue.";
      }
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(value)) {
        return "That doesn't look like a valid email.";
      }
    }
    if (fieldName === 'password') {
      if (!value) {
        return "Choose a password to secure your account.";
      }
      if (value.length < 8) {
        return "Use at least 8 characters.";
      }
    }
    if (fieldName === 'confirmPassword') {
      if (value !== password) {
        return "Passwords don't match.";
      }
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name: fieldName, value } = e.target;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const errMsg = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: errMsg }));
  };

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    if (fieldName === 'name') setName(value);
    if (fieldName === 'email') setEmail(value);
    if (fieldName === 'password') setPassword(value);
    if (fieldName === 'confirmPassword') setConfirmPassword(value);

    // If confirm password changes, revalidate it, or if password changes and confirm password is touched, revalidate confirm password
    if (fieldName === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: value === confirmPassword ? '' : "Passwords don't match." }));
    }

    if (touched[fieldName] || errors[fieldName]) {
      const errMsg = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: errMsg }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const nameErr = validateField('name', name);
    const emailErr = validateField('email', email);
    const passwordErr = validateField('password', password);
    const confirmErr = validateField('confirmPassword', confirmPassword);

    const newErrors = {
      name: nameErr,
      email: emailErr,
      password: passwordErr,
      confirmPassword: confirmErr,
    };
    setErrors(newErrors);

    if (nameErr || emailErr || passwordErr || confirmErr) {
      // Find first invalid field
      let firstInvalid = '';
      if (nameErr) firstInvalid = 'name';
      else if (emailErr) firstInvalid = 'email';
      else if (passwordErr) firstInvalid = 'password';
      else if (confirmErr) firstInvalid = 'confirmPassword';

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

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2 bg-bg transition-colors duration-200">
      {/* Right panel: Visual Banner (mirrored to right side on desktop) */}
      <div className="hidden md:flex relative flex-col justify-between p-12 bg-surface border-r border-border overflow-hidden select-none order-2">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
          <span className="font-display font-extrabold text-[15vw] tracking-tighter text-text-primary uppercase leading-none rotate-[10deg]">
            create
          </span>
        </div>

        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/12 w-[340px] h-[220px] flex flex-col gap-6 items-center pointer-events-none">
          <div className="w-[300px] h-[90px] rounded-md bg-surface-elevated/65 border border-border/40 backdrop-blur-lg rotate-[4deg] translate-x-6 flex items-center px-4 gap-4 shadow-xl">
            <div className="w-12 h-12 rounded bg-accent/20 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-2/3 rounded bg-accent/20" />
              <div className="h-2 w-1/3 rounded bg-text-muted/20" />
            </div>
          </div>
          <div className="w-[300px] h-[90px] rounded-md bg-surface-elevated/40 border border-border/30 backdrop-blur-md rotate-[-3deg] -translate-x-4 flex items-center px-4 gap-4 opacity-80">
            <div className="w-12 h-12 rounded bg-accent/10 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-3/4 rounded bg-text-muted/20" />
              <div className="h-2 w-1/2 rounded bg-text-muted/10" />
            </div>
          </div>
        </div>

        <div className="mt-auto max-w-[340px] self-end text-right">
          <h3 className="font-display font-bold text-2xl text-text-primary leading-tight mb-2">
            Every great story starts with showing up.
          </h3>
          <p className="font-body text-text-secondary text-[14px]">
            Join eventflow to reserve seats instantly for music events, technical summits, comedy acts, and more.
          </p>
        </div>
      </div>

      {/* Left panel: Form */}
      <div className="flex flex-col justify-center px-6 py-12 md:py-24 sm:px-12 lg:px-20 z-10 order-1 md:order-1">
        <div className="mx-auto w-full max-w-[380px]">
          {/* Wordmark for mobile */}
          <div className="mb-8 block md:hidden">
            <span className="font-display font-extrabold text-3xl text-text-primary">
              <span className="text-accent">e</span>ventflow
            </span>
          </div>

          <h2 className="font-display font-bold text-[28px] text-text-primary leading-snug mb-1">
            Create account
          </h2>
          <p className="font-body text-text-secondary text-[15px] mb-8">
            Register now to book your first event seat.
          </p>

          {/* Server/Network Error Banner */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 rounded-sm bg-error-bg border border-error animate-fadeIn" role="alert">
              <FontAwesomeIcon icon={faCircleXmark} className="text-error w-5 h-5 flex-shrink-0" />
              <span className="font-body text-[14px] font-medium text-error">
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="font-body font-semibold text-[12px] text-text-secondary uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-text-muted">
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  disabled={loading}
                  className={`w-full h-12 pl-10 bg-surface-elevated border rounded-sm font-body text-[15px] text-text-primary placeholder-text-muted focus:outline-none transition-all duration-200 disabled:opacity-50
                    ${errors.name && touched.name
                      ? 'border-error shadow-[0_0_0_3px_var(--color-error-bg)] focus:border-error'
                      : 'border-border focus:border-accent focus:ring-3 focus:ring-accent-glow'
                    }
                    ${shakeField === 'name' ? 'animate-shake' : ''}
                    ${(touched.name && !errors.name && name) ? 'pr-10' : 'pr-4'}
                  `}
                  required
                />
                {/* Positive feedback checkmark */}
                {touched.name && !errors.name && name && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-success">
                    <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
                  </span>
                )}
              </div>
              {/* Error Message */}
              {errors.name && touched.name && (
                <span aria-live="polite" className="font-body text-[12px] text-error flex items-center gap-1.5 mt-1 animate-fadeIn">
                  <FontAwesomeIcon icon={faCircleXmark} className="w-3.5 h-3.5" />
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
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
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-body font-semibold text-[12px] text-text-secondary uppercase tracking-widest">
                Password
              </label>
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-1 flex flex-col gap-1">
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.percent}%` }}
                    />
                  </div>
                  <span className="font-body text-[11px] text-text-secondary">
                    {passwordStrength.text}
                  </span>
                </div>
              )}

              {/* Error Message */}
              {errors.password && touched.password && (
                <span aria-live="polite" className="font-body text-[12px] text-error flex items-center gap-1.5 mt-1 animate-fadeIn">
                  <FontAwesomeIcon icon={faCircleXmark} className="w-3.5 h-3.5" />
                  {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="font-body font-semibold text-[12px] text-text-secondary uppercase tracking-widest">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-text-muted">
                  <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full h-12 pl-10 bg-surface-elevated border rounded-sm font-body text-[15px] text-text-primary placeholder-text-muted focus:outline-none transition-all duration-200 disabled:opacity-50
                    ${errors.confirmPassword && touched.confirmPassword
                      ? 'border-error shadow-[0_0_0_3px_var(--color-error-bg)] focus:border-error'
                      : 'border-border focus:border-accent focus:ring-3 focus:ring-accent-glow'
                    }
                    ${shakeField === 'confirmPassword' ? 'animate-shake' : ''}
                    ${(touched.confirmPassword && !errors.confirmPassword && confirmPassword) ? 'pr-10' : 'pr-4'}
                  `}
                  required
                />
                {/* Positive feedback checkmark */}
                {touched.confirmPassword && !errors.confirmPassword && confirmPassword && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-success">
                    <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
                  </span>
                )}
                {/* Visibility Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-secondary focus:outline-none"
                  style={{ marginRight: touched.confirmPassword && !errors.confirmPassword && confirmPassword ? '24px' : '0' }}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
              {/* Error Message */}
              {errors.confirmPassword && touched.confirmPassword && (
                <span aria-live="polite" className="font-body text-[12px] text-error flex items-center gap-1.5 mt-1 animate-fadeIn">
                  <FontAwesomeIcon icon={faCircleXmark} className="w-3.5 h-3.5" />
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 flex items-center justify-center bg-accent-fill text-white font-body font-semibold text-[15px] rounded-sm hover:bg-accent-fill-hover focus:outline-none focus:ring-3 focus:ring-accent-glow transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
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
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
