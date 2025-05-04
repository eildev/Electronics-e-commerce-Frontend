// src/features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getCartFromLocalStorage, saveCartToLocalStorage } from '../../../utils/localstorage';

// Initial state
const initialState = {
  cartItems: getCartFromLocalStorage(),
};

// const { user } = useSelector((state) => state.auth);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((cartItem) => cartItem.id === item.id && cartItem.user_id === item.user_id);
  

      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });

      }
      saveCartToLocalStorage(state.cartItems);
      
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(cartItem => cartItem.id !== action.payload);
      saveCartToLocalStorage(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('eCartItems');
    },
    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find(cartItem => cartItem.id === itemId);
      if (item) {
        
        item.quantity += 1;
        saveCartToLocalStorage(state.cartItems);
      }
    },
    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find(cartItem => cartItem.id === itemId);
      if (item && item.quantity > 1) { 
        item.quantity -= 1;
        saveCartToLocalStorage(state.cartItems);
      }
    },

    updateCartUserId: (state, action) => {
      const userId = action.payload;
    
      const isUserIdAlreadyPresent = state.cartItems.some(
        (item) => item.user_id === userId
      );
    
      if (isUserIdAlreadyPresent) return;

      const updatedCart = state.cartItems.map((item) => {
        if (item.user_id === null) {
          return { ...item, user_id: userId };
        }
        return item;
      });
    
      state.cartItems = updatedCart;
      saveCartToLocalStorage(updatedCart);
    }
    
  }
});

export const { addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity, updateCartUserId, } = cartSlice.actions;
export default cartSlice.reducer;