import { createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => {
    return {
      fetchTodolist:  create.reducer<{ todolists: Todolist[] }>((_, action) => {
        console.log("Полученный payload:", action.payload)
        return action.payload.todolists.map(t=> ({...t,filter: 'all'}))
      }),
      deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      }),
      changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      }),
      changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].filter = action.payload.filter
        }
      }),
      createTodolistAC: create.preparedReducer(
        (title: string) => {
          return { payload: { title, id: nanoid() } }
        },
        (state, action) => {
          state.push({ ...action.payload, filter: "all",addedDate:'',order:0 })
        },
      ),
    }
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})



export type DomainTodolist = Todolist & {
  filter: FilterValues;
}

export type FilterValues = "all" | "active" | "completed"

export const { deleteTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, createTodolistAC,fetchTodolist } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors