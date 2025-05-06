import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { useGetOrderInfoQuery } from '../../redux/features/api/orderGetApi';
import { useGetOrderHistoryQuery } from '../../redux/features/api/orderHistoryApi';


const OrdersTable = () => {
  const { user } = useSelector((state) => state.auth);
  const userID = user?.id;

  // Fetch ongoing orders
  const {
    data: ongoingOrdersData,
    isLoading: ongoingLoading,
    error: ongoingError,
  } = useGetOrderInfoQuery(userID);

  // Fetch historical orders
  const {
    data: historyOrdersData,
    isLoading: historyLoading,
    error: historyError,
  } = useGetOrderHistoryQuery(userID);
console.log(historyOrdersData);
  // Combine ongoing and historical orders
  const allOrders = [
    ...(ongoingOrdersData?.data || []),
    ...(historyOrdersData?.data || []),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // State for review modal
  const [reviewItem, setReviewItem] = useState(null);

  // Open modal when reviewItem is set
  useEffect(() => {
    if (reviewItem) {
      document.getElementById('review_modal').showModal();
    }
  }, [reviewItem]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-success-100 text-success-600';
      case 'processing':
        return 'bg-warning-100 text-warning-600';
      case 'shipped':
        return 'bg-info-100 text-info-600';
      case 'cancelled':
        return 'bg-danger-100 text-danger-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleReviewClick = (order) => {
    setReviewItem(order);
  };

  // Simplified review submission (replace with actual API call if needed)
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    toast.success('Review submitted successfully!');
    document.getElementById('review_modal').close();
    setReviewItem(null);
  };

  return (
    <div className="orders-table border border-gray-200 rounded-12 shadow-sm p-32 bg-white">
      <h3 className="text-xl fw-semibold mb-24 text-gray-900">Your Orders</h3>
      <div className="overflow-x-auto">
        {ongoingLoading  ? (
          <p className="text-center text-gray-600 text-md py-32">Loading orders...</p>
        ) : ongoingError  ? (
          <p className="text-center text-danger text-md py-32">
            {ongoingError?.data?.message || historyError?.data?.message || 'Error fetching orders. Please try again.'}
          </p>
        ) : allOrders.length === 0 ? (
          <p className="text-center text-gray-600 text-md py-32">
            You have no orders yet.
          </p>
        ) : (
          <table className="table w-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Order ID</th>
                <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Date</th>
                <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Total</th>
                <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Status</th>
                <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Payment</th>
                <th className="text-sm fw-semibold text-gray-600 py-16 px-24 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-16 px-24 text-gray-900 text-sm fw-medium">
                    #{order.invoice_number}
                  </td>
                  <td className="py-16 px-24 text-gray-600 text-sm">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-16 px-24 text-gray-900 text-sm fw-medium">
                    ৳ {parseFloat(order.grand_total).toFixed(2)}
                  </td>
                  <td className="py-16 px-24">
                    <span
                      className={`inline-block px-12 py-4 rounded-6 text-sm fw-medium ${getStatusBadgeClass(
                        order.order_status
                      )}`}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td className="py-16 px-24 text-gray-600 text-sm">
                    {order.payment_method}
                  </td>
                  <td className="py-16 px-24">
                    <div className="d-flex gap-2">
                      <Link
                        to={`/order-details/${order.id}`}
                        className="btn btn-outline-main-600 text-sm py-8 px-16 rounded-8 bg-main-600 hover-bg-main-800 hover-text-white transition-all duration-200"
                      >
                        View Details
                      </Link>
                      {order.order_status.toLowerCase() === 'delivered' && (
                        <button
                          onClick={() => handleReviewClick(order)}
                          className="btn btn-outline-secondary text-sm py-8 px-16 rounded-8 hover-bg-secondary hover-text-white transition-all duration-200"
                        >
                          Give Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Review Modal (Styled with Bootstrap) */}
      <dialog id="review_modal" className="modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-md fw-bold text-secondary">Give Review</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  document.getElementById('review_modal').close();
                  setReviewItem(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              {reviewItem && (
                <form onSubmit={handleReviewSubmit}>
                  <p className="text-sm text-gray-600 mb-3">
                    Order #{reviewItem.invoice_number} -{' '}
                    {reviewItem.order_details[0]?.product?.product_name}
                  </p>
                  <textarea
                    className="form-control w-100 p-3"
                    rows="4"
                    placeholder="Write your review..."
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="btn btn-secondary w-100 mt-3 py-3 text-sm text-white"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default OrdersTable;