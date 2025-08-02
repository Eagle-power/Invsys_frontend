import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateStockMutation } from "@/features/inventory/inventoryApiSlice";
import { useGetProductsQuery } from "@/features/products/productsApiSlice";
import { toast } from "sonner";

export default function AddProductToInventoryForm({ storeId, setOpen }) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch all products for the dropdown
  const { data: products, isLoading: isLoadingProducts } =
    useGetProductsQuery();
  const [updateStock, { isLoading: isUpdatingStock }] =
    useUpdateStockMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) {
      toast.error("Please select a product.");
      return;
    }
    try {
      await updateStock({
        productId,
        storeId,
        quantity: Number(quantity),
      }).unwrap();
      toast.success("Product added to inventory successfully!");
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add product to inventory");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4 ">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="product" className="text-right">
            Product
          </Label>
          <Select onValueChange={setProductId} disabled={isLoadingProducts}>
            <SelectTrigger className="col-span-3">
              <SelectValue
                placeholder={
                  isLoadingProducts ? "Loading..." : "Select a product"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-white hover:cursor-pointer font-semibold">
              {products?.map((product) => (
                <SelectItem key={product._id} value={product._id} className="hover:cursor-pointer font-semibold">
                  {product.name} ({product.sku})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            min="1"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdatingStock} className="bg-gradient-to-r from-blue-500 to-violet-700">
          {isUpdatingStock ? "Adding..." : "Add to Inventory"}
        </Button>
      </div>
    </form>
  );
}
