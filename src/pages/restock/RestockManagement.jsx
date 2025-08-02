// import {
//   useGetRestockRequestsQuery,
//   useUpdateRestockRequestMutation,
// } from "@/features/restock/restockApiSlice";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { toast } from "sonner";

// export default function RestockManagement() {
//   const {
//     data: requests,
//     isLoading,
//     isSuccess,
//     isError,
//     error,
//   } = useGetRestockRequestsQuery();
//   const [updateRequest, { isLoading: isUpdating }] =
//     useUpdateRestockRequestMutation();

//   const handleUpdateRequest = async (requestId, status, storeId) => {
//     try {
//       await updateRequest({ requestId, status, storeId }).unwrap();
//       toast.success(`Request has been ${status.toLowerCase()}.`);
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to update request.");
//     }
//   };

//   let content;
//   if (isLoading) {
//     content = <p>Loading requests...</p>;
//   } else if (isError) {
//     content = (
//       <p className="text-red-500">
//         Error: {error?.data?.message || error.error}
//       </p>
//     );
//   } else if (isSuccess && requests.length > 0) {
//     content = (
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Product</TableHead>
//             <TableHead>Store</TableHead>
//             <TableHead>Qty Requested</TableHead>
//             <TableHead>Requested By</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {requests.map((req) => (
//             <TableRow key={req._id}>
//               <TableCell className="font-medium">
//                 {req.product.name} ({req.product.sku})
//               </TableCell>
//               <TableCell>{req.store.name}</TableCell>
//               <TableCell>{req.quantityRequested}</TableCell>
//               <TableCell>{req.requestedBy.name}</TableCell>
//               <TableCell>
//                 <span
//                   className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                     req.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : req.status === "Approved"
//                       ? "bg-green-100 text-green-800"
//                       : "bg-red-100 text-red-800"
//                   }`}
//                 >
//                   {req.status}
//                 </span>
//               </TableCell>
//               <TableCell className="text-right">
//                 {req.status === "Pending" && (
//                   <div className="flex gap-2 justify-end">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="text-green-600 border-green-600 hover:bg-green-50"
//                       onClick={() =>
//                         handleUpdateRequest(req._id, "Approved", req.store._id)
//                       }
//                       disabled={isUpdating}
//                     >
//                       Approve
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="text-red-600 border-red-600 hover:bg-red-50"
//                       onClick={() =>
//                         handleUpdateRequest(req._id, "Rejected", req.store._id)
//                       }
//                       disabled={isUpdating}
//                     >
//                       Reject
//                     </Button>
//                   </div>
//                 )}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     );
//   } else {
//     content = <p className="text-center py-10">No pending restock requests.</p>;
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-2">Restock Management</h1>
//       <p className="text-gray-600 mb-6">
//         Approve or reject restock requests from all stores.
//       </p>
//       <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>
//     </div>
//   );
// }

// path: src/pages/restock/RestockManagement.jsx

import {
  useGetRestockRequestsQuery,
  useUpdateRestockRequestMutation,
} from "@/features/restock/restockApiSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function RestockManagement() {
  const {
    data: requests,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetRestockRequestsQuery();
  const [updateRequest, { isLoading: isUpdating }] =
    useUpdateRestockRequestMutation();

  const handleUpdateRequest = async (requestId, status) => {
    try {
      // The storeId is not needed here anymore as the backend handles it
      await updateRequest({ requestId, status }).unwrap();
      toast.success(`Request has been ${status.toLowerCase()}.`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update request.");
    }
  };

  let content;

  if (isLoading) {
    content = <p className="text-center py-10">Loading requests...</p>;
  } else if (isError) {
    content = (
      <p className="text-red-500 text-center py-10">
        Error: {error?.data?.message || error.error}
      </p>
    );
  } else if (isSuccess && requests.length > 0) {
    content = (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Qty Requested</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req._id}>
                <TableCell className="font-medium">
                  {req.product.name} ({req.product.sku})
                </TableCell>
                <TableCell>{req.store.name}</TableCell>
                <TableCell>{req.quantityRequested}</TableCell>
                <TableCell>{req.requestedBy.name}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      req.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : req.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {req.status === "Pending" && (
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleUpdateRequest(req._id, "Approved")}
                        disabled={isUpdating}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleUpdateRequest(req._id, "Rejected")}
                        disabled={isUpdating}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  } else {
    content = <p className="text-center py-10">No pending restock requests.</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Restock Management</h1>
        <p className="text-gray-600">
          Approve or reject restock requests from all stores.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>
    </div>
  );
}
