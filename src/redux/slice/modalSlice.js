import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    visible: false,
    message: "",
    type: "info",
  },
  reducers: {
    showModal: (state, action) => {
      const { message, type = "info" } = action.payload;
      state.visible = true;
      state.message = message;
      state.type = type;
    },
    hideModal: (state) => {
      state.visible = false;
      state.message = "";
      state.type = "info";
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;