import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-lightSlate py-12 text-slateGrey text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-aiBlue flex items-center justify-center text-white text-base font-bold">
                🚗
              </div>
              <span className="text-lg font-bold text-deepGraphite tracking-tight">Companion Ride</span>
            </div>
            <p className="text-xs text-slateGrey max-w-sm leading-relaxed">
              Companion Ride is a community carpooling platform connecting verified commuters travelling on the exact same routes. Split fuel costs, reduce traffic, and travel safely.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-deepGraphite uppercase tracking-wider">Product</p>
            <ul className="space-y-1 text-xs">
              <li><Link href="#how-it-works" className="hover:text-aiBlue">How It Works</Link></li>
              <li><Link href="#safety" className="hover:text-aiBlue">Safety Center</Link></li>
              <li><Link href="#faq" className="hover:text-aiBlue">FAQ</Link></li>
              <li><Link href="#download" className="hover:text-aiBlue">Download APK</Link></li>
            </ul>
          </div>

          {/* Legal / Trust */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-deepGraphite uppercase tracking-wider">Safety & Legal</p>
            <ul className="space-y-1 text-xs">
              <li><a href="#" className="hover:text-aiBlue">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-aiBlue">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-aiBlue">Terms of Service</a></li>
              <li><a href="#" className="hover:text-aiBlue">Emergency Response 112</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-lightSlate flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slateGrey">
          <p>© {new Date().getFullYear()} Companion Ride Technologies. All rights reserved.</p>
          <p className="text-slateGrey">Designed for clean, safe, and community-driven transportation.</p>
        </div>
      </div>
    </footer>
  );
};
