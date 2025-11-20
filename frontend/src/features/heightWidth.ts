import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { HeightWidth } from "@/types/globaltype";

const initialState: HeightWidth = {
  height: 0,
  width: 0,
  totalHeight: 0,
  totalWidth: 0,
};

const heightWidthSlice = createSlice({
  name: "heightWidth",
  initialState,
  reducers: {
    updateHW: (state, action: PayloadAction<HeightWidth>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateHW } = heightWidthSlice.actions;
export default heightWidthSlice.reducer;
