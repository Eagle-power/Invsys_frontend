import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { userInfo, token } = action.payload;
      state.userInfo = userInfo;
      state.token = token;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('token', token);
    },
    logout(state) {
      state.userInfo = null;
      state.token = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.userInfo;