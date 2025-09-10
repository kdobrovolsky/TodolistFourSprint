import { createAction, createReducer, createSlice } from "@reduxjs/toolkit"

export const changeThemeModeAC = createAction<{ themeMode: ThemeMode }>("app/changeThemeMode")

const initialState = {
  themeMode: "light" as ThemeMode,
}

const appSlice = createSlice({
  name: 'app',
  initialState: {
    themeMode: "light" as ThemeMode
  },
  reducers:{

  }
})

export const appReducer = createReducer(initialState, (builder) => {
  builder.addCase(changeThemeModeAC, (state, action) => {
    state.themeMode = action.payload.themeMode
  })
})

export type ThemeMode = "dark" | "light"
