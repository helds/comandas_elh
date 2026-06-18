// useTabelaComandaSync.js — Site React/Vite
// Sincroniza os itens de uma comanda em tempo real via Firestore,
// usando localStorage como cache offline/imediato.
//
// Mesma coleção usada pelo app mobile:
//   comanda_itens/{comandaId}  →  { linhas: [...80 linhas...], atualizadoEm: Timestamp }
//
// Estratégia:
//   1. Ao montar: lê localStorage imediatamente (sem esperar rede)
//   2. onSnapshot: sempre que o Firestore mudar, atualiza estado + localStorage
//   3. Ao editar: salva no localStorage imediatamente + agenda save no Firestore (debounce 400ms)

import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

const TOTAL_LINHAS = 80;
const COLECAO      = 'comanda_itens';
const DEBOUNCE_MS  = 400;

const linhaVazia = () => ({ cod: '', quant: '', produto: '', valorUnit: '', pago: false });

const normalizar = (salvas) =>
  Array.from({ length: TOTAL_LINHAS }, (_, i) => ({
    ...linhaVazia(),
    ...(salvas?.[i] || {}),
  }));

export function useTabelaComandaSync(comandaId) {
  const chaveLocal = comandaId ? `comanda_${comandaId}` : null;
  const docRef     = comandaId ? doc(db, COLECAO, comandaId) : null;

  const [linhas, setLinhas]         = useState(() => normalizar([]));
  const [carregando, setCarregando] = useState(true);

  const debounceRef               = useRef(null);
  // Quando salvamos nós mesmos no Firestore, o snapshot vai disparar de volta.
  // Esse ref evita sobrescrever o estado com dados que acabamos de enviar.
  const ignorarProximoSnapshotRef = useRef(false);

  // ── 1. Cache local imediato ──────────────────────────────────────────────
  useEffect(() => {
    if (!chaveLocal) return;
    try {
      const json = localStorage.getItem(chaveLocal);
      if (json) setLinhas(normalizar(JSON.parse(json)));
    } catch (e) {
      console.error('useTabelaComandaSync — cache local:', e);
    }
  }, [chaveLocal]);

  useEffect(() => {
  return () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };
}, []);

  // ── 2. Escuta Firestore em tempo real ────────────────────────────────────
  useEffect(() => {
    if (!docRef) { setCarregando(false); return; }

    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (ignorarProximoSnapshotRef.current) {
          ignorarProximoSnapshotRef.current = false;
          setCarregando(false);
          return;
        }
        if (snap.exists()) {
          const novas = normalizar(snap.data().linhas);
          setLinhas(novas);
          // Sincroniza localStorage com o que veio do Firestore
          try { localStorage.setItem(chaveLocal, JSON.stringify(novas)); } catch (_) {}
        }
        setCarregando(false);
      },
      (err) => {
        console.error('useTabelaComandaSync — snapshot:', err);
        setCarregando(false);
      }
    );

    return () => unsub();
  }, [comandaId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3. Persiste (localStorage imediato + Firestore com debounce) ─────────
  const persistir = useCallback(
    (novasLinhas) => {
      // localStorage: imediato
      if (chaveLocal) {
        try { localStorage.setItem(chaveLocal, JSON.stringify(novasLinhas)); } catch (_) {}
      }

      // Firestore: debounced
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        if (!docRef) return;
        try {
          ignorarProximoSnapshotRef.current = true;
          await setDoc(
            docRef,
            { linhas: novasLinhas, atualizadoEm: serverTimestamp() },
            { merge: false }
          );
        } catch (e) {
          console.error('useTabelaComandaSync — salvar Firestore:', e);
          ignorarProximoSnapshotRef.current = false;
        }
      }, DEBOUNCE_MS);
    },
    [chaveLocal, docRef]
  );

  // Wrapper que atualiza o estado e chama persistir
  const setLinhasEPersistir = useCallback(
    (updater) => {
      setLinhas((prev) => {
        const proximas = typeof updater === 'function' ? updater(prev) : updater;
        persistir(proximas);
        return proximas;
      });
    },
    [persistir]
  );

  return { linhas, setLinhas: setLinhasEPersistir, carregando };
}
