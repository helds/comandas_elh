import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import TabelaComanda from './TabelaComanda';
import ImpressaoNotaFiscal from './impressaoNotaFiscal';
import IconeAdd from '././assets/IconeAdd.svg?react';
import VoltarIcon from '././assets/voltar.svg?react';

// 🔥 FIREBASE — imports novos
import { usePedidosGarcom } from './usePedidosGarcom';
import NotificacaoGarcom from './NotificacaoGarcom';
import { useTabelaComandaSync } from './useTabelaComandaSync'; 

const ComandaDetalhe = () => {
  const location = useLocation();
  const comandaId = location.pathname.split("/").pop();
  const nomeCliente = location.state?.nome || localStorage.getItem("nome_cliente_atual") || "Cliente";

  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

  // 1º PRIMEIRO: Chamamos o hook para pegar as linhas do Firebase
  const { linhas, setLinhas, carregando } = useTabelaComandaSync(comandaId);
  
  // 2º SEGUNDO: Calculamos o total da comanda
  const totalComanda = useMemo(() => {
    if (!linhas) return 0;
    return linhas.reduce((soma, linha) => {
      if (linha.pago || !linha.produto || !linha.quant || !linha.valorUnit) return soma;
      return soma + (parseFloat(linha.quant) || 0) * (parseFloat(linha.valorUnit) || 0);
    }, 0);
  }, [linhas]);

  // 🔥 FIREBASE — escuta pedidos do garçom em tempo real
  const pedidosGarcom = usePedidosGarcom(comandaId);

  // 🔥 FIREBASE — callback chamado quando o cliente aceita um item do garçom
  const adicionarItemNaComanda = useCallback((item) => {
    if (!comandaId) return;

    setLinhas((linhasAtuais) => {
      const novasLinhas = [...linhasAtuais];

      if (item._merge) {
        const idx = novasLinhas.findIndex((l) => String(l.cod) === String(item.cod));
        if (idx !== -1) {
          novasLinhas[idx] = {
            ...novasLinhas[idx],
            quant: String(Number(novasLinhas[idx].quant) + Number(item.quantidade || 1))
          };
          return novasLinhas;
        }
      }

      const indexVazio = novasLinhas.findIndex(l => !l.produto || l.produto === '');

      if (indexVazio !== -1) {
        novasLinhas[indexVazio] = {
          cod: String(item.cod || ''),
          produto: item.nome || item.produto || '',
          valorUnit: String(item.preco || item.valorUnit || ''),
          quant: String(item.quantidade || item.quant || 1),
          pago: false
        };
      } else {
        console.warn("Sem linhas vazias na comanda para inserir o item.");
      }

      return novasLinhas;
    });
  }, [comandaId, setLinhas]);

  useEffect(() => {
    if (location.state?.nome) {
      localStorage.setItem("nome_cliente_atual", location.state.nome);
    }
  }, [location.state]);

  const formatarValor = (valor) => Number(valor || 0).toFixed(2).replace('.', ',');

  return (
    <Container>

      {mostrarNotificacao && (
        <NotificacaoGarcom
          comandaId={comandaId}
          pedidos={pedidosGarcom}
          // ✅ FIX 1: Usa `linhas` (do hook) em vez de `linhasComanda` (que não existia)
          comanda={linhas}
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
          <BotaoSino onClick={() => setMostrarNotificacao(!mostrarNotificacao)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45" fill="#fff">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>

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

          {/* ✅ FIX 1: Usa `linhas` em vez de `linhasComanda` */}
          <ImpressaoNotaFiscal
            nomeCliente={nomeCliente}
            comandaId={comandaId}
            linhas={linhas}
            totalComanda={totalComanda}
          />
        </LadoBarraDireito>
      </Barra>

      <TabelaContainer>
        {!carregando && (
          <TabelaComanda
            comandaId={comandaId}
            linhasCompartilhadas={linhas}
            setLinhasEPersistir={setLinhas}
          />
        )}
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

/* ---------- estilos ---------- */

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