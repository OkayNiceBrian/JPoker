import { createSlice } from "@reduxjs/toolkit";

export interface chatState {
    messages: string[]
};

const initialChat: string[] = [];

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: initialChat
    } as chatState,
    reducers: {
        addMessage(state, action) {
            state.messages.push(action.payload);
        }
    }
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;