import React from 'react';

export function BackgroundBlobs() {
  return (
    <>
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/30 blur-[120px] pointer-events-none animate-pulse" 
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px] pointer-events-none animate-pulse" 
        style={{ animationDuration: '12s', animationDelay: '2s' }}
      />
      <div 
        className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none animate-pulse" 
        style={{ animationDuration: '10s', animationDelay: '4s' }}
      />
    </>
  );
}
