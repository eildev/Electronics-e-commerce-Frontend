import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteWishlistItemMutation, useGetWishlistByUserIdQuery } from "../redux/features/api/wishlistByUserAPI";
import { addToCart } from "../redux/features/slice/cartSlice";
import toast from "react-hot-toast";
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

const WishListSection = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const {
    data: wishlistResponse,
    error,
    isLoading,
  } = useGetWishlistByUserIdQuery(user?.id, {
    skip: !user?.id,
  });

  // Extract wishlist array
  const wishlistData = wishlistResponse?.wishlist || [];

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteWishlistItem] = useDeleteWishlistItemMutation();

  // Calculate average rating and review count
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return { average: 0, total: 0 };
    }
    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = (sum / total);
    return { average: parseFloat(average), total };
  };

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

  // Handle delete item
  const handleDeleteItems = (itemID) => {
    setItemToDelete(itemID);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteWishlistItem(itemToDelete).unwrap();
        toast.success("Item removed from wishlist!");
      } catch (error) {
        console.error("Failed to delete item:", error);
        toast.error("Error removing item!");
      }
      setShowConfirmModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  // Add to cart and delete from wishlist
  const handleAddCart = async (wishlistItem) => {
    const variant = wishlistItem.variant;
    const stockAvailable = variant?.product_stock?.StockQuantity > 0;

    if (!stockAvailable) {
      toast.error("Product is out of stock!");
      return;
    }

    const filteredCartItems = cartItems.filter((item) =>
      user?.id ? item.user_id === user.id : item.user_id === null
    );
    const matchedItem = filteredCartItems.find((item) => item.id === variant.id);

    if (matchedItem) {
      toast.error("This product is already in your cart!");
      return;
    }

    const finalPrice = calculateFinalPrice(variant);

    const newProduct = {
      ...variant,
      quantity: 1,
      user_id: user?.id || null,
      final_price: finalPrice,
    };

    try {
      dispatch(addToCart(newProduct));
      // Delete from wishlist
      await deleteWishlistItem(wishlistItem.id).unwrap();
      toast.success(`Added to cart and removed from wishlist!`);
    } catch (error) {
      console.error("Error during add to cart or delete:", error);
      toast.error("Failed to remove item from wishlist, but added to cart!");
    }
  };

  // Rating styles
  const customStyles = {
    itemShapes: Star,
    boxBorderWidth: 0,
    activeFillColor: '#FA8232',
    inactiveFillColor: '#AFAFAF',
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-main-600" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-gray-500">Error loading wishlist: {error.message}</div>;
  }

  if (!wishlistData.length) {
    return <div className="text-center py-4 text-gray-500">Your wishlist is empty.</div>;
  }

  console.log(wishlistData);

  return (
    <section className="cart py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-lg-11">
            <div className="cart-table border border-gray-100 rounded-8">
              <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                <table className="table rounded-8 overflow-hidden">
                  <thead>
                    <tr className="border-bottom border-neutral-100">
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Delete</th>
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Product Name</th>
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Unit Price</th>
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Stock Status</th>
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32" />
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistData.map((item, i) => {
                      const { average, total } = calculateAverageRating(item.variant?.review_rating);
                      const finalPrice = calculateFinalPrice(item.variant);
                      const regularPrice = parseFloat(item.variant?.regular_price);
                      const hasDiscount = finalPrice < regularPrice;

                      return (
                        <tr key={i}>
                          <td className="px-40 py-32 border-end border-neutral-100">
                            <button
                              type="button"
                              className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                              onClick={() => handleDeleteItems(item.id)}
                            >
                              <i className="ph ph-x-circle text-2xl d-flex" />
                              Remove
                            </button>
                          </td>
                          <td className="px-40 py-32 border-end border-neutral-100">
                            <div className="table-product d-flex align-items-center gap-24">
                              <Link
                                to={`/product-details-two/${item.variant?.id}`}
                                className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                              >
                                <img
                                  src={
                                    item?.variant?.variant_image?.[0]?.image
                                      ? `http://127.0.0.1:8000/${item.variant.variant_image[0].image}`
                                      : "assets/images/thumbs/product-two-img1.png"
                                  }
                                  alt={item?.variant?.variant_name || "Product Image"}
                                  className="w-full h-auto object-contain rounded-8"
                                />
                              </Link>
                              <div className="table-product__content text-start">
                                <h6 className="title text-lg fw-semibold mb-8">
                                  <Link
                                    to={`/product-details-two/${item.variant?.id}`}
                                    className="link text-line-2"
                                    tabIndex={0}
                                  >
                                    {item?.variant?.variant_name || "Unnamed Product"}
                                  </Link>
                                </h6>
                                <div className="flex-align gap-16 mb-16">
                                  {/* <div className="flex-align gap-6">
                                    <Rating
                                      value={average}
                                      readOnly
                                      itemStyles={customStyles}
                                      style={{ maxWidth: 80 }}
                                    />
                                    <span className="text-md fw-semibold text-gray-900">{average}</span>
                                  </div> */}
                                  <div className="flex-align gap-6">
                                    <span className="text-md fw-medium text-warning-600 d-flex">
                                      <i className="ph-fill ph-star" />
                                    </span>
                                    <span className="text-md fw-semibold text-gray-900">{average}</span>
                                  </div>
                                  <span className="text-sm fw-medium text-gray-200">|</span>
                                  <span className="text-neutral-600 text-sm">{total} Reviews</span>
                                </div>
                                <div className="flex-align gap-16">
                                  <span className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium">
                                    Camera
                                  </span>
                                  <span className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium">
                                    Videos
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-40 py-32 border-end border-neutral-100">
                            <div className="flex-align gap-8">
                              {hasDiscount && (
                                <div className="flex-align gap-8 text-main-two-600">
                                  <i className="ph-fill ph-seal-percent text-xl" />
                                  -{item.variant?.product_variant_promotion?.coupon?.discount_value}
                                  {item.variant?.product_variant_promotion?.coupon?.discount_type === 'percentage' ? '%' : '$'}
                                </div>
                              )}
                              <span className="text-lg h6 mb-0 fw-semibold">
                                ${finalPrice.toFixed(2)}
                              </span>
                              {hasDiscount && (
                                <span className="text-md text-gray-400 text-decoration-line-through">
                                  ${regularPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-40 py-32 border-end border-neutral-100">
                            <span className="text-lg h6 mb-0 fw-semibold">
                              {item?.variant?.product_stock?.StockQuantity > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="px-40 py-32">
                            <button
                              className="btn btn-main-two rounded-8 px-64"
                              onClick={() => handleAddCart(item)}
                            >
                              Add To Cart <i className="ph ph-shopping-cart" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1050,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeIn 0.3s ease-in-out',
          }}
          onClick={cancelDelete}
        >
          <div
            style={{
              maxWidth: '400px',
              width: '100%',
              background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              padding: '24px',
              position: 'relative',
              animation: 'slideIn 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1C1B1B',
                  margin: '0 auto',
                  textAlign: 'center',
                }}
              >
                Remove Item
              </h1>
              <button
                onClick={cancelDelete}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#1C1B1B',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1',
                }}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <p
                style={{
                  fontSize: '18px',
                  color: '#4B5563',
                  margin: '0',
                  lineHeight: '1.5',
                }}
              >
                Are you sure you want to remove this item from your wishlist?
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
              }}
            >
              <button
                onClick={cancelDelete}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1C1B1B',
                  background: '#E5E7EB',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.background = '#D1D5DB')}
                onMouseOut={(e) => (e.target.style.background = '#E5E7EB')}
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  background: 'linear-gradient(90deg, #FA6400, #FA6400)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = 'linear-gradient(90deg, #FA6400, #FA6400)')
                }
                onMouseOut={(e) =>
                  (e.target.style.background = 'linear-gradient(90deg, #FA6400, #FA6400)')
                }
                aria-label="Confirm removal"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WishListSection;