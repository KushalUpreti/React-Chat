import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from '../Store/Reducers/conversationSlice';
import activeReducer from '../Store/Reducers/activeUsersSlice';
import messageReducer from '../Store/Reducers/messageSlice';

export default configureStore({
    reducer: {
        conversation: conversationReducer,
        active: activeReducer,
        message: messageReducer
    },
});
