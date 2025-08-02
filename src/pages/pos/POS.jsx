// import { useState, useMemo } from "react";
// import { useGetPosProductsQuery } from "@/features/products/productsApiSlice";
// import { useCreateSaleMutation } from "@/features/sales/salesApiSlice";
// import { useGetPosCustomersQuery } from "@/features/customers/customersApiSlice";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "@/features/auth/authSlice";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   useCreateRazorpayOrderMutation,
//   useVerifyPaymentMutation,
// } from "@/features/payments/paymentApiSlice";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import AddNewCustomerForm from "./AddNewCustomerForm";
// import { toast } from "sonner";
// import {
//   Search,
//   Plus,
//   Minus,
//   ShoppingCart,
//   XCircle,
//   ChevronsUpDown,
//   Check,
//   UserPlus,
// } from "lucide-react";
// import { Label } from "@/components/ui/label";

// export default function POS() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [cart, setCart] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [openCombobox, setOpenCombobox] = useState(false);
//   const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

//   const [createRazorpayOrder, { isLoading: isCreatingOrder }] =
//     useCreateRazorpayOrderMutation();
//   const [verifyPayment, { isLoading: isVerifyingPayment }] =
//     useVerifyPaymentMutation();

//   const user = useSelector(selectCurrentUser);
//   const {
//     data: products,
//     isLoading: isLoadingProducts,
//     isError,
//   } = useGetPosProductsQuery();
//   const { data: customers, isLoading: isLoadingCustomers } =
//     useGetPosCustomersQuery();
//   const [createSale, { isLoading: isCreatingSale }] = useCreateSaleMutation();

//   const filteredProducts = useMemo(() => {
//     if (!products) return [];
//     return products.filter(
//       (product) =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [products, searchTerm]);

//   const addToCart = (product) => {
//     setCart((prevCart) => {
//       const existingItem = prevCart.find((item) => item._id === product._id);
//       if (existingItem) {
//         return prevCart.map((item) =>
//           item._id === product._id ? { ...item, qty: item.qty + 1 } : item
//         );
//       }
//       return [...prevCart, { ...product, qty: 1 }];
//     });
//   };

//   const updateQuantity = (productId, amount) => {
//     setCart((prevCart) => {
//       return prevCart
//         .map((item) =>
//           item._id === productId ? { ...item, qty: item.qty + amount } : item
//         )
//         .filter((item) => item.qty > 0);
//     });
//   };

//   const totalAmount = useMemo(() => {
//     return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//   }, [cart]);

//   // const handleCompleteSale = async () => {
//   //   if (cart.length === 0) {
//   //     toast.error("Cart is empty.");
//   //     return;
//   //   }
//   //   if (!selectedCustomer) {
//   //     toast.error("A customer must be selected to complete the sale.");
//   //     return;
//   //   }
//   //   if (!user?.assignedStore) {
//   //     toast.error("You are not assigned to a store. Please contact an admin.");
//   //     return;
//   //   }
//   //   const saleData = {
//   //     storeId: user.assignedStore,
//   //     customerId: selectedCustomer._id,
//   //     items: cart.map((item) => ({ productId: item._id, quantity: item.qty })),
//   //   };
//   //   try {
//   //     await createSale(saleData).unwrap();
//   //     toast.success("Sale completed successfully!");
//   //     setCart([]);
//   //     setSelectedCustomer(null);
//   //   } catch (err) {
//   //     toast.error(err?.data?.message || "Failed to complete sale.");
//   //   }
//   // };

//   const handleCompleteSale = async () => {
//     console.log("Razorpay Key ID:", import.meta.env.VITE_RAZORPAY_KEY_ID);

//     if (cart.length === 0 || !selectedCustomer || !user?.assignedStore) {
//       toast.error("Please add items to cart and select a customer.");
//       return;
//     }

//     try {
//       // 1. Create an order on Razorpay
//       const order = await createRazorpayOrder({ amount: totalAmount }).unwrap();

