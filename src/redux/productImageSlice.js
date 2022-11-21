import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  current: null,
  list: [],
};
const productImageSlice = createSlice({
  name: "productImage",
  initialState: initialState,
  reducers: {
    getAllProductImages: (state, action) => {
      state.list = action.payload;
    },
    addProductImages: (state, action) => {
      state.list = [...action.payload, ...state.list];
    },
    updateProductImage: (state, action) => {
      const data = action.payload;
      const index = state.list.findIndex((item) => item.id === data.id);
      state.list[index] = { ...state.list[index], ...data };
    },
    deleteProductImage: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((item) => item.id !== id);
    },
    deleteProductImages: (state, action) => {
      const list = action.payload;
      state.list = state.list.filter(
        (item) => list.findIndex((el) => el.id === item.id) === -1
      );
    },
    getCurrentProductImage: (state, action) => {
      state.current = action.payload;
    },
  },
});
export const {
  getCurrentProductImage,
  addProductImages,
  updateProductImage,
  deleteProductImage,
  getAllProductImages,
  deleteProductImages,
} = productImageSlice.actions;
export default productImageSlice.reducer;
