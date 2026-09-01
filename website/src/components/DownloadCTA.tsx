import React from 'react';
import Link from 'next/link';

export const DownloadCTA = () => {
  return (
    <section id="download" className="py-20 bg-gradient-to-br from-aiBlue via-blue-600 to-indigo-700 text-white relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <span>📱 Android APK Direct Download</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Download Sangati & Start Sharing Rides Today
          </h2>

          <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Get the official Sangati Companion Ride Android APK directly on your phone. Connect with verified commuters on your daily route and start splitting fuel costs.
          </p>

          {/* Download Action Box */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
            {/* Direct APK Download Button */}
            <a
              href="/SangatiCompanionRide.apk"
              download="SangatiCompanionRide.apk"
              className="group bg-white text-deepGraphite hover:bg-slate-50 transition-all transform hover:-translate-y-0.5 rounded-2xl p-5 shadow-2xl flex items-center gap-4 text-left w-full sm:w-auto border-2 border-white/80 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-aiBlue text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition-transform">
                ⬇️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slateGrey uppercase tracking-wider">Direct Download</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Verified APK</span>
                </div>
                <p className="text-lg font-extrabold text-deepGraphite mt-0.5">Download Android APK</p>
                <p className="text-xs text-slateGrey font-medium">v1.0.0 • Production Build • Fast & Safe</p>
              </div>
            </a>

            {/* View Install Guide */}
            <Link
              href="/download"
              className="bg-white/15 hover:bg-white/20 transition-all backdrop-blur-md border border-white/30 text-white rounded-2xl p-5 flex items-center gap-4 text-left w-full sm:w-auto"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                📖
              </div>
              <div>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Installation Guide</p>
                <p className="text-lg font-extrabold text-white mt-0.5">How to Install APK</p>
                <p className="text-xs text-blue-200 font-medium">Step-by-step setup instructions →</p>
              </div>
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100 font-medium">
            <span className="flex items-center gap-1.5">
              <span>🛡️</span> 100% Virus & Malware Free
            </span>
            <span className="flex items-center gap-1.5">
              <span>⚡</span> Direct Fast CDN Download
            </span>
            <span className="flex items-center gap-1.5">
              <span>🔒</span> Supabase Encrypted Connection
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
