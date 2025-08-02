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
import EditUserForm from "./EditUserForm";
import { useDeleteUserMutation } from "@/features/users/usersApiSlice";
import { toast } from "sonner";

export default function UserActions({ user }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(user._id).unwrap();
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <>
      <AlertDialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild >
              <Button variant="ghost" className="h-8 w-8 p-0 bg-gradient-to-tl from-blue-500 to-violet-700">
                <MoreHorizontal className="h-4 w-4 " />
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
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 font-semibold">
                  <Trash2 className="mr-2 h-4 w-4 " />
                  Delete User
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader className="flex ">
              <DialogTitle className="text-center">Edit User</DialogTitle>
            </DialogHeader>
            <EditUserForm user={user} setOpen={setIsEditDialogOpen} />
          </DialogContent>
        </Dialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user {user.name}.
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
