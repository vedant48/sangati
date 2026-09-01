'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-lightSlate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-aiBlue flex items-center justify-center text-white text-xl font-bold shadow-sm">
            🚗
          </div>
          <div>
            <span className="text-xl font-bold text-deepGraphite tracking-tight">Companion Ride</span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-aiBlue-light text-aiBlue font-semibold">
              Carpooling
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slateGrey">
          <Link href="/#how-it-works" className="hover:text-aiBlue transition-colors">
            How It Works
          </Link>
          <Link href="/#safety" className="hover:text-aiBlue transition-colors">
            Safety & Trust
          </Link>
          <Link href="/#faq" className="hover:text-aiBlue transition-colors">
            FAQ
          </Link>
          <Link href="/download" className="hover:text-aiBlue transition-colors font-semibold text-deepGraphite flex items-center gap-1.5">
            <span>📱</span>
            <span>Download APK</span>
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/download"
            className="px-4 py-2 rounded-lg bg-aiBlue text-white text-sm font-semibold hover:bg-aiBlue-hover transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>⬇️</span>
            <span>Get APK (v1.0.0)</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slateGrey hover:text-deepGraphite focus:outline-none"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-lightSlate px-4 py-4 space-y-3">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-deepGraphite"
          >
            How It Works
          </Link>
          <Link
            href="/#safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-deepGraphite"
          >
            Safety & Trust
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-deepGraphite"
          >
            FAQ
          </Link>
          <Link
            href="/download"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center px-4 py-2.5 rounded-lg bg-aiBlue text-white text-sm font-semibold"
          >
            ⬇️ Download Android APK
          </Link>
        </div>
      )}
    </header>
  );
};
