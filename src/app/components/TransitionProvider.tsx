'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPending] = useTransition();

  useEffect(() => {
    // Show transition overlay when route changes
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 150); // Reduced from 300ms to 150ms

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Global transition overlay */}
      {(isTransitioning || isPending) && (
        <div 
          className="fixed inset-0 bg-white/60 z-[9999] flex items-center justify-center backdrop-blur-sm transition-opacity duration-100"
          style={{ 
            animation: 'fadeIn 0.1s ease-in-out',
          }}
        >
          <div className="bg-white rounded-lg p-3 shadow-lg">
            <div className="animate-spin h-6 w-6 border-3 border-neutral-300 border-t-neutral-900 rounded-full"></div>
          </div>
        </div>
      )}
      {children}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
