  import { useAppDispatch, useAppSelector } from "@/common/hooks"
  import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
  import { TaskItem } from "./TaskItem/TaskItem"
  import List from "@mui/material/List"
  import { selectTasks } from "@/features/todolists/model/tasks-slice.ts"
  import { useEffect } from "react"
  import { fetchTasksTC } from "@/features/todolists/model/tasks-slice.ts"
  import { TaskStatus } from "@/common/enums"

  type Props = {
    todolist: DomainTodolist
  }

  export const Tasks = ({ todolist }: Props) => {
    const { id, filter } = todolist

    const tasks = useAppSelector(selectTasks)
    const dispatch = useAppDispatch()

    console.log('All tasks:', tasks)
    console.log('Tasks for todolist', id, ':', tasks[id])
    console.log('Todolist IDs in state:', Object.keys(tasks))

    useEffect(() => {
      console.log('Fetching tasks for:', id)
      dispatch(fetchTasksTC(id))
    }, [])


    const todolistTasks = tasks[id]
    let filteredTasks = todolistTasks
    if (filter === "active") {
      filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.New)
    }
    if (filter === "completed") {
      filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.Completed)
    }

    return (
      <>
        <button onClick={() => dispatch(fetchTasksTC(id))}>
          Force reload tasks
        </button>
        {filteredTasks?.length === 0 ? (
          <p>Тасок нет</p>
        ) : (
          <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolistId={id} />)}</List>
        )}
      </>
    )
  }
