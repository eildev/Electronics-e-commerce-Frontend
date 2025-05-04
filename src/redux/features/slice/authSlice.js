import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: Cookies.get("token") || null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            // console.log(action.payload.data);
            state.loading = false;
            state.user = action.payload.data || null;
            state.token = action.payload.data.token;
            Cookies.set("token", action.payload.data.token, { expires: 7 });
            localStorage.setItem("user", JSON.stringify(action.payload.data));
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            Cookies.remove("token");
            localStorage.removeItem("user");
        },
        restoreUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, restoreUser } = authSlice.actions;
export default authSlice.reducer;