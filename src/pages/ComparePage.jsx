import React from 'react';
import ColorInit from '../helper/ColorInit';
import ScrollToTop from 'react-scroll-to-top';
import Preloader from '../helper/Preloader';
import HeaderTwo from '../components/HeaderTwo';
import ShippingOne from '../components/ShippingOne';
import FooterTwo from '../components/FooterTwo';
import BottomFooter from '../components/BottomFooter';
import Breadcrumb from '../components/Breadcrumb';
import CompareSection from '../components/CompareSection';

const ComparePage = () => {
    return (
        <div>
            {/* ColorInit */}
            <ColorInit color={true} />

            {/* ScrollToTop */}
            <ScrollToTop smooth color="#FA6400" />

            {/* Preloader */}
            <Preloader />

            {/* HeaderTwo */}
            <HeaderTwo category={true} />

            {/* Breadcrumb */}
            <Breadcrumb title={"Compare"} />

            {/* Compare */}
            <CompareSection />

            {/* ShippingOne */}
            <ShippingOne />

            {/* FooterTwo */}
            <FooterTwo />

            {/* BottomFooter */}
            <BottomFooter />
        </div>
    );
};

export default ComparePage;