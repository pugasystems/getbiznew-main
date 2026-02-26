import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Providers from '@/app/providers';
import { Toaster } from 'sonner';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';

const openSans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GetBizzUSA',
  description:
    'GetBizzUSA is the best online marketplace for buying and selling products.',
  metadataBase: new URL(process.env.NEXTAUTH_URL as string),
  openGraph: {
    title: 'GetBizzUSA',
    description:
      'GetBizzUSA is the best online marketplace for buying and selling products.',
    url: process.env.NEXTAUTH_URL,
    siteName: 'GetBizzUSA',
    type: 'website',
    locale: 'en_US',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${openSans.className} text-normal`}>
        <Providers session={session}>
          <Header />
          {children}
        </Providers>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
