
// import { createSlice } from "@reduxjs/toolkit";

// const searchSlice = createSlice({
//   name: "search",
//   initialState: {
//     query: "",
//     isSuggestionsVisible: false,
//   },
//   reducers: {
//     setQuery: (state, action) => {
//       state.query = action.payload;
//     },
//     setSuggestionsVisible: (state, action) => {
//       state.isSuggestionsVisible = action.payload;
//     },
//   },
// });

// export const { setQuery, setSuggestionsVisible } = searchSlice.actions;
// export default searchSlice.reducer;




// searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSearchResults = createAsyncThunk(
  'search/fetchSearchResults',
  async ({ query, category }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/product/search', {
        query,
        category: category !== 'All Categories' ? category : undefined,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    isSuggestionsVisible: false,
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setSuggestionsVisible: (state, action) => {
      state.isSuggestionsVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setQuery, setSuggestionsVisible } = searchSlice.actions;
export default searchSlice.reducer;