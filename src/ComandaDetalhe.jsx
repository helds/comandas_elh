// ComandaDetalhe.jsx — ATUALIZADO com integração Firebase
// Alterações marcadas com // 🔥 FIREBASE

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import TabelaComanda from './TabelaComanda';
import ImpressaoNotaFiscal from './impressaoNotaFiscal';
import IconeAdd from '././assets/IconeAdd.svg?react';
import VoltarIcon from '././assets/voltar.svg?react';

// 🔥 FIREBASE — imports novos
import { usePedidosGarcom } from './usePedidosGarcom';
import NotificacaoGarcom from './NotificacaoGarcom';

const ComandaDetalhe = () => {
  const location = useLocation();
  const nomeCliente = location.state?.nome || localStorage.getItem("nome_cliente_atual") || "Cliente";
  const comandaId = location.pathname.split("/").pop();

  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

  const [totalComanda, setTotalComanda] = useState(0);
  const [linhasComanda, setLinhasComanda] = useState([]);

  // 🔥 FIREBASE — escuta pedidos do garçom em tempo real
  const pedidosGarcom = usePedidosGarcom(comandaId);

  // 🔥 FIREBASE — callback chamado quando o cliente aceita um item do garçom
  // Encontra a primeira linha vazia da comanda e preenche com o item
  const adicionarItemNaComanda = useCallback((item) => {
    if (!comandaId) return;

    try {
      const chave = `comanda_${comandaId}`;
      const dadosSalvos = localStorage.getItem(chave);
      const linhas = dadosSalvos ? JSON.parse(dadosSalvos) : [];

      if (item._merge) {
        const idx = linhas.findIndex((l) => String(l.cod) === String(item.cod));
        if (idx !== -1) {
          linhas[idx].quant = String(Number(linhas[idx].quant) + Number(item.quantidade));
          localStorage.setItem(chave, JSON.stringify(linhas));
          setRefreshKey((k) => k + 1);
          return; // para aqui, não cria nova linha
        }
      }

      // Procura a primeira linha vazia
      const primeiraVaziaIdx = linhas.findIndex(
        (l) => !l.produto && !l.cod && !l.quant
      );

      if (primeiraVaziaIdx === -1) {
        console.warn("Sem linhas vazias na comanda para inserir o item.");
        return;
      }

      // Preenche a linha com os dados vindos do app do garçom
      linhas[primeiraVaziaIdx] = {
        cod: String(item.cod || ''),
        quant: String(item.quantidade || 1),
        produto: item.nome || '',
        valorUnit: String(item.valorUnit || ''),
      };

      localStorage.setItem(chave, JSON.stringify(linhas));

      // Força o TabelaComanda a recarregar lendo do localStorage
      // Fazemos isso via um estado auxiliar que serve como "sinal de refresh"
      setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error("Erro ao adicionar item na comanda:", e);
    }
  }, [comandaId]);

  // 🔥 FIREBASE — chave de refresh para forçar TabelaComanda recarregar
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (location.state?.nome) {
      localStorage.setItem("nome_cliente_atual", location.state.nome);
    }
  }, [location.state]);

  useEffect(() => {
    if (!comandaId) return;
    try {
      const chave = `comanda_${comandaId}`;
      const dadosSalvos = localStorage.getItem(chave);
      if (dadosSalvos) setLinhasComanda(JSON.parse(dadosSalvos));
    } catch (erro) {
      console.error('Erro ao carregar dados para impressão:', erro);
    }
  }, [comandaId, totalComanda]);

  const formatarValor = (valor) => Number(valor || 0).toFixed(2).replace('.', ',');

  return (
    <Container>

      {mostrarNotificacao && (
        <NotificacaoGarcom
          comandaId={comandaId}
          pedidos={pedidosGarcom}
          comanda={linhasComanda}        // ✅ adiciona isso
          onAdicionar={adicionarItemNaComanda}
        />
      )}

      <Barra>
        <LadoBarra>
          <Botoes onClick={() => window.history.back()}>
            <StyledVoltar />
          </Botoes>
        </LadoBarra>
        <Titulo>{nomeCliente.toUpperCase()}</Titulo>
        <LadoBarraDireito>
          {/* 👇 NOVO BOTÃO DE SINO ADICIONADO AQUI 👇 */}
          <BotaoSino onClick={() => setMostrarNotificacao(!mostrarNotificacao)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45" fill="#fff">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>

            {/* Ponto vermelho se houver pedidos */}
            {pedidosGarcom.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -7,
                  right: -2,
                  width: 20,
                  height: 20,
                  background: "red",
                  borderRadius: "50%",
                }}
              />
            )}
          </BotaoSino>

          <ImpressaoNotaFiscal
            nomeCliente={nomeCliente}
            comandaId={comandaId}
            linhas={linhasComanda}
            totalComanda={totalComanda}
          />
        </LadoBarraDireito>
      </Barra>

      <TabelaContainer>
        {/* 🔥 FIREBASE — refreshKey faz a tabela recarregar do localStorage quando um item é aceito */}
        <TabelaComanda
          key={refreshKey}
          onTotalChange={setTotalComanda}
          comandaId={comandaId}
        />
      </TabelaContainer>

      <SvgStyled xmlns="http://www.w3.org/2000/svg" viewBox={'0 0 1920 1080'} style={{ zIndex: 999 }}>
        <VisiblePath id="barrainf" stroke='#079100' fill='#079100' d="M353.76 1080l1212.48 0 0 -122.62c0,-15.22 -12.45,-27.68 -27.68,-27.68l-1157.12 0c-15.23,0 -27.68,12.46 -27.68,27.68l0 122.62z" />
        <VisiblePath id="barrainf2" stroke='#079100' fill='#079100' d="M688.06 932.74l543.88 0 0 -2.87c0,-16.43 -13.44,-29.87 -29.87,-29.87l-484.14 0c-16.43,0 -29.87,13.44 -29.87,29.87l0 2.87z" />
        <VisibleRect fill="#FFFEF7" x='762.11' y='911.23' width='395.77' height='10.28' rx='10' ry='9.96' />
        <rect width="1920" height="1080" fill="transparent" />
        <text x="450" y="980" fill="#FFFEF7" fontSize="40" fontFamily="'Nunito', sans-serif" fontWeight="bold" textAnchor="start" pointerEvents="none">
          <tspan>VALOR TOTAL:</tspan>
          <tspan x="450" dy="40">VALOR C/ TAXA DE SERVIÇO (10%):</tspan>
          <tspan x="450" dy="40">VALOR C/ CARTÃO (5%):</tspan>
        </text>
        <text x="1290" y="980" fill="#FFFEF7" fontSize="40" fontFamily="'Nunito', sans-serif" fontWeight="bold" textAnchor="start" pointerEvents="none">
          <tspan>R$</tspan><tspan x="1290" dy="40">R$</tspan><tspan x="1290" dy="40">R$</tspan>
        </text>
        <text x="1350" y="980" fill="#FFFEF7" fontSize="40" fontFamily="'Nunito', sans-serif" fontWeight="bold" textAnchor="start" pointerEvents="none">
          <tspan>{formatarValor(totalComanda)}</tspan>
          <tspan x="1350" dy="40">{formatarValor(totalComanda * 1.10)}</tspan>
          <tspan x="1350" dy="40">{formatarValor(totalComanda * 1.10 * 1.05)}</tspan>
        </text>
      </SvgStyled>
    </Container>
  );
};

