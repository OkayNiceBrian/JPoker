import { UserConnection } from "@/types/NetworkTypes";
import { createSlice } from "@reduxjs/toolkit";

export interface chatState {
    messages: string[],
    userConnection: UserConnection | null
};

const initialState: chatState = { 
    messages: [],
    userConnection: null
} satisfies chatState as chatState;

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage(state, action) {
            state.messages.push(action.payload);
        },
        setUserConnection(state, action) {
            state.userConnection = action.payload;
        }
    },
    selectors: {
        selectMessages: state => state.messages,
        selectUserConnection: state => state.userConnection
    }
});

export const { addMessage, setUserConnection } = chatSlice.actions;
export const { selectMessages, selectUserConnection } = chatSlice.selectors;

export default chatSlice.reducer;