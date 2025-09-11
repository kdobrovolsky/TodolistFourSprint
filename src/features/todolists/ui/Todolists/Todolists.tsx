import { useAppDispatch, useAppSelector } from "@/common/hooks"

import { TodolistItem } from "./TodolistItem/TodolistItem"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { useEffect } from "react"
import { fetchTodolist, selectTodolists } from "@/features/todolists/model/todolists-slice.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)
  const dispatch = useAppDispatch()
  useEffect(() => {
    todolistsApi.getTodolists().then(res => {
      dispatch(fetchTodolist({ todolists: res.data }))
    })
  }, [])
  return (
    <>
      {todolists.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
