import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: []
    },
    reducers: {
        addMessageToConversation: (state, action) => {
            if (state.messages.length > 0) {
                state.messages.push(action.payload);
            } else {
                state.messages = [action.payload]
            }

            return state;
        },
        addAllMessages: (state, action) => {
            state.messages = action.payload;
            return state;
        },
        addMoreMessages: (state, action) => {
            state.messages = [...action.payload, ...state.messages]
            return state;
        }
        ,
        removeAllMessages: (state, action) => {
            state.messages = [];
            return state;
        },
        removeSingleMessge: (state, action) => {
            let position = action.payload;
            state.messages[position].message = "\uD83D\uDDD1 Message deleted";
            state.messages[position].deleted = true;
            return state;
        }

    }
});

export const { addMessageToConversation, addAllMessages, removeAllMessages, addMoreMessages, removeSingleMessge } = messageSlice.actions;
export const selectMessage = state => state.message.messages;

export default messageSlice.reducer;