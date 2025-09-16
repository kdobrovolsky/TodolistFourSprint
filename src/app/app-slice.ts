import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"

const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
  },
  reducers: (create) => {
    return {
      changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
        state.themeMode = action.payload.themeMode
      }),
      setAppStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
        state.status = action.payload.status
      }),
    }
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: state => state.status
  },
})

export const { changeThemeModeAC,setAppStatusAC } = appSlice.actions
export const {selectThemeMode,selectAppStatus} = appSlice.selectors
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
