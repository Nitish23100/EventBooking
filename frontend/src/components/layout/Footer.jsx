import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-14 w-full border-t border-border flex items-center justify-between px-4 sm:px-6 md:px-8 text-text-secondary font-body text-[12px] sm:text-[13px] bg-bg select-none mt-auto transition-colors duration-200">
      <div className="font-body">
        &copy; {currentYear} eventflow. All rights reserved.
      </div>
      <div className="font-body text-text-muted">
        Built with React & Node.js
      </div>
    </footer>
  );
};

export default Footer;
