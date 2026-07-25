import { apiSlice } from './apiSlice.js';

const BANNERS_URL = '/api/banners';

export const bannersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public: fetch active banners (announcement or promo images)
    getActiveBanners: builder.query({
      query: ({ type, placement } = {}) => ({
        url: `${BANNERS_URL}/active`,
        params: { type, placement },
      }),
      providesTags: ['Banner'],
      keepUnusedDataFor: 60,
    }),
    // Admin: fetch all banners
    getBanners: builder.query({
      query: ({ type } = {}) => ({
        url: BANNERS_URL,
        params: { type },
      }),
      providesTags: ['Banner'],
    }),
    // Admin: create
    createBanner: builder.mutation({
      query: (data) => ({
        url: BANNERS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Banner'],
    }),
    // Admin: update
    updateBanner: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BANNERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Banner'],
    }),
    // Admin: delete
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `${BANNERS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),
  }),
});

export const {
  useGetActiveBannersQuery,
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannersApiSlice;
