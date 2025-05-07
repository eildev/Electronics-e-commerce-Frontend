import React from 'react';
import Preloader from '../helper/Preloader';
import HeaderTwo from '../components/HeaderTwo';
import BannerTwo from '../components/BannerTwo';
import PromotionalTwo from '../components/PromotionalTwo';
import DealsOne from '../components/DealsOne';
import TopSellingOne from '../components/TopSellingOne';
import TrendingOne from '../components/TrendingOne';
import DiscountOne from '../components/DiscountOne';
import FeaturedOne from '../components/FeaturedOne';
import BigDealOne from '../components/BigDealOne';
import TopSellingTwo from '../components/TopSellingTwo';
import PopularProductsOne from '../components/PopularProductsOne';
import TopVendorsTwo from '../components/TopVendorsTwo';
import DaySaleOne from '../components/DaySaleOne';
import RecentlyViewedOne from '../components/RecentlyViewedOne';
import BrandTwo from '../components/BrandTwo';
import ShippingTwo from '../components/ShippingTwo';
import NewsletterTwo from '../components/NewsletterTwo';
import FooterTwo from '../components/FooterTwo';
import BottomFooter from '../components/BottomFooter';
import ColorInit from '../helper/ColorInit';
import ScrollToTop from 'react-scroll-to-top';
import { useGetVariantApiQuery } from '../redux/features/api/variantApi';


const HomePageTwo = () => {

    const { data: variants, isLoading, error } = useGetVariantApiQuery();

    if (error) {
        console.error('Error fetching variants:', error);
    }
    console.log('Fetched Variants:', variants);

    return (
        <>
            {/* ColorInit */}
            <ColorInit color={true} />

            {/* ScrollToTop */}
            <ScrollToTop smooth color="#FA6400" />

            {/* Preloader */}
            {isLoading && <Preloader />}

            {/* HeaderTwo */}
            <HeaderTwo category={false} />

            {/* BannerTwo */}
            <BannerTwo />

            {/* PromotionalTwo */}
            <PromotionalTwo />

            {/* DealsOne */}
            <DealsOne data={variants?.variant || []} />

            {/* TopSellingOne */}
            <TopSellingOne data={variants?.variant || []} />

            {/* TrendingOne */}
            <TrendingOne data={variants?.variant || []} />

            {/* DiscountOne */}
            <DiscountOne data={variants?.variant || []} />

            {/* FeaturedOne */}
            <FeaturedOne data={variants?.variant || []} />

            {/* BigDealOne */}
            <BigDealOne data={variants?.variant || []} />

            {/* TopSellingTwo */}
            <TopSellingTwo data={variants?.variant || []} />

            {/* PopularProductsOne */}
            <PopularProductsOne data={variants?.variant || []} />

            {/* TopVendorsTwo */}
            <TopVendorsTwo data={variants?.variant || []} />

            {/* DaySaleOne */}
            <DaySaleOne data={variants?.variant || []} />

            {/* RecentlyViewedOne */}
            <RecentlyViewedOne data={variants?.variant || []} />

            {/* BrandTwo */}
            <BrandTwo />

            {/* ShippingTwo */}
            <ShippingTwo />

            {/* NewsletterTwo */}
            <NewsletterTwo />

            {/* FooterTwo */}
            <FooterTwo />

            {/* BottomFooter */}
            <BottomFooter />
        </>
    );
};

export default HomePageTwo;