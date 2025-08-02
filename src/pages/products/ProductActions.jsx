// path: src/pages/products/ProductActions.jsx

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditProductForm from "./EditProductForm";
import { useDeleteProductMutation } from "@/features/products/productsApiSlice";
import { toast } from "sonner";

export default function ProductActions({ product }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct(product._id).unwrap();
      toast.success("Product deleted successfully!");
      // No need to close the dialog here, AlertDialog handles it on action
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  return (
    <>
      {/* The Dropdown Menu is the only visible part initially */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost"  className="h-8 w-8 p-0 bg-gradient-to-r from-blue-600 to-violet-600">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white ">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setIsEditDialogOpen(true)}
            className="cursor-pointer font-bold"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setIsDeleteDialogOpen(true)}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* The Dialogs are separate and controlled by state */}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <EditProductForm product={product} setOpen={setIsEditDialogOpen} />
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product "{product.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-800"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
