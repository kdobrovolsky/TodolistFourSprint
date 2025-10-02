import { Route, Routes } from "react-router"
import { Main } from "@/app/Main.tsx"
import { Login } from "@/features/features/auth/ui/Login/Login.tsx"
import { PageNotFound } from "@/common/components/PageNotFound/PageNotFound.tsx"

const Patch = {
  Main: "/",
  Login: "/login",
  PageNotFound: "*",
}

export const Routing = () => {
  return (
    <Routes>
      <Route path={Patch.Main} element={<Main />} />
      <Route path={Patch.Login} element={<Login />} />
      <Route path={Patch.PageNotFound} element={<PageNotFound />} />
    </Routes>
  )
}
