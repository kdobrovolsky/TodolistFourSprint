import { domainTodolistSchema, Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { RequestStatus } from "@/common/types"
import { ResultCode } from "@/common/enums"
import { handleServerAppError } from "@/common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "@/common/utils/handleServerNetworkError.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => {
    return {
      fetchTodolistsTC: create.asyncThunk(
        async (_, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: "loading" }))
            const res = await todolistsApi.getTodolists()
            const validatedTodolists = domainTodolistSchema.array().parse(res.data)
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { todolists: validatedTodolists }
          } catch (error) {
            dispatch(setAppStatusAC({ status: "failed" }))
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (_, action) => {
            return action.payload.todolists.map((tl) => ({
              ...tl,
              filter: "all" as const,
              entityStatus: "idle" as const,
            }))
          },
        },
      ),
      createTodolistTC: create.asyncThunk(
        async (title: string, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: "loading" }))
            const res = await todolistsApi.createTodolist(title)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatusAC({ status: "succeeded" }))
              return res.data.data.item
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(dispatch, error)
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            state.unshift({ ...action.payload, filter: "all", entityStatus: "idle" })
          },
        },
      ),
      deleteTodolistTC: create.asyncThunk(
        async (id: string, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: "loading" }))
            dispatch(changeTodolistStatusAC({ id, status: "loading" }))
            const res = await todolistsApi.deleteTodolist(id)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatusAC({ status: "succeeded" }))
              return { id }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(dispatch, error)
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todolist) => todolist.id === action.payload.id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          },
        },
      ),

      changeTodolistTitleTC: create.asyncThunk(
        async (arg: { id: string; title: string }, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            const res = await todolistsApi.changeTodolistTitle(arg)

            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatusAC({ status: "succeeded" }))
              return arg
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(dispatch, error)
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todolist) => todolist.id === action.payload.id)
            if (index !== -1) {
              state[index].title = action.payload.title
            }
          },
        },
      ),

      changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].filter = action.payload.filter
        }
      }),
      changeTodolistStatusAC: create.reducer<{ id: string; status: RequestStatus }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].entityStatus = action.payload.status
        }
      }),
    }
  },

  selectors: {
    selectTodolists: (state) => state,
  },
})

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
export const {
  changeTodolistFilterAC,
  deleteTodolistTC,
  createTodolistTC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  changeTodolistStatusAC,
} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
