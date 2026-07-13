import { apiSlice } from './apiSlice.js';

const COUPONS_URL = '/api/coupons';

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPONS_URL}/validate`,
        method: 'POST',
        body: data,
      }),
    }),
    getCouponByCode: builder.query({
      query: (code) => `${COUPONS_URL}/code/${code}`,
    }),
    getCoupons: builder.query({
      query: () => COUPONS_URL,
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: COUPONS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${COUPONS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${COUPONS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    applyCoupon: builder.mutation({
      query: (id) => ({
        url: `${COUPONS_URL}/${id}/apply`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetCouponByCodeQuery,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
} = couponsApiSlice;
