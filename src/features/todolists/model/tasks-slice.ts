import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskPriority, TaskStatus } from "@/common/enums"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { RootState } from "@/app/store.ts"
import {setAppStatusAC} from "@/app/app-slice.ts";

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => {
    return {
      fetchTasksTC: create.asyncThunk(
        async (todolistId: string, thunkAPI) => {
          const{dispatch,rejectWithValue} = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: 'loading' }))
            const res = await tasksApi.getTasks(todolistId)
            dispatch(setAppStatusAC({ status: 'succeeded' }))
            return { todolistId, tasks: res.data.items }
          } catch (error) {
            dispatch(setAppStatusAC({ status: 'failed' }))
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
          const{dispatch,rejectWithValue} = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: 'loading' }))
            const res = await tasksApi.createTask(payload)
            dispatch(setAppStatusAC({ status: 'succeeded' }))
            return { task: res.data.data.item }
          } catch (error) {
            dispatch(setAppStatusAC({ status: 'failed' }))
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
          const{dispatch,rejectWithValue} = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: 'loading' }))
            await tasksApi.deleteTask(payload)
            dispatch(setAppStatusAC({ status: 'succeeded' }))
            return payload
          } catch (error) {
            dispatch(setAppStatusAC({ status: 'failed' }))
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

      changeTaskStatusTC: create.asyncThunk(
        async (payload: { todolistId: string; taskId: string; status: TaskStatus }, thunkAPI) => {
          const{dispatch,rejectWithValue} = thunkAPI
          try {
            dispatch(setAppStatusAC({ status: 'loading' }))
            const state =  thunkAPI.getState() as RootState
            const allTasks = state.tasks
            const TaskForTodolist = allTasks[payload.todolistId]
            const task = TaskForTodolist.find(el => el.id === payload.taskId)

            if(task) {
              const model: UpdateTaskModel = {
                description: task.description,
                title: task.title,
                status: payload.status,
                priority: TaskPriority.Low,
                startDate: task.startDate,
                deadline: task.deadline,
              }

              await tasksApi.updateTask({ todolistId: payload.todolistId, taskId: payload.taskId, model })
              dispatch(setAppStatusAC({ status: 'succeeded' }))
              return payload
            }else {
              dispatch(setAppStatusAC({ status: 'failed' }))
              return rejectWithValue(null)
            }
          } catch (error) {
            return thunkAPI.rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
            if (task) {
              task.status = action.payload.status
            }
          },
        },
      ),


      changeTaskTitleTC: create.asyncThunk(
          async (payload: { todolistId: string; taskId: string; title: string }, thunkAPI) => {
            const{dispatch,rejectWithValue} = thunkAPI
            try {
              dispatch(setAppStatusAC({ status: 'loading' }))
              const state =  thunkAPI.getState() as RootState
              const allTasks = state.tasks
              const TaskForTodolist = allTasks[payload.todolistId]
              const task = TaskForTodolist.find(el => el.id === payload.taskId)

              if(task) {
                const model: UpdateTaskModel = {
                  description: task.description,
                  title: task.title,
                  status: task.status,
                  priority: TaskPriority.Low,
                  startDate: task.startDate,
                  deadline: task.deadline,
                }

                await tasksApi.updateTask({ todolistId: payload.todolistId, taskId: payload.taskId, model })
                dispatch(setAppStatusAC({ status: 'succeeded' }))
                return payload
              }else {
                dispatch(setAppStatusAC({ status: 'failed' }))
                return rejectWithValue(null)
              }
            } catch (error) {
              return thunkAPI.rejectWithValue(error)
            }
          },
          {
            fulfilled: (state, action) => {
              const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
              if (task) {
                task.title = action.payload.title
              }
            },
          },
      ),
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
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

export const { deleteTaskTC, createTaskTC, changeTaskStatusTC, changeTaskTitleTC, fetchTasksTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
