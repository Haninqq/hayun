import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HAIC Guide — Human-AI Collaboration Guide',
  description:
    '직무와 업무를 입력하면 AI 협업 강도를 판별하고, 최적의 인간-AI 협업 가이드를 제공합니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <TooltipProvider delay={200}>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  );
}
