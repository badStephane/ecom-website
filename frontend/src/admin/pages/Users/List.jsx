import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser } from '../../store/adminUserSlice';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.adminUsers.items);
  const loading = useSelector(state => state.adminUsers.loading);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'customer') return u.role === 'customer';
    if (filter === 'admin') return u.role === 'admin';
    return true;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUser({ id: userId, data: { role: newRole } })).unwrap();
      toast.success('Rôle utilisateur mis à jour avec succès');
    } catch (error) {
      toast.error(error || 'Échec de la mise à jour du rôle utilisateur');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success('Utilisateur supprimé avec succès');
      } catch (error) {
        toast.error(error || 'Échec de la suppression de l\'utilisateur');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Utilisateurs</h1>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Utilisateurs</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'customer', 'admin'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === tab ? 'bg-black text-white' : 'bg-gray-200'
            }`}
          >
            {tab === 'all' ? 'Tous' : tab === 'customer' ? 'Clients' : 'Admins'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Rôle</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded capitalize"
                  >
                    <option value="customer">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
