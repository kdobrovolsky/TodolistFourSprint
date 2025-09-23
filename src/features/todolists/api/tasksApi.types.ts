import type { TaskPriority, TaskStatus } from "@/common/enums/enums"
import { RequestStatus } from "@/common/types"

export type DomainTask = {
  description: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
  entityStatus?: RequestStatus
}

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
}

export type UpdateTaskModel = Omit<DomainTask, 'id' | 'todoListId' | 'order' | 'addedDate'>
