import React from 'react';
import styled from 'styled-components';

const ImpressaoNotaFiscal = ({ nomeCliente, comandaId, linhas, totalComanda }) => {
  const imprimirNota = () => {
    // Filtra apenas as linhas com produtos
    const linhasPreenchidas = linhas.filter(
      (linha) => linha.produto && linha.quant && linha.valorUnit
    );

    if (linhasPreenchidas.length === 0) {
      alert('Não há itens para imprimir!');
      return;
    }

    // Cria o conteúdo HTML da nota fiscal
    const conteudoImpressao = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Nota Fiscal - Comanda ${comandaId}</title>
        <style>
          @media print {
            @page {
              size: 58mm auto;
              margin: 5mm;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            max-width: 58mm;
            margin: 0 auto;
            padding: 10px;
          }

          .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 1px;
            margin-bottom: 1px;
          }

          .header h1 {
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 1px;
          }

          .header p {
            font-size: 10pt;
            margin: 2px 0;
          }

          .info-cliente {
            margin: 1px 0;
            padding: 1px 0;
            border-bottom: 1px dashed #000;
          }

          .info-cliente p {
            margin: 5px 0;
          }

          .info-cliente strong {
            font-weight: bold;
          }

          .itens {
            margin: 2px 0;
          }

          .itens-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
          }

          .item {
            display: flex;
            justify-content: space-between;
            margin: 1px 0;
            padding: 1px 0;
          }

          .item-info {
            flex: 1;
          }

          .item-nome {
            font-weight: bold;
            margin-bottom: 0px;
          }

          .item-detalhes {
            font-size: 10pt;
            color: #333;
          }

          .item-total {
            font-weight: bold;
            text-align: right;
            min-width: 80px;
          }

          .linha-separadora {
            border-top: 1px dashed #000;
            margin: 1px 0;
          }

          .totais {
            margin: 1px 0;
            padding: 1px 0;
            border-top: 2px solid #000;
          }

          .total-linha {
            display: flex;
            justify-content: space-between;
            margin: 1px 0;
            font-size: 11pt;
          }

          .total-linha.destaque {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 1px;
            border-top: 1px dashed #000;
          }

          .footer {
            text-align: center;
            margin-top: 2px;
            padding-top: 3px;
            border-top: 2px dashed #000;
            font-size: 10pt;
          }

          .footer p {
            margin: 5px 0;
          }

          .agradecimento {
            font-weight: bold;
            margin-top: 10px;
            font-size: 12pt;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>EL HONORATO</h1>
          <p>Comanda Nº ${comandaId}</p>
          <p>${new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })} às ${new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}</p>
        </div>

        <div class="info-cliente">
          <p><strong>Cliente:</strong> ${nomeCliente.toUpperCase()}</p>
        </div>

        <div class="itens">
          <div class="itens-header">
            <span>ITEM</span>
            <span>TOTAL</span>
          </div>

          ${linhasPreenchidas
            .map((linha) => {
              const quantidade = parseFloat(linha.quant) || 0;
              const valorUnit = parseFloat(linha.valorUnit) || 0;
              const total = quantidade * valorUnit;

              return `
                <div class="item">
                  <div class="item-info">
                    <div class="item-nome">${linha.produto}</div>
                    <div class="item-detalhes">
                      ${quantidade}x ${valorUnit.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </div>
                  </div>
                  <div class="item-total">
                    ${total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>

        <div class="totais">
          <div class="total-linha">
            <span>Subtotal:</span>
            <span>${totalComanda.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}</span>
          </div>

          <div class="total-linha">
            <span>Taxa de Serviço (10%)*:</span>
            <span>${(totalComanda * 0.1).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}</span>
          </div>

          <div class="total-linha destaque">
            <span>TOTAL:</span>
            <span>${(totalComanda * 1.1).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}</span>
          </div>

          <div class="linha-separadora"></div>

          <div class="total-linha">
            <span>Com Cartão (+5%):</span>
            <span>${(totalComanda * 1.1 * 1.05).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}</span>
          </div>
        </div>

        <div class="footer">
          <p class="agradecimento">VOLTE SEMPRE!</p>
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

    // Abre uma nova janela com o conteúdo
    const janelaImpressao = window.open('', '_blank', 'width=300,height=600');
    janelaImpressao.document.write(conteudoImpressao);
    janelaImpressao.document.close();
  };

  return (
    <BotaoImprimir onClick={imprimirNota} title="Imprimir Nota Fiscal">
      <IconeImpressora>
        <svg
          xmlns="http://www.w3.org/2000/svg"
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
      </IconeImpressora>
      <span>IMPRIMIR</span>
    </BotaoImprimir>
  );
};

export default ImpressaoNotaFiscal;

const BotaoImprimir = styled.button`
  position: fixed;
  top: 20px;
  right: 70px;
  background-color: #0abf00;
  border: 5px solid #fffef7;
  border-radius: 10px;
  padding: 15px 80px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 11;
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

  span {
    font-family: 'League Spartan', sans-serif;
    font-weight: 700;
    font-size: 20pt;
    color: #fffef7;
    user-select: none;
  }
`;

const IconeImpressora = styled.div`
  width: 30px;
  height: 30px;
  color: #fffef7;
  display: flex;
  align-items: center;
  justify-content: center;
`;