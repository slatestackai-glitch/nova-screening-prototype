import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nova — Adaptive Screening Intelligence',
  description: 'First-round AI voice recruiter prototype with live evidence-linked scoring and adaptive probing engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
