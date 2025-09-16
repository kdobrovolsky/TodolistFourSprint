import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { setAppStatusAC } from "@/app/app-slice.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => {
    return {
      fetchTodolistsTC: create.asyncThunk(
        async (_, thunkAPI) => {
          const {dispatch,rejectWithValue} = thunkAPI
          try {
           dispatch(setAppStatusAC({ status: 'loading' }))
            const res = await todolistsApi.getTodolists()
            dispatch(setAppStatusAC({ status: 'succeeded' }))
            return { todolists: res.data }
          } catch (error) {
            console.error("Failed to fetch todolists:", error)
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            action.payload.todolists.forEach((tl) => {
              state.push({ ...tl, filter: "all" })
            })
          },
        },
      ),
      createTodolistTC: create.asyncThunk(
        async (title: string, thunkAPI) => {
          const {dispatch,rejectWithValue} = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: 'loading' }))
            const res = await todolistsApi.createTodolist(title)
            dispatch(setAppStatusAC({ status: 'succeeded' }))
            return res.data.data.item
          } catch (error) {
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            state.unshift({ ...action.payload, filter: "all", addedDate: "", order: 0 })
          },
        },
      ),
      deleteTodolistTC: create.asyncThunk(
        async (id: string, thunkAPI) => {
          const {dispatch,rejectWithValue} = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: 'loading' }))
            await todolistsApi.deleteTodolist(id)
            dispatch(setAppStatusAC({ status: 'succeeded' }))
            return { id }
          } catch (error) {
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
          try {
            await todolistsApi.changeTodolistTitle(arg)
            return arg
          } catch (error) {
            return thunkAPI.rejectWithValue(error)
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
    }
  },

  selectors: {
    selectTodolists: (state) => state,
  },
})

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
export const { changeTodolistFilterAC,deleteTodolistTC,createTodolistTC,changeTodolistTitleTC,fetchTodolistsTC } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
