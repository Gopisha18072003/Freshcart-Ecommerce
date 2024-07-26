import { createSlice } from "@reduxjs/toolkit";

const cart = createSlice({
    name: 'cart',
    initialState: { items:[] },
    reducers: {
        addItemToCart(state, action) {
            let isItemFound = false;
            for (let item of state.items) {
                if(item.product._id == action.payload.product._id) {
                    item.quantity += 1;
                    isItemFound = true;
                    break;
                }
            }
            if(!isItemFound) {
                state.items.push({
                    product : action.payload.product,
                    quantity: 1
                })
            }

        },
        removeItemToCart(state, action) {
            state.items.filter(item => item.product._id !== action.payload.product._id)
        }
    }
})

export const {addItemToCart, removeItemToCart} = cart.actions;
export default cart.reducer;