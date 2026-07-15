import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  isInitialized: false,
  error: null,
  requirePasswordChange: false
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const { user, accessToken, refreshToken, requirePasswordChange } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, requirePasswordChange };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      const errorCode = error.response?.data?.errorCode;
      return rejectWithValue({ message, errorCode });
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token');
      const response = await authApi.getProfile();
      const user = response.data.data || response.data; // Handle potentially nested data
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore logout errors
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.requirePasswordChange = action.payload.requirePasswordChange;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.requirePasswordChange = false;
      });
  }
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
