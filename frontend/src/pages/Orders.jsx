import { useContext } from "react"
import { ShopContext } from './../context/ShopContext';
import Title from './../components/Title';
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import axios from "axios";

const Orders = () => {

  const {backendUrl, token, currency, navigate}= useContext(ShopContext);
 

  const [orderData, setorderData] = useState([]);

  const loadOrderData = useCallback(async () =>{
    try {
      if(!token){
        return null
      }

      const response = await axios.get(backendUrl + '/api/orders', {headers:{token}})
      if(response.data.success){
        let allOrdersItem = [];
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            allOrdersItem.push({
              _id: item._id,
              name: item.product?.name || 'Unknown Product',
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              image: [item.product?.image || item.product?.images?.[0] || ''],
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod || 'cod',
              date: order.createdAt,
              orderId: order._id
            });
          })
        })
        setorderData(allOrdersItem.reverse());
      }
    } catch (error){
      console.error("Error loading order data:", error);
      setorderData([]); // Reset order data on error
    }
  }, [backendUrl, token]);



  useEffect(()=>{
    loadOrderData();
  }, [loadOrderData])



  return (
    <div className="border-t pt-16">

      <div className="text-2xl">
       <Title  text1={'MY'} text2={'ORDERS'}/> 
      </div>
     
     <div>
      {
        orderData.map((item,index) =>(
          <div key={index} className="py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20" src={item.image[0]} alt="item_image" />

                <div>
                    <p className="sm:text-base font-medium">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-base text-gray-700 ">
                        <p>{currency}{item.price}</p>
                        <p>Quantité : {item.quantity}</p>
                        <p>Taille : {item.size}</p>
                    </div>

                    <p className="mt-1">Date : <span className="text-gray-400">{new Date(item.date).toLocaleDateString('fr-FR')}</span></p>
                    <p className="mt-1">Paiement : <span className="text-gray-400">{item.paymentMethod === 'cod' ? 'À la livraison' : item.paymentMethod}</span></p>
                </div>
            </div>

            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                  <p className={`min-w-2 h-2 rounded-full ${
                    item.status === 'pending' ? 'bg-yellow-400' : 
                    item.status === 'confirmed' ? 'bg-blue-400' : 
                    item.status === 'shipped' ? 'bg-orange-400' :
                    item.status === 'delivered' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}></p>
                  <p className="text-sm md:text-base capitalize">
                    {item.status === 'pending' ? 'En attente' :
                     item.status === 'confirmed' ? 'Confirmée' :
                     item.status === 'shipped' ? 'Expédiée' :
                     item.status === 'delivered' ? 'Livrée' :
                     item.status === 'cancelled' ? 'Annulée' : item.status
                    }
                  </p>
              </div>
              <button onClick={() => navigate(`/orders`)} className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50">Voir les détails</button>
            </div>
          </div>
        ))
      }
     </div>

    </div>
  )
}

export default Orders
