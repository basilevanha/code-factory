import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coding Factory',
  description: 'Learn to code industrial machines interactively.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={
          inter.className +
          'flex min-h-screen flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-5'
        }
      >
        {children}
      </body>
    </html>
  );
}
