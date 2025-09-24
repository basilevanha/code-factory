import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo2',
  description: 'Second game of the Coding Factory',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
