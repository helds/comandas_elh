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

const CabecalhoDia = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  border-bottom: 3px solid #0abf00;
  padding-bottom: 15px;
`;

const TituloDia = styled.h2`
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 35pt;
  color: #007007;
  flex: 1;
  margin: 0;
`;

const BotaoProdutos = styled.button`
  background: none;
  border: 2px solid #0abf00;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #007007;
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 14pt;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0abf00;
    color: #fffef7;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(10, 191, 0, 0.3);

    svg {
      stroke: #fffef7;
    }
  }

  svg {
    stroke: #007007;
    transition: stroke 0.2s ease;
  }
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

const FileiraBotoes = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
`;

const BotaoProdutosGeral = styled.button`
  background-color: transparent;
  color: #fffef7;
  border: 2px solid #fffef7;
  border-radius: 10px;
  padding: 15px 30px;
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 20pt;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 254, 247, 0.15);
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
  // Armazena os produtos agrupados por dia: { [dia]: { [nomeProduto]: { quant, valorUnit, total } } }
  const [produtosPorDia, setProdutosPorDia] = useState({});

  useEffect(() => {
    calcularTotaisPorDia();
  }, []);

  const calcularTotaisPorDia = () => {
    const comandasAtivas = JSON.parse(localStorage.getItem('comandas') || '[]');
    const comandasArquivadas = JSON.parse(localStorage.getItem('comandasArquivadas') || '[]');

    const todasComandas = [...comandasAtivas, ...comandasArquivadas];

    const totaisPorDia = {};
    const produtosPorDia = {};

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
            if (linha.pago) return soma;
            const quantidade = parseFloat(linha.quant) || 0;
            const valor = parseFloat(linha.valorUnit) || 0;
            return soma + quantidade * valor;
          }, 0);

          const dataComanda = comanda.dataArquivamento
            ? new Date(comanda.dataArquivamento)
            : new Date();

          const dia = dataComanda.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });

          if (totalComanda > 0 || linhasPreenchidas.some(l => !l.pago)) {
            if (!totaisPorDia[dia]) {
              totaisPorDia[dia] = { comandas: [], total: 0 };
            }

            totaisPorDia[dia].comandas.push({
              nome: comanda.nome,
              valor: totalComanda,
              id: comanda.id
            });

            totaisPorDia[dia].total += totalComanda;

            // ── Agrupa produtos por dia ──
            if (!produtosPorDia[dia]) {
              produtosPorDia[dia] = {};
            }

            linhasPreenchidas.forEach(linha => {
              if (linha.pago) return; // ignora itens já pagos
              const nomeProduto = linha.produto.trim().toUpperCase();
              const quantidade = parseFloat(linha.quant) || 0;
              const valorUnit = parseFloat(linha.valorUnit) || 0;

              if (!produtosPorDia[dia][nomeProduto]) {
                produtosPorDia[dia][nomeProduto] = { quant: 0, valorUnit, total: 0 };
              }

              produtosPorDia[dia][nomeProduto].quant += quantidade;
              produtosPorDia[dia][nomeProduto].total += quantidade * valorUnit;
            });
          }
        }
      }
    });

    setTotaisPorDia(totaisPorDia);
    setProdutosPorDia(produtosPorDia);
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

  // ── Abre janela HTML com resumo de produtos do dia ──
  const abrirResumodeProdutos = (dia) => {
    const produtos = produtosPorDia[dia] || {};
    const totalDia = totaisPorDia[dia]?.total || 0;

    const linhasProdutos = Object.entries(produtos)
      .sort((a, b) => b[1].total - a[1].total) // ordena por maior valor
      .map(([nome, dados], i) => `
        <tr class="${i % 2 === 0 ? 'par' : 'impar'}">
          <td class="nome">${nome}</td>
          <td class="quant">${dados.quant % 1 === 0 ? dados.quant : dados.quant.toFixed(2)}</td>
          <td class="valor">${formatarValor(dados.valorUnit)}</td>
          <td class="total">${formatarValor(dados.total)}</td>
        </tr>
      `).join('');

    const conteudo = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Produtos do Dia - ${dia}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;700;800&display=swap');
          @media print {
            @page { size: A4; margin: 15mm; }
            .no-print { display: none; }
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'League Spartan', Arial, sans-serif;
            background-color: #fffef7;
            padding: 30px;
            color: #222;
          }
          .header {
            text-align: center;
            border-bottom: 4px solid #0abf00;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 28pt;
            color: #007007;
            font-weight: 800;
            letter-spacing: 1px;
          }
          .header .subtitulo {
            font-size: 16pt;
            color: #555;
            margin-top: 6px;
          }
          .header .gerado {
            font-size: 11pt;
            color: #999;
            margin-top: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          thead tr {
            background: linear-gradient(135deg, #0abf00, #007007);
            color: #fffef7;
          }
          thead th {
            padding: 16px 20px;
            font-size: 15pt;
            font-weight: 700;
            text-align: left;
            letter-spacing: 0.5px;
          }
          thead th.direita { text-align: right; }
          tbody tr.par { background-color: #e9ffe8; }
          tbody tr.impar { background-color: #f5fff5; }
          tbody tr:hover { background-color: #d0ffd0; }
          tbody td {
            padding: 14px 20px;
            font-size: 14pt;
            border-bottom: 1px solid rgba(0,0,0,0.05);
          }
          td.nome { font-weight: 700; color: #333; }
          td.quant { text-align: right; font-weight: 600; color: #555; }
          td.valor { text-align: right; color: #555; }
          td.total { text-align: right; font-weight: 700; color: #007007; }
          .rodape-tabela {
            display: flex;
            justify-content: flex-end;
            margin-top: -10px;
            margin-bottom: 30px;
          }
          .total-geral {
            background: linear-gradient(135deg, #007007, #003003);
            color: #fffef7;
            border-radius: 12px;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,191,0,0.25);
          }
          .total-geral .label {
            font-size: 20pt;
            font-weight: 700;
            text-transform: uppercase;
          }
          .total-geral .valor {
            font-size: 24pt;
            font-weight: 800;
          }
          .btn-baixar {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-top: 25px;
            background-color: #0abf00;
            color: #fffef7;
            border: none;
            border-radius: 10px;
            padding: 14px 28px;
            font-family: 'League Spartan', Arial, sans-serif;
            font-size: 15pt;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s;
            text-decoration: none;
          }
          .btn-baixar:hover { background-color: #079100; }
          .footer {
            margin-top: 35px;
            text-align: center;
            font-size: 10pt;
            color: #aaa;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📦 PRODUTOS DO DIA</h1>
          <div class="subtitulo">📅 ${dia}</div>
          <div class="gerado">Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th class="direita">Qtd.</th>
              <th class="direita">Vlr. Unit.</th>
              <th class="direita">Total</th>
            </tr>
          </thead>
          <tbody>
            ${linhasProdutos || '<tr><td colspan="4" style="text-align:center;padding:20px;color:#999;">Nenhum produto encontrado</td></tr>'}
          </tbody>
        </table>

        <div class="total-geral">
          <span class="label">Total do Dia:</span>
          <span class="valor">${formatarValor(totalDia)}</span>
        </div>

        <a class="btn-baixar" id="btnBaixar" download="produtos-${dia.replace(/\//g, '-')}.html">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Baixar HTML
        </a>

        <script>
          window.onload = function() {
            var btn = document.getElementById('btnBaixar');
            var html = document.documentElement.outerHTML;
            var blob = new Blob([html], { type: 'text/html' });
            btn.href = URL.createObjectURL(blob);
          };
        <\/script>

        <div class="footer">Relatório gerado automaticamente pelo Sistema de Comandas</div>
      </body>
      </html>
    `;

    const janela = window.open('', '_blank', 'width=850,height=700');
    janela.document.write(conteudo);
    janela.document.close();
  };

  // ── Abre janela HTML com resumo de TODOS os produtos separados por mês ──
  const abrirProdutosTodos = () => {
    const MESES = [
      'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
      'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
    ];

    // Agrupa produtos por chave "MM/YYYY"
    const produtosPorMes = {}; // { 'MM/YYYY': { nomeProduto: { quant, valorUnit, total } } }

    Object.entries(produtosPorDia).forEach(([dia, produtos]) => {
      const [, mes, ano] = dia.split('/');
      const chave = `${mes}/${ano}`;
      if (!produtosPorMes[chave]) produtosPorMes[chave] = {};
      Object.entries(produtos).forEach(([nome, dados]) => {
        if (!produtosPorMes[chave][nome]) {
          produtosPorMes[chave][nome] = { quant: 0, valorUnit: dados.valorUnit, total: 0 };
        }
        produtosPorMes[chave][nome].quant += dados.quant;
        produtosPorMes[chave][nome].total += dados.total;
      });
    });

    // Ordena meses cronologicamente
    const mesesOrdenados = Object.keys(produtosPorMes).sort((a, b) => {
      const [mA, aA] = a.split('/');
      const [mB, aB] = b.split('/');
      return new Date(aA, mA - 1) - new Date(aB, mB - 1);
    });

    // Total geral de tudo
    const totalGeralGlobal = mesesOrdenados.reduce((soma, chave) => {
      return soma + Object.values(produtosPorMes[chave]).reduce((s, p) => s + p.total, 0);
    }, 0);

    // Gera um bloco HTML por mês
    const blocosMeses = mesesOrdenados.map(chave => {
      const [mes, ano] = chave.split('/');
      const nomeMes = `${MESES[parseInt(mes, 10) - 1]} de ${ano}`;
      const produtos = produtosPorMes[chave];
      const totalMes = Object.values(produtos).reduce((s, p) => s + p.total, 0);

      const linhas = Object.entries(produtos)
        .sort((a, b) => b[1].total - a[1].total)
        .map(([nome, dados], i) => `
          <tr class="${i % 2 === 0 ? 'par' : 'impar'}">
            <td class="nome">${nome}</td>
            <td class="quant">${dados.quant % 1 === 0 ? dados.quant : dados.quant.toFixed(2)}</td>
            <td class="valor">${formatarValor(dados.valorUnit)}</td>
            <td class="total">${formatarValor(dados.total)}</td>
          </tr>
        `).join('');

      return `
        <div class="secao-mes">
          <div class="titulo-mes">📅 ${nomeMes}</div>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th class="direita">Qtd.</th>
                <th class="direita">Vlr. Unit.</th>
                <th class="direita">Total</th>
              </tr>
            </thead>
            <tbody>${linhas}</tbody>
          </table>
          <div class="total-mes">
            <span class="label-mes">TOTAL DO MÊS:</span>
            <span class="valor-mes">${formatarValor(totalMes)}</span>
          </div>
        </div>
      `;
    }).join('');

    const conteudo = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Produtos — Todos os Meses</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;700;800&display=swap');
          @media print {
            @page { size: A4; margin: 15mm; }
            .no-print { display: none; }
            .secao-mes { page-break-inside: avoid; }
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'League Spartan', Arial, sans-serif; background-color: #fffef7; padding: 30px; color: #222; }

          /* ── Cabeçalho ── */
          .header { text-align: center; border-bottom: 4px solid #0abf00; padding-bottom: 20px; margin-bottom: 35px; }
          .header h1 { font-size: 26pt; color: #007007; font-weight: 800; letter-spacing: 1px; }
          .header .subtitulo { font-size: 14pt; color: #555; margin-top: 6px; }
          .header .gerado { font-size: 10pt; color: #999; margin-top: 4px; }

          /* ── Seção de mês ── */
          .secao-mes { margin-bottom: 45px; }
          .titulo-mes {
            font-size: 20pt;
            font-weight: 800;
            color: #fffef7;
            background: linear-gradient(135deg, #0abf00, #007007);
            padding: 14px 22px;
            border-radius: 10px 10px 0 0;
            letter-spacing: 0.5px;
          }

          /* ── Tabela ── */
          table { width: 100%; border-collapse: collapse; border-radius: 0 0 10px 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 0; }
          thead tr { background: #005005; color: #fffef7; }
          thead th { padding: 13px 18px; font-size: 13pt; font-weight: 700; text-align: left; }
          thead th.direita { text-align: right; }
          tbody tr.par { background-color: #e9ffe8; }
          tbody tr.impar { background-color: #f5fff5; }
          tbody tr:hover { background-color: #d0ffd0; }
          tbody td { padding: 12px 18px; font-size: 13pt; border-bottom: 1px solid rgba(0,0,0,0.05); }
          td.nome { font-weight: 700; color: #333; }
          td.quant { text-align: right; font-weight: 600; color: #555; }
          td.valor { text-align: right; color: #777; }
          td.total { text-align: right; font-weight: 700; color: #007007; }

          /* ── Total do mês ── */
          .total-mes {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 22px;
            background: linear-gradient(135deg, #007007, #004004);
            border-radius: 0 0 10px 10px;
            margin-top: -1px;
          }
          .label-mes { font-size: 16pt; font-weight: 700; color: #fffef7; text-transform: uppercase; }
          .valor-mes { font-size: 18pt; font-weight: 800; color: #fffef7; }

          /* ── Total geral global ── */
          .total-global {
            background: linear-gradient(135deg, #003003, #001501);
            color: #fffef7;
            border-radius: 12px;
            padding: 22px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0,191,0,0.2);
            margin-top: 10px;
          }
          .total-global .label { font-size: 20pt; font-weight: 700; text-transform: uppercase; }
          .total-global .valor { font-size: 24pt; font-weight: 800; color: #09db67; }

          .btn-baixar { display: inline-flex; align-items: center; gap: 10px; margin-top: 25px; background-color: #0abf00; color: #fffef7; border: none; border-radius: 10px; padding: 14px 28px; font-family: 'League Spartan', Arial, sans-serif; font-size: 14pt; font-weight: 700; cursor: pointer; transition: background 0.2s; text-decoration: none; }
          .btn-baixar:hover { background-color: #079100; }
          .footer { margin-top: 35px; text-align: center; font-size: 10pt; color: #aaa; border-top: 1px solid #ddd; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📦 PRODUTOS — TODOS OS MESES</h1>
          <div class="subtitulo">Consolidado separado por mês</div>
          <div class="gerado">Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>

        ${blocosMeses}

        <div class="total-global">
          <span class="label">Total Geral:</span>
          <span class="valor">${formatarValor(totalGeralGlobal)}</span>
        </div>

        <a class="btn-baixar" id="btnBaixar" download="produtos-todos-os-meses.html">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Baixar HTML
        </a>

        <script>
          window.onload = function() {
            var btn = document.getElementById('btnBaixar');
            var html = document.documentElement.outerHTML;
            var blob = new Blob([html], { type: 'text/html' });
            btn.href = URL.createObjectURL(blob);
          };
        <\/script>

        <div class="footer">Relatório gerado automaticamente pelo Sistema de Comandas</div>
      </body>
      </html>
    `;

    const janela = window.open('', '_blank', 'width=900,height=750');
    janela.document.write(conteudo);
    janela.document.close();
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
            @page { size: A4; margin: 15mm; }
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; padding: 20px; }
          .header { text-align: center; border-bottom: 3px solid #0abf00; padding-bottom: 15px; margin-bottom: 30px; }
          .header h1 { font-size: 28pt; color: #007007; margin-bottom: 10px; }
          .header p { font-size: 14pt; color: #666; }
          .secao-dia { margin-bottom: 30px; page-break-inside: avoid; }
          .titulo-dia { font-size: 18pt; color: #007007; border-bottom: 2px solid #0abf00; padding-bottom: 10px; margin-bottom: 15px; }
          .lista-comandas { margin-left: 20px; }
          .item-comanda { display: flex; justify-content: space-between; padding: 8px 15px; margin: 5px 0; background-color: #f5f5f5; border-radius: 5px; }
          .total-dia { display: flex; justify-content: space-between; padding: 15px 20px; margin-top: 15px; background-color: #0abf00; color: white; border-radius: 8px; font-weight: bold; font-size: 14pt; }
          .resumo-geral { margin-top: 40px; padding: 25px; background-color: #005005; color: white; border-radius: 10px; page-break-inside: avoid; }
          .resumo-geral h2 { text-align: center; margin-bottom: 20px; font-size: 20pt; }
          .linha-resumo { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 13pt; }
          .linha-resumo.total { border-top: 2px solid white; border-bottom: none; margin-top: 15px; padding-top: 15px; font-size: 16pt; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 11pt; color: #666; border-top: 1px solid #ccc; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RELATÓRIO - TOTAL DO DIA</h1>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
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
          <div class="linha-resumo"><span>Total de Dias:</span><span>${Object.keys(totaisPorDia).length}</span></div>
          <div class="linha-resumo"><span>Total de Comandas:</span><span>${Object.values(totaisPorDia).reduce((soma, dia) => soma + dia.comandas.length, 0)}</span></div>
          <div class="linha-resumo total"><span>SUBTOTAL GERAL:</span><span>${formatarValor(totalGeral)}</span></div>
          <div class="linha-resumo"><span>Taxa de Serviço (10%):</span><span>${formatarValor(totalGeral * 0.1)}</span></div>
          <div class="linha-resumo"><span>Total com Taxa:</span><span>${formatarValor(totalComTaxa)}</span></div>
          <div class="linha-resumo"><span>Taxa Cartão (5%):</span><span>${formatarValor(totalComTaxa * 0.05)}</span></div>
          <div class="linha-resumo"><span>Total com Cartão:</span><span>${formatarValor(totalComCartao)}</span></div>
        </div>
        <div class="footer"><p>Relatório gerado automaticamente pelo Sistema de Comandas</p></div>
        <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };<\/script>
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
        <Botoes onClick={() => navigate('/comandas_elh/')}>
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
                <LabelResumo className="total"> SUBTOTAL:</LabelResumo>
                <ValorResumo className="total"> {formatarValor(totalGeral)}</ValorResumo>
              </LinhaResumo>
              <LinhaResumo>
                <LabelResumo>Com Taxa (10%):</LabelResumo>
                <ValorResumo>{formatarValor(totalComTaxa)}</ValorResumo>
              </LinhaResumo>
              <LinhaResumo>
                <LabelResumo> Com Cartão (5%):</LabelResumo>
                <ValorResumo> {formatarValor(totalComCartao)}</ValorResumo>
              </LinhaResumo>

              <FileiraBotoes>
                <BotaoProdutosGeral onClick={abrirProdutosTodos}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Ver Todos os Produtos
                </BotaoProdutosGeral>

                <BotaoImprimir onClick={imprimirRelatorio}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Imprimir Relatório
                </BotaoImprimir>
              </FileiraBotoes>
            </ResumoGeral>

            {Object.keys(totaisPorDia)
              .sort((a, b) => {
                const [diaA, mesA, anoA] = a.split('/');
                const [diaB, mesB, anoB] = b.split('/');
                return new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA);
              })
              .map(dia => (
                <SecaoDia key={dia}>
                  {/* ── Cabeçalho do dia com ícone de produtos ── */}
                  <CabecalhoDia>
                    <TituloDia>📅 {dia}</TituloDia>
                    <BotaoProdutos
                      title="Ver resumo de produtos do dia"
                      onClick={() => abrirResumodeProdutos(dia)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      Produtos
                    </BotaoProdutos>
                  </CabecalhoDia>

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