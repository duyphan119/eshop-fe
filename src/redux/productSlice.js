import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_PRODUCT } from "../constants";
const initLatest = JSON.parse(localStorage.getItem("shop-of-duy:latest"));
const initialState = {
  list: [],
  favoriteList: [],
  current: null,
  searchResult: [],
  latest: initLatest ? initLatest : [],
  page: 1,
  limit: LIMIT_ROW_PRODUCT,
  product: {
    items: [],
    totalResult: 0,
    totalPage: 0,
    limit: LIMIT_ROW_PRODUCT,
  },
  bestSellersDashboard: [],
};
const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    getAllProducts: (state, action) => {
      state.list = action.payload;
    },
    getBestSellersDashboard: (state, action) => {
      state.bestSellersDashboard = action.payload;
    },
    getProduct: (state, action) => {
      state.product = action.payload;
    },
    addProduct: (state, action) => {
      console.log(action.payload);
      state.list.push(action.payload);
    },
    updateProduct: (state, action) => {
      const data = action.payload;
      const index = state.list.findIndex((item) => item.id === data.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...data };
      }
    },
    deleteProduct: (state, action) => {
      const id = action.payload;
      state.list.filter((item) => item.id !== id);
    },
    getSortedProducts: (state, action) => {
      console.log(action.payload);
    },
    getFavoriteList: (state, action) => {
      state.favoriteList = action.payload;
    },
    removeFavoriteItem: (state, action) => {
      state.favoriteList = state.favoriteList.filter(
        (item) => item.product_id !== action.payload.product_id
      );
    },
    newFavoriteItem: (state, action) => {
      state.favoriteList.push(action.payload);
    },
    getCurrentProduct: (state, action) => {
      state.current = action.payload;
    },
    newComment: (state, action) => {
      const comment = action.payload;
      const index = state.current.comments.findIndex(
        (item) => item.id === comment.id
      );
      if (index === -1) {
        state.current.comments.push(comment);
      } else {
        state.current.comments[index] = comment;
      }
    },
    updateComment: (state, action) => {
      const comment = action.payload;
      const index = state.current.comments.findIndex(
        (item) => item.id === comment.id
      );
      if (index !== -1) {
        state.current.comments[index] = comment;
      }
    },
    newRepliedComment: (state, action) => {
      const replied_comment = action.payload;
      const index = state.current.comments.replied_comments.findIndex(
        (item) => item.id === replied_comment.id
      );
      if (index === -1) {
        state.current.comments.replied_comments.push(replied_comment);
      } else {
        state.current.comments.replied_comments[index] = replied_comment;
      }
    },
    getSearchResult: (state, action) => {
      state.searchResult = action.payload;
    },
    addToLatest: (state, action) => {
      const newItem = action.payload;
      state.latest = state.latest.filter((item) => item.id !== newItem.id);
      state.latest = [newItem, ...state.latest];
      localStorage.setItem("shop-of-duy:latest", JSON.stringify(state.latest));
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
  getAllProducts,
  addProduct,
  getProduct,
  getSortedProducts,
  getFavoriteList,
  removeFavoriteItem,
  newFavoriteItem,
  getCurrentProduct,
  newComment,
  updateComment,
  newRepliedComment,
  getSearchResult,
  addToLatest,
  changePage,
  changeLimit,
  getBestSellersDashboard,
  deleteProduct,
  updateProduct,
} = productSlice.actions;
export default productSlice.reducer;
