'use client';

import React, { useState } from 'react';

const FAQS = [
  {
    q: 'How is Companion Ride different from Uber or Ola?',
    a: 'Companion Ride is NOT a commercial taxi booking platform. The ride creators are everyday commuters who are already travelling from Point A to Point B for work, college, or personal travel. They publish their empty seats to share fuel expenses or offer free company along the way.',
  },
  {
    q: 'How does the PostGIS route matching algorithm work?',
    a: 'Rather than comparing simple city names, our database uses PostgreSQL PostGIS spatial math to evaluate 4 key metrics: Pickup Proximity (30%), Destination Proximity (30%), Departure Time Window (20%), and Directional Bearing Vector Cosine Similarity (20%). This gives you an accurate compatibility percentage score (e.g. 92% Match).',
  },
  {
    q: 'Are phone numbers shared publicly?',
    a: 'Never. Phone numbers are kept strictly private and are never exposed publicly on profiles or search results. All communication happens through secure in-app realtime chat once a match is confirmed.',
  },
  {
    q: 'How does cost sharing work?',
    a: 'Ride creators can choose between Free Rides, Fuel-Cost Sharing, or Cab Fare Sharing. Contribution amounts are agreed directly per seat and are strictly meant for splitting actual travel expenses.',
  },
  {
    q: 'What safety features are available during the trip?',
    a: 'You have access to 1-tap SOS dialing (112 universal and 1091 women helpline), live trip status sharing via OS share sheets, user rating history, and user blocking/reporting.',
  },
];

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-surface border-b border-lightSlate">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold text-aiViolet uppercase tracking-wider bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
            Answers & Clarity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-deepGraphite tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slateGrey">
            Everything you need to know about Companion Ride community carpooling.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-background rounded-2xl border border-lightSlate overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-deepGraphite text-base focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="ml-4 text-aiBlue text-xl font-bold">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slateGrey leading-relaxed border-t border-lightSlate/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
