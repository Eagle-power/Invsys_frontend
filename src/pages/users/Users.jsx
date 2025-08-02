import { useGetUsersQuery } from "@/features/users/usersApiSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserActions from "./UserActions";

export default function Users() {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  let content;
  if (isLoading) {
    content = <p className="text-center">Loading users...</p>;
  } else if (isError) {
    content = (
      <p className="text-red-500">
        Error: {error?.data?.message || error.error}
      </p>
    );
  } else if (isSuccess) {
    content = (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned Store</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.assignedStore?.name || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <UserActions user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-gray-600">
          Manage all users, roles, and store assignments.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>
    </div>
  );
}
