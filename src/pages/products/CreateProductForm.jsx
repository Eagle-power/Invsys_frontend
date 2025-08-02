// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useCreateProductMutation } from "@/features/products/productsApiSlice";
// import { useGetCategoriesQuery } from "@/features/categories/categoriesApiSlice"; // Import categories hook
// import { useGetSuppliersQuery } from "@/features/suppliers/suppliersApiSlice";
// import { useGenerateDescriptionMutation } from "@/features/gemini/geminiApiSlice";
// import { toast } from "sonner";

// export default function CreateProductForm({ setOpen }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     sku: "",
//     description: "",
//     category: "",
//     price: "",
//   });

//   const { data: categories, isLoading: isLoadingCategories } =
//     useGetCategoriesQuery();
//   const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
//   const [generateDescription, { isLoading: isGenerating }] =
//     useGenerateDescriptionMutation();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleCategoryChange = (value) => {
//     setFormData({ ...formData, category: value });
//   };

//   const handleGenerateDesc = async () => {
//     const selectedCategory = categories?.find(
//       (c) => c._id === formData.category
//     );
//     if (!formData.name || !selectedCategory) {
//       toast.error("Please enter a Product Name and select a Category first.");
//       return;
//     }
//     try {
//       const result = await generateDescription({
//         productName: formData.name,
//         category: selectedCategory.name,
//       }).unwrap();
//       setFormData({ ...formData, description: result.description });
//       toast.success("Description generated!");
//     } catch (err) {
//       toast.error("AI generation failed. Please try again.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createProduct(formData).unwrap();
//       toast.success("Product created successfully!");
//       setOpen(false);
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to create product");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="grid gap-4 py-4">
//         {/* Name and SKU fields remain the same */}
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="name" className="text-right">
//             Name
//           </Label>
//           <Input
//             id="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="col-span-3"
//             required
//           />
//         </div>
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="sku" className="text-right">
//             SKU
//           </Label>
//           <Input
//             id="sku"
//             value={formData.sku}
//             onChange={handleChange}
//             className="col-span-3"
//             required
//           />
//         </div>

//         {/* Category Dropdown */}
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="category" className="text-right">
//             Category
//           </Label>
//           <Select
//             onValueChange={handleCategoryChange}
//             value={formData.category}
//             disabled={isLoadingCategories}
//           >
//             <SelectTrigger className="col-span-3">
//               <SelectValue
//                 placeholder={
//                   isLoadingCategories ? "Loading..." : "Select a category"
//                 }
//               />
//             </SelectTrigger>
//             <SelectContent>
//               {categories
//                 ?.filter((cat) => cat.isActive)
//                 .map((cat) => (
//                   <SelectItem key={cat._id} value={cat._id}>
//                     {cat.name}
//                   </SelectItem>
//                 ))}
//             </SelectContent>
//           </Select>
//         </div>
//         {/* Supplier  Dropdown */}
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="supplier" className="text-right">
//             Supplier
//           </Label>
//           <Select
//             onValueChange={(value) => handleSelectChange("supplier", value)}
//             value={formData.supplier}
//             disabled={isLoadingSuppliers}
//           >
//             <SelectTrigger className="col-span-3">
//               <SelectValue placeholder="Select a supplier" />
//             </SelectTrigger>
//             <SelectContent>
//               {suppliers?.map((sup) => (
//                 <SelectItem key={sup._id} value={sup._id}>
//                   {sup.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Description with AI button */}
//         <div className="grid grid-cols-4 items-start gap-4 pt-2">
//           <div className="flex flex-col items-end gap-1">
//             <Label htmlFor="description" className="text-right">
//               Description
//             </Label>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={handleGenerateDesc}
//               disabled={isGenerating}
//             >
//               {isGenerating ? "..." : "✨ AI"}
//             </Button>
//           </div>
//           <textarea
//             id="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="col-span-3 h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//             required
//           />
//         </div>

//         {/* Price field remains the same */}
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="price" className="text-right">
//             Price
//           </Label>
//           <Input
//             id="price"
//             type="number"
//             value={formData.price}
//             onChange={handleChange}
//             className="col-span-3"
//             required
//           />
//         </div>
//       </div>
//       <div className="flex justify-end">
//         <Button
//           className="bg-gradient-to-r from-blue-600 to-violet-600"
//           type="submit"
//           disabled={isCreating}
//         >
//           {isCreating ? "Saving..." : "Save Product"}
//         </Button>
//       </div>
//     </form>
//   );
// }
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateProductMutation } from "@/features/products/productsApiSlice";
import { useGetCategoriesQuery } from "@/features/categories/categoriesApiSlice";
import { useGetSuppliersQuery } from "@/features/suppliers/suppliersApiSlice";
import { useGenerateDescriptionMutation } from "@/features/gemini/geminiApiSlice";
import { toast } from "sonner";

export default function CreateProductForm({ setOpen }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    supplier: "",
    price: "",
  });

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const { data: suppliers, isLoading: isLoadingSuppliers } =
    useGetSuppliersQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [generateDescription, { isLoading: isGenerating }] =
    useGenerateDescriptionMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateDesc = async () => {
    const selectedCategory = categories?.find(
      (c) => c._id === formData.category
    );
    if (!formData.name || !selectedCategory) {
      toast.error("Please enter a Product Name and select a Category first.");
      return;
    }
    try {
      const result = await generateDescription({
        productName: formData.name,
        category: selectedCategory.name,
      }).unwrap();
      setFormData((prev) => ({ ...prev, description: result.description }));
      toast.success("Description generated!");
    } catch (err) {
      toast.error("AI generation failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.supplier) {
      toast.error("Please select both a category and a supplier.");
      return;
    }
    try {
      await createProduct(formData).unwrap();
      toast.success("Product created successfully!");
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create product");
    }
  };

  const isFormInvalid = !formData.category || !formData.supplier;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sku" className="text-right">
            SKU
          </Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <Select
            onValueChange={(value) => handleSelectChange("category", value)}
            value={formData.category}
            className="bg-white"
            disabled={isLoadingCategories}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue
                placeholder={
                  isLoadingCategories ? "Loading..." : "Select a category"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {categories
                ?.filter((cat) => cat.isActive)
                .map((cat) => (
                  <SelectItem key={cat._id} value={cat._id} className="bg-white cursor-pointer" >
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="supplier" className="text-right">
            Supplier
          </Label>
          <Select
            onValueChange={(value) => handleSelectChange("supplier", value)}
            value={formData.supplier}
            className="bg-white"
            disabled={isLoadingSuppliers}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers?.map((sup) => (
                <SelectItem key={sup._id} value={sup._id} className="bg-white cursor-pointer">
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-start gap-4 pt-2">
          <div className="flex flex-col items-end gap-1">
            <Label htmlFor="description" className="text-right pt-1">
              Description
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateDesc}
              disabled={isGenerating}
            >
              {isGenerating ? "..." : "✨ AI"}
            </Button>
          </div>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="col-span-3 h-24"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isCreating || isFormInvalid}
          className="bg-gradient-to-r from-blue-600 to-violet-600"
        >
          {isCreating ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
