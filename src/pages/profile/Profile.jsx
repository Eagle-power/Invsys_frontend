import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setCredentials } from "@/features/auth/authSlice";
import {
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
} from "@/features/users/usersApiSlice";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Pencil, Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const fileInputRef = useRef(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateUserProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  useEffect(() => {
    setName(user.name || "");
    setEmail(user.email || "");
    setBio(user.bio || "");
    setPreview(user.profilePictureUrl || "");
    setProfilePicture(null);
  }, [user, isEditMode]);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    if (isEditMode) {
      fileInputRef.current.click();
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("bio", bio);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const updatedUserData = await updateProfile(formData).unwrap();
      dispatch(
        setCredentials({
          userInfo: updatedUserData,
          token: localStorage.getItem("token"),
        })
      );
      toast.success("Profile updated successfully!");
      setIsEditMode(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">
            View and manage your personal details.
          </p>
        </div>
        {!isEditMode && (
          <Button
            className="bg-gradient-to-r from-blue-600 to-violet-600"
            onClick={() => setIsEditMode(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <Card className="border-2 border-gray-400">
        <CardContent className="pt-6">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="relative w-24 h-24">
              <Avatar className="h-24 w-24" onClick={handleAvatarClick}>
                <AvatarImage src={preview} alt={user.name} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditMode && (
                <div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full transition-opacity cursor-pointer hover:bg-black/60"
                  onClick={handleAvatarClick}
                >
                  <Pencil className="text-white" />
                </div>
              )}
              <Input
                id="picture"
                type="file"
                ref={fileInputRef}
                onChange={handlePictureChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself"
                disabled={!isEditMode}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={user.role}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label>Assigned Store</Label>
                <Input
                  value={user.assignedStore?.name || "N/A"}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            {isEditMode && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-400"  onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-violet-600" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>

          <Separator className="my-8" />
        </CardContent>
      </Card>

      <Card className="border-2 border-gray-400">
        <CardContent className="pt-6">
          <div>
            <h3 className="text-lg font-semibold">Change Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter your current and new password.
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute bottom-2 right-2 text-gray-500"
                  >
                    {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute bottom-2 right-2 text-gray-500"
                  >
                    {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute bottom-2 right-2 text-gray-500"
                  >
                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-gradient-to-r from-blue-600 to-violet-600"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
