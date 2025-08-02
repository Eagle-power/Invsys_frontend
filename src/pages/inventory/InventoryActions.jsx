import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdjustStockForm from "./AdjustStockForm";

export default function InventoryActions({ item }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className=" mr-4 bg-gradient-to-r from-blue-500  to-violet-600">
          Adjust Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Adjust Stock Quantity</DialogTitle>
          <DialogDescription>
            Set the new stock quantity for this item. This will overwrite the
            current value.
          </DialogDescription>
        </DialogHeader>
        <AdjustStockForm item={item} setOpen={setIsDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}
