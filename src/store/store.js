import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./ui-slice";
import { authSlice } from "./auth-slice";

const store = configureStore({reducer:{cart: cartSlice.reducer, auth: authSlice.reducer}});

export default store;