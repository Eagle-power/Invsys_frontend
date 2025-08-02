import { apiSlice } from '../api/apiSlice';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/api/dashboard/stats',
      providesTags: ['Sale', 'Customer', 'Product'], // Refetch if these change
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApiSlice;
