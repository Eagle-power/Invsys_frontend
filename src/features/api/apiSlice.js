import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  credentials : 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// console.log('Base URL:', import.meta.env.VITE_API_BASE_URL);


export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ['User', 'Product', 'Store', 'Inventory', 'Sale'],
  endpoints: (builder) => ({}),
});
