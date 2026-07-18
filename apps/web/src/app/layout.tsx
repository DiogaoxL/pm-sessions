import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'PM Sessions',
  description: 'Orquestração de processos seletivos e sessões em grupo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} dark h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground flex flex-col font-sans">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
