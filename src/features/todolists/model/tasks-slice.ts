import { nanoid } from "@reduxjs/toolkit"
import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskPriority, TaskStatus } from "@/common/enums"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => {

    return {
      fetchTasksTC: create.asyncThunk(
        async (todolistId: string, thunkAPI) => {
          try {
            const res = await tasksApi.getTasks(todolistId)
            return { todolistId, tasks: res.data.items }

          } catch (error) {
            console.error("Failed to fetch tasks:", error)
            return thunkAPI.rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
          },
        },
      ),
      deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) {
          tasks.splice(index, 1)
        }
      }),
      createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, action) => {
        const newTask: DomainTask = {
          title: action.payload.title,
          status: TaskStatus.New,
          id: nanoid(),
          description: "",
          priority: TaskPriority.Low,
          startDate: "",
          deadline: "",
          todoListId: action.payload.todolistId,
          order: 0,
          addedDate: new Date().toISOString(),
        }
        state[action.payload.todolistId].unshift(newTask)
      }),
      changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; status: TaskStatus }>(
        (state, action) => {
          const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
          if (task) {
            task.status = action.payload.status
          }
        },
      ),
      changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
        const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
        if (task) {
          task.title = action.payload.title
        }
      }),
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        console.log('createTodolistTC payload:', action.payload)
        console.log('Todolist ID:', action.payload.id)
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  selectors: {
    selectTasks: (state) => state,
  },
})

export const { deleteTaskAC, createTaskAC, changeTaskStatusAC, changeTaskTitleAC,fetchTasksTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
