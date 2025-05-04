import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
    endpoints: builder => ({
        getCategoryApi: builder.query({
            query: () => '/category',
        }),
    })
})

export const {
    useGetCategoryApiQuery,

} = categoryApi;

export default categoryApi;