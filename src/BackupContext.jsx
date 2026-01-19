import { createContext, useEffect, useRef } from 'react';

export const BackupContext = createContext(null);

export const BackupProvider = ({ children }) => {
  const ultimoHashRef = useRef(
    localStorage.getItem('ultimoHashBackup') || null
  );

  // ================= UTIL =================
  const formatarMoeda = (valor) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  // 🔒 SOMENTE COMANDAS ATIVAS
  const coletarComandasAtivas = () => {
    const comandas = JSON.parse(
      localStorage.getItem('comandas') || '[]'
    );

    return comandas.map((c) => {
      const linhas = JSON.parse(
        localStorage.getItem(`comanda_${c.id}`) || '[]'
      ).filter(l => l.produto && l.quant && l.valorUnit);

      let totalComanda = 0;

      const pedidos = linhas.map((l) => {
        const quantidade = Number(l.quant);

        const valorUnitario = Number(
          String(l.valorUnit).replace('.', '').replace(',', '.')
        );

        const totalItem = quantidade * valorUnitario;
        totalComanda += totalItem;

        return {
          codigo: l.cod,
          produto: l.produto,
          quantidade,
          valorUnitario,
          totalItem
        };
      });

      return {
        id: c.id,
        cliente: String(c.nome || '').toUpperCase(), // ✅ CAIXA ALTA
        pedidos,
        totalComanda
      };
    });
  };

  // ================= HASH =================
  const gerarHash = (dados) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(dados))));

  // ================= HTML =================
  const gerarHTML = (comandas) => `
<html>
<head>
  <meta charset="utf-8" />
  <title>Backup Automático de Comandas</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px }
    h1 { color: #166534 }
    h2 { margin-top: 30px }
    table { width: 100%; border-collapse: collapse; margin-top: 10px }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left }
    th { background: #dcfce7 }
    .total { font-weight: bold; text-align: right }
  </style>
</head>
<body>

<h1>Backup Automático de Comandas Ativas</h1>
<p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>

${comandas.map(comanda => `
  <h2>Comanda #${comanda.id} — ${comanda.cliente}</h2>

  <table>
    <thead>
      <tr>
        <th>Produto</th>
        <th>Qtd</th>
        <th>Valor Unitário</th>
        <th>Total Item</th>
      </tr>
    </thead>
    <tbody>
      ${comanda.pedidos.map(p => `
        <tr>
          <td>${p.produto}</td>
          <td>${p.quantidade}</td>
          <td>${formatarMoeda(p.valorUnitario)}</td>
          <td>${formatarMoeda(p.totalItem)}</td>
        </tr>
      `).join('')}
      <tr>
        <td colspan="3" class="total">Total da Comanda</td>
        <td class="total">${formatarMoeda(comanda.totalComanda)}</td>
      </tr>
    </tbody>
  </table>
`).join('')}

</body>
</html>
`;

  // ============== DOWNLOAD ===============
  const forcarDownloadHTML = (html) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const nomeArquivo = `BACKUP_ELH_${new Date()
      .toISOString()
      .replace(/[:.]/g, '-')}.html`;

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ============ BACKUP AUTOMÁTICO ============
  const executarBackupAutomatico = () => {
    const dados = coletarComandasAtivas();
    if (!dados.length) return;

    const hashAtual = gerarHash(dados);
    if (hashAtual === ultimoHashRef.current) return;

    const html = gerarHTML(dados);
    forcarDownloadHTML(html);

    localStorage.setItem('ultimoHashBackup', hashAtual);
    localStorage.setItem('lastBackupDate', new Date().toISOString());
    ultimoHashRef.current = hashAtual;
  };

  useEffect(() => {
    const timer = setInterval(executarBackupAutomatico, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <BackupContext.Provider value={{}}>
      {children}
    </BackupContext.Provider>
  );
};
