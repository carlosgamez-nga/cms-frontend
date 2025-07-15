import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Contract Management System | NGA',
  description: 'Contract Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // --- Suggested Modification: Add suppressHydrationWarning ---
    // This tells React to ignore mismatches on these attributes during hydration.
    // It's commonly used when a client-side script (like a theme toggle) modifies
    // attributes that are also set by the server.
    <html lang='en' suppressHydrationWarning>
      <body className={`${nunitoSans.variable}`}>{children}</body>
    </html>
  );
}