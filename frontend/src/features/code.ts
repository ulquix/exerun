import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Output } from "@/types/globaltype";

const initialState: Output = {
  stdout: "",
  stderr: "",
  exception: null,
  executionTime: 0,
  limitPerMonthRemaining: 0,
  status: "idle",
  error: null,
};

const CodeSlice = createSlice({
  name: "Code",
  initialState,
  reducers: {
    setOutput: (state, action: PayloadAction<Output>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setOutput } = CodeSlice.actions;
export default CodeSlice.reducer;
