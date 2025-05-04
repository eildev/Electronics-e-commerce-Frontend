import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const checkoutApi = createApi({
  reducerPath: 'checkoutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api',
    credentials: 'include', // Include cookies in requests
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Add auth token if required
      const csrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      if (csrfToken) {
        headers.set('X-XSRF-TOKEN', decodeURIComponent(csrfToken));
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: '/order/create',
        method: 'POST',
        body: orderData,
      }),
    }),
  }),
});

export const { usePlaceOrderMutation } = checkoutApi;
export default checkoutApi;