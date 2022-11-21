import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_USER } from "../constants";
const initialState = {
  all: [],
  current: null,
  user: {
    items: [],
    totalResult: 0,
    totalPage: 0,
    limit: LIMIT_ROW_USER,
  },
  limit: LIMIT_ROW_USER,
  page: 1,
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    getAllUsers: (state, action) => {
      state.all = action.payload;
    },
    getUser: (state, action) => {
      state.user = action.payload;
    },
    addUser: (state, action) => {
      state.all.push(action.payload);
    },
    updateUser: (state, action) => {
      const newSize = action.payload;
      const index = state.all.findIndex((item) => item.id === newSize.id);
      state.all[index] = { ...state.all[index], ...newSize };
    },
    deleteUser: (state) => {
      state.all = state.all.filter((item) => item.id !== state.current.id);
    },
    getCurrentUser: (state, action) => {
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
  addUser,
  changePage,
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUser,
  changeLimit,
} = userSlice.actions;
export default userSlice.reducer;
