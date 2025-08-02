import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateStockMutation } from "@/features/inventory/inventoryApiSlice";
import { toast } from "sonner";

export default function AdjustStockForm({ item, setOpen }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updateStock, { isLoading }] = useUpdateStockMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStock({
        productId: item.product._id,
        storeId: item.store._id,
        quantity: Number(quantity),
      }).unwrap();
      toast.success(`Stock for ${item.product.name} updated successfully!`);
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update stock");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="product-name" className="text-right">
            Product
          </Label>
          <p id="product-name" className="col-span-3 font-medium">
            {item?.product?.name}
          </p>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">
            New Quantity
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
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-violet-600"
        >
          {isLoading ? "Saving..." : "Save Quantity"}
        </Button>
      </div>
    </form>
  );
}
