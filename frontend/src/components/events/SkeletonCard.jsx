import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="flex flex-col bg-surface border border-border rounded-md overflow-hidden animate-pulse select-none">
      {/* Image Area Aspect Ratio */}
      <div className="aspect-video w-full bg-surface-elevated" />
      
      {/* Content Area */}
      <div className="p-4 flex flex-col gap-4 flex-grow">
        <div className="flex flex-col gap-2">
          {/* Title bar */}
          <div className="h-4 bg-surface-elevated rounded w-5/6" />
          <div className="h-4 bg-surface-elevated rounded w-1/2" />
          
          {/* Metadata Row */}
          <div className="flex gap-2 mt-2">
            <div className="h-3 bg-surface-elevated rounded w-1/3" />
            <div className="h-3 bg-surface-elevated rounded w-1/4" />
          </div>
        </div>

        {/* Bottom Details Row */}
        <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
          <div className="h-4 bg-surface-elevated rounded w-1/3" />
          <div className="h-4 bg-surface-elevated rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
