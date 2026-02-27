import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">HelvetiaOps</h1>
        <p className="text-sm text-neutral-600 mt-1">Operations Management Platform</p>
      </div>
      
      {/* Auth Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {children}
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-neutral-500">© 2024 HelvetiaOps. All rights reserved.</p>
      </div>
    </div>
  );
}