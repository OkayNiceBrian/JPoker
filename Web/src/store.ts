import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatSlice";
import connectionReducer from "./reducers/connectionSlice";

export const store = configureStore({
    reducer: {
        chat: chatReducer,
        connection: connectionReducer
    }
});