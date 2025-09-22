import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice.ts"
import { RequestStatus } from "@/common/types"
import { ResultCode } from "@/common/enums"

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
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            action.payload.todolists.forEach((tl) => {
              state.push({ ...tl, filter: "all",  entityStatus:'idle' })
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
            if(res.data.resultCode === ResultCode.Success){
              dispatch(setAppStatusAC({ status: 'succeeded' }))
              return res.data.data.item
            }else {
              dispatch(setAppErrorAC({error: res.data.messages[0]}))
              dispatch(setAppStatusAC({ status: "failed" }))
              return rejectWithValue(null)
            }
          } catch (error: any) {
            dispatch(setAppErrorAC({error: error.message}))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {

            state.unshift({ ...action.payload, filter: "all", entityStatus:'idle' })
          },
        },
      ),
      deleteTodolistTC: create.asyncThunk(
        async (id: string, thunkAPI) => {
          const {dispatch,rejectWithValue} = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: 'loading' }))
            dispatch(changeTodolistStatusAC({id,status: 'loading' }))
            await todolistsApi.deleteTodolist(id)
            dispatch(setAppStatusAC({ status: 'succeeded' }))
            return { id }
          } catch (error) {
            dispatch(setAppStatusAC({ status: 'failed' }))
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
export const { changeTodolistFilterAC,deleteTodolistTC,createTodolistTC,changeTodolistTitleTC,fetchTodolistsTC,changeTodolistStatusAC } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
