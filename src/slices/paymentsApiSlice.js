import { apiSlice } from './apiSlice.js';

const PAYMENTS_URL = '/api/payments';

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initiateDahebiaPayment: builder.mutation({
      query: (data) => ({
        url: `${PAYMENTS_URL}/dahabia/init`,
        method: 'POST',
        body: data,
      }),
    }),
    verifyDahebiaPayment: builder.mutation({
      query: (data) => ({
        url: `${PAYMENTS_URL}/dahabia/verify`,
        method: 'POST',
        body: data,
      }),
    }),
    getDahebiaPaymentStatus: builder.query({
      query: (reference) => `${PAYMENTS_URL}/dahabia/${reference}`,
    }),
  }),
});

export const {
  useInitiateDahebiaPaymentMutation,
  useVerifyDahebiaPaymentMutation,
  useGetDahebiaPaymentStatusQuery,
} = paymentsApiSlice;
