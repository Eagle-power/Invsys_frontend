import { apiSlice } from '../api/apiSlice';

export const customersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosCustomers: builder.query({
            query: () => '/api/customers/pos',
            providesTags: ['Customer'],
        }),
        getCustomers: builder.query({
            query: () => '/api/customers',
            providesTags: (result = [], error, arg) => [
                'Customer',
                ...result.map(({ _id }) => ({ type: 'Customer', id: _id })),
            ],
        }),
        createCustomer: builder.mutation({
            query: (newCustomer) => ({
                url: '/api/customers',
                method: 'POST',
                body: newCustomer,
            }),
            invalidatesTags: ['Customer'],
        }),
        updateCustomer: builder.mutation({
            query: ({ customerId, data }) => ({
                url: `/api/customers/${customerId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Customer', id: arg.customerId }],
        }),
        deleteCustomer: builder.mutation({
            query: (customerId) => ({
                url: `/api/customers/${customerId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Customer'],
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useGetPosCustomersQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customersApiSlice;