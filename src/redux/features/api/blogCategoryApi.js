import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const blogCategoryApi = createApi({
    reducerPath: 'blogCategoryApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
    endpoints: builder => ({
        getBlogCategory: builder.query({
            query: () => '/blogCategory',
        }),
        getBlogCategoryByDetails: builder.query({
            query: (id) => `/blogCategory/${id}`,
        }),

    })
})

export const {
    useGetBlogCategoryQuery,
    useGetBlogCategoryByDetailsQuery,
    useGetNavbarBlogQuery,

} = blogCategoryApi;

export default blogCategoryApi;