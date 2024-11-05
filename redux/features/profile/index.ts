import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface profilerState {
    profile: {}
}

// Define the initial state using that type
const initialState: profilerState = {
    profile: {}
}

export const profileSlice = createSlice({
    name: 'profile',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        addProfile: (state, action: PayloadAction<any>) => {
            state.profile = action.payload
        },
    },
})

export const { addProfile } = profileSlice.actions

export default profileSlice.reducer