import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiSlice } from "../features/api/apiSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useRequestAssignmentMutation,
  useGetMeQuery,
} from "@/features/auth/authApiSlice";
import { setCredentials } from "@/features/auth/authSlice";
import { Loader2 } from "lucide-react";

export default function PendingApproval() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use the getMe query with a polling interval of 10 seconds (10000 ms)
  const { data: user, isLoading: isUserLoading } = useGetMeQuery(undefined, {
    pollingInterval: 10000,
  });

  const [requestAssignment, { isLoading: isRequesting }] =
    useRequestAssignmentMutation();

  // This effect checks the user's status every time the polling returns new data
  useEffect(() => {
    if (user) {
      // If the status is now 'Active', update the credentials in Redux and navigate
      if (user.status === "Active") {
        toast.success("Your account has been approved! Redirecting...");
        dispatch(
          setCredentials({
            userInfo: user,
            token: localStorage.getItem("token"),
          })
        );
        navigate("/dashboard");
      }
    }
  }, [user, dispatch, navigate]);
  // --- END OF NEW LOGIC ---

  const handleRequest = async () => {
    try {
      // The unwrap() method will throw an error if the request fails,
      // but it will return the successful payload if it succeeds.
      const result = await requestAssignment().unwrap();

      // THE FIX: Check for the new flag from the backend.
      if (result.isAlreadyActive) {
        toast.info("Your account is already active. Redirecting...");
        // Manually trigger a refresh of the user's data to get the latest status
        dispatch(apiSlice.util.invalidateTags(["User"]));
      } else {
        toast.success("Your request has been sent to the admin for approval.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send request.");
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading user status...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Account Pending Approval</CardTitle>
          <CardDescription>
            Your account has been created, but an admin needs to assign you to a
            store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 mb-6 text-yellow-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="font-semibold">Checking for approval status...</p>
          </div>
          <p className="mb-6 text-sm text-gray-600">
            If you haven't already, you can send a request to the administrator.
            We will automatically redirect you once your account is approved.
          </p>
          <Button
            onClick={handleRequest}
            disabled={isRequesting}
            className="bg-gradient-to-r from-blue-600 to-violet-700"
          >
            {isRequesting ? "Sending..." : "Send Assignment Request"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
