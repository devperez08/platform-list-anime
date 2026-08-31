
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { getProfile } from '@/services/profile';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const profile = await getProfile();

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar profile={profile} />
      </header>
      <main className="flex-grow">
        {/* Navbar is fixed. Pages should manage their own top padding or hero section */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
