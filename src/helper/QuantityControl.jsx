import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { incrementQuantity as incrementAction, decrementQuantity as decrementAction } from '../redux/features/slice/cartSlice';

const QuantityControl = ({ initialQuantity = 1, item }) => {
  const [quantity, setQuantity] = useState(item?.quantity || initialQuantity);
  const dispatch = useDispatch();
  const maxStock = item?.product_stock?.StockQuantity || 0;

  useEffect(() => {
    setQuantity(item?.quantity || initialQuantity);
  }, [item?.quantity, initialQuantity]);

  const incrementQuantity = () => {
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
      dispatch(incrementAction(item.id)); 
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      dispatch(decrementAction(item.id)); 
    }
  };

  return (
    <div className="d-flex rounded-4 overflow-hidden">
      <button
        type="button"
        onClick={decrementQuantity}
        className="quantity__minus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
        disabled={quantity <= 1}
      >
        <i className="ph ph-minus" />
      </button>
      <input
        type="number"
        className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-4"
        value={quantity}
        min={1}
        readOnly
      />
      <button
        type="button"
        onClick={incrementQuantity}
        className="quantity__plus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
        disabled={quantity >= maxStock}
      >
        <i className="ph ph-plus" />
      </button>
    </div>
  );
};

export default QuantityControl;