import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconeAdd from '../../assets/IconeAdd.svg?react';
import IconeMenu from '../../assets/IconeMenu.svg?react';
import IconeBolaP from '../../assets/IconeBolaP.svg?react';

const Fundo = styled.div`
      background-color: #fffef7;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      height: 100vh;
      width: 100vw;
      overflow-y: auto;
      display: flex;
      justify-content: flex-start;
      align-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      padding-top: 130px; 
      padding-left: 20px;
      gap: 0px;
`;

const Barra = styled.div`
      background-color: #0abf00;
      position: fixed;
      width: 100%;
      height: 110px;
      top: 0;
      left: 0;
      z-index: 10;
`;

const Nova = styled.div`
      background-color: #0abf00;
      position: fixed;
      width: 654px;
      height: 238px;
      align-items: center;
      justify-content: center;
      border-radius: 25px;
`;

const Textbox = styled.div`
      background-color: #fffef7;
      position: fixed;
      width: 624px;
      height: 130px;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
      margin-top: 9px;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
`;

const CaixaTexto = styled.input`
      width: 604px;
      margin-top: 5px;
      margin-left: 10px;
      padding: 10px;
      border: 2px solid #ccc;
      font-size: 26px;
      &:focus {
        outline: none;
        border-color: #007007;
      }
`;

const Titulo = styled.h1`
      font-family: 'League Spartan', sans-serif;
      font-weight: 700;
      font-size: 60pt;
      color: #fffef7;
      text-align: center;
      padding-top: 25px;
      pointer-events: none;
      user-select: none;
`;

const Titulo2 = styled.h2`
      font-family: 'League Spartan', sans-serif;
      font-weight: 650;
      font-size: 50pt;
      pointer-events: none;
      user-select: none;
`;

const Titulo3 = styled.h3`
      font-family: 'League Spartan', sans-serif;
      font-weight: 700;
      font-size: 40pt;
      pointer-events: none;
      user-select: none;
`;

const Botoes = styled.button`
      position: fixed;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
`;

const StyledAdd = styled(IconeAdd)`
    position: fixed;
    top: 25px;
    right: 50px;
    width: 60px;
    height: 60px;
    z-index: 10;
`;

const StyledMenu = styled(IconeMenu)`
    position: fixed;
    top: 25px;
    left: 50px;
    width: 60px;
    height: 60px;
    z-index: 10;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
`;

const QuadradoComanda = styled.div`
  position: relative;
  background-color: ${(props) => (props.index % 2 === 0 ? '#09db67' : '#fffef7')};
  border: 4px solid #007007;
  color: black;
  width: 273px;
  height: 270px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'League Spartan', sans-serif;
  text-transform: uppercase;
  font-size: 33pt;
  font-weight: 720;
  text-align: center;
  cursor: pointer;
  word-break: break-word;
  margin-top: -20px;    
  margin-left: -20px;   
  margin-right: 16px;   
  margin-bottom: 16px;

    &:hover {
    transform: scale(1.005);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  }
`;

const StyledBola = styled(IconeBolaP)`
      position: absolute;
      top: 15px;
      right: 12px;
      width: 35px;
      height: 35px;
      z-index: 10000;
      cursor: pointer;
        transition: all 0.2s ease;

  &:hover {
    transform: scale(1.07);
}
  `;

const IconeImpressora = styled.div`
  position: absolute;
  top: 8px;
  left: 12px;
  width: 37px;
  height: 37px;
  z-index: 10;
  cursor: pointer;
  color: #007007;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.07);
    color: #005005;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const MenuPrincipalSuspenso = styled.div`
  position: fixed;
  top: 18px;
  left: 120px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
  width: 250px;
  z-index: 15000;
`;

const MenuPrincipalItem = styled.div`
  padding: 15px 20px;
  font-size: 25px;
  font-family: 'League Spartan', sans-serif;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  text-align: left;
  text-transform: uppercase;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MenuSuspenso = styled.div`
  position: absolute;
  top: 55px;
  right: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
  width: 200px;
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  font-size: 25px;
  font-family: sans-serif;
  color: #333;
  cursor: pointer;
  text-align: left;
  text-transform: uppercase;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const InputEdicao = styled.input`
  width: 90%;
  background-color: #fffef7;
  border: 2px solid #007007;
  border-radius: 5px;
  padding: 10px;
  font-family: 'League Spartan', sans-serif;
  font-size: 28pt;
  font-weight: 720;
  text-align: center;
  text-transform: uppercase;
  outline: none;
  z-index: 3;
