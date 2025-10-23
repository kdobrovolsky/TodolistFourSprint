import { configureStore } from "@reduxjs/toolkit"
import { tasksReducer, tasksSlice } from "@/features/todolists/model/tasks-slice.ts"
import { todolistsReducer, todolistsSlice } from "@/features/todolists/model/todolists-slice.ts"
import { appReducer, appSlice } from "@/app/appSlice.ts"
import { authReducer, authSlice } from "@/features/auth/model/auth-slice.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "@/src/app/baseApi.ts"

// создание store
export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    [authSlice.name]: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)
// для возможности обращения к store в консоли браузера
// @ts-ignore
window.store = store
