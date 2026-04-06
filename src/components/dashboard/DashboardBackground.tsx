import React from 'react';

export const DashboardBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-l-3xl">
      {/* Floating Orbs inside dashboard */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-pink-600/10 blur-[120px] animate-pulse" 
        style={{ animationDuration: '12s' }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" 
        style={{ animationDuration: '18s', animationDelay: '2s' }}
      />
    </div>
  );
};
