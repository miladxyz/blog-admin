// app/layout.js

import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleTagManager } from '@next/third-parties/google'
import Navigation from './components/Navigation';
import Script from 'next/script'

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
        <Script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/146914493.js" />
        {children}
      </body>
    </html>
  );
}