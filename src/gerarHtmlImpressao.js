// gerarHtmlImpressao.js
// Gera o HTML do comprovante para impressão térmica 58mm.
//
// @param {string} mesa            — nome ou número da mesa
// @param {Array}  itens           — [{ nome, quantidade, obs? }]
// @param {string} observacaoGeral — observação geral do pedido (opcional)
// @returns {string}               — HTML completo pronto para window.print()

export function gerarHtmlImpressao(mesa, itens, observacaoGeral = '') {

  const agora = new Date();
  const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const linhasItens = itens.map((item) => `
    <div class="item">
      <span class="quant">${item.quantidade}x</span><span class="nome">${item.nome}</span>
      ${item.obs ? `<div class="obs">OBS: ${item.obs}</div>` : ""}
    </div>
  `).join("");

  const secaoObsGeral = observacaoGeral ? `
    <div class="divisor"></div>
    <div class="secao-titulo">OBS. GERAL</div>
    <div class="obs-geral">${observacaoGeral}</div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <style>
    @page {
      size: 58mm auto;
      margin: 5mm;
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
            
    .mesa {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      padding: 4px 0 2px 0;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .data-hora {
      font-size: 9pt;
      text-align: center;
      margin-bottom: 4px;
    }

    .divisor {
      border: none;
      border-top: 1px dashed #000;
      margin: 4px 0;
    }

    .secao-titulo {
      font-size: 9px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 3px;
    }

    .item {
      margin-bottom: 4px;
      padding-bottom: 3px;
    }

    .item:last-child {
      border-bottom: none;
    }

    .item .quant {
      font-size: 11pt;
      font-weight: bold;
      margin-right: 3px;
    }

    .item .nome {
      font-size: 11pt;
    }

    .item .obs {
      font-size: 10pt;
      margin-top: 1px;
      margin-left: 14px;
    }

    .obs-geral {
      font-size: 10pt;
      font-style: italic;
      padding: 2px 4px;
      margin-top: 2px;
    }

    .rodape {
      margin-top: 6px;
      border-top: 1px dashed #000;
      padding-top: 4px;
      text-align: center;
      font-size: 9px;
    }

    @media print {
      @page {
        size: 58mm auto;
        margin: 5mm;
      }
      body {
        width: 54mm;
      }
    }
  </style>
</head>

<body>
  <div class="mesa">${mesa}</div>
  <div class="data-hora">Pedido Cadastrado às ${hora}</div>
  ${linhasItens}
  ${secaoObsGeral}

</body>
</html>`;
}