
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
  endpoints: (builder) => ({
    reviewInfo: builder.mutation({
      query: (data) => ({
        url: '/review/add',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useReviewInfoMutation } = reviewApi;
export default reviewApi;
