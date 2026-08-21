import { useEffect, useState } from "react"

import { useAuth } from "../context/AuthContext"

import { buscarLancamentos } from "../services/lancamentos"


function obterDataHoje() {
  return new Date().toISOString().split("T")[0]
}


function determinarStatus(data) {
  return data <= obterDataHoje()
    ? "realizado"
    : "previsto"
}


function formatarMoeda(valor) {
  return Number(valor).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  )
}


function formatarData(data) {
  if (!data) {
    return "-"
  }

  const [
    ano,
    mes,
    dia,
  ] = data.split("-")

  return `${dia}/${mes}/${ano}`
}


function Dashboard() {
  const { usuario } = useAuth()

  const [lancamentos, setLancamentos] =
    useState([])

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] =
    useState("")


  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true)
        setErro("")

        const dados =
          await buscarLancamentos(
            usuario.uid
          )

        /*
         * O status é recalculado pela data.
         *
         * Dessa maneira um lançamento que estava
         * previsto passa automaticamente para
         * realizado quando chega sua data.
         */
        const dadosComStatus =
          dados.map((lancamento) => ({
            ...lancamento,
            status: determinarStatus(
              lancamento.data
            ),
          }))

        setLancamentos(
          dadosComStatus
        )

      } catch (error) {
        console.error(error)

        setErro(
          "Não foi possível carregar os dados financeiros."
        )

      } finally {
        setCarregando(false)
      }
    }


    if (usuario) {
      carregarDados()
    }

  }, [usuario])


  /*
   * DATA ATUAL
   */

  const hoje =
    new Date()

  const anoAtual =
    hoje.getFullYear()

  const mesAtual =
    hoje.getMonth()


  /*
   * LANÇAMENTOS REALIZADOS
   */

  const realizados =
    lancamentos.filter(
      (lancamento) =>
        lancamento.status ===
        "realizado"
    )


  /*
   * LANÇAMENTOS DO MÊS ATUAL
   */

  const lancamentosMesAtual =
    lancamentos.filter(
      (lancamento) => {

        if (!lancamento.data) {
          return false
        }

        const data =
          new Date(
            `${lancamento.data}T00:00:00`
          )

        return (
          data.getFullYear() ===
            anoAtual &&
          data.getMonth() ===
            mesAtual
        )
      }
    )


  /*
   * RECEITAS REALIZADAS
   */

  const receitasMes =
    lancamentosMesAtual
      .filter(
        (lancamento) =>
          lancamento.tipo ===
            "rendimento" &&
          lancamento.status ===
            "realizado"
      )
      .reduce(
        (total, lancamento) =>
          total +
          Number(lancamento.valor),
        0
      )


  /*
   * GASTOS REALIZADOS
   */

  const gastosMes =
    lancamentosMesAtual
      .filter(
        (lancamento) =>
          lancamento.tipo ===
            "gasto" &&
          lancamento.status ===
            "realizado"
      )
      .reduce(
        (total, lancamento) =>
          total +
          Number(lancamento.valor),
        0
      )


  /*
   * RECEITAS PREVISTAS
   */

  const recebimentosPrevistos =
    lancamentosMesAtual
      .filter(
        (lancamento) =>
          lancamento.tipo ===
            "rendimento" &&
          lancamento.status ===
            "previsto"
      )
      .reduce(
        (total, lancamento) =>
          total +
          Number(lancamento.valor),
        0
      )


  /*
   * GASTOS PREVISTOS
   */

  const gastosPrevistos =
    lancamentosMesAtual
      .filter(
        (lancamento) =>
          lancamento.tipo ===
            "gasto" &&
          lancamento.status ===
            "previsto"
      )
      .reduce(
        (total, lancamento) =>
          total +
          Number(lancamento.valor),
        0
      )


  /*
   * SALDO ATUAL
   *
   * Aqui entram TODOS os lançamentos realizados,
   * independentemente do mês.
   *
   * Isso é importante:
   *
   * Se você começou o controle financeiro há meses,
   * o saldo atual precisa considerar os lançamentos
   * realizados anteriormente também.
   */

  const totalRecebimentos =
    realizados
      .filter(
        (lancamento) =>
          lancamento.tipo ===
          "rendimento"
      )
      .reduce(
        (total, lancamento) =>
          total +
          Number(lancamento.valor),
        0
      )


  const totalGastos =
    realizados
      .filter(
        (lancamento) =>
          lancamento.tipo ===
          "gasto"
      )
      .reduce(
        (total, lancamento) =>
          total +
          Number(lancamento.valor),
        0
      )


  const saldoAtual =
    totalRecebimentos -
    totalGastos


  /*
   * MOVIMENTAÇÕES RECENTES
   *
   * Ordena pela data mais recente.
   */

  const movimentacoesRecentes =
    [...lancamentos]
      .sort(
        (a, b) =>
          new Date(
            `${b.data}T00:00:00`
          ) -
          new Date(
            `${a.data}T00:00:00`
          )
      )
      .slice(0, 5)


  if (carregando) {
    return (
      <div className="mx-auto max-w-7xl">

        <div className="flex min-h-64 items-center justify-center">

          <p className="text-sm text-slate-400">
            Carregando dados financeiros...
          </p>

        </div>

      </div>
    )
  }


  return (
    <div className="mx-auto max-w-7xl">

      {/* CABEÇALHO */}

      <header className="mb-8">

        <p className="text-sm text-slate-500">
          Visão geral
        </p>

        <h2 className="mt-1 text-3xl font-bold text-slate-900">
          Saldo atual
        </h2>

      </header>


      {/* ERRO */}

      {erro && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}


      {/* CARDS PRINCIPAIS */}

      <section className="grid gap-6 md:grid-cols-3">

        {/* SALDO */}

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

          <p className="text-sm text-slate-500">
            Saldo atual
          </p>

          <p
            className={`mt-3 text-3xl font-bold ${
              saldoAtual >= 0
                ? "text-slate-900"
                : "text-red-600"
            }`}
          >
            {formatarMoeda(
              saldoAtual
            )}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Considerando lançamentos realizados
          </p>

        </div>


        {/* RECEITAS */}

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

          <p className="text-sm text-slate-500">
            Receitas do mês
          </p>

          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {formatarMoeda(
              receitasMes
            )}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Receitas já realizadas
          </p>

        </div>


        {/* GASTOS */}

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

          <p className="text-sm text-slate-500">
            Gastos do mês
          </p>

          <p className="mt-3 text-3xl font-bold text-red-500">
            {formatarMoeda(
              gastosMes
            )}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Gastos já realizados
          </p>

        </div>

      </section>


      {/* PREVISTOS */}

      <section className="mt-6 grid gap-6 md:grid-cols-2">

        {/* RECEBIMENTOS */}

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

          <p className="text-sm text-slate-500">
            Recebimentos previstos
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-600">
            {formatarMoeda(
              recebimentosPrevistos
            )}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Ainda não realizados neste mês
          </p>

        </div>


        {/* GASTOS */}

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

          <p className="text-sm text-slate-500">
            Gastos previstos
          </p>

          <p className="mt-3 text-2xl font-bold text-red-500">
            {formatarMoeda(
              gastosPrevistos
            )}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Ainda não realizados neste mês
          </p>

        </div>

      </section>


      {/* MOVIMENTAÇÕES */}

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

        <div className="mb-6">

          <h3 className="font-semibold text-slate-800">
            Movimentações recentes
          </h3>

          <p className="text-sm text-slate-500">
            Últimos lançamentos registrados
          </p>

        </div>


        {movimentacoesRecentes.length === 0 ? (

          <div className="flex min-h-32 items-center justify-center text-sm text-slate-400">
            Nenhuma movimentação registrada.
          </div>

        ) : (

          <div className="space-y-3">

            {movimentacoesRecentes.map(
              (lancamento) => (

                <div
                  key={lancamento.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                >

                  <div className="min-w-0">

                    <p className="truncate font-medium text-slate-800">
                      {lancamento.descricao}
                    </p>

                    <div className="mt-1 flex gap-3 text-xs text-slate-400">

                      <span>
                        {lancamento.categoria}
                      </span>

                      <span>
                        {formatarData(
                          lancamento.data
                        )}
                      </span>

                      <span
                        className={
                          lancamento.status ===
                          "realizado"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }
                      >
                        {lancamento.status ===
                        "realizado"
                          ? "Realizado"
                          : "Previsto"}
                      </span>

                    </div>

                  </div>


                  <p
                    className={`ml-4 whitespace-nowrap font-semibold ${
                      lancamento.tipo ===
                      "rendimento"
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {lancamento.tipo ===
                    "rendimento"
                      ? "+"
                      : "-"}{" "}

                    {formatarMoeda(
                      lancamento.valor
                    )}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  )
}


export default Dashboard