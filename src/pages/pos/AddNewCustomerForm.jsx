import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCustomerMutation } from "@/features/customers/customersApiSlice";
import { toast } from "sonner";

export default function AddNewCustomerForm({ setOpen, onCustomerCreated }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCustomer = await createCustomer({ name, phone }).unwrap();
      toast.success("New customer added successfully!");
      onCustomerCreated(newCustomer); // Pass the new customer back to the POS page
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add customer");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name*
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3 border-2"
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
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            className="col-span-3 border-2"
            required
            maxLength="10"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-violet-600">
          {isLoading ? "Saving..." : "Save Customer"}
        </Button>
      </div>
    </form>
  );
}
