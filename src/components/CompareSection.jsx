
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { useGetCategoryApiQuery } from '../redux/features/api/categoryApi';
import { useGetBrandQuery } from '../redux/features/api/brandApi';
import { clearCompare, removeFromCompare, setCompareItems } from '../redux/features/slice/compareSlice';
import { addToCart } from '../redux/features/slice/cartSlice';

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Helper function to extract key features from HTML ingredients
const extractFeatures = (html) => {
  if (!html) return [];
  const regex = /<span class="a-list-item">([^<]+)</g;
  const features = [];
  let match;
  while ((match = regex.exec(html)) !== null && features.length < 3) {
    features.push(match[1]);
  }
  return features;
};

const CompareSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { compareItems } = useSelector((state) => state.compare);
  const { user } = useSelector((state) => state.auth);
  const { data: categoryApi, isLoading: categoryLoading } = useGetCategoryApiQuery();
  const { data: brandData, isLoading: brandLoading } = useGetBrandQuery();

  // Load compare items from localStorage on mount
  useEffect(() => {
    const storedItems = localStorage.getItem('compareItems');
    if (storedItems) {
      const parsedItems = JSON.parse(storedItems);
      if (Array.isArray(parsedItems) && parsedItems.length <= 4) {
        dispatch(setCompareItems(parsedItems));
      }
    }
  }, [dispatch]);

  // Update localStorage whenever compareItems change
  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  // Handle remove product
  const handleRemove = (itemId) => {
    dispatch(removeFromCompare(itemId));
    toast.success('Product removed from comparison');
  };

  // Handle clear all
  const handleClearAll = () => {
    dispatch(clearCompare());
    localStorage.removeItem('compareItems');
    toast.success('Cleared all comparison products');
  };

  // Handle Buy Now
  const handleBuyNow = (item) => {
    if (!item.product_stock?.StockQuantity) {
      toast.error('Product is out of stock!');
      return;
    }

    const newProduct = {
      ...item,
      quantity: 1,
      user_id: user?.id || null,
      final_price: parseFloat(item.regular_price),
    };

    dispatch(addToCart(newProduct));
    toast.success('Added to cart! Redirecting to checkout...');
    navigate('/checkout');
  };

  // Rating styles
  const customStyles = {
    itemShapes: Star,
    boxBorderWidth: 0,
    activeFillColor: '#FA8232',
    inactiveFillColor: '#AFAFAF',
  };

  // Get category and brand names
  const getCategoryName = (categoryId, subcategoryId) => {
    if (categoryLoading || !categoryApi?.categories) return 'N/A';
    const category = categoryApi.categories.find(cat => cat.id === categoryId || cat.id === subcategoryId);
    return category?.categoryName || 'N/A';
  };

  const getBrandName = (brandId) => {
    if (brandLoading || !brandData?.Brands) return 'N/A';
    const brand = brandData.Brands.find(b => b.id === brandId);
    return brand?.BrandName || 'N/A';
  };

  if (categoryLoading || brandLoading) {
    return (
      <section className="compare py-80">
        <div className="container container-lg">
          <div className="text-center py-4">
            <div className="spinner-border text-main-600" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (compareItems.length === 0) {
    return (
      <section className="compare py-80">
        <div className="container container-lg">
          <div className="bg-main-50 border border-gray-100 rounded-16 p-40 text-center">
            <h4 className="text-xl fw-semibold text-heading mb-16">
              No Products Selected for Comparison
            </h4>
            <p className="text-gray-700 mb-24">
              Add products to compare their features and find the best fit for you.
            </p>
            <Link
              to="/shop"
              className="btn btn-main rounded-8 py-16 px-24 flex-center gap-8 mx-auto"
            >
              <i className="ph ph-storefront text-lg" />
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="compare py-80">
      <div className="container container-lg">
        <div className="mb-32 flex-between flex-wrap gap-16">
          <h4 className="text-xl fw-semibold text-heading">
            Compare Products ({compareItems.length}/4)
          </h4>
          <button
            className="btn bg-danger text-white rounded-8 py-16 px-24 flex-center gap-8"
            onClick={handleClearAll}
            disabled={compareItems.length === 0}
          >
            <i className="ph ph-trash text-lg" />
            Clear All
          </button>
        </div>
        <div className="compare-grid d-flex overflow-x-auto gap-24">
          <AnimatePresence>
            {compareItems.map((item) => (
              <motion.div
                key={item.id}
                className="compare-card w-280 bg-white border border-gray-100 rounded-16 p-24"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Product Header */}
                <div className="text-center mb-24">
                  <Link to={`/product-details-two/${item.id}`}>
                    <motion.img
                      src={
                        item?.variant_image?.[0]?.image
                          ? `http://127.0.0.1:8000/${item.variant_image[0].image}`
                          : 'assets/images/thumbs/product-two-img1.png'
                      }
                      alt={item?.variant_name || 'Product Image'}
                      style={{ height: '250px', width: "100%",  objectFit: 'cover', margin: "0 auto", }}
                      className="w-100 mb-16"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                  <Link
                    to={`/product-details-two/${item.id}`}
                    className="text-md fw-semibold text-heading line-clamp-2 hover-text-main-600 w-100"
                  >
                    {truncateText(item?.variant_name || 'Unnamed Product', 50)}
                  </Link>
                </div>

                {/* Attributes */}
                <div className="compare-attributes">
                  {/* Product Name */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Product</span>
                    <span className="text-md text-gray-700">
                      {truncateText(item?.product?.product_name || 'N/A', 50)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Price</span>
                    <span className="text-md fw-bold text-main-600">
                      ${parseFloat(item?.regular_price).toFixed(2)}
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Stock</span>
                    <span
                      className={`text-md fw-semibold ${
                        item?.product_stock?.StockQuantity > 0
                          ? 'text-success-600'
                          : 'text-danger-600'
                      }`}
                    >
                      {item?.product_stock?.StockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Stock Quantity */}
                  {item?.product_stock?.StockQuantity > 0 && (
                    <div className="attribute-item py-16 border-bottom border-gray-100">
                      <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Available Quantity</span>
                      <span className="text-md text-gray-700">
                        {item.product_stock.StockQuantity}
                      </span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Rating</span>
                    <div className="flex-align gap-8">
                      <Rating
                        value={
                          item?.review_rating?.length > 0
                            ? item.review_rating.reduce((sum, review) => sum + review.rating, 0) /
                              item.review_rating.length
                            : 0
                        }
                        readOnly
                        itemStyles={customStyles}
                        style={{ maxWidth: 100 }}
                      />
                      <span className="text-xs fw-medium text-gray-500">
                        ({item?.review_rating?.length || 0})
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Category</span>
                    <span className="text-md text-gray-700">
                      {getCategoryName(item?.product?.category_id, item?.product?.subcategory_id)}
                    </span>
                  </div>

                  {/* Brand */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Brand</span>
                    <span className="text-md text-gray-700">
                      {getBrandName(item?.product?.brand_id)}
                    </span>
                  </div>

                  {/* SKU */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">SKU</span>
                    <span className="text-md text-gray-700">{item?.product?.sku || 'N/A'}</span>
                  </div>

                  {/* Color */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Color</span>
                    <span className="text-md text-gray-700">{item?.color || 'N/A'}</span>
                  </div>

                  {/* Size */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Size</span>
                    <span className="text-md text-gray-700">{item?.size || 'N/A'}</span>
                  </div>

                  {/* Weight */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Weight</span>
                    <span className="text-md text-gray-700">{item?.weight ? `${item.weight} g` : 'N/A'}</span>
                  </div>

                  {/* Short Description */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Description</span>
                    <span className="text-md text-gray-700">
                      {truncateText(item?.product?.product_details?.short_description || 'N/A', 100)}
                    </span>
                  </div>

                  {/* Gender */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Gender</span>
                    <span className="text-md text-gray-700">{item?.product?.product_details?.gender || 'N/A'}</span>
                  </div>

                  {/* Shipping Charge */}
                  <div className="attribute-item py-16 border-bottom border-gray-100">
                    <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Shipping</span>
                    <span className="text-md text-gray-700">
                      {item?.product?.shipping_charge === 'paid' ? 'Paid' : 'Free'}
                    </span>
                  </div>

                  {/* Key Features */}
                  {item?.product?.product_details?.ingredients && (
                    <div className="attribute-item py-16 border-bottom border-gray-100">
                      <span className="text-sm fw-medium text-gray-600 mb-8 d-block">Key Features</span>
                      <ul className="list-unstyled text-md text-gray-700 ps-0">
                        {extractFeatures(item.product.product_details.ingredients).map((feature, index) => (
                          <li key={index}>{truncateText(feature, 50)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="attribute-item py-16 text-center d-flex gap-10">
                    <button
                      type="button"
                      className="btn bg-danger text-white rounded-8 py-16 px-24 w-100 flex-center gap-8"
                      onClick={() => handleRemove(item.id)}
                    >
                      <i className="ph ph-x-circle text-lg" />
                      Remove
                    </button>
                    <button
                      type="button"
                      className={`btn btn-main rounded-8 px-24 w-100 flex-center gap-8 ${
                        !item.product_stock?.StockQuantity ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleBuyNow(item)}
                      disabled={!item.product_stock?.StockQuantity}
                    >
                      <i className="ph ph-shopping-cart text-lg" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CompareSection;
