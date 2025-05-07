import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const TopSellingOne = ({ data }) => {
    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button"
                onClick={onClick}
                className={`${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-right" />
            </button>
        );
    }

    function SamplePrevArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="type"
                onClick={onClick}
                className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-left" />
            </button>
        );
    }

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const sliderRef = useRef(null);

    useEffect(() => {
        if (data && data.length > 0) {
            setIsDataLoaded(true);
            if (sliderRef.current) {
                sliderRef.current.slickGoTo(0); // Reset to first slide
            }
        } else {
            setIsDataLoaded(false);
        }
    }, [data]);

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1399,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <section className="top-selling-products pt-80">
            <style>
                {`
                    .slick-slider {
                        position: relative;
                        width: 100%;
                    }
                    .slick-list {
                        margin: 0 -10px;
                        overflow: hidden;
                    }
                    .slick-track {
                        display: flex;
                        align-items: stretch;
                    }
                    .slick-slide {
                        width: calc(100% / 4) !important;
                        padding: 0 10px;
                        box-sizing: border-box;
                        float: none;
                        display: inline-block !important;
                        vertical-align: top;
                    }
                    .product-card {
                        width: 100%;
                        min-height: 400px;
                        display: flex;
                        flex-direction: column;
                        box-sizing: border-box;
                    }
                    .product-card__thumb img {
                        width: 100%;
                        height: 150px;
                        object-fit: contain;
                    }
                    @media (max-width: 1399px) {
                        .slick-slide {
                            width: calc(100% / 3) !important;
                        }
                    }
                    @media (max-width: 1199px) {
                        .slick-slide {
                            width: calc(100% / 2) !important;
                        }
                    }
                    @media (max-width: 575px) {
                        .slick-slide {
                            width: 100% !important;
                        }
                    }
                `}
            </style>
            <div className="container container-lg">
                <div className="border border-gray-100 p-24 rounded-16">
                    <div className="section-heading mb-24">
                        <div className="flex-between flex-wrap gap-8">
                            <h5 className="mb-0">Top Selling Products</h5>
                            <div className="flex-align mr-point gap-16">
                                <Link
                                    to="/shop"
                                    className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                >
                                    View All Deals
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row g-12">
                        <div className="col-md-4">
                            <div className="position-relative rounded-16 overflow-hidden p-28 z-1 text-center">
                                <img
                                    src="assets/images/bg/deal-bg.png"
                                    alt=""
                                    className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100"
                                />
                                <div className="py-xl-4">
                                    <h6 className="mb-4 fw-semibold">Polaroid Now+ Gen 2 - White</h6>
                                    <h5 className="mb-40 fw-semibold">Fresh Vegetables</h5>
                                    <Link
                                        to="/cart"
                                        className="btn text-heading border-neutral-600 hover-bg-neutral-600 hover-text-white py-16 px-24 flex-center d-inline-flex rounded-pill gap-8 fw-medium"
                                        tabIndex={0}
                                    >
                                        Shop Now <i className="ph ph-shopping-cart text-xl d-flex" />
                                    </Link>
                                </div>
                                <div className="d-md-block d-none mt-36">
                                    <img src="assets/images/thumbs/deal-img.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="top-selling-product-slider arrow-style-two">
                                {isDataLoaded ? (
                                    <Slider ref={sliderRef} {...settings}>
                                        {data.map((variant, index) => {
                                            const primaryImage =
                                                variant.variant_image?.[0]?.image || 'assets/images/thumbs/placeholder.jpg';
                                            const discount =
                                                parseFloat(variant.product_variant_promotion?.coupon?.discount_value) || 0;
                                            const discountedPrice =
                                                discount > 0
                                                    ? variant.regular_price * (1 - discount / 100)
                                                    : variant.regular_price;
                                            const averageRating =
                                                variant.review_rating?.length > 0
                                                    ? variant.review_rating.reduce((sum, r) => sum + r.rating, 0) /
                                                      variant.review_rating.length
                                                    : 0;
                                            const stockQuantity = variant.product_stock?.StockQuantity || 35;
                                            const soldQuantity = Math.round(stockQuantity * 0.514); // Matches 18/35
                                            const progressPercentage = stockQuantity
                                                ? (soldQuantity / stockQuantity) * 100
                                                : 35;
                                            const truncatedName =
                                                variant.variant_name && variant.variant_name.length > 50
                                                    ? `${variant.variant_name.slice(0, 47)}...`
                                                    : variant.variant_name || 'Unknown Product';
                                            // Rotate badge types to match variety
                                            const badgeTypes = [
                                                { text: 'New', class: 'bg-warning-600' },
                                                { text: 'Best Seller', class: 'bg-tertiary-600' },
                                                { text: `Sale ${discount}%`, class: 'bg-danger-600' },
                                            ];
                                            const badge = discount > 0 ? badgeTypes[2] : badgeTypes[index % 2];

                                            return (
                                                <div key={variant.id} style={{ width: '100%' }}>
                                                    <div
                                                        className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2"
                                                        style={{ minHeight: '400px' }}
                                                    >
                                                        <Link
                                                            to={`/product-details-two/${variant.id}`}
                                                            className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                                        >
                                                            <span
                                                                className={`product-card__badge ${badge.class} px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0`}
                                                            >
                                                                {badge.text}
                                                            </span>
                                                            <img
                                                                src={`http://127.0.0.1:8000/${primaryImage}`}
                                                                alt={variant.variant_name || 'Product'}
                                                                className="w-auto max-w-unset"
                                                                style={{ height: '150px', objectFit: 'contain' }}
                                                            />
                                                        </Link>
                                                        <div className="product-card__content mt-16">
                                                            <div className="flex-align gap-6">
                                                                <span className="text-xs fw-medium text-gray-500">
                                                                    {averageRating.toFixed(1)}
                                                                </span>
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-500">
                                                                    ({variant.review_rating?.length || 0})
                                                                </span>
                                                            </div>
                                                            <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                                                <Link
                                                                    to={`/product-details-two/${variant.id}`}
                                                                    className="link text-line-2"
                                                                    tabIndex={0}
                                                                >
                                                                    {truncatedName}
                                                                </Link>
                                                            </h6>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-tertiary-600 text-md d-flex">
                                                                    <i className="ph-fill ph-storefront" />
                                                                </span>
                                                                <span className="text-gray-500 text-xs">
                                                                    By{' '}
                                                                    {variant.product?.product_name?.split(' ')[0] ||
                                                                        'Brand'}
                                                                </span>
                                                            </div>
                                                            <div className="mt-8">
                                                                <div
                                                                    className="progress w-100 bg-color-three rounded-pill h-4"
                                                                    role="progressbar"
                                                                    aria-label="Basic example"
                                                                    aria-valuenow={progressPercentage}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                >
                                                                    <div
                                                                        className="progress-bar bg-tertiary-600 rounded-pill"
                                                                        style={{ width: `${progressPercentage}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-gray-900 text-xs fw-medium mt-8">
                                                                    Sold: {soldQuantity}/{stockQuantity}
                                                                </span>
                                                            </div>
                                                            <div className="product-card__price my-20">
                                                                {discount > 0 && (
                                                                    <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                                        ${variant.regular_price.toFixed(2)}
                                                                    </span>
                                                                )}
                                                                <span className="text-heading text-md fw-semibold">
                                                                    ${discountedPrice.toFixed(2)}{' '}
                                                                    <span className="text-gray-500 fw-normal">
                                                                        /Qty
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <Link
                                                                to="/cart"
                                                                className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                                                tabIndex={0}
                                                            >
                                                                Add To Cart <i className="ph ph-shopping-cart" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </Slider>
                                ) : (
                                    <div>
                                        <div className="product-card h-100 p-16 border border-gray-100 rounded-16 text-center">
                                            <p className="text-gray-600">No products available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopSellingOne;