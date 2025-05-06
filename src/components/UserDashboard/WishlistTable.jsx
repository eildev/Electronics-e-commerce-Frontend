import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

import { useGetWishlistByUserIdQuery } from '../../redux/features/api/wishlistByUserAPI';

const WishlistTable = ({ wishlistItems, onRemoveFromWishlist, onAddToCart }) => {
     const { token, user } = useSelector((state) => state.auth);
    const {
        data: wishlist,
        error,
        isLoading,
      } = useGetWishlistByUserIdQuery(user?.id, {
        skip: !user?.id,
      });
      console.log(wishlist);
    // const getStockStatusClass = (status) => {
    //     return status.toLowerCase() === 'in stock'
    //         ? 'bg-success-100 text-success-600'
    //         : 'bg-danger-100 text-danger-600';
    // };

    const handleRemove = (itemId) => {
        onRemoveFromWishlist(itemId);
        toast.success('Item removed from wishlist');
    };

    const handleAddToCart = (item) => {
        if (item.stock_status.toLowerCase() === 'in stock') {
            onAddToCart(item);
            toast.success('Item added to cart');
        } else {
            toast.error('Item is out of stock');
        }
    };

    return (
        <div className="wishlist-table border border-gray-200 rounded-12 shadow-sm p-32 bg-white">
            <h3 className="text-xl fw-semibold mb-24 text-gray-900">Your Wishlist</h3>
            <div className="overflow-x-auto">
                <table className="table w-100">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Product</th>
                            <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Price</th>
                            {/* <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Stock Status</th> */}
                            <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wishlist?.wishlist?.length > 0 ? (
                            wishlist?.wishlist?.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="py-16 px-24">
                                        <div className="d-flex align-items-center gap-16">
                                            <Link
                                                to={`/product-details-two/${item.id}`}
                                                className="w-64 h-64 border border-gray-100 rounded-8 flex-center"
                                            >
                                                <img
                                                    src={`http://127.0.0.1:8000/${item?.variant?.variant_image[0]?.image}`|| `/placeholder-image.jpg`}
                                                    alt={item.name || 'Product'}
                                                    className="w-100 h-100 object-fit-cover"
                                                    onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                                                />
                                            </Link>
                                            <div className="text-start">
                                                <h6 className="text-md fw-semibold mb-8 text-gray-900">
                                                    <Link
                                                        to={`/product-details-two/${item.id}`}
                                                        className="text-line-2 hover-text-main-600"
                                                    >
                                                        {item?.wishlist_product?.product_name || 'Unnamed Product'}
                                                    </Link>
                                                </h6>
                                                {/* {item.rating && (
                                                    <div className="flex-align gap-8">
                                                        <span className="text-sm text-gray-600">
                                                            {item.rating.toFixed(1)} ★
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            ({item.reviews || 0} reviews)
                                                        </span>
                                                    </div>
                                                )} */}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-16 px-24 text-gray-900 text-sm fw-medium">
                                        {/* {item.discountPrice ? (
                                            <>
                                                <span className="text-gray-400 text-sm fw-semibold text-decoration-line-through me-2">
                                                    ${item.regularPrice.toFixed(2)}
                                                </span>
                                                <span className="text-md fw-semibold text-gray-900">
                                                    ${item.discountPrice.toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-md fw-semibold text-gray-900">
                                                ${item.regularPrice.toFixed(2)}
                                            </span>
                                        )} */}
                                         ${item?.variant.regular_price}
                                    </td>
                                    {/* <td className="py-16 px-24">
                                        <span
                                            className={`inline-block px-12 py-4 rounded-6 text-sm fw-medium ${getStockStatusClass(
                                                item.stock_status
                                            )}`}
                                        >
                                            {item.stock_status}
                                        </span>
                                    </td> */}
                                    <td className="py-16 px-24">
                                        <div className="d-flex gap-12">
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                className="btn btn-main-600 bg-main-400 text-sm py-8 px-16 rounded-8 hover-bg-main-700 hover-text-white transition-all duration-200"
                                                
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="btn btn-outline-danger-600 bg-main-400 text-sm py-8 px-16 rounded-8 hover-bg-danger-600 hover-text-white transition-all duration-200"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-32 text-gray-600 text-md">
                                    Your wishlist is empty.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WishlistTable;