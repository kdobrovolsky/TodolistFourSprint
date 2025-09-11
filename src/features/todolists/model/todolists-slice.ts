import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => {
    return {
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
  extraReducers: (builder) => {
    builder.addCase(fetchTodolistsTC.fulfilled, (_, action) => {
      return action.payload?.todolists.map((t) => ({ ...t, filter: "all" }))
    })
      .addCase(changeTodolistTitleTC.fulfilled,(state,action)=>{
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(deleteTodolistTC.fulfilled,(state,action)=> {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(createTodolistTC.fulfilled,(state,action)=> {
        state.unshift({ ...action.payload, filter: "all", addedDate: "", order: 0 })
      })
  },
})

export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolistsTC`,
  async (_, thunkAPI) => {
    try {
      const res = await todolistsApi.getTodolists()
      return { todolists: res.data }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async ( id: string , thunkAPI) => {
    try {
      await todolistsApi.deleteTodolist(id)
      return {id}
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createTodolistTC = createAsyncThunk( `${todolistsSlice.name}/createTodolistTC`,
  async (title: string,thunkAPI) => {
    try {
     const res=  await todolistsApi.createTodolist(title)
      return res.data.data.item
    }catch (error){
      return thunkAPI.rejectWithValue(error)
    }
  })

export const changeTodolistTitleTC = createAsyncThunk( `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (arg:{id: string, title: string},thunkAPI) => {
    try {
      await todolistsApi.changeTodolistTitle(arg)
      return arg
    }catch (error){
     return thunkAPI.rejectWithValue(error)
    }
  })



export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export const {  changeTodolistFilterAC} =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
