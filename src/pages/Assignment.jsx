import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAssignmentDetailsQuery,
  useApproveAssignmentMutation,
} from "@/features/auth/authApiSlice";
import { useGetStoresQuery } from "@/features/stores/storesApiSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function Assignment() {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetAssignmentDetailsQuery(token);
  const { data: stores } = useGetStoresQuery();
  const [approveAssignment, { isLoading: isApproving }] =
    useApproveAssignmentMutation();

  const [role, setRole] = useState("staff");
  const [assignedStore, setAssignedStore] = useState("");

  const handleSubmit = async () => {
    if (!role || !assignedStore) {
      toast.error("Please select a role and a store.");
      return;
    }
    try {
      await approveAssignment({
        userId: user._id,
        role,
        assignedStore,
      }).unwrap();
      toast.success("User has been approved and assigned successfully!");
      navigate("/login"); // Redirect admin to login after approval
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve assignment.");
    }
  };

  if (isLoading) return <p>Loading assignment details...</p>;
  if (isError)
    return (
      <p className="text-red-500">
        This assignment link is invalid or has been expired.
      </p>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">Approve User Assignment</CardTitle>
          <CardDescription>
            Review the new user and assign them a role and a store.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assign Role</Label>
              <Select onValueChange={setRole} defaultValue="staff">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white ">
                  <SelectItem value="staff" className="hover:cursor-pointer">
                    Staff
                  </SelectItem>
                  <SelectItem value="manager" className="hover:cursor-pointer">
                    Store Manager
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assign to Store</Label>
              <Select onValueChange={setAssignedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a store..." />
                </SelectTrigger>
                <SelectContent className="bg-white hover:cursor-pointer">
                  {stores?.map((store) => (
                    <SelectItem key={store._id} value={store._id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isApproving}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-800"
          >
            {isApproving ? "Approving..." : "Approve & Assign User"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
