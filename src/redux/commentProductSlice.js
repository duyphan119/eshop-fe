import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_COMMENT_PRODUCT } from "../constants";
const initialState = {
  list: [],
  page: 1,
  limit: LIMIT_ROW_COMMENT_PRODUCT,
  current: null,
  commentProduct: null,
  currentRep: null,
};
const commentProductSlice = createSlice({
  name: "commentProduct",
  initialState: initialState,
  reducers: {
    getAllCommentProducts: (state, action) => {
      state.list = action.payload;
    },
    getCommentProduct: (state, action) => {
      state.commentProduct = action.payload;
    },
    addCommentProduct: (state, action) => {
      if (state.list.findIndex((item) => item.id === action.payload.id) === -1)
        state.list = [action.payload, ...state.list];
    },
    updateCommentProduct: (state, action) => {
      const data = action.payload;
      const index = state.list.findIndex((item) => item.id === data.id);
      state.list[index] = { ...state.list[index], ...data };
    },
    deleteCommentProduct: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((item) => item.id !== id);
      state.current = null;
    },
    deleteRepCommentProduct: (state, action) => {
      const id = action.payload;
      const index = state.list.findIndex(
        (item) => item.id === state.current.id
      );
      if (index !== -1) {
        state.list[index].repComments = state.list[index].repComments.filter(
          (item) => item.id !== id
        );
        state.currentRep = null;
      }
    },
    changePage: (state, action) => {
      state.page = action.payload;
    },
    getCurrentCommentProduct: (state, action) => {
      state.current = action.payload;
    },
    getCurrentRepCommentProduct: (state, action) => {
      state.currentRep = action.payload;
    },
    newRepCommentProduct: (state, action) => {
      const data = action.payload;
      const index = state.list.findIndex(
        (item) => item.id === state.current.id
      );
      if (index !== -1) {
        state.list[index].repComments.push(data);
      }
    },
    updateRepCommentProduct: (state, action) => {
      const data = action.payload;
      const index = state.list.findIndex(
        (item) => item.id === state.current.id
      );
      if (index !== -1) {
        const index2 = state.list[index].repComments.findIndex(
          (el) => el.id === data.id
        );
        state.list[index].repComments[index2] = {
          ...state.list[index].repComments[index2],
          ...data,
        };
      }
    },
  },
});
export const {
  getAllCommentProducts,
  addCommentProduct,
  changePage,
  getCurrentCommentProduct,
  updateCommentProduct,
  deleteCommentProduct,
  newRepCommentProduct,
  updateRepCommentProduct,
  deleteRepCommentProduct,
  getCurrentRepCommentProduct,
} = commentProductSlice.actions;
export default commentProductSlice.reducer;
