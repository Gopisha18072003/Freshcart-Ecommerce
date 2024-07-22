import { createSlice } from "@reduxjs/toolkit";

const auth = createSlice({
    name: 'auth',
    initialState: { user: {} },
    reducers: {
        loginSuccess(state, action) {
            if(!state.user ) {
                state.user = action.payload
            }

        },
        logoutSuccess(state, action) {
            state.user = null;
        }
    }
})

export const {loginSuccess, logoutSuccess} = auth.actions;
export const authSlice = auth;