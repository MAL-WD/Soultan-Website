import { COLLECTIONS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const collectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query({
      query: () => ({
        url: COLLECTIONS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Collection'],
    }),
    getActiveCollections: builder.query({
      query: () => ({
        url: `${COLLECTIONS_URL}/active`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Collection'],
    }),
    getCollectionById: builder.query({
      query: (id) => ({
        url: `${COLLECTIONS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createCollection: builder.mutation({
      query: (data) => ({
        url: COLLECTIONS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Collection'],
    }),
    updateCollection: builder.mutation({
      query: (data) => ({
        url: `${COLLECTIONS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Collection'],
    }),
    deleteCollection: builder.mutation({
      query: (id) => ({
        url: `${COLLECTIONS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Collection'],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetActiveCollectionsQuery,
  useGetCollectionByIdQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionsApiSlice;
