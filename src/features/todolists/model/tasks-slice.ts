import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { ResultCode } from "@/common/enums"
import { RootState } from "@/app/store.ts"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { handleServerNetworkError } from "@/common/utils/handleServerNetworkError.ts"
import { handleServerAppError } from "@/common/utils/handleServerAppError.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => {
    return {
      fetchTasksTC: create.asyncThunk(
        async (todolistId: string, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: "loading" }))
            const res = await tasksApi.getTasks(todolistId)
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { todolistId, tasks: res.data.items }
          } catch (error) {
            dispatch(setAppStatusAC({ status: "failed" }))
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
          },
        },
      ),
      createTaskTC: create.asyncThunk(
        async (payload: { todolistId: string; title: string }, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: "loading" }))

            const res = await tasksApi.createTask(payload)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatusAC({ status: "succeeded" }))
              return { task: res.data.data.item }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
          },
        },
      ),
      deleteTaskTC: create.asyncThunk(
        async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: "loading" }))
            const res = await tasksApi.deleteTask(payload)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatusAC({ status: "succeeded" }))
              return payload
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
              tasks.splice(index, 1)
            }
          },
        },
      ),

      updateTaskTC: create.asyncThunk(
        async (
          payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
          { dispatch, getState, rejectWithValue },
        ) => {
          const { todolistId, taskId, domainModel } = payload
          const allTodolistTasks = (getState() as RootState).tasks[todolistId]
          const task = allTodolistTasks.find((task) => task.id === taskId)

          if (!task) {
            return rejectWithValue(null)
          }

          const model: UpdateTaskModel = {
            description: task.description,
            title: task.title,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status,
            ...domainModel,
          }

          try {
            dispatch(setAppStatusAC({ status: "loading" }))
            const res = await tasksApi.updateTask({ todolistId, taskId, model })
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatusAC({ status: "succeeded" }))
              return { task: res.data.data.item }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            const allTodolistTasks = state[action.payload.task.todoListId]
            const taskIndex = allTodolistTasks.findIndex((task) => task.id === action.payload.task.id)
            if (taskIndex !== -1) {
              allTodolistTasks[taskIndex] = action.payload.task
            }
          },
        },
      ),
    }
  },
  selectors: {
    selectTasks: (state) => state,
  },
})

export const { deleteTaskTC, createTaskTC, updateTaskTC, fetchTasksTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
