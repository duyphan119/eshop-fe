import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_BANNER } from "../constants";
const initialState = {
  list: [],
  page: 1,
  limit: LIMIT_ROW_BANNER,
  current: null,
  all: [],
  banner: null,
};
const bannerSlice = createSlice({
  name: "banner",
  initialState: initialState,
  reducers: {
    getAll: (state, action) => {
      state.all = action.payload;
    },
    getBanner: (state, action) => {
      state.banner = action.payload;
    },
    newBanner: (state, action) => {
      const data = action.payload;
      if (state.banner.items) {
        const index = state.banner.items.findIndex(
          (item) => item.id === data.id
        );
        if (index === -1) {
          state.banner = {
            items: [
              data,
              ...state.banner.items.splice(state.banner.items.length - 1, 1),
            ],
            limit: LIMIT_ROW_BANNER,
            total_result: state.banner.items.length + 1,
            total_page: Math.ceil(
              (state.banner.items.length + 1) / LIMIT_ROW_BANNER
            ),
          };
        } else {
          state.banner.items[index] = {
            ...state.banner.items[index],
            ...data,
          };
        }
      } else {
        state.banner = {
          items: [data],
          limit: LIMIT_ROW_BANNER,
          total_result: 1,
          total_page: 1,
        };
      }
    },
    updateBanner: (state, action) => {
      const newItem = action.payload;
      const index = state.banner.items.findIndex(
        (item) => item.id === newItem.id
      );
      if (index !== -1) {
        state.banner.items[index] = {
          ...state.banner.items[index],
          ...newItem,
        };
      }
    },
    deleteBanner: (state, action) => {
      const id = action.payload;
      state.banner = {
        items: [...state.banner.items].filter((item) => item.id !== id),
        total_result: state.banner.items.length - 1,
        total_page: Math.ceil(
          (state.banner.items.length - 1) / LIMIT_ROW_BANNER
        ),
        limit: LIMIT_ROW_BANNER,
      };
    },
    changePage: (state, action) => {
      state.page = action.payload;
    },
    changeLimit: (state, action) => {
      state.limit = action.payload;
    },
    getCurrentBanner: (state, action) => {
      state.current = action.payload;
    },
  },
});
export const {
  getCurrentBanner,
  changeLimit,
  changePage,
  deleteBanner,
  updateBanner,
  newBanner,
  getBanner,
  getAll,
} = bannerSlice.actions;
export default bannerSlice.reducer;
