import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedItems: [], // Array of item IDs that are selected
    allSelected: false, // Whether all items are selected
};

const selectCartSlice = createSlice({
    name: 'selectCart',
    initialState,
    reducers: {
        toggleItemSelection: (state, action) => {
            const itemId = action.payload;
            if (state.selectedItems.includes(itemId)) {
                state.selectedItems = state.selectedItems.filter(id => id !== itemId);
            } else {
                state.selectedItems.push(itemId);
            }
            state.allSelected = false; // Reset allSelected when toggling individual items
        },
        toggleAllSelection: (state, action) => {
            const allItemIds = action.payload; // Array of all cart item IDs
            state.allSelected = !state.allSelected;
            state.selectedItems = state.allSelected ? [...allItemIds] : [];
        },
        clearSelections: (state) => {
            state.selectedItems = [];
            state.allSelected = false;
        },
    },
});

export const { toggleItemSelection, toggleAllSelection, clearSelections } = selectCartSlice.actions;
export default selectCartSlice.reducer;