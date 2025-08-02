import { apiSlice } from '../api/apiSlice';

export const salesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSalesHistory: builder.query({
            query: (storeId) => {
                const params = {};
                if (storeId) {
                    params.storeId = storeId;
                }
                return {
                    url: '/api/sales',
                    params,
                };
                
            },
            providesTags: ['Sale'],
        }),
        getSaleById: builder.query({
            query: (saleId) => `/api/sales/${saleId}`,
        }),
        createSale: builder.mutation({
            query: (saleData) => ({
                url: '/api/sales',
                method: 'POST',
                body: saleData,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Inventory', id: arg.storeId },
                'Sale', // Invalidate the general Sale tag to refetch the history list
            ],
        }),
    }),
});

export const {
    useGetSalesHistoryQuery,
    useLazyGetSaleByIdQuery, // We'll use a lazy query for the bill view
    useCreateSaleMutation,
} = salesApiSlice;
