import { createSlice } from '@reduxjs/toolkit';

const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversations: []
    },
    reducers: {
        addNewConversation: (state, action) => {
            state.conversations.unshift(action.payload);
            return state;
        },

        updateConversation: (state, action) => {
            const index = state.conversations.findIndex((item) => {
                return item._id === action.payload.message.conversation_id;
            })
            const convo = state.conversations[index];
            convo.latest_message_date = new Date() + "";
            convo.latest_message = action.payload.message.message;
            const newArray = state.conversations.filter((item) => {
                return item._id !== action.payload.message.conversation_id;
            })
            newArray.unshift(convo);
            state.conversations = newArray;
        },
        removeConversation: (state, action) => {
            state.conversations.filter((item) => {
                return item._id !== action.payload;
            })
            return state;
        },

        loadConversation: (state, action) => {
            state.conversations = action.payload;
        }
    }
});

export const { addNewConversation, loadConversation, updateConversation, removeConversation } = conversationSlice.actions;
export const selectConvo = state => state.conversation.conversations;

export default conversationSlice.reducer;