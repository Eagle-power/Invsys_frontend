import { apiSlice } from '../api/apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/api/products',
      providesTags: (result = [], error, arg) => [
        'Product',
        ...result.map(({ _id }) => ({ type: 'Product', id: _id })),
      ],
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/api/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `/api/products/${productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    getPosProducts: builder.query({
      query: () => '/api/products/pos',
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetPosProductsQuery
} = productsApiSlice;
