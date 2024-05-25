import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/authSlice";
import posReducer from "../features/posSlice";
import transReducer from "../features/transaksiSlice";
import { saveStateToLocalStorage } from '../features/transaksiSlice';
import cartReducer from "../features/cartSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pos: posReducer,
    transaction : transReducer,
    cart : cartReducer,
  },
});

// store.subscribe(() => {
//   saveStateToLocalStorage(store.getState().transaction);
// });
