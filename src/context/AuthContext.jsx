import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { onAuthStateChanged } from "firebase/auth"

import { auth } from "../services/firebase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (usuarioAtual) => {
        setUsuario(usuarioAtual)
        setCarregando(false)
      }
    )

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}