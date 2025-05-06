import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems(state, action) {
      state.wishlistItems = action.payload;
    },
    addToWishlist(state, action) {
      const item = action.payload;
      const exists = state.wishlistItems.some(w => w.variant_id == item.variant_id);
      if (!exists) {
        state.wishlistItems.push(item);
      }
    },
    removeFromWishlist(state, action) {
      const variantId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(w => w.variant_id != variantId);
    },
  },
});

export const { setWishlistItems, addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;