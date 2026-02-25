import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}