import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from '../Store/Reducers/conversationSlice';
import activeReducer from '../Store/Reducers/activeUsersSlice';

export default configureStore({
    reducer: {
        conversation: conversationReducer,
        active:activeReducer
    },
});
