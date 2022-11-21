import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_SIZE } from "../constants";
const initialState = {
  list: [],
  page: 1,
  limit: LIMIT_ROW_SIZE,
  current: null,
  all: [],
  size: {
    items: [],
    totalResult: 0,
    totalPage: 0,
    limit: LIMIT_ROW_SIZE,
  },
};
const sizeSlice = createSlice({
  name: "size",
  initialState: initialState,
  reducers: {
    getAll: (state, action) => {
      state.all = action.payload;
    },
    getAllSizes: (state, action) => {
      state.list = action.payload;
    },
    getSize: (state, action) => {
      state.size = action.payload;
    },
    addSize: (state, action) => {
      state.list.push(action.payload);
    },
    updateSize: (state, action) => {
      const newSize = action.payload;
      const index = state.list.findIndex((item) => item.id === newSize.id);
      state.list[index] = { ...state.list[index], ...newSize };
    },
    deleteSize: (state) => {
      state.list = state.list.filter((item) => item.id !== state.current.id);
    },
    changePage: (state, action) => {
      state.page = action.payload;
    },
    changeLimit: (state, action) => {
      state.limit = action.payload;
    },
    getCurrentSize: (state, action) => {
      state.current = action.payload;
    },
  },
});
export const {
  getAllSizes,
  addSize,
  getSize,
  changeLimit,
  changePage,
  getCurrentSize,
  updateSize,
  deleteSize,
  getAll,
} = sizeSlice.actions;
export default sizeSlice.reducer;
