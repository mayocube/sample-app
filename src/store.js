import { configureStore } from '@reduxjs/toolkit';

import errorReducer from './state/errorSlice';

const store = configureStore({
  reducer: {
    error: errorReducer,
  },
});

export default store;
