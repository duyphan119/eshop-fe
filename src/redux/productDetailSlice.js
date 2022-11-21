import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_PRODUCT_DETAIL } from "../constants";
const initialState = {
  current: null,
  page: 1,
  limit: LIMIT_ROW_PRODUCT_DETAIL,
  productDetail: {
    items: [],
    totalResult: 0,
    totalPage: 0,
    limit: LIMIT_ROW_PRODUCT_DETAIL,
  },
  list: [],
  bestSellerList: [],
};
const productDetailSlice = createSlice({
  name: "productDetail",
  initialState: initialState,
  reducers: {
    getProductDetail: (state, action) => {
      state.productDetail = action.payload;
    },
    getAllProductDetails: (state, action) => {
      state.list = action.payload;
    },
    getBestSellerList: (state, action) => {
      state.bestSellerList = action.payload;
    },
    addProductDetail: (state, action) => {
      state.list.push(action.payload);
    },
    updateProductDetail: (state, action) => {
      const data = action.payload;
      const index = state.list.findIndex((item) => item.id === data.id);
      state.list[index] = { ...state.list[index], ...data };
    },
    deleteProductDetail: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((item) => item.id !== id);
    },
    getCurrentProductDetail: (state, action) => {
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
  getProductDetail,
  getCurrentProductDetail,
  changePage,
  changeLimit,
  addProductDetail,
  updateProductDetail,
  deleteProductDetail,
  getAllProductDetails,
  getBestSellerList,
} = productDetailSlice.actions;
export default productDetailSlice.reducer;
