// path: src/pages/sales/SalesHistory.jsx

import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { useGetSalesHistoryQuery } from "@/features/sales/salesApiSlice";
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
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BillView from "./BillView";

export default function SalesHistory() {
  const [selectedStore, setSelectedStore] = useState("");
  const user = useSelector(selectCurrentUser);

  const { data: stores, isLoading: isLoadingStores } = useGetStoresQuery(
    undefined,
    {
      skip: user?.role !== "admin",
    }
  );

  const {
    data: sales,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSalesHistoryQuery(selectedStore);

  let content;
  if (isLoading) {
    content = <p className="text-center py-10">Loading sales history...</p>;
  } else if (isError) {
    content = (
      <p className="text-red-500 text-center py-10">
        Error: {error?.data?.message || error.error}
      </p>
    );
  } else if (isSuccess && sales.length > 0) {
    content = (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              {user.role === "admin" && <TableHead>Store</TableHead>}
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale._id}>
                <TableCell className="font-mono">
                  {sale.invoiceNumber}
                </TableCell>
                <TableCell>
                  {new Date(sale.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{sale.customer?.name || "N/A"}</TableCell>
                {user.role === "admin" && (
                  <TableCell>{sale.store?.name || "N/A"}</TableCell>
                )}
                <TableCell className="font-semibold">
                  ₹{sale.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Bill
                      </Button>
                    </DialogTrigger>
                   
                    <DialogContent className="sm:max-w-2xl p-0 bg-white">
                      <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Invoice Details</DialogTitle>
                        <DialogDescription>
                          A detailed view of the transaction for invoice #
                          {sale.invoiceNumber}.
                        </DialogDescription>
                      </DialogHeader>
                      <BillView saleId={sale._id} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  } else if (isSuccess && sales.length === 0) {
    content = (
      <p className="text-center py-10">No sales found for this store.</p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sales History</h1>
          <p className="text-gray-600">Review all past transactions.</p>
        </div>
        {user.role === "admin" && (
          <div className="flex items-center gap-2">
            <label className="font-medium">Filter by Store:</label>
            <Select
              onValueChange={(value) =>
                setSelectedStore(value === "all-stores" ? "" : value)
              }
              disabled={isLoadingStores}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue
                  placeholder={isLoadingStores ? "Loading..." : "All Stores"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-stores">All Stores</SelectItem>
                {stores?.map((store) => (
                  <SelectItem key={store._id} value={store._id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>
    </div>
  );
}
