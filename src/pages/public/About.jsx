import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";

const TeamMember = ({ name, role, imageUrl }) => (
  <div className="flex flex-col items-center text-center">
    <img
      src={imageUrl}
      alt={`Photo of ${name}`}
      className="h-32 w-32 rounded-full object-cover mb-4 shadow-lg border-4 border-white"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/128x128/e0e7ff/4f46e5?text=Dev";
      }}
    />
    <h3 className="font-bold text-lg text-gray-800">{name}</h3>
    <p className="text-blue-600 font-medium">{role}</p>
  </div>
);

export default function About() {
  const features = [
    "Real-Time Multi-Store Inventory Tracking",
    "Role-Based Access Control (Admin, Manager, Staff)",
    "Complete Product, Category, and Supplier Management",
    "Integrated Point of Sale (POS) System",
    "Customer Relationship Management (CRM)",
    "AI-Powered Description Generation with Gemini",
    "Secure User Profile and Password Management",
    "Role-Aware Analytics Dashboard",
  ];

  return (
    <div className="container mx-auto max-w-4xl py-12 select-none " onContextMenu={(e) => e.preventDefault()}>
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">About InvSys</CardTitle>
          <CardDescription className="text-lg text-gray-600 pt-2">
            The intelligent, all-in-one solution for modern retail management.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700">
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              Our Mission
            </h2>
            <p>
              InvSys was born from a simple idea: to empower businesses with a
              centralized, real-time solution to the complex challenges of
              multi-store inventory management. We aim to eliminate data
              inconsistencies, prevent stock discrepancies, and provide business
              owners with a clear, live view of their entire operation. Our goal
              is to make sophisticated inventory control accessible, intuitive,
              and efficient.
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TeamMember
                name="Ankur Kumar"
                role="Lead Developer & Backend Developer"
                imageUrl="https://res.cloudinary.com/dww70ejnl/image/upload/v1753980722/inventory-system-profiles/ghpnwubbiwv8o6cbaxce.jpg"
              />
              <TeamMember
                name="Sonu Kumar"
                role="Frontend Developer (UI/UX)"
                imageUrl="https://res.cloudinary.com/dww70ejnl/image/upload/v1754159972/Screenshot_2025-08-03_000909_weyrsg.png"
              />
              <TeamMember
                name="Ranvijay Singh"
                role="Database Engineer"
                imageUrl="https://res.cloudinary.com/dww70ejnl/image/upload/v1754160577/aws_c5fuut.jpg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
