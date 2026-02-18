
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { createClient } from '@/utils/supabase/server';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar user={user} />
      </header>
      <main className="flex-grow">
        {/* Navbar is fixed. Pages should manage their own top padding or hero section */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
