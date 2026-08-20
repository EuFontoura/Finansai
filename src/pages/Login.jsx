import { Link } from "react-router-dom"

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Meu Financeiro
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Entre para acessar seu controle financeiro.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          <button
            type="button"
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            Entrar
          </button>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-slate-500 hover:text-slate-700"
        >
          Continuar sem login
        </Link>

      </div>
    </div>
  )
}

export default Login