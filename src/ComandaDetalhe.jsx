import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import TabelaComanda from './TabelaComanda';
import ImpressaoNotaFiscal from './impressaoNotaFiscal';
import IconeAdd from '././assets/IconeAdd.svg?react';
import VoltarIcon from '././assets/voltar.svg?react';

const ComandaDetalhe = () => {
  const location = useLocation();
  const nomeCliente = location.state?.nome || localStorage.getItem("nome_cliente_atual") || "Cliente";

  // extrai o ID da comanda pela URL
  const comandaId = location.pathname.split("/").pop();

  const [totalComanda, setTotalComanda] = useState(0);
  const [linhasComanda, setLinhasComanda] = useState([]);

  // salva o nome do cliente atual (para persistência de UI)
  useEffect(() => {
    if (location.state?.nome) {
      localStorage.setItem("nome_cliente_atual", location.state.nome);
    }
  }, [location.state]);

  // Carrega as linhas da comanda do localStorage para impressão
  useEffect(() => {
    if (!comandaId) return;
    
    try {
      const chave = `comanda_${comandaId}`;
      const dadosSalvos = localStorage.getItem(chave);
      
      if (dadosSalvos) {
        const dadosParseados = JSON.parse(dadosSalvos);
        setLinhasComanda(dadosParseados);
      }
    } catch (erro) {
      console.error('Erro ao carregar dados para impressão:', erro);
    }
  }, [comandaId, totalComanda]); // Atualiza quando o total muda

  const formatarValor = (valor) => {
    return Number(valor || 0).toFixed(2).replace('.', ',');
  };

  return (
    <Container>
      <Barra>
        <Titulo>{nomeCliente.toUpperCase()}</Titulo>
        <Botoes onClick={() => window.history.back()}>
          <StyledVoltar />
        </Botoes>
        <ImpressaoNotaFiscal
          nomeCliente={nomeCliente}
          comandaId={comandaId}
          linhas={linhasComanda}
          totalComanda={totalComanda}
        />

      </Barra>

      <TabelaContainer>
        {/* ✅ Passa o comandaId para a tabela poder salvar/carregar dados únicos */}
        <TabelaComanda
          onTotalChange={setTotalComanda}
          comandaId={comandaId}
        />
      </TabelaContainer>

      {/* Rodapé com Totais */}
      <SvgStyled xmlns="http://www.w3.org/2000/svg" viewBox={'0 0 1920 1080'} style={{ zIndex: 999 }}>

        <VisiblePath id="barrainf" stroke='#079100' fill='#079100' d="M353.76 1080l1212.48 0 0 -122.62c0,-15.22 -12.45,-27.68 -27.68,-27.68l-1157.12 0c-15.23,0 -27.68,12.46 -27.68,27.68l0 122.62z" />
        <VisiblePath id="barrainf2" stroke='#079100' fill='#079100' d="M688.06 932.74l543.88 0 0 -2.87c0,-16.43 -13.44,-29.87 -29.87,-29.87l-484.14 0c-16.43,0 -29.87,13.44 -29.87,29.87l0 2.87z" />
        <VisibleRect fill="#FFFEF7" x='762.11' y='911.23' width='395.77' height='10.28' rx='10' ry='9.96' />
        
        <rect width="1920" height="1080" fill="transparent" />

        <text
          x="450"
          y="980"
          fill="#FFFEF7"
          fontSize="40"
          fontFamily="'Nunito', sans-serif"
          fontWeight="bold"
          textAnchor="start"
          pointerEvents="none"
        >
          <tspan>VALOR TOTAL:</tspan>
          <tspan x="450" dy="40">VALOR C/ TAXA DE SERVIÇO (10%):</tspan>
          <tspan x="450" dy="40">VALOR C/ CARTÃO (5%):</tspan>
        </text>

        <text
          x="1290"
          y="980"
          fill="#FFFEF7"
          fontSize="40"
          fontFamily="'Nunito', sans-serif"
          fontWeight="bold"
          textAnchor="start"
          pointerEvents="none"
        >
          <tspan>R$</tspan>
          <tspan x="1290" dy="40">R$</tspan>
          <tspan x="1290" dy="40">R$</tspan>
        </text>

        <text
          x="1350"
          y="980"
          fill="#FFFEF7"
          fontSize="40"
          fontFamily="'Nunito', sans-serif"
          fontWeight="bold"
          textAnchor="start"
          pointerEvents="none"
        >
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
  justify-content: center;
`;

const Titulo = styled.h1`
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 60pt;
  color: #fffef7;
  text-align: center;
  user-select: none;
`;

const Botoes = styled.button`
  position: fixed;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const StyledVoltar = styled(VoltarIcon)`
  position: fixed;
  top: 20px;
  left: 50px;
  width: 70px;
  height: 70px;
  z-index: 11;
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
  overflow: hidden; /* evita linha branca fora do limite da tabela */
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