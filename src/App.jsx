import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./features/auth/RequireAuth";
import Stores from "./pages/stores/Stores";
import Products from "./pages/products/Products";
import Users from "./pages/users/Users";
import Inventory from "./pages/inventory/Inventory";
import POS from "./pages/pos/POS";
import Categories from "./pages/categories/Categories";
import Customers from "./pages/customers/Customers";
import Suppliers from "./pages/suppliers/Suppliers";
import SalesHistory from "./pages/sales/SalesHistory";
import Profile from "./pages/profile/Profile";
import RestockRequests from "./pages/restock/RestockRequests";
import RestockManagement from './pages/restock/RestockManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route index element={<Login />} />

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="pos" element={<POS />} />
              <Route path="stores" element={<Stores />} />
              <Route path="products" element={<Products />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="categories" element={<Categories />} />
              <Route path="users" element={<Users />} />
              <Route path="customers" element={<Customers />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="sales-history" element={<SalesHistory />} />
              <Route path="profile" element={<Profile />} />
              <Route path="restock-requests" element={<RestockRequests />} />
              <Route path="restock-management" element={<RestockManagement />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
