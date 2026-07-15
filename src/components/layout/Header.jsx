import React from 'react';
import { Menu, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm border-b border-border shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome back, {user?.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        <div className="flex items-center gap-3 group relative cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-primary-surface text-primary flex items-center justify-center font-bold shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-700 leading-tight">{user?.name}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
          </div>

          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden group-hover:block transition-all animate-fade-in z-50">
            <div className="px-4 py-2 border-b border-gray-100 md:hidden">
              <p className="font-medium text-gray-700 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              onClick={() => navigate(user?.role === 'admin' ? '/admin/settings' : '/seller/settings')}
            >
              <User size={16} /> Profile
            </button>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
