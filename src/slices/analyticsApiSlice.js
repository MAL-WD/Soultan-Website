import { apiSlice } from './apiSlice.js';

const ANALYTICS_URL = '/api/analytics';

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query({
      query: () => ANALYTICS_URL,
    }),
    getOrderAnalytics: builder.query({
      query: () => `${ANALYTICS_URL}/orders`,
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetOrderAnalyticsQuery,
} = analyticsApiSlice;
