import { apiSlice } from '../api/apiSlice';

export const restockApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRestockRequests: builder.query({
            query: () => '/api/restock-requests',
            providesTags: ['RestockRequest'],
        }),
        createRestockRequest: builder.mutation({
            query: (requestData) => ({
                url: '/api/restock-requests',
                method: 'POST',
                body: requestData,
            }),
            invalidatesTags: ['RestockRequest'],
        }),
        updateRestockRequest: builder.mutation({
            query: ({ requestId, status }) => ({
                url: `/api/restock-requests/${requestId}`,
                method: 'PUT',
                body: { status },
            }),
           
            // and also invalidate the general Inventory and Sale tags as stock levels have changed.
            invalidatesTags: ['RestockRequest', 'Inventory', 'Sale'],
        }),
    }),
});

export const {
    useGetRestockRequestsQuery,
    useCreateRestockRequestMutation,
    useUpdateRestockRequestMutation,
} = restockApiSlice;
