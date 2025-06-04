import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  CalendarDays, 
  Palette, 
  DollarSign, 
  BarChart3, 
  UserCircle,
  Menu,
  X
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/clients', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    { to: '/appointments', label: 'Citas', icon: <CalendarDays className="w-5 h-5" /> },
    { to: '/services', label: 'Servicios', icon: <Palette className="w-5 h-5" /> },
    { to: '/employees', label: 'Empleados', icon: <UserCircle className="w-5 h-5" /> },
    { to: '/finances', label: 'Finanzas', icon: <DollarSign className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-30 bg-pink-100 p-2 rounded-full shadow-md hover:bg-pink-200 transition-colors"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6 text-pink-700" /> : <Menu className="w-6 h-6 text-pink-700" />}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-pink-50 to-purple-50 z-20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:shadow-none shadow-xl overflow-y-auto`}
      >
        <div className="sticky top-0 bg-gradient-to-br from-pink-50 to-purple-50 p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-pink-700 font-display mb-1">Nail Studio</h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">Sistema de Gestión</p>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-pink-100 text-pink-700 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;