import { useState } from "react";
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
} from "@/features/customers/customersApiSlice";
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
import CustomerForm from "./CustomerForm";
import CustomerActions from "./CustomerActions";
import { toast } from "sonner";

export default function Customers() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    data: customers,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCustomersQuery();
  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();

  const handleCreate = async (formData) => {
    try {
      await createCustomer(formData).unwrap();
      toast.success("Customer created successfully!");
      setIsCreateDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create customer");
    }
  };

  let content;
  if (isLoading) {
    content = <p>Loading customers...</p>;
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
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <CustomerActions customer={customer} />
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
          <h1 className="text-3xl font-bold">Customers Management</h1>
          <p className="text-gray-600">Manage all customer information.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm onSubmit={handleCreate} isLoading={isCreating} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>
    </div>
  );
}