//       // 2. Configure Razorpay options
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Get this from your .env file or directly for testing
//         amount: order.amount,
//         currency: "INR",
//         name: "InvSys",
//         description: "Test Transaction",
//         order_id: order.id,
//         handler: async function (response) {
//           // 3. This function runs after a successful payment
//           const saleData = {
//             storeId: user.assignedStore._id,
//             customerId: selectedCustomer._id,
//             items: cart.map((item) => ({
//               productId: item._id,
//               quantity: item.qty,
//               name: item.name,
//               sku: item.sku,
//               price: item.price,
//             })),
//             totalAmount,
//           };

//           try {
//             await verifyPayment({
//               razorpayOrderId: response.razorpay_order_id,
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpaySignature: response.razorpay_signature,
//               saleData,
//             }).unwrap();

//             toast.success("Payment successful & Sale recorded!");
//             setCart([]);
//             setSelectedCustomer(null);
//           } catch (verifyErr) {
//             toast.error(
//               verifyErr.data?.message || "Payment verification failed."
//             );
//           }
//         },
//         prefill: {
//           name: selectedCustomer.name,
//           email: selectedCustomer.email,
//           contact: selectedCustomer.phone,
//         },
//         theme: {
//           color: "#3366FF",
//         },
//       };

//       // 4. Open the Razorpay checkout modal
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to create payment order.");
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Point of Sale</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//         {/* Product Selection Column */}
//         <div className="lg:col-span-2">
//           <Card className="shadow-lg">
//             <CardHeader>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <Input
//                   placeholder="Search by product name or SKU..."
//                   className="pl-10"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <ScrollArea className="h-[60vh]">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {isLoadingProducts && <p>Loading products...</p>}
//                   {isError && (
//                     <p className="text-red-500">Could not load products.</p>
//                   )}
//                   {filteredProducts.map((product) => (
//                     <Card
//                       key={product._id}
//                       className="cursor-pointer hover:shadow-md transition-shadow"
//                       onClick={() => addToCart(product)}
//                     >
//                       <CardContent className="p-4 flex flex-col justify-between h-full">
//                         <p className="font-semibold text-sm">{product.name}</p>
//                         <p className="text-xs text-gray-500">
//                           SKU: {product.sku}
//                         </p>
//                         <p className="text-sm font-bold mt-2">
//                           ₹{product.price.toFixed(2)}
//                         </p>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </ScrollArea>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Cart Column */}
//         <div className="lg:col-span-1">
//           <Card className="shadow-lg sticky top-6">
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <ShoppingCart />
//                   Current Order
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => {
//                     setCart([]);
//                     setSelectedCustomer(null);
//                   }}
//                   className="h-8 w-8"
//                 >
//                   <XCircle className="h-5 w-5 text-gray-700 hover:h-7 hover:w-7 " />
//                 </Button>
//               </CardTitle>
//               <CardDescription className="font-bold">
//                 Store: {user.assignedStore?.name || "N/A"}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="mb-4">
//                 <Label className="font-semibold">Customer</Label>
//                 {selectedCustomer ? (
//                   <div className="flex items-center justify-between mt-2 p-2 border rounded-md">
//                     <p className="font-medium">{selectedCustomer.name}</p>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => setSelectedCustomer(null)}
//                       className="h-6 w-6"
//                     >
//                       <XCircle className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="flex gap-2 mt-2">
//                     <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           role="combobox"
//                           aria-expanded={openCombobox}
//                           className="w-full justify-between"
//                         >
//                           {isLoadingCustomers
//                             ? "Loading..."
//                             : "Select Customer..."}
//                           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-[300px]  bg-white">
//                         <Command>
//                           <CommandInput
//                             placeholder="Search customer..."
//                             className="mt-2"
//                           />
//                           <CommandList>
//                             <CommandEmpty>No customer found.</CommandEmpty>
//                             <CommandGroup>
//                               {customers?.map((customer) => (
//                                 <CommandItem
//                                   key={customer._id}
//                                   className="cursor-pointer"
//                                   value={customer.name}
//                                   onSelect={() => {
//                                     setSelectedCustomer(customer);
//                                     setOpenCombobox(false);
//                                   }}
//                                 >
//                                   <Check
//                                     className={`mr-2 h-4 w-4 ${
//                                       selectedCustomer?._id === customer._id
//                                         ? "opacity-100"
//                                         : "opacity-0"
//                                     }`}
//                                   />
//                                   {customer.name} ({customer.phone})
//                                 </CommandItem>
//                               ))}
//                             </CommandGroup>
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                     <Dialog
//                       open={isAddCustomerOpen}
//                       onOpenChange={setIsAddCustomerOpen}
//                     >
//                       <DialogTrigger asChild>
//                         <Button variant="outline" size="icon">
//                           <UserPlus className="h-4 w-4" />
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="sm:max-w-[425px] bg-white">
//                         <DialogHeader>
//                           <DialogTitle>Add New Customer</DialogTitle>
//                         </DialogHeader>
//                         <AddNewCustomerForm
//                           setOpen={setIsAddCustomerOpen}
//                           onCustomerCreated={setSelectedCustomer}
//                         />
//                       </DialogContent>
//                     </Dialog>
//                   </div>
//                 )}
//               </div>
//               <ScrollArea className="h-[35vh] pr-4 -mr-4">
//                 {cart.length === 0 ? (
//                   <p className="text-center text-gray-500 py-10">
//                     Cart is empty
//                   </p>
//                 ) : (
//                   <div className="space-y-4">
//                     {cart.map((item) => (
//                       <div
//                         key={item._id}
//                         className="flex items-center justify-between"
//                       >
//                         <div>
//                           <p className="font-semibold text-sm">{item.name}</p>
//                           <p className="text-xs text-gray-500">
//                             ₹{item.price.toFixed(2)}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-7 w-7"
//                             onClick={() => updateQuantity(item._id, -1)}
//                           >
//                             <Minus className="h-4 w-4" />
//                           </Button>
//                           <span className="font-bold w-4 text-center">
//                             {item.qty}
//                           </span>
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-7 w-7"
//                             onClick={() => updateQuantity(item._id, 1)}
//                           >
//                             <Plus className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </ScrollArea>
//               <div className="border-t mt-4 pt-4">
//                 <div className="flex justify-between font-bold text-lg mb-4">
//                   <p>Total</p>
//                   <p>₹{totalAmount.toFixed(2)}</p>
//                 </div>
//                 <Button
//                   className="w-full bg-green-600 hover:bg-green-700"
//                   onClick={handleCompleteSale}
//                   disabled={
//                     isCreatingSale || cart.length === 0 || !selectedCustomer
//                   }
//                 >
//                   {isCreatingSale ? "Processing..." : "Complete Sale"}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import { useGetPosProductsQuery } from "@/features/products/productsApiSlice";
import { useGetPosCustomersQuery } from "@/features/customers/customersApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} from "@/features/payments/paymentApiSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddNewCustomerForm from "./AddNewCustomerForm";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  XCircle,
  ChevronsUpDown,
  Check,
  UserPlus,
} from "lucide-react";
import { Label } from "@/components/ui/label";

