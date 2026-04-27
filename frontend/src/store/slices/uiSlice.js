import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  activeTab: "dashboard",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
  },
});

export const { toggleSidebar, setActiveTab } = uiSlice.actions;

export default uiSlice.reducer;
