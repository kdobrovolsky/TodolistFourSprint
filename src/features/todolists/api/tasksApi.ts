import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"

import { baseApi } from "@/src/app/baseApi.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; params: { page: number } }>({
      query: ({ todolistId, params }) => {
        return {
          url: `/todo-lists/${todolistId}/tasks`,
          params,
        }
      },
      providesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    createTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),

    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    deleteTask: build.mutation<BaseResponse<{ item: BaseResponse }>, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
  }),
})

export const { useUpdateTaskMutation, useGetTasksQuery, useDeleteTaskMutation, useCreateTaskMutation } = tasksApi
