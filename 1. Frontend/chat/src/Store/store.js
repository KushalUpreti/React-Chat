import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from '../Store/Reducers/conversationSlice';

export default configureStore({
    reducer: {
        conversation: conversationReducer,
    },
});
