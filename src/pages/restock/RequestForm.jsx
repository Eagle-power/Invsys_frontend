import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRestockRequestMutation } from "@/features/restock/restockApiSlice";
import { toast } from "sonner";

export default function RequestForm({ item, setOpen }) {
  const [quantity, setQuantity] = useState(50); // Default request quantity
  const [notes, setNotes] = useState("");
  const [createRequest, { isLoading }] = useCreateRestockRequestMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRequest({
        productId: item.product._id,
        quantityRequested: Number(quantity),
        notes,
      }).unwrap();
      toast.success(`Restock request for ${item.product.name} submitted!`);
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit request.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Product</Label>
          <p className="col-span-3 font-medium">{item.product.name}</p>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="notes" className="text-right pt-2">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="col-span-3"
            placeholder="Optional: e.g., urgent, high demand"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-violet-600">
          {isLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}
