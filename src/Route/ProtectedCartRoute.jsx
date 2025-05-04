import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedCartRoute = ({ element }) => {
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);


  const filteredCartItems = cartItems.filter((item) =>
    user?.id ? item.user_id === user.id : item.user_id == null
  );


  const hasItemsInCart = filteredCartItems.length > 0;

  return hasItemsInCart ? element : <Navigate to="/shop" replace />;
};

export default ProtectedCartRoute;