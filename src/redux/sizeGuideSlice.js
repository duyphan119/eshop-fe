import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_SIZE_GUIDE } from "../constants";
const initialState = {
  list: [],
  page: 1,
  limit: LIMIT_ROW_SIZE_GUIDE,
  current: null,
  totalPage: 0,
  sizeGuide: null,
};
const sizeGuideSlice = createSlice({
  name: "sizeGuide",
  initialState: initialState,
  reducers: {
    getSizeGuide: (state, action) => {
      state.sizeGuide = action.payload;
    },
    newSizeGuide: (state, action) => {
      const data = action.payload;
      if (state.sizeGuide.items) {
        const index = state.sizeGuide.items.findIndex(
          (item) => item.id === data.id
        );
        if (index === -1) {
          state.sizeGuide = {
            items: [
              data,
              ...state.sizeGuide.items.splice(
                0,
                state.sizeGuide.items.length - 1
              ),
            ],
            limit: LIMIT_ROW_SIZE_GUIDE,
            total_result: state.sizeGuide.items.length + 1,
            total_page: Math.ceil(
              (state.sizeGuide.items.length + 1) / LIMIT_ROW_SIZE_GUIDE
            ),
          };
        } else {
          state.sizeGuide.items[index] = {
            ...state.sizeGuide.items[index],
            ...data,
          };
        }
      } else {
        state.sizeGuide = {
          items: [data],
          limit: LIMIT_ROW_SIZE_GUIDE,
          total_result: 1,
          total_page: 1,
        };
      }
    },
    updateSizeGuide: (state, action) => {
      const newItem = action.payload;
      const index = state.sizeGuide.items.findIndex(
        (item) => item.id === newItem.id
      );
      if (index !== -1) {
        state.sizeGuide.items[index] = {
          ...state.sizeGuide.items[index],
          ...newItem,
        };
      }
    },
    deletedSizeGuide: (state, action) => {
      const id = action.payload;
      state.sizeGuide = {
        items: [...state.sizeGuide.items].filter((item) => item.id !== id),
        total_result: state.sizeGuide.items.length - 1,
        total_page: Math.ceil(
          (state.sizeGuide.items.length - 1) / LIMIT_ROW_SIZE_GUIDE
        ),
        limit: LIMIT_ROW_SIZE_GUIDE,
      };
    },
    getSizeGuides: (state, action) => {
      state.list = action.payload.items;
      state.totalPage = action.payload.total_page;
    },
    changePage: (state, action) => {
      state.page = action.payload;
    },
    changeLimit: (state, action) => {
      state.limit = action.payload;
    },
    getCurrentSizeGuide: (state, action) => {
      state.current = action.payload;
    },
  },
});
export const {
  getSizeGuides,
  changeLimit,
  getCurrentSizeGuide,
  changePage,
  updateSizeGuide,
  getSizeGuide,
  deletedSizeGuide,
  newSizeGuide,
} = sizeGuideSlice.actions;
export default sizeGuideSlice.reducer;
