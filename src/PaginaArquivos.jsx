import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VoltarIcon from './assets/voltar.svg?react';
import IconeBolaP from './assets/iconeBolaP.svg?react';

// --- Styled Components (com pequenas melhorias) ---

const Fundo = styled.div`
  background-color: #fffef7;
  min-height: 100vh;
  width: 100vw;
  overflow-y: auto;
  padding: 130px 40px 40px 40px;
  box-sizing: border-box;
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
  overflow: hidden;
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
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 50px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const StyledVoltar = styled(VoltarIcon)`
  width: 70px;
  height: 70px;
`;

const SecaoAno = styled.div`
  margin-bottom: 40px;
`;

const TituloAno = styled.h2`
  font-family: 'League Spartan', sans-serif;
  font-size: 3rem;
  color: #007007;
  border-bottom: 3px solid #0abf00;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const SecaoMes = styled.div`
  margin-bottom: 30px;
  padding-left: 20px;
`;

const TituloMes = styled.h3`
  font-family: 'League Spartan', sans-serif;
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 20px;
`;

const SecaoDia = styled.div`
  margin-bottom: 25px;
  padding-left: 20px;
`;

const TituloDia = styled.h4`
  font-family: 'League Spartan', sans-serif;
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 15px;
`;

const GridComandas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const QuadradoComanda = styled.div`
  position: relative;
  background-color: #e9ffe8;
  border: 3px solid #007007;
  color: black;
  width: 250px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'League Spartan', sans-serif;
  text-transform: uppercase;
  font-size: 28pt;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  word-break: break-word;
  padding: 10px;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const InfoComanda = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  text-transform: none;
  margin-top: 10px;
`;

const StyledBola = styled(IconeBolaP)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 2;
`;

const MenuSuspenso = styled.div`
  position: absolute;
  top: 45px;
  right: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
  width: 160px;
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  font-size: 16px;
  font-family: sans-serif;
  color: #333;
  cursor: pointer;
  text-align: left;
  text-transform: none;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const MensagemVazia = styled.p`
  font-family: 'League Spartan', sans-serif;
  font-size: 1.5rem;
  color: #777;
  text-align: center;
  width: 100%;
`;


function PaginaArquivos() {
  const navigate = useNavigate();
  const [arquivadas, setArquivadas] = useState([]);
  const [comandasOrganizadas, setComandasOrganizadas] = useState({});
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  // Carrega as comandas arquivadas do localStorage na inicialização
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('comandasArquivadas');
    if (dadosSalvos) {
      setArquivadas(JSON.parse(dadosSalvos));
    }
  }, []);

  // ✅ CORREÇÃO PRINCIPAL: Organiza as comandas sempre que a lista 'arquivadas' mudar
  useEffect(() => {
    const organizadas = arquivadas.reduce((acc, comanda) => {
      const data = new Date(comanda.dataArquivamento);
      const ano = data.getFullYear();
      const mes = data.toLocaleString('pt-BR', { month: 'long' });
      const dia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

      if (!acc[ano]) acc[ano] = {};
      if (!acc[ano][mesCapitalizado]) acc[ano][mesCapitalizado] = {};
      if (!acc[ano][mesCapitalizado][dia]) acc[ano][mesCapitalizado][dia] = [];
      
      acc[ano][mesCapitalizado][dia].push(comanda);
      return acc;
    }, {});
    setComandasOrganizadas(organizadas);
  }, [arquivadas]);

  const toggleMenu = (e, comandaId) => {
    e.stopPropagation();
    setMenuAbertoId(menuAbertoId === comandaId ? null : comandaId);
  };

  const desarquivarComanda = (comandaParaDesarquivar) => {
    // Adiciona a comanda de volta à lista de comandas ativas
    const comandasAtivas = JSON.parse(localStorage.getItem('comandas') || '[]');
    const novasAtivas = [...comandasAtivas, { id: comandaParaDesarquivar.id, nome: comandaParaDesarquivar.nome }];
    localStorage.setItem('comandas', JSON.stringify(novasAtivas));

    // Remove da lista de arquivadas
    const novasArquivadas = arquivadas.filter(c => c.id !== comandaParaDesarquivar.id);
    localStorage.setItem('comandasArquivadas', JSON.stringify(novasArquivadas));
    setArquivadas(novasArquivadas); // Atualiza o estado para disparar a reorganização
  };

  const deletarComanda = (comandaParaDeletar) => {
    if (window.confirm(`Tem certeza que deseja excluir a comanda "${comandaParaDeletar.nome}" permanentemente?`)) {
      const novasArquivadas = arquivadas.filter(c => c.id !== comandaParaDeletar.id);
      localStorage.setItem('comandasArquivadas', JSON.stringify(novasArquivadas));
      setArquivadas(novasArquivadas); // Atualiza o estado
    }
  };

  return (
    <Fundo>
      <Barra>
        <Botoes onClick={() => navigate('/comandas_elh/')}>
          <StyledVoltar />
        </Botoes>
        <Titulo>ARQUIVOS</Titulo>
      </Barra>

      {Object.keys(comandasOrganizadas).length === 0 ? (
        <MensagemVazia>Nenhuma comanda arquivada.</MensagemVazia>
      ) : (
        Object.keys(comandasOrganizadas)
          .sort((a, b) => b - a) // Ordena os anos do mais recente para o mais antigo
          .map(ano => (
            <SecaoAno key={ano}>
              <TituloAno>{ano}</TituloAno>
              {Object.keys(comandasOrganizadas[ano]).map(mes => (
                <SecaoMes key={mes}>
                  <TituloMes>{mes}</TituloMes>
                  {Object.keys(comandasOrganizadas[ano][mes]).map(dia => (
                    <SecaoDia key={dia}>
                      <TituloDia>📅 {dia}</TituloDia>
                      <GridComandas>
                        {comandasOrganizadas[ano][mes][dia].map((comanda, index) => (
                          <QuadradoComanda
                            key={comanda.id}
                            index={index}
                            onClick={() => navigate(`/comandas_elh/comanda/${comanda.id}`, { state: { nome: comanda.nome } })}
                          >
                            {comanda.nome}
                            <InfoComanda>
                              {new Date(comanda.dataArquivamento).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </InfoComanda>

                            <StyledBola onClick={(e) => toggleMenu(e, comanda.id)} />

                            {menuAbertoId === comanda.id && (
                              <MenuSuspenso onClick={(e) => e.stopPropagation()}>
                                <MenuItem onClick={() => desarquivarComanda(comanda)}>Desarquivar</MenuItem>
                                <MenuItem onClick={() => deletarComanda(comanda)}>Excluir</MenuItem>
                              </MenuSuspenso>
                            )}
                          </QuadradoComanda>
                        ))}
                      </GridComandas>
                    </SecaoDia>
                  ))}
                </SecaoMes>
              ))}
            </SecaoAno>
          ))
      )}
    </Fundo>
  );
}

export default PaginaArquivos;