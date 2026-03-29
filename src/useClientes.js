// useClientes.js — Site React/Vite
// Escuta e gerencia clientes/comandas sincronizados via Firebase

import { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

const COLECAO_MESAS = 'mesas';

export function useClientes() {
  const [listaClientes, setListaClientes] = useState([]);

  // Escuta o Firebase em tempo real — atualiza quando app ou site criam/excluem
  useEffect(() => {
    const ref = collection(db, COLECAO_MESAS);

    const unsub = onSnapshot(ref, (snapshot) => {
      const clientes = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setListaClientes(clientes);
      
      // 🔥 AQUI ESTÁ A CORREÇÃO 🔥
      // Guarda uma cópia atualizada na memória para o Backup e Total do Dia funcionarem
      localStorage.setItem('comandas', JSON.stringify(clientes));
    });

    return () => unsub();
  }, []);

  // Criar comanda/cliente pelo site
  const criarCliente = async (nome) => {
    const agora = new Date();
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const id = Date.now().toString();

    await setDoc(doc(db, COLECAO_MESAS, id), {
      nome: nome.trim(),
      hora,
      criadoEm: serverTimestamp(),
    });

    return { id, nome: nome.trim(), hora };
  };

  // Excluir comanda/cliente pelo site
  const excluirCliente = async (id) => {
    await deleteDoc(doc(db, COLECAO_MESAS, id));
  };

  return { listaClientes, criarCliente, excluirCliente };
}