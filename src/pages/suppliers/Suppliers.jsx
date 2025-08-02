import { useState } from "react";
import {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
} from "@/features/suppliers/suppliersApiSlice";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import SupplierForm from "./SupplierForm";
import SupplierActions from "./SupplierActions";
import { toast } from "sonner";

export default function Suppliers() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    data: suppliers,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSuppliersQuery();
  const [createSupplier, { isLoading: isCreating }] =
    useCreateSupplierMutation();

  const handleCreate = async (formData) => {
    try {
      await createSupplier(formData).unwrap();
      toast.success("Supplier created successfully!");
      setIsCreateDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create supplier");
    }
  };

  let content;
  if (isLoading) {
    content = <p>Loading suppliers...</p>;
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
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier._id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell className="text-right">
                  <SupplierActions supplier={supplier} />
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
          <h1 className="text-3xl font-bold">Suppliers Management</h1>
          <p className="text-gray-600">
            Manage all vendor and supplier information.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <SupplierForm onSubmit={handleCreate} isLoading={isCreating} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>
    </div>
  );
}
