import React from 'react';
import Link from 'next/link';
import { RideCalculator } from './RideCalculator';

export const Hero = () => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-background via-white to-background border-b border-lightSlate">
      {/* Decorative background glow rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-aiBlue-light/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-aiBlue-light border border-blue-200 text-aiBlue text-xs font-bold uppercase tracking-wider">
              <span>✨ Smart Route Matching Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-deepGraphite tracking-tight leading-[1.15]">
              Going somewhere? <br />
              <span className="text-aiBlue">Someone’s probably going your way.</span>
            </h1>

            <p className="text-lg text-slateGrey max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Companion Ride connects verified commuters travelling on the exact same corridor. 
              Share fuel costs, reduce traffic congestion, and make daily journeys enjoyable and safe.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="/SangatiCompanionRide.apk"
                download="SangatiCompanionRide.apk"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-aiBlue text-white font-bold text-base hover:bg-aiBlue-hover transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⬇️</span>
                <span>Download Android APK</span>
              </a>
              <Link
                href="/download"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-lightSlate text-deepGraphite font-bold text-base hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Install Guide</span>
                <span>📱</span>
              </Link>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-lightSlate grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-extrabold text-deepGraphite">100%</p>
                <p className="text-xs text-slateGrey font-medium">Verified Profiles</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-aiBlue">₹0 Comm.</p>
                <p className="text-xs text-slateGrey font-medium">Direct Fuel Sharing</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-commerceTeal">PostGIS</p>
                <p className="text-xs text-slateGrey font-medium">Precise Corridor Match</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Interactive Search Demonstration Preview */}
          <div className="lg:col-span-5">
            <RideCalculator />
          </div>
        </div>
      </div>
    </section>
  );
};
