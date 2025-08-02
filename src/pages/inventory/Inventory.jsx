// import { useState } from "react";
// import { useGetStoresQuery } from "@/features/stores/storesApiSlice";
// import { useLazyGetStoreInventoryQuery } from "@/features/inventory/inventoryApiSlice";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import InventoryActions from "./InventoryActions";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, PlusCircle } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import AddProductToInventoryForm from "./AddProductToInventoryForm"; // ADD THIS LINE

// export default function Inventory() {
//   const [selectedStore, setSelectedStore] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // NEW STATE

//   const { data: stores, isLoading: isLoadingStores } = useGetStoresQuery();

//   const [
//     triggerGetInventory,
//     {
//       data: inventory,
//       isLoading: isLoadingInventory,
//       isFetching,
//       isSuccess,
//       isError,
//     },
//   ] = useLazyGetStoreInventoryQuery();

//   const selectedStoreData = stores?.find(store => store._id === selectedStore);

//   const handleStoreChange = (storeId) => {
//     setSelectedStore(storeId);
//     if (storeId) {
//       triggerGetInventory(storeId);
//     }
//   };

//   const handleSearch = () => {
//     if (!searchTerm || !stores) return;
//     const foundStore = stores.find(
//       (store) => store.storeCode.toLowerCase() === searchTerm.toLowerCase()
//     );
//     if (foundStore) {
//       handleStoreChange(foundStore._id);
//     } else {
//       alert("Store code not found.");
//     }
//   };

//   let inventoryContent;
//   if (isLoadingInventory || isFetching) {
//     inventoryContent = <p className="mt-4 text-center">Loading inventory...</p>;
//   } else if (isError) {
//     inventoryContent = (
//       <p className="mt-4 text-center text-red-500">Error fetching inventory.</p>
//     );
//   } else if (isSuccess && inventory?.length > 0) {
//     inventoryContent = (
//       <div className="mt-6 overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Product Name</TableHead>
//               <TableHead>SKU</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {inventory.map((item) => (
//               <TableRow key={item._id}>
//                 <TableCell className="font-medium">
//                   {item?.product?.name}
//                 </TableCell>
//                 <TableCell>{item?.product?.sku}</TableCell>
//                 <TableCell>{item?.quantity}</TableCell>
//                 <TableCell className="text-right">
//                   <InventoryActions item={item} />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     );
//   } else if (isSuccess && inventory?.length === 0) {
//     inventoryContent = (
//       <p className="mt-4 text-center">
//         No inventory found for this store. Add a product to get started.
//       </p>
//     );
//   } else if (!selectedStore) {
//     inventoryContent = (
//       <p className="mt-4 text-center">
//         Select or search for a store to view its inventory.
//       </p>
//     );
//   }

//   return (
//     <div>
//       <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Inventory Levels</h1>
//           <p className="text-gray-600">
//             View and manage stock quantities across your stores.
//           </p>
//         </div>
//         {/* NEW: Add Product to Inventory Button and Dialog */}
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogTrigger asChild>
//             <Button
//               disabled={!selectedStore}
//               className="bg-gradient-to-r from-blue-500 to-violet-700"
//             >
//               <PlusCircle className="mr-2 h-4 w-4" />
//               Add Product to Inventory
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px] bg-white">
//             <DialogHeader>
//               <DialogTitle>Add Product to Inventory</DialogTitle>
//               <DialogDescription>
//                 Select a product from the master catalog to add to this store's
//                 inventory.
//               </DialogDescription>
//             </DialogHeader>
//             <AddProductToInventoryForm
//               storeId={selectedStore}
//               setOpen={setIsAddDialogOpen}
//             />
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="bg-white p-6 flex items-center justify-between flex-wrap gap-4">
//         <div className="flex items-center gap-4">
//           <label className="font-medium">Select a Store:</label>
//           <Select onValueChange={handleStoreChange} disabled={isLoadingStores}>
//             <SelectTrigger className="w-[280px]">
//               <SelectValue
//                 placeholder={
//                   isLoadingStores ? "Loading stores..." : "Select a store"
//                 }
//               />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               {stores?.map((store) => (
//                 <SelectItem
//                   key={store._id}
//                   value={store._id}
//                   className="font-semibold cursor-pointer"
//                 >
//                   {store.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="flex items-center gap-2">
//           <label className="font-medium">Search by Code:</label>
//           <Input
//             type="text"
//             placeholder="e.g., S_001"
//             className="w-[150px]"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <Button onClick={handleSearch} size="icon">
//             <Search className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <div className="mt-6 p-1 bg-white">
//         {selectedStoreData && (
//           <div className="mt-6 border-t pt-4">
//             <h2 className="text-xl font-semibold">
//               Showing Inventory for:{" "}
//               <span className="text-blue-600">{selectedStoreData.name}</span>
//             </h2>
//           </div>
//         )}
//         {inventoryContent}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { useGetStoresQuery } from "@/features/stores/storesApiSlice";
import { useLazyGetStoreInventoryQuery } from "@/features/inventory/inventoryApiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import InventoryActions from "./InventoryActions";
import AddProductToInventoryForm from "./AddProductToInventoryForm";
import { toast } from "sonner";

