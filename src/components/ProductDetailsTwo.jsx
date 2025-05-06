import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { getCountdown } from '../helper/Countdown';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/features/slice/cartSlice';
import { addToCompare } from '../redux/features/slice/compareSlice';
import { Rating, Star } from '@smastrom/react-rating';
import { useReviewInfoMutation } from '../redux/features/api/reviewApi';
import { useGetReviewInfoQuery } from '../redux/features/api/reviewGetApi';
import { formatDistanceToNow } from 'date-fns';
import '@smastrom/react-rating/style.css';
import { useAddToWishlistMutation, useGetWishlistByUserIdQuery } from '../redux/features/api/wishlistByUserAPI';

const ProductDetailsTwo = ({ item: data }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { compareItems } = useSelector((state) => state.compare);
  const { user } = useSelector((state) => state.auth);
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  const [mainImage, setMainImage] = useState(data?.variant_image[0]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(2);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [localReviews, setLocalReviews] = useState([]);

  const { data: reviews, isLoading, isError, error } = useGetReviewInfoQuery(data?.id);
  const [postReview, { isLoading: isSubmitting }] = useReviewInfoMutation();
   const [addToWishlist] = useAddToWishlistMutation();


  const { data: wishlistResponse, isLoading: wishlistLoading, error: wishlistError } = useGetWishlistByUserIdQuery(user?.id, {
    skip: !user?.id, 
  });



  const wishlist = wishlistResponse?.wishlist || [];

  
  const wishlistData = Array.isArray(wishlistResponse) ? wishlistResponse : wishlistResponse?.data || [];


  useEffect(() => {
    if (reviews?.reviews) {
      setLocalReviews(reviews.reviews);
    }
  }, [reviews]);

  const hasUserReviewed = localReviews.some(
    (review) => review.user_id === user?.id
  );

  useEffect(() => {
    console.log('Current rating:', rating);
  }, [rating]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  console.log(data);

  useEffect(() => {
    setMainImage(data?.variant_image[0]);
  }, [data]);


  const incrementQuantity = () => {
    if (quantity < data?.product_stock?.StockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  
  const settingsThumbs = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
  };

  const filteredCartItems = cartItems.filter((item) => {
    if (user?.id) {
      return item.user_id === user.id;
    } else {
      return item.user_id === null;
    }
  });

  const navigate = useNavigate();
  const stockAvailable = data?.product_stock?.StockQuantity > 0;


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

  const handleAddToCart = () => {
    if (!stockAvailable) {
      toast.error('Product is out of stock!');
      return;
    }

    const matchedItem = filteredCartItems.find((item) => item.id === data?.id);
    const stockLimit =
      matchedItem?.product_stock?.StockQuantity || data?.product_stock?.StockQuantity || 0;

    const totalRequested = (matchedItem?.quantity || 0) + quantity;

    if (totalRequested > stockLimit) {
      toast.error('Cannot add more than available stock!');
      setQuantity(1);
      return;
    }

    const finalPrice = calculateFinalPrice(data);

    const newProduct = {
      ...data,
      quantity: quantity,
      user_id: user?.id || null,
      final_price: finalPrice,
    };

    dispatch(addToCart(newProduct));
    toast.success('Added to Cart');
    setQuantity(1);
  };

  const handleCheckOut = () => {
    if (!stockAvailable) {
      toast.error('Product is out of stock!');
      return;
    }

    const matchedItem = filteredCartItems.find((item) => item.id === data?.id);
    const stockLimit =
      matchedItem?.product_stock?.StockQuantity || data?.product_stock?.StockQuantity || 0;

    const finalPrice = calculateFinalPrice(data);

    if (matchedItem) {
      const totalQuantity = matchedItem.quantity + quantity;

      if (totalQuantity > stockLimit) {
        navigate('/checkout');
        return;
      }

      const newProduct = {
        ...data,
        quantity: quantity,
        user_id: user?.id || null,
        final_price: finalPrice,
      };

      dispatch(addToCart(newProduct));
      navigate('/checkout');
    } else {
      const newProduct = {
        ...data,
        quantity: quantity,
        user_id: user?.id || null,
        final_price: finalPrice,
      };

      dispatch(addToCart(newProduct));
      navigate('/checkout');
    }
  };


  const handleAddToCompare = () => {

    if (!data?.id) {
      toast.error('Invalid product data!');
      return;
    }


    if (compareItems.length >= 4) {
      toast.error('Cannot compare more than 4 products!');
      return;
    }


    if (compareItems.some((item) => item.id === data.id)) {
      toast.error('This product is already in comparison!');
      return;
    }

    try {

      dispatch(addToCompare(data));

      const updatedCompareItems = [...compareItems, data];
      localStorage.setItem('compareItems', JSON.stringify(updatedCompareItems));

      toast.success('Added to comparison');

    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast.error('Failed to add to comparison');
    }
  };

  const calculateFeedback = () => {
    if (!localReviews.length) return { average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, total: 0 };

    const total = localReviews.length;
    const sum = localReviews.reduce((acc, review) => acc + review.rating, 0);
    const average = (sum / total).toFixed(1);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    localReviews.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });

    return { average, distribution, total };
  };

  const { average, distribution, total } = calculateFeedback();


  const handleSubmitReview = async (e) => {
    e.preventDefault();

    console.log(user);
    if (!user) {
      toast.error('Please log in to submit a review.');
      return;
    }
    if (!rating || !reviewTitle.trim() || !reviewText.trim()) {
      setReviewError('Rating, title, and content are required.');
      return;
    }


    const staticReview = {
      id: Date.now(), 
      user_id: user.id,
      product_id: data.product.id,
      variant_id: data.id,
      rating,
      title: reviewTitle,
      review: reviewText,
      created_at: new Date().toISOString(),
      user: {
        name: user.name,
        image: user.image || 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
      },
    };

 
    setLocalReviews((prev) => [...prev, staticReview]);


    setRating(0);
    setReviewTitle('');
    setReviewText('');
    setReviewError('');
    toast.success('Review submitted successfully!');


    const reviewData = {
      user_id: user.id,
      product_id: data.product.id,
      rating,
      variant_id: data.id,
      title: reviewTitle,
      order_id: 1,
      review: reviewText,
      status: 1,
    };

    console.log('Submitting review:', reviewData);

    try {
      await postReview(reviewData).unwrap();
    } catch (err) {
      console.error('Failed to submit review:', err);
      toast.error('Failed to save review to server.');
    }
  };

  const customStyles = {
    itemShapes: Star,
    boxBorderWidth: 0,
    activeFillColor: '#FA8232',
    inactiveFillColor: '#AFAFAF',
  };


  const finalPrice = calculateFinalPrice(data);
  const regularPrice = parseFloat(data?.regular_price);
  const hasDiscount = finalPrice < regularPrice;

  const handleAddToWishlist = async (item) => {
    if (!user) {
      toast.error('Please login to add items to your wishlist');
      return;
    }


    const isAlreadyInWishlist = Array.isArray(wishlistData) && wishlistData.some((wishlistItem) => {
      const isMatch = wishlistItem.variant_id === item.id;
      console.log('Checking wishlist item:', wishlistItem, 'against item.id:', item.id, 'Match:', isMatch);
      return isMatch;
    });

    if (isAlreadyInWishlist) {
      toast.error('This product is already in your wishlist');
      return;
    }

    try {
      const wishlistDataPayload = {
        user_id: user.id,
        product_id: item.product?.id,
        variant_id: item.id,
      };

      console.log('Sending to wishlist API:', wishlistDataPayload);
      await addToWishlist(wishlistDataPayload).unwrap();
      toast.success('Added to Wishlist');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <section className="product-details py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-xl-9">
            <div className="row gy-4">
              <div className="col-xl-6">
                <div className="product-details__left">
                  <div className="product-details__thumb-slider border border-gray-100 rounded-16">
                    <div className="">
                      <div className="product-details__thumb flex-center h-100">
                        <img src={`http://127.0.0.1:8000/${mainImage?.image}`} alt={data?.variant_name} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-24">
                    <div className="product-details__images-slider">
                      <Slider {...settingsThumbs}>
                        {data?.variant_image.map((image, index) => (
                          <div
                            className="center max-w-120 max-h-120 h-100 flex-center border border-gray-100 rounded-16 p-8"
                            key={index}
                            onClick={() => setMainImage(image)}
                          >
                            <img
                              className="thum"
                              src={`http://127.0.0.1:8000/${image?.image}`}
                              alt={`Thumbnail ${index}`}
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="product-details__content">
                  <div className="flex-center mb-24 flex-wrap gap-16 bg-color-one rounded-8 py-16 px-24 position-relative z-1">
                    <img
                      src="assets/images/bg/details-offer-bg.png"
                      alt=""
                      className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1"
                    />
                    <div className="flex-align gap-16">
                      <span className="text-white text-sm">Special Offer:</span>
                    </div>
                    <div className="countdown" id="countdown11">
                      <ul className="countdown-list flex-align flex-wrap">
                        <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                          {timeLeft.days}
                          <span className="days" />
                        </li>
                        <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                          {timeLeft.hours}
                          <span className="hours" />
                        </li>
                        <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                          {timeLeft.minutes}
                          <span className="minutes" />
                        </li>
                        <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                          {timeLeft.seconds}
                          <span className="seconds" />
                        </li>
                      </ul>
                    </div>
                    <span className="text-white text-xs">Remains until the end of the offer</span>
                  </div>
                  <h5 className="mb-12">{data?.variant_name}</h5>
                  <div className="flex-align flex-wrap gap-12 mb-12">
                    <div className="flex-align gap-12 flex-wrap">
                      <div className="flex-align gap-8">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-15 fw-medium ${
                              i < Math.round(average) ? 'text-warning-600' : 'text-gray-400'
                            } d-flex`}
                          >
                            <i className="ph-fill ph-star" />
                          </span>
                        ))}
                      </div>
                      <span className="text-sm fw-medium text-neutral-600">
                        {average} Star Rating
                      </span>
                      <span className="text-sm fw-medium text-gray-500">({total} reviews)</span>
                    </div>
                    <span className="text-sm fw-medium text-gray-500">|</span>
                    <span className="text-gray-900">
                      <span className="text-gray-400">SKU:</span> {data?.product?.sku}
                    </span>
                  </div>
                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                  <p className="text-gray-700">{data?.product?.product_details?.short_description}</p>
                  <div className="my-32 flex-align gap-16 flex-wrap">
                    <div className="flex-align gap-8">
                      {hasDiscount && (
                        <div className="flex-align gap-8 text-main-two-600">
                          <i className="ph-fill ph-seal-percent text-xl" />
                          -{data?.product_variant_promotion?.coupon?.discount_value}
                          {data?.product_variant_promotion?.coupon?.discount_type === 'percentage' ? '%' : '$'}
                        </div>
                      )}
                      <h6 className="mb-0">USD {finalPrice.toFixed(2)}</h6>
                    </div>
                    {hasDiscount && (
                      <div className="flex-align gap-8">
                        <span className="text-gray-700">Regular Price</span>
                        <h6 className="text-xl text-gray-400 mb-0 fw-medium">
                          USD {regularPrice.toFixed(2)}
                        </h6>
                      </div>
                    )}
                  </div>
                  <div className="my-32 flex-align flex-wrap gap-12">
                    <Link
                      to="#"
                      className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                    >
                      Monthly EMI USD {(finalPrice / 12).toFixed(2)}
                      <i className="ph ph-caret-right" />
                    </Link>
                    <Link
                      to="#"
                      className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                    >
                      Shipping Charge
                      <i className="ph ph-caret-right" />
                    </Link>
                    <Link
                      to="#"
                      className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                    >
                      Security & Privacy
                      <i className="ph ph-caret-right" />
                    </Link>
                  </div>
                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                  <Link
                    to="/https://www.whatsapp.com"
                    className="btn btn-black flex-center gap-8 rounded-8 py-16"
                  >
                    <i className="ph ph-whatsapp-logo text-lg" />
                    Request More Information
                  </Link>
                  <div className="mt-32">
                    <span className="fw-medium text-gray-900">100% Guarantee Safe Checkout</span>
                    <div className="mt-10">
                      <img src="assets/images/thumbs/gateway-img.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="product-details__sidebar py-40 px-32 border border-gray-100 rounded-16">
              <div className="mb-32">
                <label
                  htmlFor="stock"
                  className="text-lg mb-8 text-heading fw-semibold d-block"
                >
                  Total Stock: {data?.product_stock?.StockQuantity}
                </label>
                <span className="text-xl d-flex">
                  <i className="ph ph-location" />
                </span>
                <div className="d-flex rounded-4 overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    type="button"
                    className="quantity__minus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white"
                    disabled={!stockAvailable}
                  >
                    <i className="ph ph-minus" />
                  </button>
                  <input
                    type="number"
                    className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-16"
                    id="stock"
                    value={quantity}
                    readOnly
                  />
                  <button
                    onClick={incrementQuantity}
                    type="button"
                    className="quantity__plus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white"
                    disabled={!stockAvailable}
                  >
                    <i className="ph ph-plus" />
                  </button>
                </div>
              </div>
              <div className="mb-32">
                <div className="flex-between flex-wrap gap-8 border-bottom border-gray-100 pb-16 mb-16">
                  <span className="text-gray-500">Price</span>
                  <h6 className="text-lg mb-0">${finalPrice.toFixed(2)}</h6>
                </div>
                <div className="flex-between flex-wrap gap-8">
                  <span className="text-gray-500">Shipping</span>
                  <h6 className="text-lg mb-0">{data?.product?.shipping_charge === 'paid' ? 'From $20.00' : 'Free'}</h6>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className={`btn btn-main flex-center gap-8 rounded-8 py-16 fw-normal mt-48 w-100 ${!stockAvailable ? 'disabled opacity-50 cursor-not-allowed' : ''}`}
                disabled={!stockAvailable}
              >
                <i className="ph ph-shopping-cart-simple text-lg" />
                Add To Cart
              </button>
              <button
                onClick={handleCheckOut}
                className={`btn btn-outline-main rounded-8 py-16 fw-normal mt-16 w-100 ${!stockAvailable ? 'disabled opacity-50 cursor-not-allowed' : ''}`}
                disabled={!stockAvailable}
              >
                Buy Now
              </button>
              <button
              onClick={() => handleAddToWishlist(data)}
              disabled={wishlist?.some((item) => item?.variant_id === data?.id)}
                className="btn btn-outline-main rounded-8 py-16 fw-normal mt-16 w-100 flex-center gap-8"
              >
                <i className="ph ph-heart text-lg" />
                Add to Wishlist
              </button>
              <button
                onClick={handleAddToCompare}
                className="btn btn-outline-main rounded-8 py-16 fw-normal mt-16 w-100 flex-center gap-8"
                disabled={compareItems.some((item) => item?.id === data?.id) || compareItems.length >= 4}
              >
                <i className="ph ph-scales text-lg" />
                Add to Compare
              </button>
              <div className="mt-32">
                <div className="px-16 py-8 bg-main-50 rounded-8 flex-between gap-24 mb-14">
                  <span className="w-32 h-32 bg-white text-main-600 rounded-circle flex-center text-xl flex-shrink-0">
                    <i className="ph-fill ph-truck" />
                  </span>
                  <span className="text-sm text-neutral-600">
                    Ship from <span className="fw-semibold">MarketPro</span>
                  </span>
                </div>
                <div className="px-16 py-8 bg-main-50 rounded-8 flex-between gap-24 mb-0">
                  <span className="w-32 h-32 bg-white text-main-600 rounded-circle flex-center text-xl flex-shrink-0">
                    <i className="ph-fill ph-storefront" />
                  </span>
                  <span className="text-sm text-neutral-600">
                    Sold by: <span className="fw-semibold">MR Distribution LLC</span>
                  </span>
                </div>
              </div>
              <div className="mt-32">
                <div className="px-32 py-16 rounded-8 border border-gray-100 flex-between gap-8">
                  <Link to="#" className="d-flex text-main-600 text-28">
                    <i className="ph-fill ph-chats-teardrop" />
                  </Link>
                  <span className="h-26 border border-gray-100" />
                  <div className="dropdown on-hover-item">
                    <button className="d-flex text-main-600 text-28" type="button">
                      <i className="ph-fill ph-share-network" />
                    </button>
                    <div className="on-hover-dropdown common-dropdown border-0 inset-inline-start-auto inset-inline-end-0">
                      <ul className="flex-align gap-16">
                        <li>
                          <Link
                            to="/https://www.facebook.com"
                            className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                          >
                            <i className="ph-fill ph-facebook-logo" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/https://www.twitter.com"
                            className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                          >
                            <i className="ph-fill ph-twitter-logo" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/https://www.linkedin.com"
                            className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                          >
                            <i className="ph-fill ph-instagram-logo" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/https://www.pinterest.com"
                            className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                          >
                            <i className="ph-fill ph-linkedin-logo" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-80">
          <div className="product-dContent border rounded-24">
            <div className="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16">
              <ul
                className="nav common-tab nav-pills mb-3"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="pills-description-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-description"
                    type="button"
                    role="tab"
                    aria-controls="pills-description"
                    aria-selected="true"
                  >
                    Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-reviews-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-reviews"
                    type="button"
                    role="tab"
                    aria-controls="pills-reviews"
                    aria-selected="false"
                    onClick={() => setRating(0)}
                  >
                    Reviews
                  </button>
                </li>
              </ul>
              <Link
                to="#"
                className="btn bg-color-one rounded-16 flex-align gap-8 text-main-600 hover-bg-main-600 hover-text-white"
              >
                <img src="assets/images/icon/satisfaction-icon.png" alt="" />
                100% Satisfaction Guaranteed
              </Link>
            </div>
            <div className="product-dContent__box">
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-description"
                  role="tabpanel"
                  aria-labelledby="pills-description-tab"
                  tabIndex={0}
                >
                  <div className="mb-40">
                    <h6 className="mb-24">Product Description</h6>
                    <div dangerouslySetInnerHTML={{ __html: data?.product?.product_details?.description }} />
                  </div>
                  <div className="mb-40">
                    <h6 className="mb-24">Product Specifications</h6>
                    <ul className="mt-32">
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Product Name: <span className="text-gray-500">{data?.product?.product_name}</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Variant: <span className="text-gray-500">{data?.variant_name}</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Color: <span className="text-gray-500">{data?.color}</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Size: <span className="text-gray-500">{data?.size}</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Weight: <span className="text-gray-500">{data?.weight}g</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Flavor: <span className="text-gray-500">{data?.flavor}</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Gender: <span className="text-gray-500">{data?.product?.product_details?.gender}</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="mb-40">
                    <h6 className="mb-24">Ingredients</h6>
                    <div dangerouslySetInnerHTML={{ __html: data?.product?.product_details?.ingredients }} />
                  </div>
                  <div className="mb-0">
                    <h6 className="mb-24">Usage Instructions</h6>
                    <div dangerouslySetInnerHTML={{ __html: data?.product?.product_details?.usage_instruction }} />
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-reviews"
                  role="tabpanel"
                  aria-labelledby="pills-reviews-tab"
                  tabIndex={0}
                >
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <h6 className="mb-24">Product Reviews</h6>
                      {isLoading ? (
                        <p className="text-gray-700">Loading reviews...</p>
                      ) : isError ? (
                        <p className="text-red-500">Error loading reviews: {error.message}</p>
                      ) : localReviews.length > 0 ? (
                        localReviews.map((item, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-24 pb-44 border-bottom border-gray-100 mb-44"
                          >
                            <img
                              src={
                                item.user.image ||
                                'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='
                              }
                              alt={item.user.name}
                              className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                            />
                            <div className="flex-grow-1">
                              <div className="flex-between align-items-start gap-8">
                                <div>
                                  <h6 className="mb-12 text-md">{item.user.name}</h6>
                                  <div className="flex-align gap-8">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-15 fw-medium ${
                                          i < item.rating ? 'text-warning-600' : 'text-gray-400'
                                        } d-flex`}
                                      >
                                        <i className="ph-fill ph-star" />
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <span className="text-gray-800 text-xs">
                                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                </span>
                              </div>
                              <h6 className="mb-14 text-md mt-24">{item.title}</h6>
                              <p className="text-gray-700">{item.review}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-700">No reviews yet.</p>
                      )}
                      {!hasUserReviewed && user && (
                        <div className="mt-56">
                          <h6 className="mb-24">Write a Review</h6>
                          <form onSubmit={handleSubmitReview}>
                            <div className="mb-32">
                              <label className="text-neutral-600 mb-8">Rating</label>
                              <Rating
                                key={rating}
                                value={rating}
                                onChange={(newRating) => setRating(newRating)}
                                itemStyles={customStyles}
                                style={{ maxWidth: 120 }}
                              />
                            </div>
                            <div className="mb-32">
                              <label htmlFor="title" className="text-neutral-600 mb-8">
                                Review Title
                              </label>
                              <input
                                type="text"
                                className="common-input rounded-8"
                                id="title"
                                placeholder="Great Product"
                                value={reviewTitle}
                                onChange={(e) => setReviewTitle(e.target.value)}
                              />
                            </div>
                            <div className="mb-32">
                              <label htmlFor="desc" className="text-neutral-600 mb-8">
                                Review Content
                              </label>
                              <textarea
                                className="common-input rounded-8"
                                id="desc"
                                placeholder="Write your review..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                              />
                            </div>
                            {reviewError && <p className="text-danger mb-4">{reviewError}</p>}
                            <button
                              type="submit"
                              className="btn btn-main rounded-pill mt-48"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-6">
                      <div className="ms-xxl-5">
                        <h6 className="mb-24">Customers Feedback</h6>
                        <div className="d-flex flex-wrap gap-44">
                          <div className="border border-gray-100 rounded-8 px-40 py-52 flex-center flex-column flex-shrink-0 text-center">
                            <h2 className="mb-6 text-main-600">{average}</h2>
                            <div className="flex-center gap-8">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-15 fw-medium ${
                                    i < Math.round(average) ? 'text-warning-600' : 'text-gray-400'
                                  } d-flex`}
                                >
                                  <i className="ph-fill ph-star" />
                                </span>
                              ))}
                            </div>
                            <span className="mt-16 text-gray-500">Average Product Rating</span>
                          </div>
                          <div className="border border-gray-100 rounded-8 px-24 py-40 flex-grow-1">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div key={rating} className="flex-align gap-8 mb-20">
                                <span className="text-gray-900 flex-shrink-0">{rating}</span>
                                <div
                                  className="progress w-100 bg-gray-100 rounded-pill h-8"
                                  role="progressbar"
                                  aria-label="Basic example"
                                  aria-valuenow={(distribution[rating] / localReviews.length || 0) * 100}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                >
                                  <div
                                    className="progress-bar bg-main-600 rounded-pill"
                                    style={{ width: `${(distribution[rating] / localReviews.length || 0) * 100}%` }}
                                  />
                                </div>
                                <div className="flex-align gap-4">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-xs fw-medium ${
                                        i < rating ? 'text-warning-600' : 'text-gray-400'
                                      } d-flex`}
                                    >
                                      <i className="ph-fill ph-star" />
                                    </span>
                                  ))}
                                </div>
                                <span className="text-gray-900 flex-shrink-0">{distribution[rating]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsTwo;