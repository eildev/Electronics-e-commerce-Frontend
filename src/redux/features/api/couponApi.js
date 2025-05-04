

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const couponApi = createApi({
  reducerPath: 'couponApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
  endpoints: (builder) => ({
    checkCoupon: builder.mutation({
      query: (data) => ({
        url: '/coupon/check',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useCheckCouponMutation } = couponApi;
export default couponApi;
