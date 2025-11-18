import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProductList from './pages/Products/List';
import ProductForm from './pages/Products/Form';
import CategoryList from './pages/Categories/List';
import OrderList from './pages/Orders/List';
import OrderDetails from './pages/Orders/Details';
import UserList from './pages/Users/List';

const AdminRouter = () => {
  const isAuthenticated = useSelector(state => state.adminAuth.isAuthenticated);

  return (
    <Routes>
      {/* Login Route */}
      <Route path="login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <AdminLayout>
              <Routes>
                <Route path="" element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/create" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="orders/:orderId" element={<OrderDetails />} />
                <Route path="users" element={<UserList />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />
    </Routes>
  );
};

export default AdminRouter;
