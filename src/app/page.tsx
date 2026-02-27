import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      {/* header/navbar */}
      <header className="bg-neutral-900 text-neutral-100 shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">HelvetiaOps</h1>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="hover:text-neutral-300 transition">
              Dashboard
            </Link>
            <Link href="/auth" className="hover:text-neutral-300 transition">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* hero section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
          Welcome to HelvetiaOps
        </h2>
        <p className="text-lg text-neutral-600 mb-8">
          Build, manage, and deploy your applications with ease.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-neutral-500 text-white px-6 py-3 rounded hover:bg-neutral-600 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/auth"
            className="bg-neutral-200 text-neutral-900 px-6 py-3 rounded hover:bg-neutral-300 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* features section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Fast & Reliable',
                description: 'Built on modern technology stack for optimal performance.',
              },
              {
                title: 'Easy to Use',
                description: 'Intuitive interface that anyone can navigate and understand.',
              },
              {
                title: 'Scalable',
                description: 'Grow your operations without worrying about infrastructure.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 border border-neutral-200 rounded-lg bg-neutral-50"
              >
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-neutral-800 text-neutral-100 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2026 HelvetiaOps. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
