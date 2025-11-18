import { configureStore, createSlice } from '@reduxjs/toolkit';

// Dummy reducer for main store
const appSlice = createSlice({
  name: 'app',
  initialState: { isReady: true },
  reducers: {}
});

export const mainStore = configureStore({
  reducer: {
    app: appSlice.reducer
  }
});

export default mainStore;
