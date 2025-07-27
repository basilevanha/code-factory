import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jeu 1',
  description: 'Premier niveau du jeu Coding Factory',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
