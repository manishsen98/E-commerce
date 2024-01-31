import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

export const LoadingSlice = createSlice({
  name: "isLoading",
  initialState,
  reducers: {
    changeLoading: (state, action: PayloadAction<boolean>) => {
      console.log(action);
      state.isLoading = action.payload;
    },
  },
});

export const { changeLoading } = LoadingSlice.actions;

export default LoadingSlice.reducer;
