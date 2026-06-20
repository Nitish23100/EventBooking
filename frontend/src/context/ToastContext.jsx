import React, { createContext, useContext, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((title, description, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, description, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 left-4 md:left-auto z-[70] flex flex-col gap-2 max-w-sm w-[calc(100%-32px)] md:w-96 select-none pointer-events-none">
        {toasts.map((t) => {
          let accentColorClass = 'border-l-success';
          let icon = faCircleCheck;
          let iconColorClass = 'text-success';

          if (t.type === 'error') {
            accentColorClass = 'border-l-error';
            icon = faCircleXmark;
            iconColorClass = 'text-error';
          } else if (t.type === 'warning') {
            accentColorClass = 'border-l-warning';
            icon = faTriangleExclamation;
            iconColorClass = 'text-warning';
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start justify-between bg-surface-elevated border border-border border-l-4 ${accentColorClass} rounded-md p-4 shadow-lg transition-all duration-300 animate-slideInRight`}
              role="alert"
            >
              <div className="flex gap-3">
                <FontAwesomeIcon icon={icon} className={`${iconColorClass} w-5 h-5 mt-0.5 flex-shrink-0`} />
                <div className="flex flex-col">
                  <h3 className="font-body font-semibold text-[14px] text-text-primary leading-tight">
                    {t.title}
                  </h3>
                  {t.description && (
                    <p className="font-body text-[12px] text-text-secondary mt-1">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-text-muted hover:text-text-secondary transition-colors focus:outline-none ml-2"
                aria-label="Dismiss toast"
              >
                <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
