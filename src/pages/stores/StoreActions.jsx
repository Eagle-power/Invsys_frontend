import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import EditStoreForm from './EditStoreForm';
import { useDeleteStoreMutation } from '@/features/stores/storesApiSlice';
import { toast } from 'sonner';

export default function StoreActions({ store }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteStore] = useDeleteStoreMutation();

  const handleDelete = async () => {
    try {
      await deleteStore(store._id).unwrap();
      toast.success('Store deleted successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete store');
    }
  };

  return (
    <>
      <AlertDialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="cursor-pointer">
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

          {/* Edit Dialog Content */}
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Store</DialogTitle>
              <DialogDescription>
                Make changes to the store details. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <EditStoreForm store={store} setOpen={setIsEditDialogOpen} />
          </DialogContent>
        </Dialog>

        {/* Delete Alert Dialog Content */}
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              store "{store.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
