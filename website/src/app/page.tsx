import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { Safety } from '../components/Safety';
import { FAQ } from '../components/FAQ';
import { DownloadCTA } from '../components/DownloadCTA';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Safety />
        <FAQ />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}
