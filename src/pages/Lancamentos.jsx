import { useEffect, useState } from "react"

import { useAuth } from "../context/AuthContext"

import {
  criarLancamento,
  buscarLancamentos,
  atualizarLancamento,
  excluirLancamento,
} from "../services/lancamentos"

import {
  categoriasGasto,
  categoriasRendimento,
} from "../data/categorias"


const estadoInicial = {
  tipo: "gasto",
  descricao: "",
  valor: "",
  categoria: "",
  formaPagamento: "dinheiro",
  data: new Date().toISOString().split("T")[0],
  vencimento: "",
}


function obterDataHoje() {
  return new Date().toISOString().split("T")[0]
}


function determinarStatus(data) {
  return data <= obterDataHoje()
    ? "realizado"
    : "previsto"
}


function Lancamentos() {
  const { usuario } = useAuth()

  // FORMULÁRIO
  const [formulario, setFormulario] =
    useState(estadoInicial)

  // CONTROLE DE SALVAMENTO
  const [salvando, setSalvando] =
    useState(false)

  // MENSAGENS
  const [mensagem, setMensagem] =
    useState("")

  const [erro, setErro] =
    useState("")

  // LISTA DE LANÇAMENTOS
  const [lancamentos, setLancamentos] =
    useState([])

  const [carregando, setCarregando] =
    useState(true)

  // ID DO LANÇAMENTO SENDO EDITADO
  const [editandoId, setEditandoId] =
    useState(null)

  // CATEGORIAS
  const categorias =
    formulario.tipo === "gasto"
      ? categoriasGasto
      : categoriasRendimento


  // CARREGAR LANÇAMENTOS
  useEffect(() => {
    async function carregarLancamentos() {
      try {
        const dados =
          await buscarLancamentos(
            usuario.uid
          )

        /*
         * Recalcula o status pela data.
         *
         * Isso é importante porque um lançamento
         * que ontem era previsto pode hoje ser
         * automaticamente considerado realizado.
         */
        const dadosAtualizados =
          dados.map((lancamento) => ({
            ...lancamento,
            status: determinarStatus(
              lancamento.data
            ),
          }))

        setLancamentos(dadosAtualizados)
      } catch (error) {
        console.error(error)

        setErro(
          "Não foi possível carregar os lançamentos."
        )
      } finally {
        setCarregando(false)
      }
    }

    if (usuario) {
      carregarLancamentos()
    }
  }, [usuario])


  // LIMPAR CATEGORIA AO TROCAR O TIPO
  useEffect(() => {
    setFormulario(
      (estadoAtual) => ({
        ...estadoAtual,
        categoria: "",
      })
    )
  }, [formulario.tipo])


  // ALTERAR CAMPO
  function alterarCampo(event) {
    const {
      name,
      value,
    } = event.target

    setFormulario(
      (estadoAtual) => ({
        ...estadoAtual,
        [name]: value,
      })
    )
  }


  // SALVAR / ATUALIZAR
  async function handleSubmit(event) {
    event.preventDefault()

    setSalvando(true)
    setMensagem("")
    setErro("")

    try {
      const ehGasto =
        formulario.tipo === "gasto"

      const status =
        determinarStatus(
          formulario.data
        )

      /*
       * Dados que serão enviados ao Firestore.
       */
      const dados = {
        tipo:
          formulario.tipo,

        descricao:
          formulario.descricao.trim(),

        valor:
          Number(formulario.valor),

        categoria:
          formulario.categoria,

        formaPagamento:
          ehGasto
            ? formulario.formaPagamento
            : null,

        /*
         * Ainda serão utilizados quando
         * implementarmos o módulo de cartões.
         */
        cartaoId: null,

        faturaId: null,

        data:
          formulario.data,

        /*
         * O vencimento só existe para
         * gastos feitos no cartão.
         */
        vencimento:
          ehGasto &&
          formulario.formaPagamento === "cartao"
            ? formulario.vencimento || null
            : null,

        status,
      }


      // ATUALIZAÇÃO
      if (editandoId) {
        await atualizarLancamento(
          usuario.uid,
          editandoId,
          dados
        )

        setLancamentos(
          (listaAtual) =>
            listaAtual.map(
              (lancamento) =>
                lancamento.id === editandoId
                  ? {
                      ...lancamento,
                      ...dados,
                    }
                  : lancamento
            )
        )

        setMensagem(
          "Lançamento atualizado com sucesso."
        )
      }

      // CRIAÇÃO
      else {
        const documento =
          await criarLancamento(
            usuario.uid,
            dados
          )

        const novoLancamento = {
          id: documento.id,
          ...dados,
        }

        setLancamentos(
          (listaAtual) => [
            novoLancamento,
            ...listaAtual,
          ]
        )

        setMensagem(
          "Lançamento salvo com sucesso."
        )
      }


      // LIMPAR FORMULÁRIO
      setFormulario({
        ...estadoInicial,
        data: obterDataHoje(),
      })

      setEditandoId(null)

    } catch (error) {
      console.error(error)

      setErro(
        editandoId
          ? "Não foi possível atualizar o lançamento."
          : "Não foi possível salvar o lançamento."
      )
    } finally {
      setSalvando(false)
    }
  }


  // INICIAR EDIÇÃO
  function iniciarEdicao(lancamento) {
    setEditandoId(
      lancamento.id
    )

    setFormulario({
      tipo:
        lancamento.tipo,

      descricao:
        lancamento.descricao,

      valor:
        lancamento.valor,

      categoria:
        lancamento.categoria,

      formaPagamento:
        lancamento.formaPagamento ||
        "dinheiro",

      data:
        lancamento.data,

      vencimento:
        lancamento.vencimento ||
        "",
    })

    setMensagem("")
    setErro("")

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  // CANCELAR EDIÇÃO
  function cancelarEdicao() {
    setEditandoId(null)

    setFormulario({
      ...estadoInicial,
      data: obterDataHoje(),
    })

    setMensagem("")
    setErro("")
  }


  // EXCLUIR
  async function handleExcluir(id) {
    const confirmar =
      window.confirm(
        "Deseja realmente excluir este lançamento?"
      )

    if (!confirmar) {
      return
    }

    try {
      await excluirLancamento(
        usuario.uid,
        id
      )

      setLancamentos(
        (listaAtual) =>
          listaAtual.filter(
            (lancamento) =>
              lancamento.id !== id
          )
      )

      setMensagem(
        "Lançamento excluído com sucesso."
      )

      setErro("")

    } catch (error) {
      console.error(error)

      setErro(
        "Não foi possível excluir o lançamento."
      )

      setMensagem("")
    }
  }


  // FORMATAÇÃO DE MOEDA
  function formatarMoeda(valor) {
    return Number(
      valor
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    )
  }


  // FORMATAÇÃO DE DATA
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


  return (
    <div className="mx-auto max-w-5xl">

      <header className="mb-8">
        <p className="text-sm text-slate-500">
          Movimentações financeiras
        </p>

        <h2 className="mt-1 text-3xl font-bold text-slate-900">
          Lançamentos
        </h2>
      </header>


      {/* FORMULÁRIO */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >

        <h3 className="mb-6 text-lg font-semibold text-slate-800">
          {editandoId
            ? "Editar lançamento"
            : "Novo lançamento"}
        </h3>


        <div className="grid gap-6 md:grid-cols-2">

          {/* TIPO */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tipo
            </label>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setFormulario(
                    (estado) => ({
                      ...estado,
                      tipo: "rendimento",
                    })
                  )
                }
                className={`rounded-xl border px-4 py-3 font-medium transition ${
                  formulario.tipo === "rendimento"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Rendimento
              </button>


              <button
                type="button"
                onClick={() =>
                  setFormulario(
                    (estado) => ({
                      ...estado,
                      tipo: "gasto",
                    })
                  )
                }
                className={`rounded-xl border px-4 py-3 font-medium transition ${
                  formulario.tipo === "gasto"
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Gasto
              </button>

            </div>
          </div>


          {/* DESCRIÇÃO */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Descrição
            </label>

            <input
              name="descricao"
              value={formulario.descricao}
              onChange={alterarCampo}
              placeholder="Ex.: Supermercado"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            />

          </div>


          {/* VALOR */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Valor
            </label>

            <input
              name="valor"
              type="number"
              min="0.01"
              step="0.01"
              value={formulario.valor}
              onChange={alterarCampo}
              placeholder="0,00"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            />

          </div>


          {/* CATEGORIA */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Categoria
            </label>

            <select
              name="categoria"
              value={formulario.categoria}
              onChange={alterarCampo}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
            >

              <option value="">
                Selecione uma categoria
              </option>

              {categorias.map(
                (categoria) => (
                  <option
                    key={categoria}
                    value={categoria}
                  >
                    {categoria}
                  </option>
                )
              )}

            </select>

          </div>


          {/* DATA */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Data
            </label>

            <input
              name="data"
              type="date"
              value={formulario.data}
              onChange={alterarCampo}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <p className="mt-2 text-xs text-slate-400">
              Datas até hoje são consideradas realizadas.
            </p>

          </div>


          {/* FORMA DE PAGAMENTO */}

          {formulario.tipo === "gasto" && (

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Forma de pagamento
              </label>

              <select
                name="formaPagamento"
                value={formulario.formaPagamento}
                onChange={alterarCampo}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              >

                <option value="dinheiro">
                  Dinheiro
                </option>

                <option value="pix">
                  Pix
                </option>

                <option value="debito">
                  Cartão de débito
                </option>

                <option value="cartao">
                  Cartão de crédito
                </option>

              </select>

            </div>

          )}


          {/* CARTÃO */}

          {formulario.tipo === "gasto" &&
            formulario.formaPagamento === "cartao" && (

              <div className="md:col-span-2">

                <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                  O cadastro de cartões será implementado no próximo módulo.
                </div>

                <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">
                  Vencimento provisório
                </label>

                <input
                  name="vencimento"
                  type="date"
                  value={formulario.vencimento}
                  onChange={alterarCampo}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />

              </div>

            )}

        </div>


        {/* MENSAGENS */}

        {mensagem && (
          <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
            {mensagem}
          </p>
        )}

        {erro && (
          <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </p>
        )}


        {/* BOTÕES */}

        <div className="mt-8 flex justify-end gap-3">

          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando
              ? "Salvando..."
              : editandoId
                ? "Atualizar lançamento"
                : "Salvar lançamento"}
          </button>

        </div>

      </form>


      {/* LISTA */}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

        <div className="mb-6">

          <h3 className="text-lg font-semibold text-slate-800">
            Lançamentos registrados
          </h3>

          <p className="text-sm text-slate-500">
            Histórico das suas movimentações
          </p>

        </div>


        {carregando ? (

          <div className="py-10 text-center text-sm text-slate-400">
            Carregando lançamentos...
          </div>

        ) : lancamentos.length === 0 ? (

          <div className="py-10 text-center text-sm text-slate-400">
            Nenhum lançamento registrado.
          </div>

        ) : (

          <div className="space-y-3">

            {lancamentos.map(
              (lancamento) => (

                <div
                  key={lancamento.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
                >

                  <div className="min-w-0">

                    <p className="truncate font-medium text-slate-800">
                      {lancamento.descricao}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">

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
                          lancamento.status === "realizado"
                            ? "font-medium text-emerald-600"
                            : "font-medium text-amber-600"
                        }
                      >
                        {lancamento.status === "realizado"
                          ? "Realizado"
                          : "Previsto"}
                      </span>

                    </div>

                  </div>


                  <div className="ml-4 flex items-center gap-4">

                    <p
                      className={`whitespace-nowrap font-semibold ${
                        lancamento.tipo === "rendimento"
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {lancamento.tipo === "rendimento"
                        ? "+"
                        : "-"}{" "}
                      {formatarMoeda(
                        lancamento.valor
                      )}
                    </p>


                    <button
                      type="button"
                      onClick={() =>
                        iniciarEdicao(
                          lancamento
                        )
                      }
                      className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
                    >
                      Editar
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleExcluir(
                          lancamento.id
                        )
                      }
                      className="rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-50"
                    >
                      Excluir
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  )
}


export default Lancamentos