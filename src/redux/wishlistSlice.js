import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  wishlist: [],
};
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initialState,
  reducers: {
    getWishlist: (state, action) => {
      state.wishlist = action.payload;
      localStorage.setItem(
        "shop-of-duy:wishlist",
        JSON.stringify(state.wishlist)
      );
    },
    addToWishlist: (state, action) => {
      const newItem = action.payload;
      let index = state.wishlist.findIndex((item) => item.id === newItem.id);
      if (index !== -1) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist = [newItem, ...state.wishlist];
      }
    },
    removeWishlistItem: (state, action) => {
      const id = action.payload;
      state.wishlist = state.wishlist.filter((item) => item.id !== id);
      localStorage.setItem(
        "shop-of-duy:wishlist",
        JSON.stringify(state.wishlist)
      );
    },
  },
});
export const { getWishlist, addToWishlist, removeWishlistItem } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
