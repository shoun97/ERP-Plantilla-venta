import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = (): string => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/clients')) return 'Gestión de Clientes';
    if (path.startsWith('/appointments')) return 'Calendario de Citas';
    if (path.startsWith('/services')) return 'Catálogo de Servicios';
    if (path.startsWith('/employees')) return 'Equipo de Trabajo';
    if (path.startsWith('/finances')) return 'Reporte Financiero';
    
    return 'Pepe Backoffice';
  };

  return (
    <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-semibold font-display truncate pr-4">
            {getPageTitle()}
          </h1>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-40 sm:w-64 pl-10 pr-4 py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-medium">
                A
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline-block">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;