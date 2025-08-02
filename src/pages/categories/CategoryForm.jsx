import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoriesQuery } from "@/features/categories/categoriesApiSlice";
import { useGenerateCategoryDescriptionMutation } from "@/features/gemini/geminiApiSlice"; // Import new hook
import { toast } from "sonner";

export default function CategoryForm({
  onSubmit,
  initialData = {},
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    parentCategory: initialData.parentCategory?._id || "",
    isActive: initialData.isActive !== undefined ? initialData.isActive : true,
  });

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const [generateCategoryDescription, { isLoading: isGenerating }] =
    useGenerateCategoryDescriptionMutation();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, parentCategory: value }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleGenerateDesc = async () => {
    if (!formData.name) {
      toast.error("Please enter a Category Name first.");
      return;
    }
    try {
      const result = await generateCategoryDescription({
        categoryName: formData.name,
      }).unwrap();
      setFormData({ ...formData, description: result.description });
      toast.success("Description generated!");
    } catch (err) {
      toast.error("AI generation failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const parentCategoryOptions = categories?.filter(
    (cat) => cat._id !== initialData._id
  );

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
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">
            Description
          </Label>
          <div className="col-span-3 flex flex-col gap-2">
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateDesc}
              disabled={isGenerating}
              className="self-start"
            >
              {isGenerating ? "Generating..." : "✨ Generate with AI"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="parentCategory" className="text-right">
            Parent Category
          </Label>
          <Select
            onValueChange={handleSelectChange}
            defaultValue={formData.parentCategory}
            disabled={isLoadingCategories}
            
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a parent (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-white " >
              {parentCategoryOptions?.map((cat) => (
                <SelectItem key={cat._id} placeholder="select Category" className="hover:cursor-pointer">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isActive" className="text-right">
            Status
          </Label>
          <div className="col-span-3 flex items-center gap-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <span className="text-sm text-gray-600">
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-blue-600  to-violet-600" type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Category"}
        </Button>
      </div>
    </form>
  );
}
