function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <p className="text-sm text-slate-500">
          Visão geral
        </p>

        <h2 className="mt-1 text-3xl font-bold text-slate-900">
          Saldo atual
        </h2>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Saldo atual
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            R$ 0,00
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Receitas do mês
          </p>

          <p className="mt-3 text-3xl font-bold text-emerald-600">
            R$ 0,00
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Gastos do mês
          </p>

          <p className="mt-3 text-3xl font-bold text-red-500">
            R$ 0,00
          </p>
        </div>

      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Recebimentos previstos
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-600">
            R$ 0,00
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Referente ao mês atual
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Gastos previstos
          </p>

          <p className="mt-3 text-2xl font-bold text-red-500">
            R$ 0,00
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Referente ao mês atual
          </p>
        </div>

      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="font-semibold text-slate-800">
          Movimentações recentes
        </h3>

        <div className="mt-6 flex min-h-32 items-center justify-center text-sm text-slate-400">
          Nenhuma movimentação registrada.
        </div>
      </section>
    </div>
  )
}

export default Dashboard