import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const blogApi = createApi({
    reducerPath: 'blogApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
    endpoints: builder => ({
        getBlog: builder.query({
            query: () => '/blogPost',
        }),
        getBlogByDetails: builder.query({
            query: (id) =>`/blogPost/${id}`,
        }),
        getNavbarBlog: builder.query({
            query: () => '/nav/blogPost/show',
        }),
    })
})

export const {
    useGetBlogQuery,
    useGetBlogByDetailsQuery,
    useGetNavbarBlogQuery,

} = blogApi;

export default blogApi;