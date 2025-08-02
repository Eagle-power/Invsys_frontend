import { useState, useMemo } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} from "@/features/categories/categoriesApiSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import CategoryForm from "./CategoryForm";
import CategoryActions from "./CategoryActions";
import { toast } from "sonner";

// --- START OF MODIFIED CODE ---
const CategoryRow = ({ category, level = 0 }) => {
  return (
    <>
      <TableRow>
        <TableCell style={{ paddingLeft: `${level * 1.5 + 1}rem` }}>
          {level > 0 && <span className="mr-2 text-gray-400">↳</span>}
          <span className="font-medium">{category.name}</span>
        </TableCell>
        {/* New Description Cell */}
        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
          {category.description}
        </TableCell>
        <TableCell>{category.parentCategory?.name || "N/A"}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              category.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {category.isActive ? "Active" : "Inactive"}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <CategoryActions category={category} />
        </TableCell>
      </TableRow>

      {category.children &&
        category.children.map((child) => (
          <CategoryRow key={child._id} category={child} level={level + 1} />
        ))}
    </>
  );
};
// --- END OF MODIFIED CODE ---

const buildCategoryTree = (categories) => {
  const map = {};
  const roots = [];

  categories.forEach((cat) => {
    map[cat._id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    if (cat.parentCategory) {
      map[cat.parentCategory._id]?.children.push(map[cat._id]);
    } else {
      roots.push(map[cat._id]);
    }
  });

  return roots;
};

export default function Categories() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const categoryTree = useMemo(() => {
    return categories ? buildCategoryTree(categories) : [];
  }, [categories]);

  const handleCreate = async (formData) => {
    try {
      await createCategory(formData).unwrap();
      toast.success("Category created successfully!");
      setIsCreateDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  let content;
  if (isLoading) {
    content = <p>Loading categories...</p>;
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
              {/* New Description Header */}
              <TableHead>Description</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryTree.map((cat) => (
              <CategoryRow key={cat._id} category={cat} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-gray-600">
            Organize your products into hierarchical categories.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-violet-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSubmit={handleCreate} isLoading={isCreating} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>
    </div>
  );
}