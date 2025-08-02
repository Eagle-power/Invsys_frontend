import { useState } from "react";
import { useGetProductsQuery } from "@/features/products/productsApiSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import CreateProductForm from "./CreateProductForm";
import ProductActions from "./ProductActions";

export default function Products() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery();

  let content;

  if (isLoading) {
    content = <p>Loading products...</p>;
  } else if (isError) {
    content = (
      <p className="text-red-500">
        Error: {error?.data?.message || error.error}
      </p>
    );
  } else if (isSuccess) {
    content = (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category?.name || "N/A"}</TableCell>
                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                <TableCell>{product.supplier?.name || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <ProductActions product={product} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-gray-600">
            Manage all products in the master catalog.
          </p>
        </div>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-violet-700 hover:from-violet-700 hover:to-blue-500 transition-all duration-500 ease-in-out">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details for the new product.
              </DialogDescription>
            </DialogHeader>
            <CreateProductForm setOpen={setOpenCreateDialog} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>
    </div>
  );
}
