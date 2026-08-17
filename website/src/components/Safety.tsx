import React from 'react';

const SAFETY_PILLARS = [
  {
    title: 'Identity & Phone Verification',
    desc: 'Every commuter on Companion Ride confirms their phone number and government ID before offering or requesting rides.',
    icon: '✓',
  },
  {
    title: 'Emergency SOS & National Helplines',
    desc: 'Instant 1-tap connection to national emergency helpline 112, women safety helpline 1091, and custom emergency contacts.',
    icon: '🚨',
  },
  {
    title: 'Live OS Trip Sharing',
    desc: 'Share your route, departure time, and companion profile link with friends and family via WhatsApp or SMS with one tap.',
    icon: '🔗',
  },
  {
    title: 'Transparent Ratings & Reviews',
    desc: 'Community feedback ensures accountability. Users maintain public star ratings based strictly on verified completed journeys.',
    icon: '★',
  },
  {
    title: 'Zero-Tolerance Moderation & Blocking',
    desc: 'Easily block any user with one click. Blocked users will never be matched with you and cannot view your journeys.',
    icon: '🛡️',
  },
  {
    title: 'Women Safety Architecture',
    desc: 'Built-in support for women safety preferences, women-only corridor filters, and verified female commuter badges.',
    icon: '🌸',
  },
];

export const Safety = () => {
  return (
    <section id="safety" className="py-20 bg-background border-b border-lightSlate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-commerceTeal uppercase tracking-wider bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            Trust & Security First
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-deepGraphite tracking-tight">
            Built for Safe, Worry-Free Commuting
          </h2>
          <p className="text-base text-slateGrey">
            We believe safety shouldn't be an afterthought. Companion Ride is engineered from the ground up with multi-tier verification and instant emergency safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAFETY_PILLARS.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-6 border border-lightSlate shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-xl font-bold text-commerceTeal mb-4">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-deepGraphite mb-2">{p.title}</h3>
              <p className="text-sm text-slateGrey leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
