import { Box } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-8 py-4 px-6">
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Box size={16} className="text-blue-600" />
          <p className="font-semibold text-gray-700">InvSys</p>
        </div>
        <p><span className="font-bold">&copy;</span> {new Date().getFullYear()} <span className="text-blue-600 font-bold">InvSys</span> All Rights Reserved.</p>
        <p>Developed by Ankur & Team.</p>
      </div>
    </footer>
  );
};

export default Footer;
