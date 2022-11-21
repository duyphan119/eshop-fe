import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_GROUP_PRODUCT } from "../constants";
const initialState = {
  current: null,
  all: [],
  groupProduct: {
    items: [],
    totalResult: 0,
    totalPage: 0,
    limit: LIMIT_ROW_GROUP_PRODUCT,
  },
  page: 1,
  limit: LIMIT_ROW_GROUP_PRODUCT,
};
const groupProductSlice = createSlice({
  name: "groupProduct",
  initialState: initialState,
  reducers: {
    getGroupProduct: (state, action) => {
      state.groupProduct = action.payload;
    },
    getAllGroupProducts: (state, action) => {
      state.all = action.payload;
    },
    addGroupProduct: (state, action) => {
      state.all = [action.payload, ...state.all];
    },
    deleteGroupProduct: (state, action) => {
      state.all = state.all.filter((item) => item.id !== action.payload);
    },
    updateGroupProduct: (state, action) => {
      const data = action.payload;
      const index = state.all.findIndex((item) => item.id === data.id);
      console.log({ ...state.all[index], ...data, data });
      state.all[index] = { ...state.all[index], ...data };
    },
    deleteCategory: (state) => {
      state.all = state.all.filter((item) => item.id !== state.current.id);
    },
    getCurrentGroupProduct: (state, action) => {
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
  addGroupProduct,
  getCurrentGroupProduct,
  updateGroupProduct,
  getGroupProduct,
  deleteGroupProduct,
  changePage,
  changeLimit,
  getAllGroupProducts,
} = groupProductSlice.actions;
export default groupProductSlice.reducer;
