import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./ui-slice";

const store = configureStore({reducer:{cart: cartSlice.reducer}});

export default store;