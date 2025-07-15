import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIs from '../../api';

export const fetchUserMe = createAsyncThunk(
  'user/fetchUserMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await APIs.users.get('/me');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
    }
  }
);

export const updateUserMe = createAsyncThunk(
  'user/updateUserMe',
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await APIs.users.put('/me', updatedData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user data');
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordChangeData, { rejectWithValue }) => {
    try {
      const response = await APIs.users.put('/me/password', passwordChangeData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change user password');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    changePasswordStatus: 'idle',
    changePasswordError: null,
  },
  reducers: {
    // You can add other synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMe.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserMe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserMe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
      })
      .addCase(updateUserMe.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateUserMe.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.user = action.payload; // Update user info with new data
      })
      .addCase(updateUserMe.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.changePasswordStatus = 'loading';
        state.changePasswordError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordStatus = 'succeeded';
        state.changePasswordError = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordStatus = 'failed';
        state.changePasswordError = action.payload;
      });
  },
});

export default userSlice.reducer;