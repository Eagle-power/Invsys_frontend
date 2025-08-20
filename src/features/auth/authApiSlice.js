import { apiSlice } from '../api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/api/users/register',
        method: 'POST',
        body: userData,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: '/api/users/verify-email',
        method: 'POST',
        body: data,
      }),
    }),
    requestAssignment: builder.mutation({
      query: () => ({
        url: '/api/users/request-assignment',
        method: 'POST',
      }),
    }),
    getAssignmentDetails: builder.query({
      query: (token) => `/api/users/assignment/${token}`,
    }),
    approveAssignment: builder.mutation({
      query: ({ userId, role, assignedStore }) => ({
        url: `/api/users/approve-assignment/${userId}`,
        method: 'PUT',
        body: { role, assignedStore },
      }),
    }),
    getMe: builder.query({
      query: () => '/api/users/me',
      providesTags: ['User'], // This query provides the 'User' tag
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useRequestAssignmentMutation,
  useGetAssignmentDetailsQuery,
  useApproveAssignmentMutation,
  useGetMeQuery,

} = authApiSlice;