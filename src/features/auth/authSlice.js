
import { createSlice } from "@reduxjs/toolkit";
import { getToken, removeToken, saveToken } from "../../utils/storage";

const initialState = {
  token: typeof window !== "undefined" ? getToken() : null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      saveToken(action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      removeToken();
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

