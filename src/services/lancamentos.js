import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"

import { db } from "./firebase"

function getLancamentosRef(uid) {
  return collection(
    db,
    "users",
    uid,
    "lancamentos"
  )
}

export async function criarLancamento(uid, dados) {
  const referencia = getLancamentosRef(uid)

  return addDoc(referencia, {
    ...dados,
    criadoEm: serverTimestamp(),
  })
}

export async function buscarLancamentos(uid) {
  const referencia = getLancamentosRef(uid)

  const consulta = query(
    referencia,
    orderBy("data", "desc")
  )

  const snapshot = await getDocs(consulta)

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }))
}

export async function atualizarLancamento(
  uid,
  lancamentoId,
  dados
) {
  const referencia = doc(
    db,
    "users",
    uid,
    "lancamentos",
    lancamentoId
  )

  return updateDoc(referencia, dados)
}

export async function excluirLancamento(
  uid,
  lancamentoId
) {
  const referencia = doc(
    db,
    "users",
    uid,
    "lancamentos",
    lancamentoId
  )

  return deleteDoc(referencia)
}