export default ComandaDetalhe;

/* ---------- estilos (sem alterações) ---------- */

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #fffef7;
  overflow: hidden;
  position: relative;
`;

const Barra = styled.div`
  background-color: #0abf00;
  position: fixed;
  width: 100%;
  height: 110px;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
`;

const LadoBarra = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  padding-left: 50px;
`;

const LadoBarraDireito = styled(LadoBarra)`
  justify-content: flex-end;
  padding-left: 0;
  padding-right: 50px;
`;

const Titulo = styled.h1`
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 60pt;
  color: #fffef7;
  text-align: center;
  user-select: none;
  margin-bottom: -0.8%;
  margin-top: 0;
`;

const Botoes = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const StyledVoltar = styled(VoltarIcon)`
  width: 70px;
  height: 70px;
`;

const TabelaContainer = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  margin-top: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #fffef7;
  overflow: hidden;
`;

const SvgStyled = styled.svg`
  position: fixed;
  top: 128.5px;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: transform 0.3s ease;
  transition-delay: 0.5s;
  
  &:hover { 
    transform: translateY(-128.5px); 
  }
`;

const VisiblePath = styled.path`
  pointer-events: all;
`;

const VisibleRect = styled.rect`
  pointer-events: all;
`;

const BotaoSino = styled.button`
  background: transparent;
  border: 5px solid #fff;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  margin-right: 25px;
  padding: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #079100;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  `;