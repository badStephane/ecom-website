import { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "./../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";


const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Fetch user data and auto-fill firstName, lastName, email, phone, and address if available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        return; // User not logged in
      }

      try {
        const response = await axios.get(`${backendUrl}/api/auth/me`, {
          headers: { token }
        });

        if (response.data.success && response.data.user) {
          const user = response.data.user;
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName || prev.firstName,
            lastName: user.lastName || prev.lastName,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
            // Pre-fill address if available
            street: user.address?.street || prev.street,
            city: user.address?.city || prev.city,
            state: user.address?.state || prev.state,
            zipcode: user.address?.postalCode || prev.zipcode,
            country: user.address?.country || prev.country,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Don't show error to user, just log it
      }
    };

    fetchUserData();
  }, [token, backendUrl]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };




  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Check if user is logged in
    if (!token) {
      toast.error("Veuillez vous connecter pour passer une commande");
      navigate("/login");
      return;
    }

    // Check if cart is empty
    if (Object.keys(cartItems).length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount(),
      };

      switch (method) {
        case "cod":
          try {
            console.log("Sending order with token:", token ? "✅ Present" : "❌ Missing");
            console.log("Order data:", orderData);
            
            const response = await axios.post(
              `${backendUrl}/api/orders/place`,
              orderData,
              { headers: { token } }
            );
       

            if (response.data.success) {
              setCartItems({});
              navigate("/orders");
              toast.success("Commande passée avec succès !");
            } else {
              toast.error(response.data.message || "Échec de la commande.");
            }
          } catch (error) {
            console.error("Order API error:", error);
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);
            
            // More specific error messages
            if (error.response?.status === 401) {
              toast.error("🔒 Non autorisé - Veuillez vous reconnecter");
              navigate("/login");
            } else if (error.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Une erreur s'est produite. Veuillez réessayer.");
            }
          }
          break;

        default:
          toast.warn("Méthode de paiement invalide.");
          break;
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ---------Left Side----------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"INFORMATIONS"} text2={"DE LIVRAISON"} />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Prénom"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Nom"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Adresse email"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Rue"
        />

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Ville"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Région/État"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Code postal"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Pays"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Téléphone"
        />
      </div>

      {/* ----------Rigt Side----------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"MÉTHODE"} text2={"DE PAIEMENT"} />
          {/* ------Payment Method Selection-------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            {/* Cash On Delivery - Only Payment Method */}
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer bg-green-50"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <div className="flex flex-col">
                <p className="text-gray-700 text-sm font-medium">
                  💳 PAIEMENT À LA LIVRAISON
                </p>
                <p className="text-gray-500 text-xs">
                  Payez à la livraison
                </p>
              </div>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PASSER LA COMMANDE
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
