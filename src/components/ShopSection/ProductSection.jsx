import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/slice/cartSlice';
import { setWishlistItems, addToWishlist, removeFromWishlist } from '../../redux/features/slice/wishlistSlice';
import { useAddToWishlistMutation, useGetWishlistByUserIdQuery } from '../../redux/features/api/wishlistByUserAPI';
import toast from 'react-hot-toast';
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

const ProductSection = ({
  isLoading,
  paginatedData,
  filteredProducts,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalPages,
  grid,
  setGrid,
  sidebarController,
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const [addToWishlistMutation] = useAddToWishlistMutation();
  
  const {
    data,
    error,
    isLoading : wishlistLoad,
  } = useGetWishlistByUserIdQuery(user?.id, {
    skip: !user?.id,
  });


  const wishlist = data?.wishlist || [];



  const { data: wishlistResponse, isLoading: wishlistLoading, error: wishlistError, refetch } = useGetWishlistByUserIdQuery(user?.id, {
    skip: !user?.id,
  });


  const wishlistData = useMemo(() => Array.isArray(wishlistResponse) ? wishlistResponse : wishlistResponse?.data || [], [wishlistResponse]);




  useEffect(() => {
    if (wishlistData.length === 0) return;
    const currentWishlistIds = wishlistItems.map(w => w.variant_id).sort();
    const newWishlistIds = wishlistData.map(w => w.variant_id).sort();
    if (JSON.stringify(currentWishlistIds) !== JSON.stringify(newWishlistIds)) {
      dispatch(setWishlistItems(wishlistData));

    }
  }, [wishlistData, wishlistItems, dispatch]);

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
      finalPrice = regularPrice * (1 - parseFloat(coupon.discount_value) / 100);
    } else if (coupon.discount_type === 'fixed') {
      finalPrice = regularPrice - parseFloat(coupon.discount_value);
    }

    return Math.max(finalPrice, 0).toFixed(2);
  };


  const handleAddToCart = (eItem) => {
    const stockAvailable = eItem?.product_stock?.StockQuantity > 0;
    const filteredCartItems = cartItems.filter((item) =>
      user?.id ? item.user_id === user.id : item.user_id === null
    );
    const matchedItem = filteredCartItems.find((item) => item.id === eItem?.id);
    const stockLimit = matchedItem?.product_stock?.StockQuantity || eItem?.product_stock?.StockQuantity || 0;
    const totalRequested = (matchedItem?.quantity || 0) + 1;

    if (!stockAvailable || totalRequested > stockLimit) {
      toast.error('Cannot add more than available stock!');
      return;
    }

    const finalPrice = calculateFinalPrice(eItem);
    const newProduct = {
      ...eItem,
      quantity: 1,
      user_id: user?.id || null,
      final_price: finalPrice,
    };

    dispatch(addToCart(newProduct));
    toast.success('Added to Cart');
  };


  const handleWishlistAdd = async (item) => {
    if (!user) {
      toast.error('Please login to manage your wishlist');
      return;
    }


    const isInWishlist = wishlist?.some(w => w.variant_id == item.id);
    // console.log(`Adding wishlist for item ${item.id}. isInWishlist: ${isInWishlist}`);

    if (isInWishlist) {
      toast.error('Item already in wishlist');
      return;
    }

    try {
      const payload = {
        user_id: user.id,
        product_id: item.product?.id || item.id,
        variant_id: item.id,
      };
      console.log(item.id);
      dispatch(addToWishlist({ ...payload, variant_id: item.id }));
      const response = await addToWishlistMutation(payload).unwrap();
      // console.log('Add API Response:', response);
      await refetch();
      toast.success('Added to Wishlist');
    } catch (error) {
      // console.error('Failed to add to wishlist:', error);
      toast.error('Failed to add to wishlist');
      dispatch(removeFromWishlist(item.id));
    }
  };


  const customStyles = {
    itemShapes: Star,
    boxBorderWidth: 0,
    activeFillColor: '#FA8232',
    inactiveFillColor: '#AFAFAF',
  };

  return (
    <div className="col-lg-9">
      <div className="flex-between gap-16 flex-wrap mb-40">
        <span className="text-gray-900">
          Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
          {filteredProducts.length} results
        </span>
        <div className="position-relative flex-align gap-16 flex-wrap">
          <div className="list-grid-btns flex-align gap-16">
            <button
              onClick={() => setGrid(true)}
              type="button"
              className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${
                grid && 'border-main-600 text-white bg-main-600'
              }`}
            >
              <i className="ph-bold ph-list-dashes" />
            </button>
            <button
              onClick={() => setGrid(false)}
              type="button"
              className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${
                !grid && 'border-main-600 text-white bg-main-600'
              }`}
            >
              <i className="ph ph-squares-four" />
            </button>
          </div>
          <div className="position-relative text-gray-500 flex-align gap-4 text-14">
            <label htmlFor="sorting" className="text-inherit flex-shrink-0">
              Sort by:{' '}
            </label>
            <select
              defaultValue={1}
              className="form-control common-input px-14 py-14 text-inherit rounded-6 w-auto"
              id="sorting"
            >
              <option value={1}>Popular</option>
              <option value={2}>Latest</option>
              <option value={3}>Trending</option>
              <option value={4}>Matches</option>
            </select>
          </div>
          <button
            onClick={sidebarController}
            type="button"
            className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
          >
            <i className="ph-bold ph-funnel" />
          </button>
        </div>
      </div>

      <div className={`list-grid-wrapper ${grid && 'list-view'}`}>
        {isLoading || wishlistLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-main-600" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : wishlistError ? (
          <div className="text-center py-4 text-gray-500">
            Failed to load wishlist. Please try again.
          </div>
        ) : paginatedData.length > 0 ? (
          paginatedData.map((item, i) => {
            const finalPrice = calculateFinalPrice(item);
            const regularPrice = parseFloat(item?.regular_price);
            const hasDiscount = finalPrice < regularPrice;
            const discountValue = item?.product_variant_promotion?.coupon?.discount_value;
            const discountType = item?.product_variant_promotion?.coupon?.discount_type;

            const reviews = item?.review_rating || [];
            const reviewCount = reviews.length;
            const averageRating = reviews.length > 0
              ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
              : 0;

            const isInWishlist = wishlistItems.some(w => w.variant_id == item.id);
            // console.log(`Rendering item ${item.id}, isInWishlist: ${isInWishlist}`);

            return (
              <div
                key={i}
                className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2"
              >
                <Link
                  to={`/product-details-two/${item.id}`}
                  className="product-card__thumb flex-center rounded-8 border position-relative"
                >
                  <img
                    src={
                      item?.variant_image?.[0]?.image
                        ? `http://127.0.0.1:8000/${item.variant_image[0].image}`
                        : 'assets/images/thumbs/product-two-img1.png'
                    }
                    alt={item?.variant_name || 'Product Image'}
                    className="w-full h-auto object-contain rounded-8"
                  />
                  <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                    Best Sale
                  </span>
                  {hasDiscount && discountValue && (
                    <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-end-0 inset-block-start-0">
                      Sale {discountValue}{discountType === 'percentage' ? '%' : '$'}
                    </span>
                  )}
                </Link>
                <div className="product-card__content mt-16">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="title text-lg fw-semibold mt-12 mb-8">
                      <Link
                        to={`/product-details-two/${item.id}`}
                        className="link text-line-2"
                        tabIndex={0}
                      >
                        {item?.variant_name || 'Unnamed Product'}
                      </Link>
                    </h6>
                    { !(wishlist?.some(w => w.variant_id == item.id)) && (
                      <button
                        onClick={() => handleWishlistAdd(item)}
                        style={{ color: '#6b7280', transition: 'color 0.2s' }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#dc3545')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#6b7280')}
                        type="button"
                        title="Add to wishlist"
                      >
                        <i
                          className="ph-bold ph-heart"
                          style={{ fontSize: '24px' }}
                        />
                      </button>
                    )}
                  </div>
                  <div className="flex-align mb-20 mt-16 gap-6">
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
                        <span className="text-xs fw-medium text-gray-500">
                          ({reviewCount})
                        </span>
                      </>
                    )}
                  </div>
                  <div className="product-card__price my-20 flex-align gap-8">
                    {hasDiscount && (
                      <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                        ${regularPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-heading text-md fw-semibold">
                      ${finalPrice} <span className="text-gray-500 fw-normal">/Qty</span>
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium flex-grow-1 w-100"
                    tabIndex={0}
                  >
                    Add To Cart <i className="ph ph-shopping-cart" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-gray-500">
            No products found.
          </div>
        )}
      </div>

      <ul className="pagination flex-center flex-wrap gap-16 mt-40">
        <li className="page-item">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="page-link h-64 w-64 flex-center text-xl rounded-8 fw-medium text-neutral-600 border border-gray-100 disabled:opacity-50"
          >
            <i className="ph-bold ph-arrow-left" />
          </button>
        </li>
        {(() => {
          const pages = [];
          const maxVisiblePages = 5;
          let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
          let endPage = startPage + maxVisiblePages - 1;

          if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }

          if (startPage > 1) {
            pages.push(
              <li key="start">
                <button
                  onClick={() => setCurrentPage(1)}
                  className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                >
                  1
                </button>
              </li>
            );
            if (startPage > 2) {
              pages.push(
                <li key="dots-start" className="text-gray-400 text-md flex-center w-64">
                  ...
                </li>
              );
            }
          }

          for (let i = startPage; i <= endPage; i++) {
            pages.push(
              <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                <button
                  onClick={() => setCurrentPage(i)}
                  className={`page-link h-64 w-64 flex-center text-md rounded-8 fw-medium border ${
                    currentPage === i
                      ? 'text-white bg-main-600 border-main-600'
                      : 'text-neutral-600 border-gray-100'
                  }`}
                >
                  {i}
                </button>
              </li>
            );
          }

          if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              pages.push(
                <li key="dots-end" className="text-gray-400 text-md flex-center w-64">
                  ...
                </li>
              );
            }
            pages.push(
              <li key="end">
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                >
                  {totalPages}
                </button>
              </li>
            );
          }

          return pages;
        })()}
        <li className="page-item">
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="page-link h-64 w-64 flex-center text-xl rounded-8 fw-medium text-neutral-600 border border-gray-100 disabled:opacity-50"
          >
            <i className="ph-bold ph-arrow-right" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProductSection;