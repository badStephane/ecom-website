# 🎬 LIVEWEAR - Vue d'ensemble Visuelle

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 INTERNET                               │
└────┬────────────────────────────────────────────┬────────────┘
     │                                            │
     ▼                                            ▼
┌──────────────────────┐              ┌──────────────────────┐
│  👤 CLIENT APP       │              │  🔐 ADMIN PANEL      │
│  React + TypeScript  │              │  React + Redux       │
│  - Home              │              │  - Dashboard         │
│  - Products          │              │  - Products CRUD     │
│  - Cart              │              │  - Categories CRUD   │
│  - Checkout          │              │  - Orders Management │
│  - Profile           │              │  - Users Management  │
│  - Orders            │              │  - Analytics         │
│  Port: 5173          │              │  Port: 5173/admin    │
└──────────┬───────────┘              └──────────┬───────────┘
           │                                     │
           └────────────────┬────────────────────┘
                            │ Axios API Calls
                            ▼
           ┌────────────────────────────────────┐
           │    🚀 BACKEND API (Express)        │
           │    Port: 5000                      │
           │    ────────────────────────────    │
           │    Routes:                         │
           │    - /api/auth (Login/Register)   │
           │    - /api/products (CRUD)         │
           │    - /api/categories (CRUD)       │
           │    - /api/orders (Orders Mgmt)    │
           │    - /api/users (Admin Only)      │
           │    ────────────────────────────    │
           │    Middlewares:                    │
           │    - JWT Authentication           │
           │    - CORS                         │
           │    - Error Handling               │
           │    ────────────────────────────    │
           │    Utils:                          │
           │    - Cloudinary (Image Upload)    │
           │    - bcryptjs (Passwords)         │
           │    - JWT (Tokens)                 │
           └────────────┬─────────────────────┘
                        │ Mongoose
                        ▼
           ┌────────────────────────────────────┐
           │    🗄️  MONGODB ATLAS               │
           │    ────────────────────────────    │
           │    Collections:                    │
           │    - users                         │
           │    - products                      │
           │    - categories                    │
           │    - orders                        │
           │    ────────────────────────────    │
           │    Plan: M0 (Gratuit)             │
           │    Backup: Automatique             │
           └────────────────────────────────────┘
```

---

## 🔄 Flow Utilisateur Client

```
1. LANDING PAGE
   ↓
2. VOIR PRODUITS
   ├─ Home (featured products)
   ├─ Products (all products + pagination)
   └─ Product Detail
   ↓
3. AJOUTER AU PANIER
   ├─ Cart preview
   └─ Qty adjustment
   ↓
4. SE CONNECTER (si pas connecté)
   ├─ Register nouveau compte
   └─ Login avec credentials
   ↓
5. CHECKOUT
   ├─ Reviewer les items
   ├─ Shipping address
   └─ Confirm order
   ↓
6. ORDER CREATED ✅
   └─ Status: pending (en attente admin)
   ↓
7. ADMIN CHANGE STATUS
   ├─ pending → confirmed
   ├─ confirmed → shipped
   └─ shipped → delivered
   ↓
8. CLIENT VÉ LES ORDERS
   └─ /profile/orders
```

---

## 🔑 Flow Admin

```
1. ADMIN LOGIN
   Email: admin@livewear.com
   Password: 123456
   ↓
2. DASHBOARD
   ├─ Stats (products, orders, users, revenue)
   ├─ Recent orders table
   └─ Top products
   ↓
3. MANAGE PRODUCTS
   ├─ View all products
   ├─ Create new product
   ├─ Edit product
   └─ Delete product
   ↓
4. MANAGE CATEGORIES
   ├─ View all categories
   ├─ Create category
   ├─ Edit category
   └─ Delete category
   ↓
5. MANAGE ORDERS
   ├─ View all orders
   ├─ Change order status
   ├─ Filter by status
   └─ View order details
   ↓
6. MANAGE USERS
   ├─ View all users
   ├─ Change user role
   ├─ Deactivate user
   └─ Delete user
   ↓
7. ANALYTICS
   └─ Total revenue, order counts, user stats
```

---

## 🔐 Authentication Flow

```
CLIENT LOGIN REQUEST
        ↓
POST /api/auth/login
├─ Email + Password
├─ Backend validates
└─ Password hash check (bcryptjs)
        ↓
JWT TOKEN GENERATED
├─ Payload: { userId, role }
├─ Secret: JWT_SECRET
└─ Expiry: 7 days
        ↓
TOKEN RETURNED TO CLIENT
├─ Frontend stores in localStorage
└─ Redux state updated
        ↓
FUTURE REQUESTS
├─ Header: Authorization: Bearer {token}
├─ Backend verifies JWT
├─ User attached to request
└─ Route executed
        ↓
PROTECTED ROUTES
├─ /admin/* (admin only)
├─ /checkout (auth required)
├─ /profile (auth required)
└─ /orders (auth required)
```

---

## 📊 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street, city, state, postalCode, country
  },
  role: "customer" | "admin",
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: ObjectId (ref Category),
  image: String (Cloudinary URL),
  images: [String],
  stock: Number,
  sizes: [String],
  colors: [String],
  rating: Number,
  reviews: [{user, comment, rating}],
  isFeatured: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref User),
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number,
    size: String,
    color: String
  }],
  totalPrice: Number,
  discountAmount: Number,
  finalPrice: Number,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
  shippingAddress: {
    firstName, lastName, email, phone, street, city, state, postalCode, country
  },
  notes: String,
  paymentStatus: "pending" | "completed" | "failed",
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  _id: ObjectId,
  name: String (unique),
  slug: String (auto-generated),
  description: String,
  image: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌊 API Response Examples

### Successful Login
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@livewear.com",
    "role": "admin"
  }
}
```

### Get Products
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Product Name",
      "price": 99.99,
      "stock": 50,
      "image": "https://cloudinary.com/...",
      "category": {
        "_id": "507f1f77bcf86cd799439001",
        "name": "Category Name"
      }
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 3,
    "total": 50
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## 🎨 Component Tree

```
App
├─ Router
│  ├─ /admin/* → AdminRouter
│  │  ├─ /admin/login → AdminLogin
│  │  └─ /admin/* → AdminLayout
│  │     ├─ Sidebar
│  │     ├─ Navbar
│  │     └─ Routes
│  │        ├─ Dashboard
│  │        ├─ Products (List, Form)
│  │        ├─ Categories
│  │        ├─ Orders
│  │        └─ Users
│  │
│  └─ / → Main App
│     ├─ Header
│     ├─ Main Routes
│     │  ├─ Home → Hero + ProductGrid
│     │  ├─ Products → ProductGrid + Pagination
│     │  ├─ ProductDetail
│     │  ├─ Cart
│     │  ├─ Checkout
│     │  ├─ Profile
│     │  └─ Orders
│     └─ Footer
```

---

## 🔌 Redux Store Structure

### Client Store
```
store/
├─ authSlice
│  ├─ user
│  ├─ token
│  ├─ isAuthenticated
│  └─ loading
├─ productSlice
│  ├─ items
│  ├─ featured
│  └─ loading
├─ cartSlice
│  ├─ items
│  └─ total
└─ orderSlice
   ├─ items
   ├─ currentOrder
   └─ loading
```

### Admin Store
```
adminStore/
├─ adminAuthSlice
│  ├─ user
│  ├─ isAuthenticated
│  └─ loading
├─ adminProductSlice
│  ├─ items
│  └─ loading
└─ adminOrderSlice
   ├─ items
   └─ loading
```

---

## 📡 File Upload Flow (Cloudinary)

```
Admin Upload Image
        ↓
Form Submit with File
        ↓
Frontend sends to Cloudinary
        ↓
Cloudinary processes & uploads
        ↓
Returns image URL
        ↓
Save URL in product
        ↓
Image stored in Cloudinary cloud
        ↓
Image URL persisted in MongoDB
        ↓
Image displayed from Cloudinary CDN
```

---

## 🚀 Deployment Diagram

```
Development
├─ http://localhost:5173 (Frontend)
├─ http://localhost:5173/admin (Admin)
└─ http://localhost:5000 (Backend)
        ↓
Production
├─ Vercel/Netlify (Frontend)
│  └─ https://livewear.com
├─ Vercel/Netlify/Railway/Render (Backend)
│  └─ https://api.livewear.com
└─ MongoDB Atlas (Database)
   └─ Managed cloud
```

---

## 🔄 Git Workflow

```
main branch (production ready)
        ↓
development branch
        ↓
feature branches
├─ feature/products
├─ feature/admin-panel
├─ feature/auth
└─ feature/orders
        ↓
Pull Requests
        ↓
Code Review
        ↓
Merge to development
        ↓
Tests pass
        ↓
Merge to main
        ↓
Deploy to production
```

---

## 🎯 Timeline Recommandé

```
Week 1: Setup & Backend
├─ MongoDB Atlas setup
├─ Backend structure
├─ Models & Controllers
├─ Authentication
└─ API testing

Week 2: Frontend
├─ Main layout
├─ Pages (Home, Products, Cart)
├─ Redux integration
└─ API integration

Week 3: Admin Panel
├─ Dashboard
├─ Product Management
├─ Category Management
├─ Orders Management

Week 4: Polish & Deploy
├─ Testing
├─ Optimization
├─ Deployment setup
└─ Go live! 🚀
```

---

**Voilà! Tu comprends maintenant l'architecture complète de Livewear! 🎉**
