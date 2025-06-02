import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Database, PanelRight, Settings, Menu, X } from 'lucide-react';
import Button from '../common/Button';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Teams', path: '/', icon: <Users size={18} /> },
    { name: 'Agents', path: '/agents', icon: <Database size={18} /> },
    { name: 'Tasks', path: '/tasks', icon: <PanelRight size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">CrewAI Builder</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`h-full ${
                  isActive(item.path)
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => navigate(item.path)}
                icon={item.icon}
              >
                {item.name}
              </Button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`w-full justify-start ${
                  isActive(item.path)
                    ? 'text-blue-500 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                icon={item.icon}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;