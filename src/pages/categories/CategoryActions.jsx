import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CategoryForm from "./CategoryForm";
import {
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/features/categories/categoriesApiSlice";
import { toast } from "sonner";

export default function CategoryActions({ category }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleUpdate = async (formData) => {
    try {
      await updateCategory({
        categoryId: category._id,
        data: formData,
      }).unwrap();
      toast.success("Category updated successfully!");
      setIsEditDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(category._id).unwrap();
      toast.success("Category deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  return (
    <>
      <AlertDialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 bg-gradient-to-r from-blue-600 to-violet-600">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem
                onClick={() => setIsEditDialogOpen(true)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleUpdate}
              initialData={category}
              isLoading={isUpdating}
            />
          </DialogContent>
        </Dialog>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{category.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
