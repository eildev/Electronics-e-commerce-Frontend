import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const reviewGetApi = createApi({
    reducerPath: 'reviewGetApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8000/api'


    }),
    endpoints: builder => ({
        getReviewInfo: builder.query({
            query: (id) => {
                return `/review/${id}`;
            },
        }),
    })
})


export const { useGetReviewInfoQuery } = reviewGetApi;

export default reviewGetApi;
