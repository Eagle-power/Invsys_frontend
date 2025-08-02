import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { useLazyGetStoreInventoryQuery } from "@/features/inventory/inventoryApiSlice";
import { useGetRestockRequestsQuery } from "@/features/restock/restockApiSlice";
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
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestForm from "./RequestForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RestockRequests() {
  const user = useSelector(selectCurrentUser);
  const [trigger, { data: inventory, isLoading: isLoadingInventory }] =
    useLazyGetStoreInventoryQuery();
  const { data: requestHistory, isLoading: isLoadingHistory } =
    useGetRestockRequestsQuery();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (user?.assignedStore) {
      trigger(user.assignedStore._id || user.assignedStore);
    }
  }, [user, trigger]);

  const lowStockItems =
    inventory?.filter((item) => item.quantity <= item.reorderLevel) || [];

  const handleRequestClick = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Restock Requests</h1>
        <p className="text-gray-600">
          Manage low-stock items and track your restock request history.
        </p>
      </div>

      <Tabs defaultValue="low-stock">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="low-stock" >Low Stock Items</TabsTrigger>
          <TabsTrigger value="request-history">Request History</TabsTrigger>
        </TabsList>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>Items Needing Attention</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInventory ? (
                <p>Loading inventory...</p>
              ) : lowStockItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">
                          {item.product.name}
                        </TableCell>
                        <TableCell className="font-bold text-red-600">
                          {item.quantity}
                        </TableCell>
                        <TableCell>{item.reorderLevel}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-violet-700"
                            onClick={() => handleRequestClick(item)}>
                            Request Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-10">
                  No products are currently low on stock. Great job!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Request History Tab */}
        <TabsContent value="request-history">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <p>Loading history...</p>
              ) : requestHistory?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Qty Requested</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestHistory.map((req) => (
                      <TableRow key={req._id}>
                        <TableCell className="font-medium">
                          {req.product.name}
                        </TableCell>
                        <TableCell>{req.quantityRequested}</TableCell>
                        <TableCell>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              req.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : req.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-10">
                  You have not submitted any restock requests.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Request Restock</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <RequestForm item={selectedItem} setOpen={setIsDialogOpen} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
