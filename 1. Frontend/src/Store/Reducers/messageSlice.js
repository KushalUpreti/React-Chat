import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: []
    },
    reducers: {
        addMessageToConversation: (state, action) => {
            if(state.messages.length>0){
                state.messages.push(action.payload);
            }else{
                state.messages = [action.payload]
            }

            return state;
        },
        addAllMessages: (state, action) => {
            state.messages = action.payload;
            return state;
        },
        removeAllMessages: (state, action) => {
            state.messages = [];
            return state;
        }
    }
});

export const { addMessageToConversation, addAllMessages, removeAllMessages } = messageSlice.actions;
export const selectMessage = state => state.message.messages;

export default messageSlice.reducer;