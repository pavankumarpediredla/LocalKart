import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAuthSession } from "../../lib/authSession";

interface AuthState {
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialSession = getAuthSession();

const initialState: AuthState = {
  username: initialSession.isAuthenticated ? initialSession.username : null,
  role: initialSession.isAuthenticated ? initialSession.role : null,
  isAuthenticated: initialSession.isAuthenticated,
};

const authStore = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ username: string; role: string }>) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.username = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, logout } = authStore.actions;
export default authStore.reducer;
