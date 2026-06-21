import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

/**
 * ErrorBoundary — global React class error boundary (DesignSkills §17 / Phase 8).
 *
 * Catches unhandled render-phase exceptions and presents an on-brand fallback UI
 * instead of a blank white screen. Provides a "Try again" button to reset state.
 *
 * Usage (in main.jsx):
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, swap console.error for an error-tracking service (e.g. Sentry)
    console.error('[ErrorBoundary] Caught an unhandled render error:', error, info);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        className="
          relative flex flex-col items-center justify-center
          min-h-screen bg-bg text-text-primary text-center px-4
          overflow-hidden select-none
        "
        role="alert"
        aria-live="assertive"
      >
        {/* Repeating dot-grid background — mirrors 404 page aesthetic (DesignSkills §8.6) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-error-bg border border-error flex items-center justify-center">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="w-7 h-7 text-error"
            />
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="font-display font-bold text-[28px] sm:text-[36px] text-text-primary leading-tight">
              Something went wrong
            </h1>
            <p className="font-body text-[15px] text-text-secondary leading-relaxed">
              An unexpected error occurred. This has been logged and we&apos;ll look into it.
            </p>

            {/* Show error message in development only */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-3 p-3 rounded-sm bg-surface-elevated border border-border text-left font-mono text-[11px] text-error overflow-x-auto whitespace-pre-wrap break-words max-h-36">
                {this.state.error.message}
              </pre>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="
                h-11 px-6 bg-accent-fill text-white font-body font-semibold text-[14px]
                rounded-sm hover:bg-accent-fill-hover
                hover:shadow-[0_0_16px_rgba(255,77,109,0.27)]
                transition-all duration-200
                flex items-center justify-center gap-2
                focus:outline-none focus:ring-2 focus:ring-accent-glow
              "
            >
              <FontAwesomeIcon icon={faArrowsRotate} className="w-4 h-4" />
              Try again
            </button>
            <a
              href="/"
              className="
                h-11 px-6 border border-border text-text-primary font-body font-semibold text-[14px]
                rounded-sm hover:border-accent hover:text-accent
                transition-all duration-200
                flex items-center justify-center
                focus:outline-none focus:ring-2 focus:ring-accent-glow
              "
            >
              Back to home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
