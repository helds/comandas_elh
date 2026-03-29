// usePedidosGarcom.js — Site React/Vite
// Escuta em tempo real os pedidos enviados pelo garçom para uma mesa específica

import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

/**
 * Retorna os pedidos com status "pendente" enviados pelo garçom para esta mesa.
 * Atualiza automaticamente em tempo real via Firestore.
 *
 * @param {string} comandaId - ID da comanda/mesa (ex: o ID aleatório já usado no site)
 */
export function usePedidosGarcom(comandaId) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!comandaId) return;

    const ref = collection(db, "pedidos", comandaId, "itens");
    const q = query(ref, where("status", "==", "pendente"));

    const unsub = onSnapshot(q, (snapshot) => {
      const itens = snapshot.docs.map((doc) => ({
        firestoreId: doc.id,
        ...doc.data(),
      }));
      setPedidos(itens);
    });

    return () => unsub();
  }, [comandaId]);

  return pedidos;
}
