import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Download, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import VoltarIcon from '././assets/voltarverde.svg?react';

// -------------------- ANIMAÇÕES --------------------
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// -------------------- ESTILOS --------------------
const Page = styled.div`
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(135deg, #e9f8ef 0%, #c7f0d3 100%);
`;

const Container = styled.div`
  max-width: 1100px;
  margin: auto;
  background: rgba(255,255,255,.9);
  border-radius: 22px;
  box-shadow: 0 25px 60px rgba(0,0,0,.12);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  padding: 35px;
  color: white;
`;

const Title = styled.h1`
  font-size: 34px;
  font-weight: 800;
  text-shadow: 0 10px 30px rgba(0,0,0,.2);
`;

const Inside = styled.div`
  padding: 30px;
`;

const StatusCard = styled.div`
  background: linear-gradient(135deg, #f7fff8 0%, #e8ffe9 100%);
  border: 2px solid #bbebc5;
  border-radius: 18px;
  padding: 20px;
  box-shadow: inset 0 0 30px rgba(0,0,0,.03);
`;

const SpinIcon = styled(Clock)`
  animation: ${spin} 1.2s linear infinite;
`;

const GlassButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 800;
  border: none;
  cursor: pointer;
  backdrop-filter: blur(6px);
  box-shadow: 0 15px 30px rgba(0,0,0,.15);
  transition: .25s ease;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-2px) scale(1.01);
  }

  &:active {
    transform: scale(.97);
  }
`;

const StyledVoltar = styled(VoltarIcon)`
  position: fixed;
  top: 20px;
  left: 50px;
  width: 70px;
  height: 70px;
  z-index: 10;
  
`;

const Botoes = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

// -----------------------------------------------------
// -------------------- COMPONENTE ----------------------
// -----------------------------------------------------

const BackupSystem = () => {
  const [backupStatus, setBackupStatus] = useState('idle');
  const [lastBackup, setLastBackup] = useState(null);

  useEffect(() => {
    const lastBackupData = localStorage.getItem('lastBackupDate');
    if (lastBackupData) setLastBackup(new Date(lastBackupData));
  }, []);

  // 🔒 COLETA SOMENTE COMANDAS ATIVAS
  const coletarDadosComandas = () => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const comandasAtivas = JSON.parse(
      localStorage.getItem('comandas') || '[]'
    );

    const comandasProcessadas = [];

    comandasAtivas.forEach((comanda) => {
      const dadosSalvos = localStorage.getItem(`comanda_${comanda.id}`);
      if (!dadosSalvos) return;

      const linhas = JSON.parse(dadosSalvos);

      const linhasValidas = linhas.filter(
        (linha) => linha.produto && linha.quant && linha.valorUnit
      );

      if (!linhasValidas.length) return;

      let totalComanda = 0;

      const pedidos = linhasValidas.map((linha) => {
        const quantidade = Number(linha.quant) || 0;
        const valor = Number(linha.valorUnit) || 0;
        const total = quantidade * valor;
        totalComanda += total;

        return {
          codigo: linha.cod,
          produto: linha.produto,
          quantidade,
          valorUnitario: valor,
          valorTotal: total
        };
      });

      comandasProcessadas.push({
        id: comanda.id,
        cliente: comanda.nome,
        pedidos,
        total: totalComanda
      });
    });

    return {
      data: hoje,
      dataCompleta: new Date().toISOString(),
      totalComandas: comandasProcessadas.length,
      comandas: comandasProcessadas
    };
  };

  const gerarHTMLBackup = (dados) => `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Backup de Comandas</title>
      </head>
      <body>
        <h1>Backup de Comandas Ativas</h1>
        <p>Data: ${dados.data}</p>
        <p>Total de comandas ativas: ${dados.totalComandas}</p>
        <pre>${JSON.stringify(dados.comandas, null, 2)}</pre>
      </body>
    </html>
  `;

  const realizarBackup = () => {
    if (backupStatus === 'processing') return;

    setBackupStatus('processing');

    try {
      const dados = coletarDadosComandas();

      if (!dados.comandas.length) {
        setBackupStatus('idle');
        return;
      }

      const html = gerarHTMLBackup(dados);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      const agora = new Date();
      const nomeArquivo = `BACKUP_COMANDAS_${agora.getFullYear()}-${String(
        agora.getMonth() + 1
      ).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}.html`;

      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      link.click();

      URL.revokeObjectURL(url);

      localStorage.setItem('lastBackupDate', new Date().toISOString());
      setLastBackup(new Date());
      setBackupStatus('success');

      setTimeout(() => setBackupStatus('idle'), 3000);
    } catch {
      setBackupStatus('error');
      setTimeout(() => setBackupStatus('idle'), 3000);
    }
  };

  const exportarJSON = () => {
    const dados = coletarDadosComandas();
    if (!dados.comandas.length) return;

    const blob = new Blob(
      [JSON.stringify(dados, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);

    const agora = new Date();
    const nomeArquivo = `BACKUP_COMANDAS_${agora.getFullYear()}-${String(
      agora.getMonth() + 1
    ).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();

    URL.revokeObjectURL(url);
  };

  const formatarData = (data) =>
    data ? new Date(data).toLocaleString('pt-BR') : 'Nunca';

  return (
    <Page>
      <Container>
        <Header>
          <Title>🗂️ Sistema de Backup</Title>
          <p>Backup manual de comandas ativas</p>
        </Header>

        <Inside>
          <StatusCard>
            <h2>Status do Sistema</h2>

            {backupStatus === 'success' && <CheckCircle color="green" size={32} />}
            {backupStatus === 'processing' && <SpinIcon size={32} />}
            {backupStatus === 'error' && <AlertCircle color="red" size={32} />}

            <p>Último backup: {formatarData(lastBackup)}</p>
          </StatusCard>

          <br />

          <GlassButton onClick={realizarBackup}>
            <Download /> Backup Agora (HTML)
          </GlassButton>

          <br />

          <GlassButton onClick={exportarJSON}>
            <Upload /> Exportar JSON
          </GlassButton>
        </Inside>
      </Container>

      <Botoes onClick={() => window.history.back()}>
        <StyledVoltar />
      </Botoes>
    </Page>
  );
};

export default BackupSystem;