export default function Inventory() {
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === "admin";

  const [selectedStore, setSelectedStore] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: stores, isLoading: isLoadingStores } = useGetStoresQuery(
    undefined,
    {
      skip: !isAdmin, // Skip fetching all stores if the user is not an admin
    }
  );

  const [
    triggerGetInventory,
    {
      data: inventory,
      isLoading: isLoadingInventory,
      isFetching,
      isSuccess,
      isError,
    },
  ] = useLazyGetStoreInventoryQuery();

  // --- START OF NEW LOGIC ---
  // If the user is a manager, automatically fetch their store's inventory
  useEffect(() => {
    if (!isAdmin && user?.assignedStore) {
      const storeId = user.assignedStore._id || user.assignedStore;
      setSelectedStore(storeId);
      triggerGetInventory(storeId);
    }
  }, [isAdmin, user, triggerGetInventory]);
  // --- END OF NEW LOGIC ---

  const selectedStoreData =
    stores?.find((store) => store._id === selectedStore) || user?.assignedStore;

  const handleStoreChange = (storeId) => {
    setSelectedStore(storeId);
    if (storeId) {
      triggerGetInventory(storeId);
    }
  };

  const handleSearch = () => {
    if (!searchTerm || !stores) return;
    const foundStore = stores.find(
      (store) => store.storeCode.toLowerCase() === searchTerm.toLowerCase()
    );
    if (foundStore) {
      handleStoreChange(foundStore._id);
    } else {
      toast.error("Store code not found.");
    }
  };

  let inventoryContent;
  if (isLoadingInventory || isFetching) {
    inventoryContent = <p className="mt-4 text-center">Loading inventory...</p>;
  } else if (isError) {
    inventoryContent = (
      <p className="mt-4 text-center text-red-500">Error fetching inventory.</p>
    );
  } else if (isSuccess && inventory?.length > 0) {
    inventoryContent = (
      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">
                  {item.product?.name}
                </TableCell>
                <TableCell>{item.product?.sku}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">
                  <InventoryActions item={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  } else if (isSuccess && inventory?.length === 0) {
    inventoryContent = (
      <p className="mt-4 text-center">
        No inventory found for this store. Add a product to get started.
      </p>
    );
  } else if (!selectedStore && isAdmin) {
    inventoryContent = (
      <p className="mt-4 text-center">
        Select or search for a store to view its inventory.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Levels</h1>
          <p className="text-gray-600">View and manage stock quantities.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={!selectedStore}
              className="bg-gradient-to-r from-blue-500 to-violet-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product to Inventory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add Product to Inventory</DialogTitle>
              <DialogDescription>
                Select a product from the master catalog to add to this store's
                inventory.
              </DialogDescription>
            </DialogHeader>
            <AddProductToInventoryForm
              storeId={selectedStore}
              setOpen={setIsAddDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* The store selector is now only visible to admins */}
        {isAdmin && (
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">Select a Store:</label>
              <Select
                onValueChange={handleStoreChange}
                disabled={isLoadingStores}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue
                    placeholder={
                      isLoadingStores ? "Loading stores..." : "Select a store"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {stores?.map((store) => (
                    <SelectItem
                      key={store._id}
                      value={store._id}
                      className="font-semibold cursor-pointer"
                    >
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium">Search by Code:</label>
              <Input
                type="text"
                placeholder="e.g., S_001"
                className="w-[150px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={handleSearch} size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6">
          {selectedStoreData && (
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold">
                Showing Inventory for:{" "}
                <span className="text-blue-600">{selectedStoreData.name}</span>
              </h2>
            </div>
          )}
          {inventoryContent}
        </div>
      </div>
    </div>
  );
}
