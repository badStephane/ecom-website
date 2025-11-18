import { LogOut, Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/adminAuthSlice';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Products', path: '/admin/products', icon: '📦' },
    { label: 'Categories', path: '/admin/categories', icon: '🏷️' },
    { label: 'Orders', path: '/admin/orders', icon: '📋' },
    { label: 'Users', path: '/admin/users', icon: '👥' }
  ];

  return (
    <aside className="h-full bg-black text-white flex flex-col">
      {/* Header with Toggle Button */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h1 className={`font-bold text-xl transition-all ${isOpen ? 'block' : 'hidden'}`}>
          LIVEWEAR
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            title={item.label}
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            {isOpen && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition"
          title="Logout"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
