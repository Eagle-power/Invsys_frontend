import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateStoreMutation } from '@/features/stores/storesApiSlice';
import { toast } from 'sonner';

export default function EditStoreForm({ store, setOpen }) {
  const [name, setName] = useState(store.name);
  const [location, setLocation] = useState(store.location);
  const [updateStore, { isLoading }] = useUpdateStoreMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStore({ storeId: store._id, data: { name, location } }).unwrap();
      toast.success('Store updated successfully!');
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update store');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name-edit" className="text-right">Name</Label>
          <Input id="name-edit" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location-edit" className="text-right">Location</Label>
          <Input id="location-edit" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" required />
        </div>
      </div>
      <div className="flex justify-end ">
        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-violet-600">
          {isLoading ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}