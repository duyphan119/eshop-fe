import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_NOTIFICATION } from "../constants";
const initialState = {
  notification: null,
};
const categorySlice = createSlice({
  name: "material",
  initialState: initialState,
  reducers: {
    getNotification: (state, action) => {
      state.notification = action.payload;
    },
    newNotification: (state, action) => {
      const data = action.payload;
      if (state.notification.items) {
        const index = state.notification.items.findIndex(
          (item) => item.id === data.id
        );
        if (index === -1) {
          state.notification = {
            items: [
              data,
              ...state.notification.items.splice(
                0,
                state.notification.items.length - 1
              ),
            ],
            limit: LIMIT_NOTIFICATION,
            total_result: state.notification.items.length + 1,
            total_page: Math.ceil(
              (state.notification.items.length + 1) / LIMIT_NOTIFICATION
            ),
          };
        } else {
          state.notification.items[index] = {
            ...state.notification.items[index],
            ...data,
          };
        }
      } else {
        state.notification = {
          items: [data],
          limit: LIMIT_NOTIFICATION,
          total_result: 1,
          total_page: 1,
        };
      }
    },
    updateNotification: (state, action) => {
      const newItem = action.payload;
      const index = state.notification.items.findIndex(
        (item) => item.id === newItem.id
      );
      if (index !== -1) {
        state.notification.items[index] = {
          ...state.notification.items[index],
          ...newItem,
        };
      }
    },
    readAll: (state, action) => {
      state.notification.items = state.notification.items.map((item) => ({
        ...item,
        isRead: true,
      }));
    },
    deleteNotification: (state, action) => {
      const id = action.payload;
      state.notification = {
        items: [...state.notification.items].filter((item) => item.id !== id),
        total_result: state.notification.items.length - 1,
        total_page: Math.ceil(
          (state.notification.items.length - 1) / LIMIT_NOTIFICATION
        ),
        limit: LIMIT_NOTIFICATION,
      };
    },
  },
});
export const {
  getNotification,
  newNotification,
  updateNotification,
  readAll,
  deleteNotification,
} = categorySlice.actions;
export default categorySlice.reducer;
