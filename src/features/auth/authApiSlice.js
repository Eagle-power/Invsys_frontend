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
  }),
});

export const { 
  useLoginMutation,
  useRegisterMutation

} = authApiSlice;