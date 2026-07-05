import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Digital Atlas of the Ramayana',
  description:
    'An interactive GIS-based digital humanities atlas mapping the geography of the Valmiki Ramayana onto real-world locations, with scholarly source citations and a timeline of Rama\'s journey.',
  keywords: [
    'Ramayana', 'Valmiki', 'digital humanities', 'GIS', 'India geography',
    'Rama journey', 'epic geography', 'ancient India', 'Kishkindha', 'Lanka',
  ],
  openGraph: {
    title: 'Digital Atlas of the Ramayana',
    description: 'Mapping the Valmiki Ramayana — an interactive scholarly atlas of Rama\'s journey.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
