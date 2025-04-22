import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const initialAuthState = {
  token: localStorage.getItem('token') || null,
  userId: null,
  emailVerified: false,
  isLoggedIn: !!localStorage.getItem('token'),
};

//checks email verification status
export const checkEmailVerification = createAsyncThunk(
  'auth/checkEmailVerification',
  async (token, thunkAPI) => {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
      { idToken: token }
    );
    return response.data.users[0].emailVerified;
  }
);

//sends verification mail
export const sendVerificationEmail = createAsyncThunk(
  'auth/sendVerificationEmail',
  async (token, thunkAPI) => {
    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
      {
        requestType: 'VERIFY_EMAIL',
        idToken: token,
      }
    );
    return true;
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
      state.emailVerified = false;
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      state.isLoggedIn = false;
      state.emailVerified = false;
      localStorage.removeItem('token');
      window.location.href = '/';
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(checkEmailVerification.fulfilled, (state, action) => {
        state.emailVerified = action.payload;
      })
      .addCase(sendVerificationEmail.fulfilled, (state) => {});
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
