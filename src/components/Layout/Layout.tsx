import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {children}
          </div>
        </main>
        
        <footer className="text-center py-3 text-xs sm:text-sm text-gray-500 border-t border-gray-100 bg-white">
          © {new Date().getFullYear()} El pepeeeee - Sistema de Gestión
        </footer>
      </div>
    </div>
  );
};

export default Layout;