import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "./slices/stockSlice";
import uiReducer from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    stock: stockReducer,
    ui: uiReducer,
  },
});

export default store;
