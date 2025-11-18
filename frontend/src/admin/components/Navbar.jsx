import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/adminAuthSlice';

const AdminNavbar = () => {
  const user = useSelector(state => state.adminAuth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center px-6">
      <div className="ml-auto flex items-center gap-4">
        <div>
          <p className="font-semibold text-gray-800">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
