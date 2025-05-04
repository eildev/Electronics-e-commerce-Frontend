import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const bannerApi = createApi({
    reducerPath: 'bannerApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
    endpoints: builder => ({
        getBannerApi: builder.query({
            query: () => '/homeBanner',
        }),
    })
})

export const {
    useGetBannerApiQuery,

} = bannerApi;

export default bannerApi;