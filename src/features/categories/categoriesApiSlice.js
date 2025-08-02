import { apiSlice } from '../api/apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/api/categories',
      providesTags: (result = [], error, arg) => [
        'Category',
        ...result.map(({ _id }) => ({ type: 'Category', id: _id })),
      ],
    }),
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: '/api/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, data }) => ({
        url: `/api/categories/${categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Category', id: arg.categoryId }],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/api/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
