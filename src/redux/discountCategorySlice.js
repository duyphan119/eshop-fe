import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  current: null,
  all: [],
  discountCategory: null,
};
const discountCategorySlice = createSlice({
  name: "discountCategory",
  initialState: initialState,
  reducers: {
    getAllDiscountCategories: (state, action) => {
      state.all = action.payload;
    },
    getCurrentDiscountCategory: (state, action) => {
      state.current = action.payload;
    },
    getDiscountCategory: (state, action) => {
      state.discountCategory = action.payload;
    },
  },
});
export const {
  getAllDiscountCategories,
  getCurrentDiscountCategory,
  getDiscountCategory,
} = discountCategorySlice.actions;
export default discountCategorySlice.reducer;
