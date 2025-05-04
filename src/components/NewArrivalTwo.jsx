import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/features/slice/cartSlice';
import toast from 'react-hot-toast';
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { useGetVariantApiQuery } from '../redux/features/api/variantApi';

const NewArrivalTwo = ({ item }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetVariantApiQuery(item?.product?.category_id);

  const matchedCategory = data?.variant?.filter(
    (variant) => variant?.product?.category_id === item?.product?.category_id && variant.id !== item.id
  ) || [];

  console.log('Matched Category:', matchedCategory);

  // Calculate final price with discount
  const calculateFinalPrice = (variant) => {
    const regularPrice = parseFloat(variant?.regular_price);
    const coupon = variant?.product_variant_promotion?.coupon;

    if (!coupon || coupon.status !== 'Active') {
      return regularPrice;
    }

    const currentDate = new Date();
    const startDate = new Date(coupon.start_date);
    const endDate = new Date(coupon.end_date);

    if (currentDate < startDate || currentDate > endDate) {
      return regularPrice;
    }

    let finalPrice = regularPrice;

    if (coupon.discount_type === 'percentage') {
      const discountAmount = (regularPrice * parseFloat(coupon.discount_value)) / 100;
      finalPrice = regularPrice - discountAmount;
    } else if (coupon.discount_type === 'fixed') {
      finalPrice = regularPrice - parseFloat(coupon.discount_value);
    }

    return Math.max(finalPrice, 0);
  };

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    if (!product?.product_stock?.StockQuantity) {
      toast.error('Product is out of stock!');
      return;
    }

    const finalPrice = calculateFinalPrice(product);
    const newProduct = {
      ...product,
      quantity: 1,
      user_id: user?.id || null,
      final_price: finalPrice,
    };

    dispatch(addToCart(newProduct));
    toast.success('Added to Cart');
  };

  // Slider arrow components
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
        aria-label="Next Product"
      >
        <i className="ph ph-caret-right" />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
        aria-label="Previous Product"
      >
        <i className="ph ph-caret-left" />
      </button>
    );
  }

  // Slider settings
  const settings = {
    dots: false,
    arrows: true,
    infinite: matchedCategory.length > 6,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1599, settings: { slidesToShow: 6 } },
      { breakpoint: 1399, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 575, settings: { slidesToShow: 2 } },
      { breakpoint: 424, settings: { slidesToShow: 1 } },
    ],
  };

  // Rating styles
  const customStyles = {
    itemShapes: Star,
    boxBorderWidth: 0,
    activeFillColor: '#FA8232',
    inactiveFillColor: '#AFAFAF',
  };

  return (
    <section className="new-arrival pb-80">
      <div className="container container-lg">
        <div className="section-heading">
          <div className="flex-between flex-wrap gap-8">
            <h5 className="mb-0">You Might Also Like</h5>
            <div className="flex-align mr-point gap-16">
              <Link
                to="/shop"
                className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
              >
                All Products
              </Link>
            </div>
          </div>
        </div>
        <div className="new-arrival__slider arrow-style-two">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-main-600" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-danger">
              Error loading products: {error.message || 'Please try again later.'}
            </div>
          ) : !matchedCategory.length ? (
            <div className="text-center py-4 text-gray-500">
              No related products found.
            </div>
          ) : (
            <Slider {...settings}>
              {matchedCategory.map((product) => {
                const finalPrice = calculateFinalPrice(product);
                const regularPrice = parseFloat(product?.regular_price);
                const hasDiscount = finalPrice < regularPrice;
                const discountValue = product?.product_variant_promotion?.coupon?.discount_value;
                const discountType = product?.product_variant_promotion?.coupon?.discount_type;

                // Calculate review metrics
                const reviews = product?.review_rating || [];
                const reviewCount = reviews.length;
                const averageRating =
                  reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                    : 0;

                console.log(`Product ${product.id} Reviews:`, reviews, 'Avg Rating:', averageRating);

                return (
                  <div key={product.id}>
                    <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                      {hasDiscount && discountValue && (
                        <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
                          Sale {discountValue}{discountType === 'percentage' ? '%' : '$'}
                        </span>
                      )}
                      <Link
                        to={`/product-details-two/${product.id}`}
                        className="product-card__thumb flex-center"
                      >
                        <img
                          src={
                            product?.variant_image?.[0]?.image
                              ? `http://127.0.0.1:8000/${product.variant_image[0].image}`
                              : 'https://via.placeholder.com/150?text=No+Image'
                          }
                          alt={product?.variant_name || 'Product Image'}
                          className="b-none"
                        />
                      </Link>
                      <div className="product-card__content p-sm-2">
                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                          <Link
                            to={`/product-details-two/${product.id}`}
                            className="link text-line-2"
                          >
                            {product?.variant_name || 'Unnamed Product'}
                          </Link>
                        </h6>
                        <div className="flex-align gap-4">
                          <span className="text-main-600 text-md d-flex">
                            <i className="ph-fill ph-storefront" />
                          </span>
                          <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                        </div>
                        <div className="product-card__content mt-12">
                        {hasDiscount && (
                              <span className="text-gray-400 text-md fw-semibold text-decoration-line-through mb-1">
                                ${regularPrice.toFixed(2)}
                              </span>
                            )}
                          <div className="product-card__price mb-8 flex-align gap-8">
                            
                            <span className="text-heading text-md fw-semibold">
                              ${finalPrice.toFixed(2)}{' '}
                              <span className="text-gray-500 fw-normal">/Qty</span>
                            </span>
                          </div>
                          <div className="flex-align gap-6">
                            {isLoading ? (
                              <span className="text-xs text-gray-600">Loading...</span>
                            ) : (
                              <>
                                <Rating
                                  value={averageRating}
                                  readOnly
                                  itemStyles={customStyles}
                                  style={{ maxWidth: 80 }}
                                />
                                <span className="text-xs fw-bold text-gray-600">
                                  ({reviewCount})
                                </span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                            disabled={!product?.product_stock?.StockQuantity}
                          >
                            Add To Cart <i className="ph ph-shopping-cart" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalTwo;