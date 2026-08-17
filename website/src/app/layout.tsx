import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Companion Ride — Location-based Ride Companion & Carpooling',
  description:
    "Find someone who is already going your way. Companion Ride connects verified commuters on the exact same route to share rides, split fuel costs, and travel safely together.",
  keywords: [
    'carpooling',
    'ride sharing',
    'travel companion',
    'carpool app India',
    'find people travelling same route',
    'shared rides',
    'safe carpooling India',
    'commuter carpool',
  ],
  authors: [{ name: 'Companion Ride Team' }],
  openGraph: {
    title: 'Companion Ride — Find Someone Going Your Way',
    description:
      'Location-based carpooling and companion matching for commuters. Split fuel costs, share rides safely, and reduce traffic.',
    url: 'https://companionride.app',
    siteName: 'Companion Ride',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Companion Ride App Preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Companion Ride — Location-based Ride Companion & Carpooling',
    description: 'Find someone who is already travelling your route. Safe, verified, and eco-friendly carpooling.',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-deepGraphite antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
