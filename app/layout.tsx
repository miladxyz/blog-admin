// app/layout.js

import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleTagManager } from '@next/third-parties/google'
import Navigation from './components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mehrnaz',
  description: 'A personal blog',
};

export default function RootLayout({ children }: any) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleTagManager gtmId={GTM_ID || ''} />
        <Navigation />
        {children}
      </body>
    </html>
  );
}