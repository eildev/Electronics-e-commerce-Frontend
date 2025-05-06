import { configureStore } from '@reduxjs/toolkit'
import productApi from './features/api/productApi';
import bannerApi from './features/api/bannerApi';
import variantApi from './features/api/variantApi';
import categoryApi from './features/api/categoryApi';
import selectCartReducer from "./features/slice/cartSlice";
import searchReducer from "./features/slice/searchSlice";
import cartReducer from "./features/slice/cartSlice";
import authReducer from "./features/slice/authSlice";
import couponApi from './features/api/couponApi';
import checkoutApi from './features/api/checkoutApi';
import registerApi from './features/api/registerApi';
import authApi from './features/api/authApi';
import subscriptionApi from './features/api/subscriptionApi';
import reviewApi from './features/api/reviewApi';
import reviewGetApi from './features/api/reviewGetApi';
import filterReducer from './features/slice/filterSlice';
import wishListApi from './features/api/wishListApi';
import wishlistByUserAPI from './features/api/wishlistByUserAPI';
import brandApi from './features/api/brandApi';
import compareReducer from './features/slice/compareSlice';
import wishlistReducer from './features/slice/wishlistSlice';
import orderHistoryApi from './features/api/orderHistoryApi';
import orderGetApi from './features/api/orderGetApi';
import blogApi from './features/api/blogApi';
import blogCategoryApi from './features/api/blogCategoryApi';

const store = configureStore({
    reducer: {

        search: searchReducer,
        auth: authReducer,
        cart: cartReducer,
        filters: filterReducer,
        selectCart: selectCartReducer,
        compare: compareReducer,
        wishlist: wishlistReducer,


        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [variantApi.reducerPath]: variantApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [checkoutApi.reducerPath]: checkoutApi.reducer,
        [registerApi.reducerPath]: registerApi.reducer,
        [subscriptionApi.reducerPath]: subscriptionApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [reviewGetApi.reducerPath]: reviewGetApi.reducer,
        [wishListApi.reducerPath]: wishListApi.reducer,
        [wishlistByUserAPI.reducerPath]: wishlistByUserAPI.reducer,
        [brandApi.reducerPath]: brandApi.reducer,
        [orderGetApi.reducerPath]: orderGetApi.reducer,
        [orderHistoryApi.reducerPath]: orderHistoryApi.reducer,
        [blogCategoryApi.reducerPath]: orderHistoryApi.reducer,
        [blogApi.reducerPath]: orderHistoryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(productApi.middleware)
            .concat(bannerApi.middleware)
            .concat(variantApi.middleware)
            .concat(categoryApi.middleware)
            .concat(couponApi.middleware)
            .concat(checkoutApi.middleware)
            .concat(registerApi.middleware)
            .concat(subscriptionApi.middleware)
            .concat(reviewApi.middleware)
            .concat(reviewGetApi.middleware)
            .concat(wishListApi.middleware)
            .concat(wishlistByUserAPI.middleware)
            .concat(brandApi.middleware)
            .concat(orderGetApi.middleware)
            .concat(orderHistoryApi.middleware)
            .concat(blogCategoryApi.middleware)
            .concat(blogApi.middleware)
})

export default store;