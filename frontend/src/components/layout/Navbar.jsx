import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../stores/authStore.js';
import ThemeToggle from './ThemeToggle.jsx';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/');
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 h-16 w-full bg-bg/80 backdrop-blur-md border-bottom border-border flex items-center justify-between px-4 sm:px-6 md:px-8 border-b">
        {/* Left: Brand Logo & Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 text-text-primary focus:outline-none select-none">
          <span className="font-display font-extrabold text-2xl tracking-tight">
            <span className="text-accent">e</span>ventflow
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-body text-[15px] font-medium transition-colors hover:text-accent focus:outline-none ${
                isActive ? 'text-accent' : 'text-text-secondary'
              }`
            }
          >
            Discover
          </NavLink>
          {user && (
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `font-body text-[15px] font-medium transition-colors hover:text-accent focus:outline-none ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`
              }
            >
              My Bookings
            </NavLink>
          )}
        </div>

        {/* Right: Theme Toggle & Auth Options */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                {/* User Avatar with Initials */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-mono text-[13px] font-bold text-text-primary">
                    {getUserInitials(user.name)}
                  </div>
                  {/* Active Booking Badge Placeholder (can be wired up in later phases) */}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                  </span>
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-9 h-9 flex items-center justify-center rounded-sm bg-transparent border border-border text-text-secondary hover:border-error hover:text-error transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-glow"
                  title="Log out"
                  aria-label="Log out"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-[15px] font-semibold border border-border text-text-primary rounded-sm hover:border-accent hover:text-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-glow"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-[15px] font-semibold bg-accent-fill text-white rounded-sm hover:bg-accent-fill-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-glow shadow-[0_0_16px_rgba(255,77,109,0.15)]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={toggleDrawer}
            className="flex md:hidden w-9 h-9 items-center justify-center rounded-sm border border-border text-text-secondary hover:border-accent hover:text-accent transition-all duration-200 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-overlay backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[80vw] max-w-[320px] bg-surface border-l border-border p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8 select-none">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-2xl tracking-tight text-text-primary">
                <span className="text-accent">e</span>ventflow
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-border text-text-secondary hover:border-accent hover:text-accent transition-all duration-200"
              aria-label="Close menu"
            >
              <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center h-14 px-4 rounded-sm font-body text-[16px] font-medium transition-colors hover:bg-surface-elevated hover:text-accent ${
                  isActive ? 'bg-surface-elevated text-accent' : 'text-text-primary'
                }`
              }
            >
              Discover
            </NavLink>
            {user && (
              <NavLink
                to="/bookings"
                onClick={closeDrawer}
                className={({ isActive }) =>
                  `flex items-center h-14 px-4 rounded-sm font-body text-[16px] font-medium transition-colors hover:bg-surface-elevated hover:text-accent ${
                    isActive ? 'bg-surface-elevated text-accent' : 'text-text-primary'
                  }`
                }
              >
                My Bookings
              </NavLink>
            )}
          </nav>
        </div>

        {/* Footer / Auth buttons */}
        <div className="flex flex-col gap-4 mt-auto">
          {user ? (
            <div className="flex flex-col gap-4 p-4 rounded-md bg-surface-elevated border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center font-mono text-sm font-bold text-text-primary">
                  {getUserInitials(user.name)}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-body font-semibold text-text-primary text-[15px] truncate">
                    {user.name}
                  </span>
                  <span className="font-body text-text-muted text-[13px] truncate">
                    {user.email}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-sm border border-error/30 text-error hover:bg-error-bg hover:border-error transition-all duration-200 font-semibold"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={closeDrawer}
                className="w-full h-12 flex items-center justify-center rounded-sm border border-border text-text-primary hover:border-accent hover:text-accent transition-all duration-200 font-semibold text-[15px]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={closeDrawer}
                className="w-full h-12 flex items-center justify-center rounded-sm bg-accent-fill text-white hover:bg-accent-fill-hover transition-all duration-200 font-semibold text-[15px]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
