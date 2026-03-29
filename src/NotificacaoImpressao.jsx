// NotificacaoImpressao.jsx
// Exibe na tela inicial os pedidos de impressão enviados pelo garçom.
// A caixa vê a notificação, clica em 🖨 e o comprovante é impresso automaticamente.
//
// Uso na tela inicial:
//   import { useImpressao } from "./useImpressao";
//   import NotificacaoImpressao from "./NotificacaoImpressao";
//
//   const { impressoes, marcarImpresso } = useImpressao();
//   <NotificacaoImpressao impressoes={impressoes} onImprimir={marcarImpresso} />

import React from "react";
import styled, { keyframes } from "styled-components";
import { gerarHtmlImpressao } from "./gerarHtmlImpressao";

// ─── Animações ────────────────────────────────────────────────────────────────

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(60px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const pulsar = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(10, 191, 0, 0.5); }
  50%       { box-shadow: 0 0 0 8px rgba(10, 191, 0, 0); }
`;

// ─── Estilos ──────────────────────────────────────────────────────────────────

const Painel = styled.div`
  position: fixed;
  bottom: 30px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 340px;
`;

const Card = styled.div`
  background: #fff;
  border: 2px solid #0abf00;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.13);
  padding: 14px 16px;
  animation: ${slideIn} 0.3s ease;
  font-family: 'Nunito', sans-serif;
`;

const CardTopo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Mesa = styled.div`
  font-size: 14pt;
  font-weight: 800;
  color: #047028;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BotaoImprimir = styled.button`
  background: #0abf00;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-family: 'Nunito', sans-serif;
  font-size: 12pt;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: ${pulsar} 2s infinite;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

const ListaItens = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemLinha = styled.li`
  font-size: 12pt;
  color: #222;
  display: flex;
  flex-direction: column;
  padding: 4px 8px;
  background: #f4fff4;
  border-radius: 6px;
`;

const ItemPrincipal = styled.span`
  font-weight: 600;

  span.quant {
    color: #047028;
    margin-right: 5px;
  }
`;

const ItemObs = styled.span`
  font-size: 10pt;
  color: #888;
  margin-top: 1px;
  padding-left: 4px;
`;

const ObsGeral = styled.div`
  margin-top: 10px;
  font-size: 11pt;
  color: #555;
  font-style: italic;
  padding: 7px 10px;
  background: #fffbe6;
  border-left: 3px solid #e6b800;
  border-radius: 6px;
`;

// ─── Função de impressão ──────────────────────────────────────────────────────

function imprimirAgora(mesa, itens, observacaoGeral = '') {
  const html = gerarHtmlImpressao(mesa, itens, observacaoGeral);
  const janela = window.open("", "_blank", "width=900,height=600");
  if (!janela) {
    alert("Pop-up bloqueado! Libere pop-ups para este site nas configurações do navegador.");
    return false;
  }
  janela.document.write(html);
  janela.document.close();
  janela.onload = () => {
    janela.focus();
    janela.print();
  };
  return true;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Props:
 *  - impressoes : array  — lista do hook useImpressao()
 *  - onImprimir : (id) => void — callback marcarImpresso do hook
 */
export default function NotificacaoImpressao({ impressoes, onImprimir }) {
  if (!impressoes || impressoes.length === 0) return null;

  const handleImprimir = (impressao) => {
    const sucesso = imprimirAgora(impressao.mesa, impressao.itens, impressao.observacaoGeral);
    if (sucesso) onImprimir(impressao.id);
  };

  return (
    <Painel>
      {impressoes.map((impressao) => (
        <Card key={impressao.id}>
          <CardTopo>
            <Mesa>
              🖨 {impressao.mesa}
            </Mesa>
            <BotaoImprimir onClick={() => handleImprimir(impressao)}>
              Imprimir
            </BotaoImprimir>
          </CardTopo>

          <ListaItens>
            {impressao.itens.map((item, idx) => (
              <ItemLinha key={idx}>
                <ItemPrincipal>
                  <span className="quant">{item.quantidade}x</span>
                  {item.nome}
                </ItemPrincipal>
                {item.obs && <ItemObs>⚠ {item.obs}</ItemObs>}
              </ItemLinha>
            ))}
          </ListaItens>

          {impressao.observacaoGeral ? (
            <ObsGeral>⚠ {impressao.observacaoGeral}</ObsGeral>
          ) : null}
        </Card>
      ))}
    </Painel>
  );
}