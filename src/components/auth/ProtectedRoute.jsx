import { Navigate } from "react-router-dom"

import { useAuth } from "../../context/AuthContext"

function ProtectedRoute({ children }) {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">
          Carregando...
        </p>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute