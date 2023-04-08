import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: JSON.parse(localStorage.getItem("userInfo")),
}

export const userSlice = createSlice({
  name: 'switch',
  initialState,
  reducers: {
    set: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = localStorage.getItem("useInfo")
    },
    unset: (state) => {
      state.value = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { set, unset } = userSlice.actions

export default userSlice.reducer
