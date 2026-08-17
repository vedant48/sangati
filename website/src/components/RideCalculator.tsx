'use client';

import React, { useState } from 'react';

const SAMPLE_CORRIDORS = [
  {
    city: 'Patna',
    from: 'Mithapur Bus Stand',
    to: 'Patna Junction',
    match: 94,
    driver: 'Rahul Kumar',
    rating: 4.9,
    time: 'In 30 mins',
    price: 'Free',
    seats: '2 seats',
  },
  {
    city: 'Bangalore',
    from: 'Indiranagar 100ft Road',
    to: 'ITPL Main Gate, Whitefield',
    match: 92,
    driver: 'Priya Sharma',
    rating: 4.85,
    time: 'In 45 mins',
    price: '₹80/seat',
    seats: '2 seats',
  },
  {
    city: 'Delhi NCR',
    from: 'Connaught Place',
    to: 'DLF Cyber City, Gurgaon',
    match: 89,
    driver: 'Ananya Singh',
    rating: 4.95,
    time: 'In 1 hour',
    price: '₹120/seat',
    seats: '3 seats',
  },
];

export const RideCalculator = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = SAMPLE_CORRIDORS[selectedIdx];

  return (
    <div className="bg-white rounded-2xl p-6 border border-lightSlate shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-lightSlate">
        <div>
          <h3 className="text-base font-bold text-deepGraphite">Live Companion Matching</h3>
          <p className="text-xs text-slateGrey">Simulate real corridor discovery</p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Realtime PostGIS</span>
        </div>
      </div>

      {/* City Switcher */}
      <div className="flex gap-2 my-4">
        {SAMPLE_CORRIDORS.map((c, i) => (
          <button
            key={c.city}
            onClick={() => setSelectedIdx(i)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              selectedIdx === i
                ? 'bg-aiBlue-light border-aiBlue text-aiBlue'
                : 'bg-slate-50 border-lightSlate text-slateGrey hover:bg-slate-100'
            }`}
          >
            {c.city}
          </button>
        ))}
      </div>

      {/* Corridor Card */}
      <div className="bg-background rounded-xl p-4 border border-lightSlate space-y-3">
        {/* Match Percentage Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-extrabold">
            ★ {current.match}% Route Match
          </span>
          <span className="text-xs font-bold text-deepGraphite bg-white px-2.5 py-1 rounded-md border border-lightSlate">
            {current.price}
          </span>
        </div>

        {/* Driver Row */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-aiBlue/10 border border-aiBlue flex items-center justify-center font-bold text-aiBlue text-sm">
            {current.driver.split(' ')[0][0]}
            {current.driver.split(' ')[1][0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-deepGraphite">{current.driver}</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-bold">
                ★ {current.rating}
              </span>
            </div>
            <span className="text-[11px] text-teal-700 font-semibold">✓ Verified ID & Phone</span>
          </div>
        </div>

        {/* Route Visualizer */}
        <div className="space-y-2 pt-2 border-t border-lightSlate text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-aiBlue" />
            <span className="text-slateGrey">Pickup:</span>
            <span className="font-semibold text-deepGraphite truncate">{current.from}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-aiViolet" />
            <span className="text-slateGrey">Drop:</span>
            <span className="font-semibold text-deepGraphite truncate">{current.to}</span>
          </div>
        </div>

        {/* Meta Bar */}
        <div className="flex justify-between items-center text-xs text-slateGrey pt-2 border-t border-lightSlate">
          <span>🕒 Departure: {current.time}</span>
          <span>💺 {current.seats}</span>
        </div>
      </div>

      <a
        href="#download"
        className="mt-4 w-full block text-center py-2.5 bg-aiBlue hover:bg-aiBlue-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm"
      >
        Request to Join Ride
      </a>
    </div>
  );
};
