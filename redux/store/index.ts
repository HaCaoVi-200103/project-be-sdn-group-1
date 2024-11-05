import profileSlice from '@redux/features/profile'
import counterSlice from '@redux/tests/counterSlice'
import { configureStore } from '@reduxjs/toolkit'
// ...

export const store = configureStore({
    reducer: {
        counter: counterSlice,
        profile: profileSlice
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch