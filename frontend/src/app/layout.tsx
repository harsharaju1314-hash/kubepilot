import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export const metadata: Metadata = {
  title: 'KubePilot | AI-Powered Kubernetes Operations Assistant',
  description: 'Cloud-native DevOps platform for Kubernetes cluster monitoring, log analysis, and AI troubleshooting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F17] text-slate-100 min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
