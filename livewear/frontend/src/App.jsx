import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Verify from "./pages/Verify";
import AdminRouter from "./admin/AdminRouter";
import adminStore from "./admin/store/index.js";

// for notification prodtuct added or no to cart library header
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <Provider store={adminStore}>
            <AdminRouter />
          </Provider>
        }
      />

      {/* Main App Routes */}
      <Route
        path="/*"
        element={
          <div className="flex flex-col min-h-screen">
            <ToastContainer/>
            <Navbar/>
            <SearchBar/>
            <div className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/place-order" element={<PlaceOrder />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/verify" element={<Verify />} />
              </Routes>
            </div>
            <Footer/>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
