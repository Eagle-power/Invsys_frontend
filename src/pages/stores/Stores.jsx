import { useState } from "react";
import { useGetStoresQuery } from "@/features/stores/storesApiSlice";
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
import CreateStoreForm from "./CreateStoreForm";
import StoreActions from "./StoreActions"; // Import the new actions component

export default function Stores() {
  const [open, setOpen] = useState(false); // State to control the dialog

  const {
    data: stores,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetStoresQuery();
  // console.log("Store data: ",stores);

  let content;

  if (isLoading) {
    content = <p>Loading stores...</p>;
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
              <TableHead>Branch Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store._id}>
                <TableCell className="font-mono">{store?.storeCode}</TableCell>
                <TableCell className="font-medium">{store?.name}</TableCell>
                <TableCell>{store?.location}</TableCell>
                <TableCell>{store?.manager?.name}</TableCell>
                <TableCell>
                  {new Date(store?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <StoreActions store={store} />
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
          <h1 className="text-3xl font-bold">Stores Management</h1>
          <p className="text-gray-600">
            Manage all store locations in the system.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>
                Fill in the details for the new store location.
              </DialogDescription>
            </DialogHeader>
            <CreateStoreForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>
    </div>
  );
}
