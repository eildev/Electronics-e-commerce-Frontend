import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const brandApi = createApi({
    reducerPath: 'brandApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
    endpoints: builder => ({
        getBrand: builder.query({
            query: () => '/brand',
        }),

    })
})

export const {
    useGetBrandQuery


} = brandApi;

export default brandApi;