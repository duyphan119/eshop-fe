import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_GROUP_CATEGORY } from "../constants";
const initialState = {
  current: null,
  all: [],
  switchList: null,
  groupCategory: {
    items: [],
    totalResult: 0,
    totalPage: 0,
    limit: LIMIT_ROW_GROUP_CATEGORY,
  },
  page: 1,
  limit: LIMIT_ROW_GROUP_CATEGORY,
};
const groupCategorySlice = createSlice({
  name: "groupCategory",
  initialState: initialState,
  reducers: {
    getAllGroupCategories: (state, action) => {
      state.all = action.payload;
      state.switchList = action.payload;
    },
    getGroupCategory: (state, action) => {
      state.groupCategory = action.payload;
    },
    addGroupCategory: (state, action) => {
      state.all = [action.payload, ...state.all];
    },
    updateGroupCategory: (state, action) => {
      const data = action.payload;
      const index = state.all.findIndex((item) => item.id === data.id);
      state.all[index] = { ...state.all[index], ...data };
    },
    deleteGroupCategory: (state, action) => {
      state.all = state.all.filter((item) => item.id !== action.payload);
    },
    getCurrentGroupCategory: (state, action) => {
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
  getAllGroupCategories,
  addGroupCategory,
  updateGroupCategory,
  getCurrentGroupCategory,
  deleteGroupCategory,
  getGroupCategory,
  changePage,
  changeLimit,
} = groupCategorySlice.actions;
export default groupCategorySlice.reducer;
