import React, { memo, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { getCountdown } from '../helper/Countdown';

const SampleNextArrow = memo(function SampleNextArrow(props) {
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
});

const SamplePrevArrow = memo(function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
        >
            <i className="ph ph-caret-left" />
        </button>
    );
});

const DealsOne = ({ data }) => {
    const [timeLeft, setTimeLeft] = useState(getCountdown());
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const sliderRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getCountdown());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
        slidesToShow: 6,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1599,
                settings: {
                    slidesToShow: 5,
                },
            },
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
        <section className="deals-weeek pt-80">
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
                        width: calc(100% / 6) !important;
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
                    @media (max-width: 1599px) {
                        .slick-slide {
                            width: calc(100% / 5) !important;
                        }
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
                            <h5 className="mb-0">Deal of The Week</h5>
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
                    <div className="deal-week-box rounded-16 overflow-hidden flex-between position-relative z-1 mb-24">
                        <img
                            src="assets/images/bg/week-deal-bg.png"
                            alt=""
                            className="position-absolute inset-block-start-0 inset-block-start-0 w-100 h-100 z-n1 object-fit-cover"
                        />
                        <div className="d-lg-block d-none ps-32 flex-shrink-0">
                            <img src="assets/images/thumbs/week-deal-img1.png" alt="" />
                        </div>
                        <div className="deal-week-box__content px-sm-4 d-block w-100 text-center">
                            <h6 className="mb-20">Apple AirPods Max, Over Ear Headphones</h6>
                            <div className="countdown mt-20" id="countdown4">
                                <ul className="countdown-list style-four flex-center flex-wrap">
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                                        <span className="days" />
                                        {timeLeft.days} <br /> Days
                                    </li>
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                                        <span className="hours" />
                                        {timeLeft.hours} <br /> Hour
                                    </li>
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                                        <span className="minutes" />
                                        {timeLeft.minutes} <br /> Min
                                    </li>
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                                        <span className="seconds" />
                                        {timeLeft.seconds} <br /> Sec
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="d-lg-block d-none flex-shrink-0 pe-xl-5">
                            <div className="me-xxl-5">
                                <img src="assets/images/thumbs/week-deal-img2.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="deals-week-slider arrow-style-two">
                        {isDataLoaded ? (
                            <Slider ref={sliderRef} {...settings}>
                                {data.map((variant) => {
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
                                                    {discount > 0 && (
                                                        <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                                            Sale {discount}%
                                                        </span>
                                                    )}
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
                                                            By {variant.product?.product_name?.split(' ')[0] || 'Brand'}
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
                                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through me-5">
                                                                ${variant.regular_price.toFixed(2)}
                                                            </span>
                                                        )}
                                                        <span className="text-heading text-md fw-semibold">
                                                            ${discountedPrice.toFixed(2)}{' '}
                                                            <span className="text-gray-500 fw-normal">/Qty</span>
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
                                    <p className="text-gray-600">No deals available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DealsOne;