import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AdminState {
  admin: {
    id: number | null;
    name: string;
    email: string;
    password: null;
    role: string;
    createdAt: string;
    updateAt: string;
    token: string;
  } | null;
}

const initialState: AdminState = {
  admin: null,
};

export const AdminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    saveAdmin: (state, action: PayloadAction<AdminState>) => {
      state.admin = action.payload;
    },
    deleteAdmin: (state) => {
      state.admin = initialState.admin;
    },
  },
});

export const { saveAdmin } = AdminSlice.actions;

export default AdminSlice.reducer;
