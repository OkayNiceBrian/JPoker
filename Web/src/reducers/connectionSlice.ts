import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: 'connection',
    initialState: null,
    reducers: {
        setConnection(state, action) {
            state = action.payload;
        }
    }
});

export const { setConnection } = connectionSlice.actions;
export default connectionSlice.reducer;