`;

// Função de impressão importada (mesma lógica do ImpressaoNotaFiscal.jsx)
const gerarNotaFiscal = (nomeCliente, comandaId, linhas, totalComanda) => {
  const linhasPreenchidas = linhas.filter(
    (linha) => linha.produto && linha.quant && linha.valorUnit
  );

  if (linhasPreenchidas.length === 0) {
    alert('Não há itens para imprimir!');
    return;
  }

  const conteudoImpressao = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Nota Fiscal - Comanda ${comandaId}</title>
      <style>
        @media print {
          @page {
            size: 80mm auto;
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
          font-family: 'Courier New', monospace;
          font-size: 12pt;
          line-height: 1.4;
          max-width: 80mm;
          margin: 0 auto;
          padding: 10px;
        }

        .header {
          text-align: center;
          border-bottom: 2px dashed #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .header h1 {
          font-size: 16pt;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .header p {
          font-size: 10pt;
          margin: 2px 0;
        }

        .info-cliente {
          margin: 15px 0;
          padding: 10px 0;
          border-bottom: 1px dashed #000;
        }

        .info-cliente p {
          margin: 5px 0;
        }

        .info-cliente strong {
          font-weight: bold;
        }

        .itens {
          margin: 15px 0;
        }

        .itens-header {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }

        .item {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          padding: 5px 0;
        }

        .item-info {
          flex: 1;
        }

        .item-nome {
          font-weight: bold;
          margin-bottom: 3px;
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
          margin: 10px 0;
        }

        .totais {
          margin: 15px 0;
          padding: 10px 0;
          border-top: 2px solid #000;
        }

        .total-linha {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          font-size: 11pt;
        }

        .total-linha.destaque {
          font-size: 14pt;
          font-weight: bold;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed #000;
        }

        .footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 10px;
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
        <h1>NOTA FISCAL</h1>
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
          <span>Taxa de Serviço (10%):</span>
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
        <p>Total de itens: ${linhasPreenchidas.length}</p>
        <p class="agradecimento">OBRIGADO PELA PREFERÊNCIA!</p>
        <p>Volte sempre!</p>
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

  const janelaImpressao = window.open('', '_blank', 'width=300,height=600');
  janelaImpressao.document.write(conteudoImpressao);
  janelaImpressao.document.close();
};

function Principal() {
  const navigate = useNavigate();
  const [mostrarNova, setMostrarNova] = useState(false);
  const [nomeComanda, setNomeComanda] = useState('');
  const [menuAbertoId, setMenuAbertoId] = useState(null);
  const [editingId, setEditingId] = useState(null); 
  const [novoNome, setNovoNome] = useState('');
  const [menuPrincipalAberto, setMenuPrincipalAberto] = useState(false);

  const [comandas, setComandas] = useState(() => {
    const comandasSalvas = localStorage.getItem('comandas');
    return comandasSalvas ? JSON.parse(comandasSalvas) : [];
  });

  useEffect(() => {
    localStorage.setItem('comandas', JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    const fecharMenu = () => {
      setMenuAbertoId(null);
      setMenuPrincipalAberto(false);
    };

    if (menuAbertoId !== null || menuPrincipalAberto) {
      window.addEventListener('click', fecharMenu);
    }
    
    return () => {
      window.removeEventListener('click', fecharMenu);
    };
  }, [menuAbertoId, menuPrincipalAberto]);

  const adicionarComanda = () => {
    if (nomeComanda.trim() !== '') {
      const novaComanda = {
        id: Date.now(),
        nome: nomeComanda.trim()
      };
      setComandas([...comandas, novaComanda]);
      setNomeComanda('');
      setMostrarNova(false);
    }
  };

  const deletarComanda = (idParaDeletar) => {
    const novasComandas = comandas.filter(comanda => comanda.id !== idParaDeletar);
    setComandas(novasComandas);
    localStorage.removeItem(`comanda_${idParaDeletar}`);
  };

  const handleEditar = (comanda) => {
    setEditingId(comanda.id);
    setNovoNome(comanda.nome);
    setMenuAbertoId(null);
  };

  const salvarEdicao = () => {
    if (!editingId || novoNome.trim() === '') return;

    setComandas(comandasAtuais =>
      comandasAtuais.map(comanda =>
        comanda.id === editingId ? { ...comanda, nome: novoNome.trim() } : comanda
      )
    );

    setEditingId(null);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      salvarEdicao();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      adicionarComanda();
    }
  };

  const toggleMenu = (e, comandaId) => {
    e.stopPropagation();
    setMenuAbertoId(menuAbertoId === comandaId ? null : comandaId);
  };

  const toggleMenuPrincipal = (e) => {
    e.stopPropagation();
    setMenuPrincipalAberto(!menuPrincipalAberto);
  };
  
  const handleArquivar = (comanda) => {
    if (window.confirm(`Deseja arquivar a comanda "${comanda.nome}"?`)) {
      // Adiciona às comandas arquivadas
      const comandasArquivadas = JSON.parse(localStorage.getItem('comandasArquivadas') || '[]');
      const comandaArquivada = {
        ...comanda,
        dataArquivamento: new Date().toISOString()
      };
      comandasArquivadas.push(comandaArquivada);
      localStorage.setItem('comandasArquivadas', JSON.stringify(comandasArquivadas));

      // Remove das comandas ativas
      const novasComandas = comandas.filter(c => c.id !== comanda.id);
      setComandas(novasComandas);
    }
  };

  const imprimirComanda = (e, comanda) => {
    e.stopPropagation();

    const chave = `comanda_${comanda.id}`;
    const dadosSalvos = localStorage.getItem(chave);
    
    if (!dadosSalvos) {
      alert('Não há dados para imprimir nesta comanda!');
      return;
    }

    const linhas = JSON.parse(dadosSalvos);
    const linhasPreenchidas = linhas.filter(
      (linha) => linha.produto && linha.quant && linha.valorUnit
    );

    if (linhasPreenchidas.length === 0) {
      alert('Não há itens para imprimir!');
      return;
    }

    const totalComanda = linhasPreenchidas.reduce((soma, linha) => {
      const quantidade = parseFloat(linha.quant) || 0;
      const valor = parseFloat(linha.valorUnit) || 0;
      return soma + quantidade * valor;
    }, 0);

    gerarNotaFiscal(comanda.nome, comanda.id, linhas, totalComanda);
  };

  return (
    <Fundo>
      <Barra>
        <Titulo>COMANDAS</Titulo>
        <Botoes onClick={() => setMostrarNova(true)}>
          <StyledAdd />
        </Botoes>
        <Botoes onClick={toggleMenuPrincipal}>
          <StyledMenu />
        </Botoes>
      </Barra>

      {menuPrincipalAberto && (
        <MenuPrincipalSuspenso onClick={(e) => e.stopPropagation()}>
          <MenuPrincipalItem onClick={() => navigate('/comandas_elh/arquivos')}>
            Arquivados
          </MenuPrincipalItem>
          <MenuPrincipalItem onClick={() => navigate('/comandas_elh/total-dia')}>
            Total do Dia
          </MenuPrincipalItem>
        </MenuPrincipalSuspenso>
      )}

      {comandas.map((comanda, index) => (
        <QuadradoComanda 
          key={comanda.id}
          index={index}
          onClick={() => !editingId && navigate(`/comandas_elh/comanda/${comanda.id}`, { state: { nome: comanda.nome } })}
        >
          {editingId === comanda.id ? (
            <InputEdicao
              type="text"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              onBlur={salvarEdicao}
              onKeyDown={handleInputKeyDown}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <>
              {comanda.nome}
              
              {/* Ícone de Impressora */}
              <IconeImpressora onClick={(e) => imprimirComanda(e, comanda)} title="Imprimir Comanda">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#fffef7"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </IconeImpressora>

              <StyledBola onClick={(e) => toggleMenu(e, comanda.id)} />
            </>
          )}

          {menuAbertoId === comanda.id && (
            <MenuSuspenso onClick={(e) => e.stopPropagation()}>
              <MenuItem onClick={() => handleEditar(comanda)}>Editar</MenuItem>
              <MenuItem onClick={() => {
                if (window.confirm(`Deseja realmente excluir a comanda "${comanda.nome}"?`)) {
                  deletarComanda(comanda.id);
                }
              }}>Apagar</MenuItem>
              <MenuItem onClick={() => handleArquivar(comanda)}>Arquivar</MenuItem>
            </MenuSuspenso>
          )}

        </QuadradoComanda>
      ))}

      {mostrarNova && (
        <Overlay onClick={() => setMostrarNova(false)}>
          <Nova onClick={(e) => e.stopPropagation()}>
            <Titulo2 style={{ color: '#fffef7', textAlign: 'center', paddingTop: '20px' }}>
              NOVA COMANDA
            </Titulo2>
            <Textbox>
              <Titulo3 style={{ color: 'black', textAlign: 'left', paddingTop: '12px', paddingLeft: '10px' }}>
                NOME:
              </Titulo3>
              <CaixaTexto
                type="text"
                placeholder="Digite o nome do cliente..."
                value={nomeComanda}
                onChange={(e) => setNomeComanda(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </Textbox>
          </Nova>
        </Overlay>
      )}
    </Fundo>
  );
}

export default Principal;