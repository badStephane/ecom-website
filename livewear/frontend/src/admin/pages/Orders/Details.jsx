import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/orders/${orderId}`,
        { headers: { token } }
      );
      
      if (response.data.success) {
        setOrder(response.data.order);
        setStatus(response.data.order.status);
        setTrackingNumber(response.data.order.trackingNumber || '');
      } else {
        setError('Échec du chargement des détails de la commande');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des détails de la commande');
    } finally {
      setLoading(false);
    }
  }, [orderId, backendUrl, token]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleStatusUpdate = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/orders/${orderId}`,
        { status, trackingNumber },
        { headers: { token } }
      );
      
      if (response.data.success) {
        setOrder(response.data.order);
        alert('Commande mise à jour avec succès');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert(err.response?.data?.message || 'Erreur lors de la mise à jour de la commande');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails de la commande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-semibold">{error}</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Retour aux commandes
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Commande introuvable</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Retour aux commandes
        </button>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    confirmed: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  
  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          <ArrowLeft size={18} />
          Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Détails de la commande</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm">ID Commande</p>
                <p className="text-2xl font-mono font-bold">{order._id}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${statusColors[order.status]}`}>
                {statusLabels[order.status] || order.status.toUpperCase()}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Date de commande</p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Montant total</p>
                <p className="font-semibold text-lg">{order.finalPrice?.toFixed(2)} XOF</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Articles commandés</h2>
            <div className="space-y-4">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product?.name || 'Produit'}</h3>
                    <p className="text-gray-500 text-sm">Taille : {item.size}</p>
                    <p className="text-gray-500 text-sm">Quantité : {item.quantity}</p>
                    <p className="font-semibold mt-2">{item.price?.toFixed(2)} XOF</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Sous-total</p>
                    <p className="font-semibold">{(item.price * item.quantity)?.toFixed(2)} XOF</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Adresse de livraison</h2>
            {order.shippingAddress && (
              <div className="space-y-2 text-gray-700">
                <p><strong>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong></p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipcode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2"><strong>Téléphone :</strong> {order.shippingAddress.phone}</p>
                <p><strong>Email :</strong> {order.shippingAddress.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Status Update */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Mettre à jour le statut</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{statusLabels[s] || s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Numéro de suivi</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Entrer le numéro de suivi (optionnel)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Résumé de la commande</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold">{order.totalPrice?.toFixed(2)} XOF</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{order.discountAmount?.toFixed(2)} XOF</span>
                </div>
              )}
              <div className="pt-3 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{order.finalPrice?.toFixed(2)} XOF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Paiement</h2>
            <p className="text-sm text-gray-600 mb-2">Méthode</p>
            <p className="font-semibold mb-4">
              {order.paymentMethod === 'cod' ? '💵 Paiement à la livraison' : order.paymentMethod}
            </p>
            <p className="text-sm text-gray-600 mb-2">Statut</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {order.paymentStatus === 'paid' ? 'Payé' : 
               order.paymentStatus === 'pending' ? 'En attente' :
               order.paymentStatus === 'failed' ? 'Échoué' :
               order.paymentStatus || 'En attente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
