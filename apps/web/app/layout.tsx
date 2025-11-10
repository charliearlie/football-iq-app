import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Football IQ - Career Path Quiz',
  description:
    'Test your knowledge of football legends. Can you recognize iconic players from their career paths? For real football fans only!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
