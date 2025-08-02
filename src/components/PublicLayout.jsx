import { Link, Outlet } from "react-router-dom";
import { Box } from "lucide-react";
import Footer from "./Footer";
import { Separator } from "@/components/ui/separator";


const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Box size={32} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-600">InvSys</h1>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/about"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Contact Us
          </Link>
        </div>
      </nav>
    </header>
  );
};

const PublicLayout = () => {
  return (
    <div
      className="h-screen flex flex-col bg-gray-100 no-scrollbar"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Navbar />
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        <Outlet />
        <Separator /> 
        <Footer />
      </main>
    </div>
  );
};

export default PublicLayout;
