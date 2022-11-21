import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  all: [],
  current: null,
};
const orderStatusSlice = createSlice({
  name: "orderStatus",
  initialState: initialState,
  reducers: {
    getAllOrderStatuses: (state, action) => {
      state.all = action.payload;
    },
    getCurrentOrderStatus: (state, action) => {
      state.current = action.payload;
    },
    addOrderStatus: (state, action) => {
      state.all.push(action.payload);
    },
    updateOrderStatus: (state, action) => {
      const data = action.payload;
      const index = state.all.findIndex((item) => item.id === data.id);
      state.all[index] = { ...state.all[index], ...data };
    },
    deleteOrderStatus: (state) => {
      state.all = state.all.filter((item) => item.id !== state.current.id);
    },
  },
});
export const {
  getAllOrderStatuses,
  getCurrentOrderStatus,
  addOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
} = orderStatusSlice.actions;
export default orderStatusSlice.reducer;
