import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/adminProductSlice';
import { fetchOrders } from '../store/adminOrderSlice';
import { fetchUsers } from '../store/adminUserSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.adminProducts.items);
  const orders = useSelector(state => state.adminOrders.items);
  const users = useSelector(state => state.adminUsers.items);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Calculate revenue only from delivered orders (exclude cancelled)
  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + (order.finalPrice || 0), 0);
  
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-semibold">Total Produits</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-semibold">Total Commandes</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-semibold">Revenu Total</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalRevenue.toFixed(2)} XOF</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-sm font-semibold">Total Utilisateurs</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalUsers}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Commandes récentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID Commande</th>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Montant</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-xs">{order._id?.substring(0, 8)}</td>
                  <td className="px-4 py-2">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                  <td className="px-4 py-2 font-semibold">{order.finalPrice?.toFixed(2) || 0} XOF</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'delivered' ? 'Livrée' :
                       order.status === 'shipped' ? 'Expédiée' :
                       order.status === 'confirmed' ? 'Confirmée' :
                       order.status === 'pending' ? 'En attente' :
                       order.status === 'cancelled' ? 'Annulée' : order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
