import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export const metadata = {
  title: 'Download Sangati Android APK — Official Release',
  description: 'Download the official Sangati Companion Ride Android APK directly on your device. Fast, safe, and verified carpooling for daily commuters.',
};

export default function DownloadPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aiBlue-light border border-blue-200 text-aiBlue text-xs font-bold uppercase tracking-wider">
              <span>🚀 Official Android Release</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-deepGraphite tracking-tight">
              Download Sangati APK for Android
            </h1>
            <p className="text-base sm:text-lg text-slateGrey max-w-2xl mx-auto">
              Get the full-featured mobile app directly on your smartphone. Find rides, share daily fuel expenses, and travel safely.
            </p>
          </div>

          {/* Main Download Card */}
          <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-lightSlate shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-lightSlate">
              <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-aiBlue to-indigo-600 flex items-center justify-center text-4xl text-white shadow-lg">
                  🚗
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-deepGraphite">Sangati Companion Ride</h2>
                  <p className="text-sm text-slateGrey font-medium">com.companionride.app • Version 1.0.0</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full font-bold">
                      ✓ Safe & Verified
                    </span>
                    <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
                      Android 7.0+
                    </span>
                    <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-bold">
                      ~45 MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Download Button */}
              <a
                href="/SangatiCompanionRide.apk"
                download="SangatiCompanionRide.apk"
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-aiBlue hover:bg-aiBlue-hover text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer text-center"
              >
                <span className="text-xl">⬇️</span>
                <span>Download APK File</span>
              </a>
            </div>

            {/* Step-by-Step Installation Instructions */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-deepGraphite flex items-center gap-2">
                <span>📱</span> How to Install the APK on Android
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-lightSlate space-y-2">
                  <div className="w-8 h-8 rounded-full bg-aiBlue text-white font-bold flex items-center justify-center text-sm">
                    1
                  </div>
                  <h4 className="font-bold text-deepGraphite text-base">Download the File</h4>
                  <p className="text-xs text-slateGrey leading-relaxed">
                    Click the download button above. If Chrome shows <em>"File might be harmful"</em>, tap <strong>Download anyway</strong>.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-lightSlate space-y-2">
                  <div className="w-8 h-8 rounded-full bg-aiBlue text-white font-bold flex items-center justify-center text-sm">
                    2
                  </div>
                  <h4 className="font-bold text-deepGraphite text-base">Allow Unknown Apps</h4>
                  <p className="text-xs text-slateGrey leading-relaxed">
                    Tap the downloaded file. If prompted with a security pop-up, tap <strong>Settings</strong> and enable <strong>Allow from this source</strong>.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-lightSlate space-y-2">
                  <div className="w-8 h-8 rounded-full bg-aiBlue text-white font-bold flex items-center justify-center text-sm">
                    3
                  </div>
                  <h4 className="font-bold text-deepGraphite text-base">Install & Start Riding</h4>
                  <p className="text-xs text-slateGrey leading-relaxed">
                    Tap <strong>Install</strong>. Once complete, open Sangati, sign up, and start discovering daily carpool companions!
                  </p>
                </div>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="bg-green-50/70 border border-green-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="text-2xl">🛡️</div>
              <div className="space-y-1">
                <h4 className="font-bold text-green-950 text-sm">100% Safe & Secure Installation</h4>
                <p className="text-xs text-green-800 leading-relaxed">
                  Our APK is signed with production encryption keys and does not contain advertisements, trackers, or unwanted permissions. It communicates securely with Supabase SSL endpoints.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Back to Home */}
          <div className="text-center pt-8">
            <Link href="/" className="text-sm font-semibold text-aiBlue hover:underline">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
