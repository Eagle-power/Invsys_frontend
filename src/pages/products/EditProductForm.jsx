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
// import { useUpdateProductMutation } from "@/features/products/productsApiSlice";
// import { useGetCategoriesQuery } from "@/features/categories/categoriesApiSlice";
// import { useGetSuppliersQuery } from "@/features/suppliers/suppliersApiSlice";
// import { toast } from "sonner";

// export default function EditProductForm({ product, setOpen }) {
//   const [formData, setFormData] = useState({
//     name: product.name,
//     sku: product.sku,
//     description: product.description,
//     category: product.category?._id || "", // Handle initial data
//     price: product.price,
//   });

//   const { data: categories, isLoading: isLoadingCategories } =
//     useGetCategoriesQuery();
//   const [updateProduct, { isLoading }] = useUpdateProductMutation();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleCategoryChange = (value) => {
//     setFormData({ ...formData, category: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updateProduct({ productId: product._id, data: formData }).unwrap();
//       toast.success("Product updated successfully!");
//       setOpen(false);
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to update product");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="grid gap-4 py-4">
//         {/* Name, SKU, Description, Price fields are similar to create form */}
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
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="category" className="text-right">
//             Category
//           </Label>
//           <Select
//             onValueChange={handleCategoryChange}
//             defaultValue={formData.category}
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
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="description" className="text-right">
//             Description
//           </Label>
//           <Input
//             id="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="col-span-3"
//             required
//           />
//         </div>
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="supplier" className="text-right">
//             Supplier
//           </Label>
//           <Select
//             onValueChange={(value) => handleSelectChange("supplier", value)}
//             defaultValue={formData.supplier}
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
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? "Saving Changes..." : "Save Changes"}
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
import { useUpdateProductMutation } from "@/features/products/productsApiSlice";
import { useGetCategoriesQuery } from "@/features/categories/categoriesApiSlice";
import { useGetSuppliersQuery } from "@/features/suppliers/suppliersApiSlice";
import { useGenerateDescriptionMutation } from "@/features/gemini/geminiApiSlice"; // Import Gemini hook
import { toast } from "sonner";

export default function EditProductForm({ product, setOpen }) {
  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    description: product.description,
    category: product.category?._id || "",
    supplier: product.supplier?._id || "",
    price: product.price,
  });

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const { data: suppliers, isLoading: isLoadingSuppliers } =
    useGetSuppliersQuery();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [generateDescription, { isLoading: isGenerating }] =
    useGenerateDescriptionMutation(); // Use Gemini hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleGenerateDesc = async () => {
    const selectedCategory = categories?.find(
      (c) => c._id === formData.category
    );
    if (!formData.name || !selectedCategory) {
      toast.error(
        "Please ensure Product Name is filled and a Category is selected."
      );
      return;
    }
    try {
      const result = await generateDescription({
        productName: formData.name,
        category: selectedCategory.name,
      }).unwrap();
      setFormData({ ...formData, description: result.description });
      toast.success("Description generated!");
    } catch (err) {
      toast.error("AI generation failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ productId: product._id, data: formData }).unwrap();
      toast.success("Product updated successfully!");
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product");
    }
  };

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
            defaultValue={formData.category}
            disabled={isLoadingCategories}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                ?.filter((cat) => cat.isActive)
                .map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
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
            defaultValue={formData.supplier}
            disabled={isLoadingSuppliers}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers?.map((sup) => (
                <SelectItem key={sup._id} value={sup._id}>
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-start gap-4 pt-2">
          <div className="flex flex-col items-end gap-1">
            <Label htmlFor="description" className="text-right">
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
            className="col-span-3 h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
