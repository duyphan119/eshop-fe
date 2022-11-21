import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_CATEGORY } from "../constants";
const initialState = {
  current: null,
  all: [],
  category: {
    items: [],
    totalResult: 0,
    totalPage: 0,
    limit: LIMIT_ROW_CATEGORY,
  },
  page: 1,
  limit: LIMIT_ROW_CATEGORY,
};
const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {
    getAllCategories: (state, action) => {
      state.all = action.payload;
    },
    getCategory: (state, action) => {
      state.category = action.payload;
    },
    addCategory: (state, action) => {
      state.all = [action.payload, ...state.all];
    },
    updateCategory: (state, action) => {
      const data = action.payload;
      const index = state.all.findIndex((item) => item.id === data.id);
      state.all[index] = { ...state.all[index], ...data };
    },
    deleteCategory: (state) => {
      state.all = state.all.filter((item) => item.id !== state.current.id);
    },
    getCurrentCategory: (state, action) => {
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
  getAllCategories,
  addCategory,
  getCurrentCategory,
  updateCategory,
  getCategory,
  deleteCategory,
  changePage,
  changeLimit,
} = categorySlice.actions;
export default categorySlice.reducer;
