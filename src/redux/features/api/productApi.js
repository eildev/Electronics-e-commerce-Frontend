import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
    endpoints: builder => ({
        getProductApi: builder.query({
            query: () => '/product',
        }),
    })
})

export const {
    useGetProductApiQuery,

} = productApi;

export default productApi;