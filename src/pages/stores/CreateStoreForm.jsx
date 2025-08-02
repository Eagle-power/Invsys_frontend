import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateStoreMutation } from '@/features/stores/storesApiSlice';
import { toast } from 'sonner';

export default function CreateStoreForm({ setOpen }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const [createStore, { isLoading }] = useCreateStoreMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStore({ name, location }).unwrap();
      toast.success('Store created successfully!');
      setOpen(false); // Close the dialog on success
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create store');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
      </div>
      <div className="flex justify-end mt-4 ">
        <Button type="submit" disabled={isLoading} className="bg-blue-600">
          {isLoading ? 'Saving...' : 'Save Store'}
        </Button>
      </div>
    </form>
  );
}
