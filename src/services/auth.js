import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"

import { auth } from "./firebase"

export async function cadastrarUsuario(email, senha) {
  return createUserWithEmailAndPassword(
    auth,
    email,
    senha
  )
}

export async function entrar(email, senha) {
  return signInWithEmailAndPassword(
    auth,
    email,
    senha
  )
}

export async function sair() {
  return signOut(auth)
}