import { configureStore } from "@reduxjs/toolkit";
import t from "../features/heightWidth";
import c from "../features/code";
export const store = configureStore({
  reducer: {
    todo: t,
    code: c,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
