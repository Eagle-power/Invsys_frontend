import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserMutation } from "@/features/users/usersApiSlice";
import { useGetStoresQuery } from "@/features/stores/storesApiSlice";
import { toast } from "sonner";

export default function EditUserForm({ user, setOpen }) {
  const [role, setRole] = useState(user.role || "");
  const [assignedStore, setAssignedStore] = useState(
    user.assignedStore?._id || ""
  );

  const { data: stores, isLoading: isLoadingStores } = useGetStoresQuery();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        userId: user._id,
        data: { 
            role, 
            assignedStore:  assignedStore === "none" ? "" : assignedStore 
        },
      }).unwrap();
      toast.success("User updated successfully!");
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Email</Label>
          <p className="col-span-3 font-medium">{user.email}</p>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="text-right">
            Role
          </Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="col-span-3 ">
               <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent className="bg-white cursor-pointer">
              <SelectItem value="staff" className="hover:font-semibold cursor-pointer">Staff</SelectItem>
              <SelectItem value="manager" className="hover:font-semibold cursor-pointer">Store Manager</SelectItem>
              <SelectItem value="admin" className="hover:font-semibold cursor-pointer">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="store" className="text-right">
            Store
          </Label>
          <Select
            onValueChange={setAssignedStore}
            defaultValue={assignedStore}
            disabled={isLoadingStores}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a store" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="none" className="hover:font-semibold hover:cursor-pointer">None</SelectItem>
              {stores?.map((store) => (
                <SelectItem key={store._id} value={store._id} className="hover:font-semibold hover:cursor-pointer ">
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdatingUser} className="bg-gradient-to-r from-blue-500 to-violet-700 ">
          {isUpdatingUser ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
