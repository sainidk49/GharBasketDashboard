import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  ListTree, 
  Settings, 
  FileText,
  X,
  Truck,
  User
} from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { isAdmin, isSeller } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: ListTree },
    { name: 'Sellers', href: '/admin/sellers', icon: Store },
    { name: 'Customers', href: '/admin/users', icon: Users },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const sellerLinks = [
    { name: 'Dashboard', href: '/seller', icon: LayoutDashboard },
    { name: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { name: 'Products', href: '/seller/products', icon: Package },
    { name: 'Store Profile', href: '/seller/profile', icon: Store },
    { name: 'Settings', href: '/seller/settings', icon: Settings },
  ];

  const deliveryLinks = [
    { name: 'Dashboard', href: '/delivery', icon: LayoutDashboard },
    { name: 'My Deliveries', href: '/delivery/orders', icon: Truck },
    { name: 'Profile', href: '/delivery/profile', icon: User },
  ];

  const { user } = useAuth();
  const links = isAdmin ? adminLinks : (user?.role === 'delivery_partner' ? deliveryLinks : sellerLinks);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 z-40 bg-gray-900/80 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-sidebar-hover shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥬</span>
            <span className="text-white font-bold text-xl tracking-tight">OnlineVegi</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-400 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto py-4 flex-1">
          <nav className="px-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href || (location.pathname.startsWith(link.href) && link.href !== '/admin' && link.href !== '/seller');
              return (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive 
                      ? "bg-sidebar-active text-white" 
                      : "text-gray-300 hover:bg-sidebar-hover hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} className={clsx(isActive ? "text-primary-light" : "text-gray-400")} />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-hover">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-xs">
              {isAdmin ? 'AD' : (user?.role === 'delivery_partner' ? 'DP' : 'SL')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {isAdmin ? 'Administrator' : (user?.role === 'delivery_partner' ? 'Delivery Partner' : 'Store Partner')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
