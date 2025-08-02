import { apiSlice } from '../api/apiSlice';

export const storesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query({
      query: () => '/api/stores',
      providesTags: (result = [], error, arg) => [
        'Store',
        ...result.map(({ _id }) => ({ type: 'Store', id: _id })),
      ],
    }),
    createStore: builder.mutation({
      query: (newStore) => ({
        url: '/api/stores',
        method: 'POST',
        body: newStore,
      }),
      // When a store is created, invalidate the general 'Store' tag to refetch the whole list.
      invalidatesTags: ['Store'],
    }),
    updateStore: builder.mutation({
      query: ({ storeId, data }) => ({
        url: `/api/stores/${storeId}`,
        method: 'PUT',
        body: data,
      }),
      // When a store is updated, only invalidate the cache for that specific store.
      invalidatesTags: (result, error, arg) => [{ type: 'Store', id: arg.storeId }],
    }),
    deleteStore: builder.mutation({
      query: (storeId) => ({
        url: `/api/stores/${storeId}`,
        method: 'DELETE',
      }),
      // When a store is deleted, invalidate the general 'Store' tag to refetch the list.
      invalidatesTags: ['Store'],
    }),
  }),
});

// Export the new hooks
export const {
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storesApiSlice;