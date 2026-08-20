import { useState } from "react"
import { Navigate } from "react-router-dom"

import { entrar, cadastrarUsuario } from "../services/auth"
import { useAuth } from "../context/AuthContext"

function Login() {
  const { usuario, carregando } = useAuth()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [modoCadastro, setModoCadastro] = useState(false)

  const [erro, setErro] = useState("")
  const [processando, setProcessando] = useState(false)

  if (carregando) {
    return null
  }

  if (usuario) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setErro("")
    setProcessando(true)

    try {
      if (modoCadastro) {
        await cadastrarUsuario(email, senha)
      } else {
        await entrar(email, senha)
      }
    } catch (error) {
      console.error(error)

      setErro(
        "Não foi possível realizar a operação. Verifique seus dados."
      )
    } finally {
      setProcessando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Finansaí
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {modoCadastro
              ? "Crie sua conta para começar."
              : "Entre para acessar seu controle financeiro."
            }
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(event) =>
              setSenha(event.target.value)
            }
            required
            minLength={6}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          {erro && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={processando}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {processando
              ? "Aguarde..."
              : modoCadastro
                ? "Criar conta"
                : "Entrar"
            }
          </button>

        </form>

        <button
          type="button"
          onClick={() => {
            setModoCadastro(!modoCadastro)
            setErro("")
          }}
          className="mt-6 w-full text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
        >
          {modoCadastro
            ? "Já tenho uma conta"
            : "Ainda não tenho uma conta"
          }
        </button>

      </div>
    </div>
  )
}

export default Login