import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_MATERIAL } from "../constants";
const initialState = {
  list: [],
  page: 1,
  limit: LIMIT_ROW_MATERIAL,
  current: null,
  all: [],
};
const categorySlice = createSlice({
  name: "material",
  initialState: initialState,
  reducers: {
    getAll: (state, action) => {
      state.all = action.payload;
    },
    getAllMaterials: (state, action) => {
      state.list = action.payload;
    },
    addMaterial: (state, action) => {
      state.list = [action.payload, ...state.list];
      state.page = 1;
    },
    updateMaterial: (state, action) => {
      const newMaterial = action.payload;
      const index = state.list.findIndex((item) => item.id === newMaterial.id);
      state.list[index] = newMaterial;
      state.current = null;
    },
    deleteMaterial: (state) => {
      state.list = state.list.filter((item) => item.id !== state.current.id);
      state.current = null;
    },
    changePage: (state, action) => {
      state.page = action.payload;
    },
    getCurrentMaterial: (state, action) => {
      state.current = action.payload;
    },
  },
});
export const {
  getAllMaterials,
  addMaterial,
  changePage,
  getCurrentMaterial,
  updateMaterial,
  deleteMaterial,
  getAll,
} = categorySlice.actions;
export default categorySlice.reducer;
