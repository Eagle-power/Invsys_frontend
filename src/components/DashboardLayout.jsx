import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Box,
  Store,
  LogOut,
  ShoppingCart,
  Truck,
  ChevronDown,
  PackageMinus ,
  PackageCheck ,
  User,
  FolderTree,
  Menu,
  Warehouse,
  Contact,
  History,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "../features/auth/authSlice";
import { Toaster, toast } from "sonner";

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    toast.error("You have been logged out.");
    navigate("/login");
  };

  const userRole = user?.role;
  let navLinks = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/dashboard/pos",
      icon: <ShoppingCart size={20} />,
      label: "POS",
    },
    { to: "/dashboard/profile", icon: <User size={20} />, label: "Profile" },
  ];

  if (userRole === "admin") {
    navLinks.push(
      { to: "/dashboard/stores", icon: <Store size={20} />, label: "Stores" },
      { to: "/dashboard/products", icon: <Box size={20} />, label: "Products" },
      { to: "/dashboard/inventory", icon: <Warehouse size={20} />, label: "Inventory"},
      { to: "/dashboard/categories", icon: <FolderTree size={20} />, label: "Categories"},
      { to: "/dashboard/suppliers", icon: <Truck size={20} />, label: "Suppliers" },
      { to: "/dashboard/users", icon: <Users size={20} />, label: "Users" },
      { to: "/dashboard/customers", icon:<Contact  size={20} /> , label: "Customer" },
      { to: "/dashboard/restock-management", icon: <PackageCheck size={20} />, label: "Restock Mgt" } ,
      { to: "/dashboard/sales-history", icon: <History size={20} />, label: "Sales History" }
    );
  } else if (userRole === "manager") {
    navLinks.push({
      to: "/dashboard/inventory",
      icon: <Warehouse size={20} />,
      label: "Inventory",
    },
    { to: "/dashboard/restock-requests", icon: <PackageMinus size={20} />, label: "Restock Requests" }, 
    { to: "/dashboard/sales-history", icon: <History size={20} />, label: "Sales History" }
  );
  }
   else if (userRole === "staff") {
    // Staff can now also see the sales history
    navLinks.push({
      to: "/dashboard/sales-history",
      icon: <History size={20} />,
      label: "Sales History",
    });
  }

  const NavContent = () => (
    <nav className="flex flex-col gap-2">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          to={link.to}
          onClick={() => setMobileMenuOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            location.pathname === link.to
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 flex-col border-r bg-white p-4 sm:flex">
        <div className="mb-8 flex items-center gap-2">
          <Box size={32} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-600">InvSys</h1>
        </div>
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="relative z-10 flex h-16 items-center justify-between border-b bg-white px-6 sm:justify-end">
          {/* Mobile Hamburger Menu */}
          <div className="sm:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4 bg-white">
                <div className="mb-8 flex items-center gap-2">
                  <Box size={32} className="text-blue-600" />
                  <h1 className="text-2xl font-bold text-blue-600">InvSys</h1>
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* User Info and Logout Button */}
          <div className="ml-auto flex items-center gap-4">
            <span className="text-gray-700 font-medium hidden sm:inline">
              Hello, {user?.name || "User"}!
            </span>
            <Button
              variant="outline"
              className="text-red-600 border-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
        <Toaster richColors />
      </div>
    </div>
  );
};

export default DashboardLayout;