export default function POS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const [createRazorpayOrder, { isLoading: isCreatingOrder }] =
    useCreateRazorpayOrderMutation();
  const [verifyPayment, { isLoading: isVerifyingPayment }] =
    useVerifyPaymentMutation();

  const user = useSelector(selectCurrentUser);
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError,
  } = useGetPosProductsQuery();
  const { data: customers, isLoading: isLoadingCustomers } =
    useGetPosCustomersQuery();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item._id === productId ? { ...item, qty: item.qty + amount } : item
        )
        .filter((item) => item.qty > 0);
    });
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const handleCompleteSale = async () => {
    console.log("razorpay_secret_id: ", import.meta.env.VITE_RAZORPAY_KEY_SECRET);

    console.log("razorpay_key_id : ", import.meta.env.VITE_RAZORPAY_KEY_ID);

    if (cart.length === 0 || !selectedCustomer || !user?.assignedStore) {
      toast.error("Please add items to cart and select a customer.");
      return;
    }

    try {
      const order = await createRazorpayOrder({ amount: totalAmount }).unwrap();

      const options = {
        // --- THE FIX ---
        // Access the environment variable correctly using import.meta.env
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        // --- END OF FIX ---
        amount: order.amount,
        currency: "INR",
        name: "InvSys",
        description: "Sale Transaction",
        order_id: order.id,
        handler: async function (response) {
          const saleData = {
            storeId: user.assignedStore._id,
            customerId: selectedCustomer._id,
            items: cart.map((item) => ({
              productId: item._id,
              quantity: item.qty,
              name: item.name,
              sku: item.sku,
              price: item.price,
            })),
            totalAmount,
          };

          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              saleData,
            }).unwrap();

            toast.success("Payment successful & Sale recorded!");
            setCart([]);
            setSelectedCustomer(null);
          } catch (verifyErr) {
            toast.error(
              verifyErr.data?.message || "Payment verification failed."
            );
          }
        },
        prefill: {
          name: selectedCustomer.name,
          email: selectedCustomer.email,
          contact: selectedCustomer.phone,
        },
        theme: {
          color: "#3366FF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create payment order.");
    }
  };

  const isLoading = isCreatingOrder || isVerifyingPayment;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Point of Sale</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Product Selection Column */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by product name or SKU..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {isLoadingProducts && <p>Loading products...</p>}
                  {isError && (
                    <p className="text-red-500">Could not load products.</p>
                  )}
                  {filteredProducts.map((product) => (
                    <Card
                      key={product._id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToCart(product)}
                    >
                      <CardContent className="p-4 flex flex-col justify-between h-full">
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          SKU: {product.sku}
                        </p>
                        <p className="text-sm font-bold mt-2">
                          ₹{product.price.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Cart Column */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart />
                  Current Order
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCart([]);
                    setSelectedCustomer(null);
                  }}
                  className="h-8 w-8"
                >
                  <XCircle className="h-5 w-5 text-gray-700 hover:h-7 hover:w-7 " />
                </Button>
              </CardTitle>
              <CardDescription className="font-bold">
                Store: {user.assignedStore?.name || "N/A"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label className="font-semibold">Customer</Label>
                {selectedCustomer ? (
                  <div className="flex items-center justify-between mt-2 p-2 border rounded-md">
                    <p className="font-medium">{selectedCustomer.name}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCustomer(null)}
                      className="h-6 w-6"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCombobox}
                          className="w-full justify-between"
                        >
                          {isLoadingCustomers
                            ? "Loading..."
                            : "Select Customer..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px]  bg-white">
                        <Command>
                          <CommandInput
                            placeholder="Search customer..."
                            className="mt-2"
                          />
                          <CommandList>
                            <CommandEmpty>No customer found.</CommandEmpty>
                            <CommandGroup>
                              {customers?.map((customer) => (
                                <CommandItem
                                  key={customer._id}
                                  className="cursor-pointer"
                                  value={customer.name}
                                  onSelect={() => {
                                    setSelectedCustomer(customer);
                                    setOpenCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      selectedCustomer?._id === customer._id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                  {customer.name} ({customer.phone})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Dialog
                      open={isAddCustomerOpen}
                      onOpenChange={setIsAddCustomerOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-white">
                        <DialogHeader>
                          <DialogTitle>Add New Customer</DialogTitle>
                        </DialogHeader>
                        <AddNewCustomerForm
                          setOpen={setIsAddCustomerOpen}
                          onCustomerCreated={setSelectedCustomer}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
              <ScrollArea className="h-[35vh] pr-4 -mr-4">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">
                    Cart is empty
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item._id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-bold w-4 text-center">
                            {item.qty}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item._id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <p>Total</p>
                  <p>₹{totalAmount.toFixed(2)}</p>
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleCompleteSale}
                  disabled={isLoading || cart.length === 0 || !selectedCustomer}
                >
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
