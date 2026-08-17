import React from 'react';

export const DownloadCTA = () => {
  return (
    <section id="download" className="py-20 bg-gradient-to-br from-aiBlue via-blue-600 to-indigo-700 text-white relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <span>📱 Available on Android</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Start Sharing Rides and Saving on Daily Commutes Today
          </h2>

          <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Download the Companion Ride Android APK or start the Expo release on your device to discover verified travel companions on your daily corridor.
          </p>

          {/* Download Action Box */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-white text-deepGraphite rounded-2xl p-4 shadow-xl flex items-center gap-4 text-left w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-aiBlue-light flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <p className="text-xs font-bold text-slateGrey uppercase tracking-wider">Android Build</p>
                <p className="text-base font-extrabold text-deepGraphite">CompanionRide.apk</p>
                <p className="text-[11px] text-green-600 font-semibold">Production Ready v1.0.0</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl p-4 flex items-center gap-4 text-left w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Expo Go Quickstart</p>
                <p className="text-base font-extrabold text-white">npx expo start</p>
                <p className="text-[11px] text-blue-200">Scan QR on Android / iOS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
