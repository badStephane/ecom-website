import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './adminAuthSlice';
import adminProductsReducer from './adminProductSlice';
import adminOrdersReducer from './adminOrderSlice';
import adminUsersReducer from './adminUserSlice';

export const adminStore = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    adminProducts: adminProductsReducer,
    adminOrders: adminOrdersReducer,
    adminUsers: adminUsersReducer
  }
});

export default adminStore;
