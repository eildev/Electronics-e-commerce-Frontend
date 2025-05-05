import { createSlice } from '@reduxjs/toolkit';


const loadState = () => {
  const savedItems = localStorage.getItem('compareItems');
  return savedItems ? { compareItems: JSON.parse(savedItems) } : { compareItems: [] };
};

const compareSlice = createSlice({
  name: 'compare',
  initialState: loadState(),
  reducers: {
    addToCompare: (state, action) => {
      if (state.compareItems.length >= 4) return;
      if (!state.compareItems.find(item => item.id === action.payload.id)) {
        state.compareItems.push(action.payload);
        localStorage.setItem('compareItems', JSON.stringify(state.compareItems));
      }
    },
    removeFromCompare: (state, action) => {
      state.compareItems = state.compareItems.filter(item => item.id !== action.payload);
      localStorage.setItem('compareItems', JSON.stringify(state.compareItems)); 
    },
    clearCompare: (state) => {
      state.compareItems = [];
      localStorage.setItem('compareItems', JSON.stringify(state.compareItems)); 
    },
    setCompareItems: (state, action) => {
      state.compareItems = action.payload;
      localStorage.setItem('compareItems', JSON.stringify(state.compareItems)); 
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare, setCompareItems } = compareSlice.actions;
export default compareSlice.reducer;