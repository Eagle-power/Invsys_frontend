import { apiSlice } from '../api/apiSlice';

export const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createRazorpayOrder: builder.mutation({
            query: ({ amount }) => ({
                url: '/api/payments/orders',
                method: 'POST',
                body: { amount },
            }),
        }),
        verifyPayment: builder.mutation({
            query: (data) => ({
                url: '/api/payments/verify',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Inventory', id: arg.saleData.storeId },
                'Sale',
            ],
        }),
    }),
});

export const { useCreateRazorpayOrderMutation, useVerifyPaymentMutation } = paymentApiSlice;