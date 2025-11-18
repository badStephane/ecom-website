import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI } from '../services/api';

export const fetchUsers = createAsyncThunk(
  'adminUsers/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk(
  'adminUsers/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'adminUsers/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await usersAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

const adminUserSlice = createSlice({
  name: 'adminUsers',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users || action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const user = action.payload.user || action.payload;
        const index = state.items.findIndex(u => u._id === user._id);
        if (index !== -1) {
          state.items[index] = user;
        }
      })
      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(u => u._id !== action.payload);
      });
  }
});

export const { clearError } = adminUserSlice.actions;
export default adminUserSlice.reducer;

