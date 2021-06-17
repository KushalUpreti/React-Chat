import { createSlice } from '@reduxjs/toolkit';

const activeUsersSlice = createSlice({
    name: 'active',
    initialState: {
        activeUsers: []
    },
    reducers: {
        addAllActiveUsers: (state, action) => {
            const find = state.activeUsers.find((item) => {
                return item.id === action.payload.id;
            })
            if (!find) {
                state.activeUsers = action.payload;
            } else {
                return state;
            }

        },
        addActiveUser: (state, action) => {
            const find = state.activeUsers.find((item) => {
                return item.id === action.payload.id;
            })
            if (!find) {
                state.activeUsers.push(action.payload);
            }
            else {
                return state;
            }
        },
        removeOfflineUser: (state, action) => {
            const newArray = state.activeUsers.filter((item) => {
                return item.id !== action.payload.id;
            });
            state.activeUsers = [...newArray];
        }
    }
})

export const { addActiveUser, removeOfflineUser, addAllActiveUsers } = activeUsersSlice.actions;
export const selectActive = state => state.active.activeUsers;

export default activeUsersSlice.reducer;