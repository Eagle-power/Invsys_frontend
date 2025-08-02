import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Linkedin } from "lucide-react";

const TeamContactCard = ({
  name,
  role,
  email,
  phone,
  imageUrl,
  linkedinUrl,
}) => (
  <Card className="text-center">
    <CardHeader>
      <img
        src={imageUrl}
        alt={`Photo of ${name}`}
        className="h-24 w-24 rounded-full object-cover mx-auto mb-4 shadow-lg border-4 border-white"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/128x128/e0e7ff/4f46e5?text=Dev";
        }}
      />
      <CardTitle className="text-xl">{name}</CardTitle>
      <CardDescription className="text-blue-600 font-medium">
        {role}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3 text-sm text-gray-600">
      <div className="flex items-center justify-center gap-2">
        <Mail className="h-4 w-4" />
        <a href={`mailto:${email}`} className="hover:underline hover:text-blue-600">
          {email}
        </a>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Phone className="h-4 w-4" />
        <span>{phone}</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Linkedin className="h-4 w-4" />
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-blue-600"
        >
          LinkedIn Profile
        </a>
      </div>
    </CardContent>
  </Card>
);

export default function Contact() {
  return (
    <div className="container mx-auto max-w-5xl py-12 select-none" onContextMenu={(e) => e.preventDefault()}>
      <div className="space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="text-lg text-gray-600 mt-2">
            We'd love to hear from you. Here's how you can reach our team.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">General Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              For general questions about the InvSys project, partnerships, or
              other inquiries, please contact us at our main office.
            </p>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">contact@invsys.project</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">+91 12345 67890</span>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div>
          <h2 className="text-3xl font-bold text-center mb-8">
            Contact Our Developers Directly
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamContactCard
              name="Ankur"
              role="Lead Developer & Backend Developer"
              email="ankur.dev@invsys.project"
              phone="+91 62022 68494"
              imageUrl="https://res.cloudinary.com/dww70ejnl/image/upload/v1753980722/inventory-system-profiles/ghpnwubbiwv8o6cbaxce.jpg"
              linkedinUrl="https://www.linkedin.com/in/ankur-kumar-364791250/"
            />
            <TeamContactCard
              name="Sonu Kumar"
              role="Frontend Developer (UI/UX)"
              email="alex.ui@invsys.project"
              phone="+91 78569 41386"
              imageUrl="https://res.cloudinary.com/dww70ejnl/image/upload/v1754159972/Screenshot_2025-08-03_000909_weyrsg.png"
              linkedinUrl="https://www.linkedin.com/in/sonu-kumar-73b29226a/"
            />
            <TeamContactCard
              name="Ranvijay Singh"
              role="Database Engineer"
              email="sam.db@invsys.project"
              phone="+91 99052 81952"
              imageUrl="https://res.cloudinary.com/dww70ejnl/image/upload/v1754160577/aws_c5fuut.jpg"
              linkedinUrl="https://www.linkedin.com/in/ranvijay-singh-abc3037/"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
