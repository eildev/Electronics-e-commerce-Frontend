import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const variantApi = createApi({
    reducerPath: 'variantApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
    endpoints: builder => ({
        getVariantApi: builder.query({
            query: () => '/variant',
        }),
    })
})

export const {
    useGetVariantApiQuery,

} = variantApi;

export default variantApi;