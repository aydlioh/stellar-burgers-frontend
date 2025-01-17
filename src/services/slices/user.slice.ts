import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { deleteTokens, saveTokens } from '../../utils/tokens';

export const fetchUser = createAsyncThunk('user/fetch', getUserApi);
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const login = createAsyncThunk('user/login', async (data: TLoginData) =>
  loginUserApi(data)
);

export const logout = createAsyncThunk('user/logout', logoutApi);

type TUserState = {
  isAuthorized: boolean;
  user: TUser;
  error: string | undefined | null;
  loading: boolean;
};

const initialState: TUserState = {
  isAuthorized: false,
  user: {
    name: '',
    email: ''
  },
  error: null,
  loading: true
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getIsAuthorized: (state) => state.isAuthorized,
    getUser: (state) => state.user,
    getAuthError: (state) => state.error,
    getAuthLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthorized = true;
        state.user = action.payload.user;
        state.error = null;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthorized = false;
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      });
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthorized = true;
        state.user = action.payload.user;
        state.error = null;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      });
    builder
      .addCase(register.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        state.isAuthorized = true;
        state.user = user;
        state.error = null;
        state.loading = false;
        saveTokens({ accessToken, refreshToken });
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthorized = false;
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        state.error = null;
        state.loading = true;
      });
    builder
      .addCase(login.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        state.isAuthorized = true;
        state.user = user;
        state.error = null;
        state.loading = false;
        saveTokens({ accessToken, refreshToken });
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthorized = false;
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.error = null;
        state.loading = true;
      });
    builder
      .addCase(logout.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthorized = false;
        state.user = {
          name: '',
          email: ''
        };
        state.error = null;
        state.loading = false;
        deleteTokens();
      });
  }
});

export const { getIsAuthorized, getUser, getAuthError, getAuthLoading } =
  userSlice.selectors;
