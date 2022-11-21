import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_COMMENT } from "../constants";
const initialState = {
  list: [],
  page: 1,
  limit: LIMIT_COMMENT,
  current: null,
  comment: null,
  productDetail: {
    list: [],
    myComment: null,
  },
  listRep: [],
  currentRep: null,
};
const commentSlice = createSlice({
  name: "comment",
  initialState: initialState,
  reducers: {
    getProductDetailComments: (state, action) => {
      state.productDetail.list = action.payload;
    },
    getProductDetailMyComment: (state, action) => {
      state.productDetail.myComment = action.payload;
    },
    getAllComments: (state, action) => {
      state.list = action.payload;
    },
    getComment: (state, action) => {
      state.comment = action.payload;
    },
    addComment: (state, action) => {
      if (state.list.findIndex((item) => item.id === action.payload.id) === -1)
        state.list = [action.payload, ...state.list];
    },
    updateComment: (state, action) => {
      const newComment = action.payload;
      const index = state.comment.items.findIndex(
        (item) => item.id === newComment.id
      );
      state.comment.items[index] = {
        ...state.comment.items[index],
        ...newComment,
      };
    },
    updateRepliedComment: (state, action) => {
      const data = action.payload;
      const index = state.comment.items.findIndex(
        (item) => item.id === data.comment_id
      );
      if (index !== -1) {
        const index2 = state.comment.items[index].replied_comments.findIndex(
          (item) => item.id === data.id
        );
        if (index2 !== -1)
          state.comment.items[index].replied_comments[index2] = {
            ...state.comment.items[index].replied_comments[index2],
            ...data,
          };
      }
    },
    deleteComment: (state, action) => {
      const id = action.payload;
      state.comment.items = state.comment.items.filter(
        (item) => item.id !== id
      );
    },
    deleteRepliedComment: (state, action) => {
      const { commentId, id } = action.payload;
      const index = state.comment.items.findIndex(
        (item) => item.id === commentId
      );
      if (index !== -1) {
        state.comment.items[index].replied_comments = state.comment.items[
          index
        ].replied_comments.filter((item) => item.id !== id);
      }
    },
    changePage: (state, action) => {
      state.page = action.payload;
    },
    newRepliedComment: (state, action) => {
      const data = action.payload;
      // Tìm vị trí cái comment
      const index = state.comment.items.findIndex(
        (item) => item.id === data.comment_id
      );
      if (index !== -1) {
        state.comment.items[index].replied_comments.push(data);
      }
    },
    getCurrentComment: (state, action) => {
      state.current = action.payload;
    },
    getCurrentRepComment: (state, action) => {
      state.currentRep = action.payload;
    },
  },
});
export const {
  getAllComments,
  addComment,
  changePage,
  getCurrentComment,
  updateComment,
  deleteComment,
  newRepliedComment,
  updateRepliedComment,
  deleteRepliedComment,
  getComment,
  getProductDetailComments,
  getProductDetailMyComment,
} = commentSlice.actions;
export default commentSlice.reducer;
