import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  current: null,
  list: [],
};
const couponSlice = createSlice({
  name: "coupon",
  initialState: initialState,
  reducers: {
    getAllCoupons: (state, action) => {
      state.list = action.payload;
    },
    getCurrentCoupon: (state, action) => {
      state.current = action.payload;
    },
    addCoupon: (state, action) => {
      state.list.push(action.payload);
    },
    updateCoupon: (state, action) => {
      const data = action.payload;
      const index = state.list.findIndex((item) => item.id === data.id);
      state.list[index] = { ...state.list[index], ...data };
    },
    deleteCoupon: (state, action) => {
      state.list = state.list.filter((item) => item.id !== state.current.id);
    },
  },
});
export const {
  getAllCoupons,
  getCurrentCoupon,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} = couponSlice.actions;
export default couponSlice.reducer;
