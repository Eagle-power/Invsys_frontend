import { apiSlice } from '../api/apiSlice';

export const suppliersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => '/api/suppliers',
      providesTags: (result = [], error, arg) => [
        'Supplier',
        ...result.map(({ _id }) => ({ type: 'Supplier', id: _id })),
      ],
    }),
    createSupplier: builder.mutation({
      query: (newSupplier) => ({
        url: '/api/suppliers',
        method: 'POST',
        body: newSupplier,
      }),
      invalidatesTags: ['Supplier'],
    }),
    updateSupplier: builder.mutation({
      query: ({ supplierId, data }) => ({
        url: `/api/suppliers/${supplierId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Supplier', id: arg.supplierId }],
    }),
    deleteSupplier: builder.mutation({
      query: (supplierId) => ({
        url: `/api/suppliers/${supplierId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplier'],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApiSlice;