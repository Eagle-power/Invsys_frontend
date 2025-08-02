import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CustomerForm({
  onSubmit,
  initialData = {},
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
    address: initialData.address || "",
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
      // THE FIX: Using a more robust regex for email validation
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      // Only validate if the field is not empty
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
      <div className="grid gap-4 py-4 ">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name*
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
          <Label htmlFor="phone" className="text-right">
            Phone*
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="address" className="text-right pt-2">
            Address
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Customer"}
        </Button>
      </div>
    </form>
  );
}
