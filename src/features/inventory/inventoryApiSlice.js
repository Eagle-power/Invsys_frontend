import { apiSlice } from '../api/apiSlice';

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreInventory: builder.query({
      query: (storeId) => `/api/inventory/${storeId}`,
      
      providesTags: (result, error, storeId) => [
        { type: 'Inventory', id: storeId },
      ],
    }),
    updateStock: builder.mutation({
      query: (data) => ({
        url: '/api/inventory',
        method: 'POST',
        body: data,
      }),
      
      invalidatesTags: (result, error, arg) => [
        { type: 'Inventory', id: arg.storeId },
      ],
    }),
  }),
});

//lazy query hook for on-demand fetching
export const { useLazyGetStoreInventoryQuery, useUpdateStockMutation } = inventoryApiSlice;
