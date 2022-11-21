import { createSlice } from "@reduxjs/toolkit";
import { LIMIT_ROW_ORDER, LIMIT_CLIENT_ORDER } from "../constants";
const initialState = {
  list: [],
  page: 1,
  limit: LIMIT_ROW_ORDER,
  current: null,
  totalPage: 0,
  order: {
    items: [],
    totalPage: 0,
    totalResult: 0,
    limit: LIMIT_ROW_ORDER,
  },
  recentOrders: [],
  clientOrder: null,
  pageClient: 1,
  limitClient: LIMIT_CLIENT_ORDER,
  currentClient: null,
};
const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    getOrder: (state, action) => {
      state.order = action.payload;
    },
    getClientOrder: (state, action) => {
      state.clientOrder = action.payload;
    },
    getRecentOrders: (state, action) => {
      state.recentOrders = action.payload;
    },
    newClientOrder: (state, action) => {
      const data = action.payload;
      if (state.clientOrder.items) {
        const index = state.clientOrder.items.findIndex(
          (item) => item.id === data.id
        );
        if (index === -1) {
          state.clientOrder = {
            items: [
              data,
              ...state.clientOrder.items.splice(
                state.clientOrder.items.length - 1,
                1
              ),
            ],
            limit: LIMIT_CLIENT_ORDER,
            total_result: state.clientOrder.items.length + 1,
            total_page: Math.ceil(
              (state.clientOrder.items.length + 1) / LIMIT_CLIENT_ORDER
            ),
          };
        } else {
          state.clientOrder.items[index] = {
            ...state.clientOrder.items[index],
            ...data,
          };
        }
      } else {
        state.order = {
          items: [data],
          limit: LIMIT_ROW_ORDER,
          total_result: 1,
          total_page: 1,
        };
      }
    },
    updateClientOrder: (state, action) => {
      const newItem = action.payload;
      const index = state.clientOrder.items.findIndex(
        (item) => item.id === newItem.id
      );
      if (index !== -1) {
        state.clientOrder.items[index] = {
          ...state.clientOrder.items[index],
          ...newItem,
        };
      }
    },
    deletedClientOrder: (state, action) => {
      const id = action.payload;
      state.clientOrder = {
        items: [...state.clientOrder.items].filter((item) => item.id !== id),
        total_result: state.clientOrder.items.length - 1,
        total_page: Math.ceil(
          (state.clientOrder.items.length - 1) / LIMIT_CLIENT_ORDER
        ),
        limit: LIMIT_CLIENT_ORDER,
      };
    },
    newOrder: (state, action) => {
      const data = action.payload;
      if (state.order.items) {
        const index = state.order.items.findIndex(
          (item) => item.id === data.id
        );
        if (index === -1) {
          state.order = {
            items: [
              data,
              ...state.order.items.splice(state.order.items.length - 1, 1),
            ],
            limit: LIMIT_ROW_ORDER,
            total_result: state.order.items.length + 1,
            total_page: Math.ceil(
              (state.order.items.length + 1) / LIMIT_ROW_ORDER
            ),
          };
        } else {
          state.order.items[index] = {
            ...state.order.items[index],
            ...data,
          };
        }
      } else {
        state.order = {
          items: [data],
          limit: LIMIT_ROW_ORDER,
          total_result: 1,
          total_page: 1,
        };
      }
    },
    updateOrder: (state, action) => {
      const newItem = action.payload;
      const index = state.list.findIndex((item) => item.id === newItem.id);
      state.list[index] = newItem;
      state.current = null;
    },
    deleteOrder: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((item) => item.id !== id);
    },
    deletedOrder: (state, action) => {
      const id = action.payload;
      state.order = {
        items: [...state.order.items].filter((item) => item.id !== id),
        total_result: state.order.items.length - 1,
        total_page: Math.ceil((state.order.items.length - 1) / LIMIT_ROW_ORDER),
        limit: LIMIT_ROW_ORDER,
      };
    },
    changePage: (state, action) => {
      state.page = action.payload;
    },
    changeLimit: (state, action) => {
      state.limit = action.payload;
    },
    getCurrentOrder: (state, action) => {
      state.current = action.payload;
    },
    getCurrentClientOrder: (state, action) => {
      state.currentClient = action.payload;
    },
    getOrders: (state, action) => {
      state.list = action.payload.items;
      state.totalPage = action.payload.total_page;
    },
    getAllOrders: (state, action) => {
      state.list = action.payload;
    },
  },
});
export const {
  getOrders,
  getAllOrders,
  getCurrentClientOrder,
  getClientOrder,
  changeLimit,
  getCurrentOrder,
  changePage,
  updateOrder,
  updateClientOrder,
  getOrder,
  deletedOrder,
  newOrder,
  deletedClientOrder,
  newClientOrder,
  getRecentOrders,
  deleteOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
