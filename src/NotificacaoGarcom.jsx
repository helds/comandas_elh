// NotificacaoGarcom.jsx — Site React/Vite
// Exibe os pedidos enviados pelo garçom com opção de confirmar (✅) ou negar (❌)

import React from "react";
import styled, { keyframes } from "styled-components";
import { db } from "./firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { cardapio } from "./database";

// ─── Animação de entrada ───────────────────────────────────────────────────────
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Estilos ──────────────────────────────────────────────────────────────────
const Painel = styled.div`
  position: fixed;
  top: 120px; /* abaixo da barra verde do site */
  right: 20px;
  z-index: 1000;
  background: #fff;
  border: 2px solid #0abf00;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  padding: 18px 20px;
  min-width: 320px;
  max-width: 400px;
  animation: ${slideIn} 0.25s ease;
  font-family: 'Nunito', sans-serif;
`;

const Titulo = styled.div`
  font-size: 15pt;
  font-weight: 800;
  color: #047028;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.span`
  background: #0abf00;
  color: #fff;
  border-radius: 50%;
  font-size: 11pt;
  font-weight: 700;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const ListaItens = styled.ul`
  list-style: none;
  margin: 0 0 14px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemLinha = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f4fff4;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13pt;
  color: #222;
`;

const ItemInfo = styled.span`
  flex: 1;
  font-weight: 600;

  span.quant {
    color: #047028;
    margin-right: 6px;
  }
`;

const BotoesItem = styled.div`
  display: flex;
  gap: 6px;
  margin-left: 10px;
`;

const BotaoIcone = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 2px 4px;
  border-radius: 6px;
  transition: background 0.15s;
  line-height: 1;

  &:hover {
    background: #e8e8e8;
  }
`;

const Divisor = styled.hr`
  border: none;
  border-top: 1.5px dashed #c5e8c5;
  margin: 10px 0 14px 0;
`;

const BotoesGlobais = styled.div`
  display: flex;
  gap: 10px;
`;

const BotaoGlobal = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-family: 'Nunito', sans-serif;
  font-size: 13pt;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.15s;

  background: ${(p) => (p.negar ? "#ffeaea" : "#e8fff0")};
  color:       ${(p) => (p.negar ? "#c0392b" : "#047028")};
  border: 2px solid ${(p) => (p.negar ? "#e57373" : "#0abf00")};

  &:hover { opacity: 0.8; }
`;

// ─── Helpers Firebase ─────────────────────────────────────────────────────────

async function aceitarItem(comandaId, item, adicionarNaComanda, comanda = []) {
  try {
    await updateDoc(
      doc(db, "pedidos", comandaId, "itens", item.firestoreId),
      { status: "confirmado" }
    );

    const produto = cardapio.find((p) => p.id === Number(item.cod));

    const itemParaTabela = {
      cod: Number(item.cod),
      nome: produto?.nome || item.nome,
      quantidade: item.quantidade,
      valorUnit: produto?.preco || item.valorUnit || 0,
    };

    // Se o item já existe na comanda, passa flag _merge para o pai somar a quantidade
    const jaExiste = comanda.some((i) => Number(i.cod) === itemParaTabela.cod);
    adicionarNaComanda(jaExiste ? { ...itemParaTabela, _merge: true } : itemParaTabela);

  } catch (e) {
    console.error("Erro ao aceitar item:", e);
  }
}

/**
 * Nega um item: muda status para "negado" no Firestore e some da notificação.
 */
async function negarItem(comandaId, item) {
  try {
    await updateDoc(doc(db, "pedidos", comandaId, "itens", item.firestoreId), {
      status: "negado",
    });
  } catch (e) {
    console.error("Erro ao negar item:", e);
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Props:
 *  - comandaId  : string  — ID da comanda/mesa
 *  - pedidos    : array   — lista vinda do hook usePedidosGarcom()
 *  - comanda    : array   — itens já presentes na comanda (para detecção de duplicatas)
 *  - onAdicionar: (item) => void — callback para inserir/mesclar item na TabelaComanda
 *                 Se item._merge === true, o pai deve somar a quantidade ao item existente.
 */
export default function NotificacaoGarcom({ comandaId, pedidos, comanda = [], onAdicionar }) {
  if (!pedidos || pedidos.length === 0) return null;

  const handleAceitar = (item) => aceitarItem(comandaId, item, onAdicionar, comanda);
  const handleNegar = (item) => negarItem(comandaId, item);

  const handleAceitarTodos = () => pedidos.forEach((item) => aceitarItem(comandaId, item, onAdicionar, comanda));
  const handleNegarTodos = () => pedidos.forEach((item) => negarItem(comandaId, item));

  return (
    <Painel>
      <Titulo>
        Pedidos
        <Badge>{pedidos.length}</Badge>
      </Titulo>

      <ListaItens>
        {pedidos.map((item) => (
          <ItemLinha key={item.firestoreId}>
            <ItemInfo>
              <span className="quant">{item.quantidade}x</span>
              {item.nome}
            </ItemInfo>
            <BotoesItem>
              <BotaoIcone title="Adicionar à comanda" onClick={() => handleAceitar(item)}>
                ✅
              </BotaoIcone>
              <BotaoIcone title="Negar item" onClick={() => handleNegar(item)}>
                ❌
              </BotaoIcone>
            </BotoesItem>
          </ItemLinha>
        ))}
      </ListaItens>

      {pedidos.length > 1 && (
        <>
          <Divisor />
          <BotoesGlobais>
            <BotaoGlobal onClick={handleAceitarTodos}>✅ Adicionar todos</BotaoGlobal>
            <BotaoGlobal negar onClick={handleNegarTodos}>❌ Negar todos</BotaoGlobal>
          </BotoesGlobais>
        </>
      )}
    </Painel>
  );
}