import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showErrorMessages: null,
  messages: [],
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    addErrorMessage(state, action) {
      state.messages.unshift({
        source: action.payload.source,
        timestamp: new Date().toLocaleString(),
        message: action.payload.message,
      });
    },
    clearErrorMessages(state) {
      state.messages = [];
    },
    hideErrorMessages(state) {
      state.showErrorMessages = false;
    },
    showErrorMessages(state) {
      state.showErrorMessages = true;
    },
  },
});

export const {
  addErrorMessage,
  clearErrorMessages,
  hideErrorMessages,
  showErrorMessages,
} = errorSlice.actions;

export default errorSlice.reducer;
