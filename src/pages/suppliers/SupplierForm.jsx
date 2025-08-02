import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SupplierForm({
  onSubmit,
  initialData = {},
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    contactPerson: initialData.contactPerson || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [id]: numericValue }));
      }
    } else if (id === "email") {
      setFormData((prev) => ({ ...prev, [id]: value }));
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Supplier Name*
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="contactPerson" className="text-right">
            Contact Person*
          </Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email*
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Phone*
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-blue-600 to-violet-600"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Supplier"}
        </Button>
      </div>
    </form>
  );
}
