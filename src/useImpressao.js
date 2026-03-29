// useImpressao.js
// Escuta em tempo real a coleção "impressoes" no Firestore.
// Cada documento representa um pedido de impressão enviado pelo garçom.
//
// Estrutura esperada do documento no Firestore:
// impressoes/{autoId} {
//   mesa:      string,   — nome/número da mesa
//   itens:     Array<{ nome: string, quantidade: number, obs?: string }>,
//   status:    "pendente" | "impresso",
//   timestamp: Timestamp
// }

import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

/**
 * Retorna:
 *  - impressoes : array de pedidos pendentes
 *  - marcarImpresso(id) : marca o documento como impresso e o remove da lista
 */
export function useImpressao() {
  const [impressoes, setImpressoes] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "impressoes"),
      where("status", "==", "pendente")
    );

    const unsub = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Ordena do mais antigo para o mais recente
      lista.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
      setImpressoes(lista);
    });

    return () => unsub();
  }, []);

  const marcarImpresso = async (id) => {
    try {
      await updateDoc(doc(db, "impressoes", id), { status: "impresso" });
    } catch (e) {
      console.error("Erro ao marcar como impresso:", e);
    }
  };

  return { impressoes, marcarImpresso };
}
