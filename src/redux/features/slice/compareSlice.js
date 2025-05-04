import { createSlice } from '@reduxjs/toolkit';

const compareSlice = createSlice({
  name: 'compare',
  initialState: {
    compareItems: [],
  },
  reducers: {
    addToCompare: (state, action) => {
      if (state.compareItems.length >= 4) {
        return; // Limit to 4 products
      }
      if (!state.compareItems.find(item => item.id === action.payload.id)) {
        state.compareItems.push(action.payload);
      }
    },
    removeFromCompare: (state, action) => {
      state.compareItems = state.compareItems.filter(item => item.id !== action.payload);
    },
    clearCompare: (state) => {
      state.compareItems = [];
    },
    setCompareItems: (state, action) => {
      state.compareItems = action.payload;
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare, setCompareItems } = compareSlice.actions;
export default compareSlice.reducer;