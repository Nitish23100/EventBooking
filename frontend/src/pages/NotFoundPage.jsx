import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px-56px)] bg-bg text-text-primary text-center px-4 overflow-hidden select-none">
      {/* Repeating Dot Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Large 404 text */}
        <h1 className="font-display font-extrabold text-[120px] sm:text-[150px] text-surface-elevated leading-none tracking-tighter select-none">
          404
        </h1>
        
        {/* Overlapping Page Not Found title */}
        <h2 className="font-display font-bold text-[24px] sm:text-[32px] text-text-primary leading-tight mt-[-30px] sm:mt-[-40px] mb-4">
          Page not found
        </h2>
        
        <p className="font-body text-text-secondary text-[15px] max-w-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist.
        </p>
        
        <Link
          to="/"
          className="h-12 px-6 bg-accent-fill text-white font-body font-semibold text-[14px] sm:text-[15px] rounded-sm hover:bg-accent-fill-hover hover:shadow-[0_0_16px_rgba(255,77,109,0.15)] flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-glow"
        >
          Back to events
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
