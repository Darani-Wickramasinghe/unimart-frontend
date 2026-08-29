import { baseApi } from '../../services/baseApi';
import type { Review, ReviewCreateInput, ReviewUpdateInput } from './reviewTypes';
import type { Page } from '../listings/listingTypes';

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getListingReviews: build.query<Page<Review>, number>({
      query: (listingId) => `listings/${listingId}/reviews`,
      providesTags: (_result, _error, listingId) => [
        { type: 'Review', id: `LISTING-${listingId}` },
      ],
    }),
    createReview: build.mutation<Review, ReviewCreateInput>({
      query: (body) => ({ url: 'reviews', method: 'POST', body }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
    updateReview: build.mutation<Review, { id: number; body: ReviewUpdateInput }>({
      query: ({ id, body }) => ({ url: `reviews/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: build.mutation<void, number>({
      query: (id) => ({ url: `reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useGetListingReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;