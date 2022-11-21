import { createSlice } from "@reduxjs/toolkit";
import {
  LOCALSTORAGE_ACCESS_TOKEN,
  LOCALSTORAGE_USER_NAME,
} from "../constants";

const initialState = {
  currentUser: null,
  token: JSON.parse(
    localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN) !== "undefined"
      ? localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN)
      : "null"
  ),
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem(
        LOCALSTORAGE_ACCESS_TOKEN,
        JSON.stringify(state.token)
      );
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    login: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem(
        LOCALSTORAGE_USER_NAME,
        JSON.stringify(state.currentUser)
      );
    },
    logout: (state) => {
      state.token = null;
      localStorage.setItem(
        LOCALSTORAGE_ACCESS_TOKEN,
        JSON.stringify(state.token)
      );
      state.currentUser = null;
    },
    refreshToken: (state, action) => {
      // if (state.currentUser.access_token !== action.payload) {
      //   state.currentUser.access_token = action.payload;
      //   localStorage.setItem(
      //     LOCALSTORAGE_USER_NAME,
      //     JSON.stringify(state.currentUser)
      //   );
      // }

      state.accessToken = action.payload;
      localStorage.setItem(
        LOCALSTORAGE_ACCESS_TOKEN,
        JSON.stringify(state.token)
      );
    },
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      localStorage.setItem(
        LOCALSTORAGE_USER_NAME,
        JSON.stringify(state.currentUser)
      );
    },
  },
});
export const {
  login,
  logout,
  refreshToken,
  updateUser,
  setAccessToken,
  setCurrentUser,
} = authSlice.actions;
export default authSlice.reducer;
