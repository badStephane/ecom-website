import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../../store/adminOrderSlice';
import { Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: orders, loading } = useSelector(state => state.adminOrders);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    confirmed: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const handleStatusChange = (orderId, newStatus, trackingNumber) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus, trackingNumber }));
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        toast.success('Commande supprimée avec succès');
      } catch (error) {
        toast.error(error || 'Échec de la suppression de la commande');
      }
    }
  };

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Commandes</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-lg ${!filter ? 'bg-black text-white' : 'bg-gray-200'}`}
        >
          Toutes les commandes
        </button>
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${filter === status ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            {statusLabels[status] || status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <p className="p-6 text-center">Chargement...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">ID Commande</th>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Montant</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{order._id?.substring(0, 8)}</td>
                  <td className="px-6 py-4">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                  <td className="px-6 py-4 font-semibold">{order.finalPrice?.toFixed(2) || 0} XOF</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value, order.trackingNumber)}
                      className={`px-2 py-1 rounded text-xs font-semibold border-0 cursor-pointer ${statusColors[order.status]}`}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{statusLabels[status] || status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        title="Voir les détails"
                      >
                        <Eye size={16} />
                        Voir
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        title="Supprimer la commande"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderList;
