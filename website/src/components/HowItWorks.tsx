import React from 'react';

const STEPS = [
  {
    step: '01',
    title: 'Choose Your Destination',
    desc: 'Enter where you are starting and where you are headed. Select your scheduled departure time.',
    icon: '📍',
  },
  {
    step: '02',
    title: 'Find People Going Your Way',
    desc: 'Our PostGIS spatial matching engine ranks compatible commuters based on pickup proximity, dropoff distance, and route direction vector.',
    icon: '⚡',
  },
  {
    step: '03',
    title: 'Match and Chat in Realtime',
    desc: 'Send a join request with a quick message. Once accepted, coordinate live pickup spots via private 1-on-1 realtime chat.',
    icon: '💬',
  },
  {
    step: '04',
    title: 'Travel Together Safely',
    desc: 'Track the live journey, share tracking status with family via OS share sheet, split fuel expenses, and rate your companion.',
    icon: '🛡️',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-surface border-b border-lightSlate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-aiBlue uppercase tracking-wider bg-aiBlue-light px-3 py-1 rounded-full">
            Simple 4-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-deepGraphite tracking-tight">
            How Companion Ride Works
          </h2>
          <p className="text-base text-slateGrey">
            No taxi algorithms or Surge pricing. Just everyday commuters sharing seats on journeys they are already taking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="bg-background rounded-2xl p-6 border border-lightSlate hover:border-aiBlue/40 transition-all hover:shadow-md relative group"
            >
              <div className="text-4xl mb-4 p-3 bg-white w-14 h-14 rounded-xl border border-lightSlate flex items-center justify-center shadow-sm">
                {s.icon}
              </div>
              <span className="text-xs font-black text-aiBlue tracking-widest uppercase">
                Step {s.step}
              </span>
              <h3 className="text-lg font-bold text-deepGraphite mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-slateGrey leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
