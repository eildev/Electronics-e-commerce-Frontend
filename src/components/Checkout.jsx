import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { districts, upazilasByDistrict } from '../utils/districtsAndUpazilas';
import { usePlaceOrderMutation } from '../redux/features/api/checkoutApi';
import { getOrCreateSessionId } from '../utils/getSessionId';
import { clearCart } from '../redux/features/slice/cartSlice';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { coupon, cartTotals } = location.state || {};
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [placeOrder, { isLoading: orderLoading, isSuccess: orderSuccess, error: orderError }] =
    usePlaceOrderMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    resetField,
  } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      district: '',
      upazila: '',
      notes: '',
      payment: '',
    },
  });

  const selectedDistrict = watch('district');
  const selectedPayment = watch('payment');

  useEffect(() => {
    console.log('Current Form Data:', watch());
  }, [watch]);

  useEffect(() => {
    resetField('upazila');
  }, [selectedDistrict, resetField]);

  const filteredCartItems = cartItems.filter((item) =>
    user?.id ? item.user_id === user.id : item.user_id == null
  );

  // Function to calculate the final price for a product variant
  const calculateFinalPrice = (item) => {
    const regularPrice = parseFloat(item.regular_price);
    const coupon = item.product_variant_promotion?.coupon;

    // If final_price is already stored in the cart item, use it
    if (item.final_price !== undefined) {
      return parseFloat(item.final_price);
    }

    // Otherwise, calculate it
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

  // Calculate subtotal using final prices
  const subTotalPrice = filteredCartItems.reduce((sum, item) => {
    const finalPrice = calculateFinalPrice(item);
    const quantity = item?.quantity || 1;
    return sum + finalPrice * quantity;
  }, 0);

  // Calculate shipping
  const shippingQuantity = filteredCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingPrice = filteredCartItems.length > 0 ? 80 + (shippingQuantity - 1) * 20 : 0;

  // Calculate tax (2% of subtotal)
  const taxRate = 0.02;
  const taxAmount = (subTotalPrice * taxRate).toFixed(2);

  // Calculate discount from global coupon
  const discountAmount = coupon
    ? coupon.discount_type === 'fixed'
      ? coupon.discount_value
      : (coupon.discount_value * subTotalPrice) / 100
    : 0;

  // Calculate grand total
  const grandTotal = (subTotalPrice - discountAmount + parseFloat(taxAmount) + shippingPrice).toFixed(2);

  const userSessionId = getOrCreateSessionId();

  const onSubmit = async (data) => {
    const orderData = {
      products: filteredCartItems.map((item) => {
        const finalPrice = calculateFinalPrice(item);
        const productCoupon = item.product_variant_promotion?.coupon;

        return {
          variant_id: item.id,
          product_id: item.product_id,
          variant_price: parseFloat(finalPrice.toFixed(2)),
          discount_cut_total_price: parseFloat((finalPrice * item.quantity).toFixed(2)),
          variant_quantity: item.quantity,
          coupon_code: productCoupon?.code || coupon?.code || '',
        };
      }),
      combo: [],
      full_name: data.fullName,
      address: data.address,
      email: data.email,
      district: data.district,
      police_station: data.upazila,
      postal_code: 1000,
      payment_method: data.payment === 'payment1' ? 'bank' : data.payment === 'payment2' ? 'card' : 'cod',
      shipping_method: 'In-House',
      shipping_charge: shippingPrice,
      phone_number: data.phone,
      coupon_code: coupon?.code || '',
      order_note: data.notes,
      ...(user?.id ? { user_id: user.id } : { session_id: userSessionId }),
    };

    console.log(orderData);

    try {
      const response = await placeOrder(orderData).unwrap();
      console.log(response);
      if (response?.status === 200 || response?.success) {
        console.log(orderData);
        toast.success('Order placed successfully!');
        reset();
        dispatch(clearCart());
        // const invoiceNumber = response?.order?.invoice_number || 'INV_DEFAULT';
        // setTimeout(() => {
        //   navigate(`/order-confirmation?invoice=${invoiceNumber}`, {
        //     replace: true,
        //   });
        // }, 100);
      } else {
        console.log(orderData);
        toast.error('Order placement unsuccessful!');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      console.log(orderData);
      toast.error('Failed to place order.');
    }
  };

  const districtOptions = districts.map((district) => ({
    value: district,
    label: district,
  }));

  const upazilaOptions = selectedDistrict
    ? (upazilasByDistrict[selectedDistrict] || []).map((upazila) => ({
        value: upazila,
        label: upazila,
      }))
    : [];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      width: '100%',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#e5e7eb',
      },
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: '#f3f4f6',
      },
    }),
  };

  return (
    <section className="checkout py-80">
      <div className="container container-lg">
        <div className="border border-gray-100 rounded-8 px-30 py-20 mb-40">
          <span>
            {coupon ? (
              `Coupon Applied: ${coupon.code} (${coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`})`
            ) : (
              <>
                Have a coupon?{' '}
                <Link
                  to="/cart"
                  className="fw-semibold text-gray-900 hover-text-decoration-underline hover-text-main-600"
                >
                  Click here to enter your code
                </Link>
              </>
            )}
          </span>
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="pe-xl-5">
              <div className="row gy-3">
                <div className="col-12">
                  <input
                    type="text"
                    className={`common-input border-gray-100 ${errors.fullName ? 'is-invalid' : ''}`}
                    placeholder="Full Name"
                    {...register('fullName', { required: 'Full Name is required' })}
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName.message}</div>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="number"
                    className={`common-input border-gray-100 ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="Phone Number"
                    {...register('phone', { required: 'Phone Number is required' })}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone.message}</div>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="email"
                    className="common-input border-gray-100"
                    placeholder="Email Address"
                    {...register('email')}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className={`common-input border-gray-100 ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Address"
                    {...register('address', { required: 'Address is required' })}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">{errors.address.message}</div>
                  )}
                </div>
                <div className="col-12">
                  <Controller
                    name="district"
                    control={control}
                    rules={{ required: 'District is required' }}
                    render={({ field }) => (
                      <Select
                        options={districtOptions}
                        value={districtOptions.find((option) => option.value === field.value) || null}
                        onChange={(option) => {
                          field.onChange(option ? option.value : '');
                          console.log('District changed:', option ? option.value : '');
                        }}
                        placeholder="Select District"
                        styles={customStyles}
                        isClearable
                        isSearchable
                        className={errors.district ? 'is-invalid' : ''}
                      />
                    )}
                  />
                  {errors.district && (
                    <div className="invalid-feedback">{errors.district.message}</div>
                  )}
                </div>
                <div className="col-12">
                  <Controller
                    name="upazila"
                    control={control}
                    rules={{ required: 'Upazila is required' }}
                    render={({ field }) => (
                      <Select
                        options={upazilaOptions}
                        value={upazilaOptions.find((option) => option.value === field.value) || null}
                        onChange={(option) => {
                          field.onChange(option ? option.value : '');
                          console.log('Upazila changed:', option ? option.value : '');
                        }}
                        placeholder="Select Upazila"
                        styles={customStyles}
                        isDisabled={!selectedDistrict}
                        isClearable
                        isSearchable
                        className={errors.upazila ? 'is-invalid' : ''}
                      />
                    )}
                  />
                  {errors.upazila && (
                    <div className="invalid-feedback">{errors.upazila.message}</div>
                  )}
                </div>
                <div className="col-12">
                  <div className="my-40">
                    <h6 className="text-lg mb-24">Additional Information</h6>
                    <input
                      type="text"
                      className="common-input border-gray-100"
                      placeholder="Notes about your order, e.g., special notes for delivery"
                      {...register('notes')}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="col-xl-3 col-lg-4">
            <div className="checkout-sidebar">
              <div className="bg-color-three rounded-8 p-24 text-center">
                <span className="text-gray-900 text-xl fw-semibold">Your Orders</span>
              </div>
              <div className="border border-gray-100 rounded-8 px-24 py-40 mt-24">
                <div className="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                  <span className="text-gray-900 fw-medium text-xl font-heading-two">Product</span>
                  <span className="text-gray-900 fw-medium text-xl font-heading-two">Subtotal</span>
                </div>
                {filteredCartItems.map((item, index) => {
                  const finalPrice = calculateFinalPrice(item);
                  const regularPrice = parseFloat(item.regular_price);
                  const hasDiscount = finalPrice < regularPrice;

                  return (
                    <div className="flex-between gap-24 mb-32" key={index}>
                      <div className="flex-align gap-12">
                        <span className="text-gray-900 fw-normal text-md font-heading-two w-144">
                          {item.variant_name}
                        </span>
                        <span className="text-gray-900 fw-normal text-md font-heading-two">
                          <i className="ph-bold ph-x" />
                        </span>
                        <span className="text-gray-900 fw-semibold text-md font-heading-two">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="text-right">
                        {hasDiscount && (
                          <span className="text-gray-400 text-md fw-semibold text-decoration-line-through mb-1 d-block">
                            ${(regularPrice * item.quantity).toFixed(2)}
                          </span>
                        )}
                        <span className="text-gray-900 fw-bold text-md font-heading-two">
                          ${(finalPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-32 pt-32 border-top border-gray-100">
                  <div className="flex-between gap-8 mb-16">
                    <span className="text-gray-900 fw-normal text-md font-heading-two">Subtotal</span>
                    <span className="text-gray-900 fw-bold text-md font-heading-two">${subTotalPrice.toFixed(2)}</span>
                  </div>
                  {coupon && (
                    <div className="flex-between gap-8 mb-16">
                      <span className="text-success-600 fw-normal text-md font-heading-two">Discount</span>
                      <span className="text-success-600 fw-bold text-md font-heading-two">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex-between gap-8 mb-16">
                    <span className="text-gray-900 fw-normal text-md font-heading-two">Shipping</span>
                    <span className="text-gray-900 fw-bold text-md font-heading-two">${shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex-between gap-8 mb-16">
                    <span className="text-gray-900 fw-normal text-md font-heading-two">Tax (2%)</span>
                    <span className="text-gray-900 fw-bold text-md font-heading-two">${taxAmount}</span>
                  </div>
                  <hr />
                  <div className="flex-between gap-8">
                    <span className="text-gray-900 fw-medium text-xl font-heading-two">Grand Total</span>
                    <span className="text-gray-900 fw-bold text-xl font-heading-two">${grandTotal}</span>
                  </div>
                </div>
              </div>
              <div className="mt-32">
                <div className="payment-item">
                  <div className="form-check common-check common-radio py-16 mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="payment1"
                      value="payment1"
                      {...register('payment', { required: 'Payment method is required' })}
                    />
                    <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment1">
                      Direct Bank Transfer
                    </label>
                  </div>
                  {selectedPayment === 'payment1' && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800">
                        Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                      </p>
                    </div>
                  )}
                </div>
                <div className="payment-item">
                  <div className="form-check common-check common-radio py-16 mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="payment2"
                      value="payment2"
                      {...register('payment', { required: 'Payment method is required' })}
                    />
                    <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment2">
                      Check Payments
                    </label>
                  </div>
                  {selectedPayment === 'payment2' && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800">
                        Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                      </p>
                    </div>
                  )}
                </div>
                <div className="payment-item">
                  <div className="form-check common-check common-radio py-16 mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="payment3"
                      value="payment3"
                      {...register('payment', { required: 'Payment method is required' })}
                    />
                    <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment3">
                      Cash on Delivery
                    </label>
                  </div>
                  {selectedPayment === 'payment3' && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800">
                        Pay upon delivery.
                      </p>
                    </div>
                  )}
                </div>
                {errors.payment && (
                  <div className="invalid-feedback d-block">{errors.payment.message}</div>
                )}
              </div>
              <div className="mt-32 pt-32 border-top border-gray-100">
                <p className="text-gray-500">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                  <Link to="#" className="text-main-600 text-decoration-underline">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
              <button
                type="submit"
                form="checkout-form"
                className={`btn btn-main mt-40 py-18 w-100 rounded-8 ${orderLoading ? 'disabled' : ''}`}
                disabled={orderLoading}
              >
                {orderLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;