import { apiSlice } from '../api/apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/api/users',
      providesTags: (result = [], error, arg) => [
        'User',
        ...result.map(({ _id }) => ({ type: 'User', id: _id })),
      ],
    }),
    updateUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/api/users/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User', 'Store'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Store'],
    }),
    updateUserProfile: builder.mutation({
      query: (formData) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: formData, // This will be FormData to handle the file upload
      }),
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: '/api/users/change-password',
        method: 'PUT',
        body: passwords,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
} = usersApiSlice;