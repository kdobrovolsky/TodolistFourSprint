import { Route, Routes } from "react-router"
import { Main } from "@/app/Main.tsx"
import { Login } from "@/features/features/auth/ui/Login/Login.tsx"
import { PageNotFound } from "@/common/components/PageNotFound/PageNotFound.tsx"
import { ProtectedRoute } from "@/common/routing/ProtectedRoute.tsx"
import { useAppSelector } from "../hooks"
import { selectIsLoggedIn } from "@/app/appSlice.ts"

export const Path = {
  Main: "/",
  Login: "/login",
  PageNotFound: "*",
}

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
        <Route path={Path.Main} element={<Main />} />
      </Route>

      <Route path={Path.Login} element={<Login />} />
      <Route path={Path.PageNotFound} element={<PageNotFound />} />
    </Routes>
  )
}
