import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  current: null,
  all: [],
};
const genderCategorySlice = createSlice({
  name: "genderCategory",
  initialState: initialState,
  reducers: {
    getAllGenderCategories: (state, action) => {
      state.all = action.payload;
    },
    addGenderCategory: (state, action) => {
      state.all = [action.payload, ...state.all];
      state.page = 1;
    },
    updateGenderCategory: (state, action) => {
      const newGenderCategory = action.payload;
      const index = state.all.findIndex(
        (item) => item.id === newGenderCategory.id
      );
      state.all[index] = newGenderCategory;
      state.current = null;
    },
    deleteGenderCategory: (state, action) => {
      state.all = state.all.filter((item) => item.id !== action.payload);
      state.current = null;
    },
    getCurrentGenderCategory: (state, action) => {
      state.current = action.payload;
    },
  },
});
export const {
  getAllGenderCategories,
  addGenderCategory,
  getCurrentGenderCategory,
  updateGenderCategory,
  deleteGenderCategory,
} = genderCategorySlice.actions;
export default genderCategorySlice.reducer;
