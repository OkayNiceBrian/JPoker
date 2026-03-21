import { createSlice } from "@reduxjs/toolkit";

export interface userState {
    username: string | null;
};

const storedUsername = localStorage.getItem("username");

const initialState: userState = { username: storedUsername } satisfies userState as userState;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsername(state, action) {
            state.username = action.payload;
            localStorage.setItem("username", state.username!);
        },
    },
    selectors: {
        selectUsername: state => state.username,
    }
});

export const { setUsername } = userSlice.actions;
export const { selectUsername } = userSlice.selectors;

export default userSlice.reducer;