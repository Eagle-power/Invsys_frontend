import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useVerifyEmailMutation } from "@/features/auth/authApiSlice";
import { setCredentials } from "@/features/auth/authSlice";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get the email from the state passed by the Register page
  const email = location.state?.email;

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/register");
      return;
    }
    try {
      const userData = await verifyEmail({ email, otp }).unwrap();
      dispatch(setCredentials({ userInfo: userData, token: userData.token }));
      navigate("/pending-approval");
    } catch (err) {
      toast.error(err?.data?.message || "Verification failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit OTP to {email}. Please enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                className="text-center text-lg tracking-[0.5em]"
                required
              />
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-violet-600 w-full "
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
    