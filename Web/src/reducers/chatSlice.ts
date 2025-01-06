import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: [],
    reducers: {
        addMessage(state, action) {
            state.push(action.payload);
        }
    }
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;