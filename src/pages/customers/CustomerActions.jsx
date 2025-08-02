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
import CustomerForm from "./CustomerForm";
import {
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "@/features/customers/customersApiSlice";
import { toast } from "sonner";

export default function CustomerActions({ customer }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleUpdate = async (formData) => {
    try {
      await updateCustomer({
        customerId: customer._id,
        data: formData,
      }).unwrap();
      toast.success("Customer updated successfully!");
      setIsEditDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update customer");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(customer._id).unwrap();
      toast.success("Customer deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete customer");
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
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm
              onSubmit={handleUpdate}
              initialData={customer}
              isLoading={isUpdating}
            />
          </DialogContent>
        </Dialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the customer "{customer.name}".
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
