import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_DISCOUNT } from "../constants";
const initialState = {
  current: null,
  all: [],
  discount: {
    items: [],
    totalResult: 0,
    totalPage: 0,
    limit: LIMIT_ROW_DISCOUNT,
  },
  page: 1,
  limit: LIMIT_ROW_DISCOUNT,
};
const discountSlice = createSlice({
  name: "discount",
  initialState: initialState,
  reducers: {
    getDiscount: (state, action) => {
      state.discount = action.payload;
    },
    getAllDiscounts: (state, action) => {
      state.all = action.payload;
    },
    addDiscount: (state, action) => {
      state.all = [action.payload, ...state.all];
    },
    updateDiscount: (state, action) => {
      const newCategory = action.payload;
      const index = state.all.findIndex((item) => item.id === newCategory.id);
      state.all[index] = newCategory;
      state.current = null;
    },
    deleteDiscount: (state) => {
      state.all = state.all.filter((item) => item.id !== state.current.id);
      state.current = null;
    },
    getCurrentDiscount: (state, action) => {
      state.current = action.payload;
    },
    changePage: (state, action) => {
      state.page = action.payload;
    },
    changeLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
});
export const {
  getDiscount,
  addDiscount,
  getCurrentDiscount,
  updateDiscount,
  deleteDiscount,
  changePage,
  changeLimit,
  getAllDiscounts,
} = discountSlice.actions;
export default discountSlice.reducer;
