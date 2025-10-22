import { Navigate } from "react-router/internal/react-server-client"
import { Path } from "@/common/routing/Routing.tsx"
import { ReactNode } from "react"
import { Outlet } from "react-router"

type Props = {
  isAllowed: boolean
  children?: ReactNode
  redirectPath?: string
}

export const ProtectedRoute = ({ children, isAllowed, redirectPath = Path.Login }: Props) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} />
  }
  return children ? children : <Outlet />
}
