import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const orderHistoryApi = createApi({
  reducerPath: "orderHistoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api'
    // baseUrl: "https://backend.glowthentic.store/api",
  }),
  endpoints: (builder) => ({
    getOrderHistory: builder.query({
      query: (id) => {
        return `/order/completed/${id}`;
      },
    }),
  }),
});

export const { useGetOrderHistoryQuery } = orderHistoryApi;

export default orderHistoryApi;
