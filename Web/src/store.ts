import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatSlice";
import userReducer from "./reducers/userSlice";

export const store = configureStore({
    reducer: {
        chat: chatReducer,
        user: userReducer
    }
});