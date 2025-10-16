import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VoltarIcon from '././assets/voltar.svg?react';

const Fundo = styled.div`
  background-color: #fffef7;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  padding-top: 130px;
  padding-left: 40px;
  padding-right: 40px;
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
  padding: 0;
  cursor: pointer;
`;

const StyledVoltar = styled(VoltarIcon)`
  position: fixed;
  top: 20px;
  left: 50px;
  width: 70px;
  height: 70px;
  z-index: 11;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SecaoDia = styled.div`
  margin-bottom: 40px;
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const TituloDia = styled.h2`
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 35pt;
  color: #007007;
  margin-bottom: 20px;
  border-bottom: 3px solid #0abf00;
  padding-bottom: 15px;
`;

const ListaComandas = styled.div`
  margin: 20px 0;
`;

const ItemComanda = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  margin: 10px 0;
  background-color: ${(props) => (props.index % 2 === 0 ? '#e9ffe8' : '#f5fff5')};
  border-radius: 8px;
  font-family: 'League Spartan', sans-serif;
  font-size: 20pt;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const NomeComanda = styled.span`
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
`;

const ValorComanda = styled.span`
  font-weight: 700;
  color: #007007;
  font-size: 22pt;
`;

const TotalDia = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  margin-top: 20px;
  background: linear-gradient(135deg, #0abf00 0%, #007007 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(10, 191, 0, 0.3);
`;

const LabelTotal = styled.span`
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 30pt;
  color: #fffef7;
  text-transform: uppercase;
`;

const ValorTotal = styled.span`
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  font-size: 35pt;
  color: #fffef7;
`;

const ResumoGeral = styled.div`
  background: linear-gradient(135deg, #005005 0%, #003003 100%);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
`;

const TituloResumo = styled.h3`
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 28pt;
  color: #fffef7;
  margin-bottom: 20px;
  text-align: center;
`;

const LinhaResumo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 254, 247, 0.2);
  
  &:last-child {
    border-bottom: none;
    margin-top: 10px;
    padding-top: 20px;
    border-top: 2px solid #fffef7;
  }
`;

const LabelResumo = styled.span`
  font-family: 'League Spartan', sans-serif;
  font-weight: 600;
  font-size: 20pt;
  color: #fffef7;
`;

const ValorResumo = styled.span`
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 22pt;
  color: #09db67;
  
  &.total {
    font-size: 28pt;
    color: #fffef7;
  }
`;

const MensagemVazia = styled.div`
  text-align: center;
  font-family: 'League Spartan', sans-serif;
  font-size: 30pt;
  color: #666;
  margin-top: 100px;
`;

const BotaoImprimir = styled.button`
  background-color: #0abf00;
  color: #fffef7;
  border: none;
  border-radius: 10px;
  padding: 15px 30px;
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 20pt;
  cursor: pointer;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #079100;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;


function TotalDias() {
  const navigate = useNavigate();
  const [totaisPorDia, setTotaisPorDia] = useState({});

  useEffect(() => {
    calcularTotaisPorDia();
  }, []);

  const calcularTotaisPorDia = () => {
    // Pega todas as comandas ativas e arquivadas
    const comandasAtivas = JSON.parse(localStorage.getItem('comandas') || '[]');
    const comandasArquivadas = JSON.parse(localStorage.getItem('comandas_arquivadas') || '[]');
    
    const todasComandas = [...comandasAtivas, ...comandasArquivadas];
    
    const totaisPorDia = {};

    todasComandas.forEach(comanda => {
      const chave = `comanda_${comanda.id}`;
      const dadosSalvos = localStorage.getItem(chave);
      
      if (dadosSalvos) {
        const linhas = JSON.parse(dadosSalvos);
        const linhasPreenchidas = linhas.filter(
          (linha) => linha.produto && linha.quant && linha.valorUnit
        );

        if (linhasPreenchidas.length > 0) {
          const totalComanda = linhasPreenchidas.reduce((soma, linha) => {
            const quantidade = parseFloat(linha.quant) || 0;
            const valor = parseFloat(linha.valorUnit) || 0;
            return soma + quantidade * valor;
          }, 0);

          // Define a data (usa data de arquivamento se existir, senão usa a data atual)
          const dataComanda = comanda.dataArquivamento 
            ? new Date(comanda.dataArquivamento)
            : new Date();
          
          const dia = dataComanda.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });

          if (!totaisPorDia[dia]) {
            totaisPorDia[dia] = {
              comandas: [],
              total: 0
            };
          }

          totaisPorDia[dia].comandas.push({
            nome: comanda.nome,
            valor: totalComanda,
            id: comanda.id
          });

          totaisPorDia[dia].total += totalComanda;
        }
      }
    });

    setTotaisPorDia(totaisPorDia);
  };

  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const calcularTotalGeral = () => {
    return Object.values(totaisPorDia).reduce((soma, dia) => soma + dia.total, 0);
  };

  const imprimirRelatorio = () => {
    const totalGeral = calcularTotalGeral();
    const totalComTaxa = totalGeral * 1.1;
    const totalComCartao = totalComTaxa * 1.05;

    const conteudoImpressao = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório - Total do Dia</title>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 15mm;
            }
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
          }

          .header {
            text-align: center;
            border-bottom: 3px solid #0abf00;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }

          .header h1 {
            font-size: 28pt;
            color: #007007;
            margin-bottom: 10px;
          }

          .header p {
            font-size: 14pt;
            color: #666;
          }

          .secao-dia {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }

          .titulo-dia {
            font-size: 18pt;
            color: #007007;
            border-bottom: 2px solid #0abf00;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }

          .lista-comandas {
            margin-left: 20px;
          }

          .item-comanda {
            display: flex;
            justify-content: space-between;
            padding: 8px 15px;
            margin: 5px 0;
            background-color: #f5f5f5;
            border-radius: 5px;
          }

          .total-dia {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            margin-top: 15px;
            background-color: #0abf00;
            color: white;
            border-radius: 8px;
            font-weight: bold;
            font-size: 14pt;
          }

          .resumo-geral {
            margin-top: 40px;
            padding: 25px;
            background-color: #005005;
            color: white;
            border-radius: 10px;
            page-break-inside: avoid;
          }

          .resumo-geral h2 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 20pt;
          }

          .linha-resumo {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            font-size: 13pt;
          }

          .linha-resumo.total {
            border-top: 2px solid white;
            border-bottom: none;
            margin-top: 15px;
            padding-top: 15px;
            font-size: 16pt;
            font-weight: bold;
          }

          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11pt;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RELATÓRIO - TOTAL DO DIA</h1>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>

        ${Object.keys(totaisPorDia)
          .sort((a, b) => {
            const [diaA, mesA, anoA] = a.split('/');
            const [diaB, mesB, anoB] = b.split('/');
            return new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA);
          })
          .map(dia => `
            <div class="secao-dia">
              <div class="titulo-dia">📅 ${dia}</div>
              <div class="lista-comandas">
                ${totaisPorDia[dia].comandas.map(comanda => `
                  <div class="item-comanda">
                    <span>${comanda.nome}</span>
                    <span>${formatarValor(comanda.valor)}</span>
                  </div>
                `).join('')}
              </div>
              <div class="total-dia">
                <span>TOTAL DO DIA:</span>
                <span>${formatarValor(totaisPorDia[dia].total)}</span>
              </div>
            </div>
          `).join('')}

        <div class="resumo-geral">
          <h2>RESUMO GERAL</h2>
          <div class="linha-resumo">
            <span>Total de Dias:</span>
            <span>${Object.keys(totaisPorDia).length}</span>
          </div>
          <div class="linha-resumo">
            <span>Total de Comandas:</span>
            <span>${Object.values(totaisPorDia).reduce((soma, dia) => soma + dia.comandas.length, 0)}</span>
          </div>
          <div class="linha-resumo">
            <span>Subtotal Geral:</span>
            <span>${formatarValor(totalGeral)}</span>
          </div>
          <div class="linha-resumo">
            <span>Taxa de Serviço (10%):</span>
            <span>${formatarValor(totalGeral * 0.1)}</span>
          </div>
          <div class="linha-resumo">
            <span>Total com Taxa:</span>
            <span>${formatarValor(totalComTaxa)}</span>
          </div>
          <div class="linha-resumo">
            <span>Taxa Cartão (5%):</span>
            <span>${formatarValor(totalComTaxa * 0.05)}</span>
          </div>
          <div class="linha-resumo total">
            <span>TOTAL COM CARTÃO:</span>
            <span>${formatarValor(totalComCartao)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Relatório gerado automaticamente pelo Sistema de Comandas</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    const janelaImpressao = window.open('', '_blank', 'width=800,height=600');
    janelaImpressao.document.write(conteudoImpressao);
    janelaImpressao.document.close();
  };

  const totalGeral = calcularTotalGeral();
  const totalComTaxa = totalGeral * 1.1;
  const totalComCartao = totalComTaxa * 1.05;

  return (
    <Fundo>
      <Barra>
        <Titulo>TOTAL DO DIA</Titulo>
        <Botoes onClick={() => navigate('/')}>
          <StyledVoltar />
        </Botoes>
      </Barra>

      <Container>
        {Object.keys(totaisPorDia).length === 0 ? (
          <MensagemVazia>Nenhuma comanda com valores registrados</MensagemVazia>
        ) : (
          <>
            <ResumoGeral>
              <TituloResumo>RESUMO GERAL</TituloResumo>
              <LinhaResumo>
                <LabelResumo>Total de Dias:</LabelResumo>
                <ValorResumo>{Object.keys(totaisPorDia).length}</ValorResumo>
              </LinhaResumo>
              <LinhaResumo>
                <LabelResumo>Total de Comandas:</LabelResumo>
                <ValorResumo>
                  {Object.values(totaisPorDia).reduce((soma, dia) => soma + dia.comandas.length, 0)}
                </ValorResumo>
              </LinhaResumo>
              <LinhaResumo>
                <LabelResumo>Subtotal:</LabelResumo>
                <ValorResumo>{formatarValor(totalGeral)}</ValorResumo>
              </LinhaResumo>
              <LinhaResumo>
                <LabelResumo>Com Taxa (10%):</LabelResumo>
                <ValorResumo>{formatarValor(totalComTaxa)}</ValorResumo>
              </LinhaResumo>
              <LinhaResumo>
                <LabelResumo className="total">Com Cartão (5%):</LabelResumo>
                <ValorResumo className="total">{formatarValor(totalComCartao)}</ValorResumo>
              </LinhaResumo>
              
              <BotaoImprimir onClick={imprimirRelatorio}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Imprimir Relatório
              </BotaoImprimir>
            </ResumoGeral>

            {Object.keys(totaisPorDia)
              .sort((a, b) => {
                const [diaA, mesA, anoA] = a.split('/');
                const [diaB, mesB, anoB] = b.split('/');
                return new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA);
              })
              .map(dia => (
                <SecaoDia key={dia}>
                  <TituloDia>📅 {dia}</TituloDia>
                  <ListaComandas>
                    {totaisPorDia[dia].comandas.map((comanda, index) => (
                      <ItemComanda key={comanda.id} index={index}>
                        <NomeComanda>{comanda.nome}</NomeComanda>
                        <ValorComanda>{formatarValor(comanda.valor)}</ValorComanda>
                      </ItemComanda>
                    ))}
                  </ListaComandas>
                  <TotalDia>
                    <LabelTotal>Total do Dia:</LabelTotal>
                    <ValorTotal>{formatarValor(totaisPorDia[dia].total)}</ValorTotal>
                  </TotalDia>
                </SecaoDia>
              ))}
          </>
        )}
      </Container>
    </Fundo>
  );
}

export default TotalDias;