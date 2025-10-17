import React, { useMemo, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useFiltroBusca } from './useFiltroBusca';
import { cardapio } from './database';

/* ---------- Estilos ---------- */

const TabelaContainer = styled.div`
  width: 100%;
  background-color: #fffef7;
  margin-top: 110px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100vh;
`;

const TabelaEstilizada = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Nunito, sans-serif;
  table-layout: fixed;
`;

const Cabecalho = styled.thead`
  background-color: #008000;
  line-height: 40px;
  color: #fffef7;
  font-weight: 800;
  font-size: 25pt;
`;

const CabecalhoCell = styled.th`
  padding: 8px 6px;
  border-right: 3px solid #03941b;
  text-align: center;
  white-space: nowrap;

  &:last-child {
    border-right: none;
  }
`;

const Corpo = styled.tbody`
  tr {
    border-bottom: 0px solid #03941b;
    height: 50px;
    background-color: #fffef7;
  }

  tr:nth-child(even) {
    background-color: #e9ffe8;
  }
`;

const CorpoCell = styled.td`
  padding: 10px 6px;
  border-right: 3px solid #03941b;
  text-align: center;
  font-size: 23pt;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:last-child {
    border-right: none;
  }

  input {
    width: 100%;
    border: none;
    background: transparent;
    text-align: inherit;
    font-size: inherit;
    font-family: inherit;
    outline: none;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
  }

  input[type='number'] {
    appearance: auto;
    -moz-appearance: textfield;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: inner-spin-button;
  }
`;

const InputContainer = styled.div`
  position: relative;
`;

const SugestoesLista = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SugestaoItem = styled.li`
  padding: 10px;
  cursor: pointer;
  font-size: 18pt;
  color: #333;
  text-align: left;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  ${props => props.$selected && `
    background-color: #0abf00;
    color: #fffef7;
    font-weight: bold;
    
    &:hover {
      background-color: #0abf00;
    }
  `}
`;

/* ---------- Componente principal ---------- */

function TabelaComanda({ onTotalChange, comandaId }) {
  const TOTAL_LINHAS = 80;

  const linhaVazia = { cod: '', quant: '', produto: '', valorUnit: '' };
  
  // Função para carregar dados do localStorage
  const carregarDados = () => {
    if (!comandaId) return Array.from({ length: TOTAL_LINHAS }, () => linhaVazia);
    
    try {
      const chave = `comanda_${comandaId}`;
      const dadosSalvos = localStorage.getItem(chave);
      
      if (dadosSalvos) {
        const dadosParseados = JSON.parse(dadosSalvos);
        // Garante que sempre temos 80 linhas
        if (dadosParseados.length === TOTAL_LINHAS) {
          return dadosParseados;
        }
      }
    } catch (erro) {
      console.error('Erro ao carregar dados do localStorage:', erro);
    }
    
    return Array.from({ length: TOTAL_LINHAS }, () => linhaVazia);
  };

  const [linhas, setLinhas] = useState(carregarDados);
  
  const [linhaAtivaIndex, setLinhaAtivaIndex] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const { termoBusca, setTermoBusca, resultadosFiltrados } = useFiltroBusca(cardapio);
  
  const inputRef = useRef(null);
  const sugestoesRef = useRef(null);

  // Salva os dados no localStorage sempre que as linhas mudarem
  useEffect(() => {
    if (!comandaId) return;
    
    try {
      const chave = `comanda_${comandaId}`;
      localStorage.setItem(chave, JSON.stringify(linhas));
    } catch (erro) {
      console.error('Erro ao salvar dados no localStorage:', erro);
    }
  }, [linhas, comandaId]);

  // Calcula o total da comanda
  useEffect(() => {
    const total = linhas.reduce((soma, linha) => {
      const quantidade = parseFloat(linha.quant) || 0;
      const valor = parseFloat(linha.valorUnit) || 0;
      return soma + quantidade * valor;
    }, 0);
    if (onTotalChange) onTotalChange(total);
  }, [linhas, onTotalChange]);

  // Reset do índice selecionado quando os resultados mudam
  useEffect(() => {
    setSelectedSuggestionIndex(0);
  }, [resultadosFiltrados]);

  // Scroll automático para item selecionado no menu
  useEffect(() => {
    if (sugestoesRef.current && resultadosFiltrados.length > 0) {
      const selectedElement = sugestoesRef.current.children[selectedSuggestionIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedSuggestionIndex, resultadosFiltrados]);

  // Gerenciamento de teclado para o menu de sugestões
  const handleKeyDown = (e, i) => {
    // Só processa setas e Enter se o menu estiver visível
    if (linhaAtivaIndex === i && resultadosFiltrados.length > 0) {
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            (prev + 1) % resultadosFiltrados.length
          );
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            (prev - 1 + resultadosFiltrados.length) % resultadosFiltrados.length
          );
          break;
        
        case 'Enter':
          e.preventDefault();
          if (resultadosFiltrados[selectedSuggestionIndex]) {
            selecionarProduto(i, resultadosFiltrados[selectedSuggestionIndex]);
          }
          break;
        
        case 'Escape':
          e.preventDefault();
          setLinhaAtivaIndex(null);
          setTermoBusca('');
          break;
        
        default:
          break;
      }
    }
  };

  const limparLinha = (i) => {
    setLinhas((old) => old.map((l, idx) => (idx === i ? { ...linhaVazia } : l)));
    if (linhaAtivaIndex === i) setTermoBusca('');
    setLinhaAtivaIndex(i);
  };

  const atualizarCelula = (i, campo, valor) => {
    setLinhas((old) => old.map((l, idx) => (idx === i ? { ...l, [campo]: valor } : l)));
  };

  const selecionarProduto = (i, produto) => {
    setLinhas((old) =>
      old.map((l, idx) =>
        idx === i
          ? {
              ...l,
              produto: produto.nome,
              cod: produto.id,
              valorUnit: produto.preco,
              quant: l.quant || 1,
            }
          : l
      )
    );
    setTermoBusca('');
    setLinhaAtivaIndex(null);
    setSelectedSuggestionIndex(0);
  };

  const colunas = useMemo(
    () => [
      { accessorKey: 'cod', header: 'CÓD.', size: '8%' },
      { accessorKey: 'quant', header: 'QUANT.', size: '10%' },
      { accessorKey: 'produto', header: 'PRODUTO', size: '50%' },
      { accessorKey: 'valorUnit', header: 'VALOR UNIT.', size: '12%' },
      {
        id: 'valorTotal',
        header: 'VALOR TOTAL',
        size: '17.5%',
        cell: ({ row }) => {
          const { quant, valorUnit } = row.original;
          const total = (parseFloat(quant) || 0) * (parseFloat(valorUnit) || 0);
          return total
            ? total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : '';
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: linhas,
    columns: colunas,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TabelaContainer>
      <TabelaEstilizada>
        <Cabecalho>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <CabecalhoCell
                  key={header.id}
                  style={{ width: header.column.columnDef.size }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </CabecalhoCell>
              ))}
            </tr>
          ))}
        </Cabecalho>

        <Corpo>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} style={{ position: 'relative', zIndex: linhaAtivaIndex === i ? 5 : 'auto' }}>
              {row.getVisibleCells().map((cell) => {
                const colId = cell.column.id;
                const isTotal = colId === 'valorTotal';
                const isEditing = editingCell?.rowIndex === i && editingCell?.colId === colId;

                if (colId === 'valorUnit') {
                  return (
                    <CorpoCell key={cell.id}>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={linhas[i].valorUnit}
                          autoFocus
                          onBlur={() => setEditingCell(null)}
                          onChange={(e) => atualizarCelula(i, 'valorUnit', e.target.value)}
                        />
                      ) : (
                        <div
                          onClick={() => setEditingCell({ rowIndex: i, colId })}
                          style={{ cursor: 'pointer', width: '100%', height: '100%' }}
                        >
                          {linhas[i].valorUnit
                            ? parseFloat(linhas[i].valorUnit).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })
                            : ''}
                        </div>
                      )}
                    </CorpoCell>
                  );
                }

                if (colId === 'produto') {
                  return (
                    <CorpoCell key={cell.id}>
                      <InputContainer>
                        <input
                          ref={linhaAtivaIndex === i ? inputRef : null}
                          type="text"
                          value={linhaAtivaIndex === i ? termoBusca : linhas[i].produto}
                          onFocus={() => {
                            setLinhaAtivaIndex(i);
                            setTermoBusca(linhas[i].produto || '');
                            setSelectedSuggestionIndex(0);
                          }}
                          onChange={(e) => {
                            const valor = e.target.value;
                            setTermoBusca(valor);
                            if (valor === '') limparLinha(i);
                            else atualizarCelula(i, 'produto', valor);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          onBlur={() => setTimeout(() => setLinhaAtivaIndex(null), 150)}
                        />
                        {linhaAtivaIndex === i && resultadosFiltrados.length > 0 && (
                          <SugestoesLista ref={sugestoesRef}>
                            {resultadosFiltrados.map((item, index) => (
                              <SugestaoItem
                                key={item.id}
                                $selected={index === selectedSuggestionIndex}
                                onMouseDown={() => selecionarProduto(i, item)}
                                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                              >
                                {item.nome}
                              </SugestaoItem>
                            ))}
                          </SugestoesLista>
                        )}
                      </InputContainer>
                    </CorpoCell>
                  );
                }

                return (
                  <CorpoCell key={cell.id}>
                    {isTotal ? (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    ) : (
                      <input
                        type={colId === 'quant' || colId === 'cod' ? 'number' : 'text'}
                        min={0}
                        value={linhas[i][colId] ?? ''}
                        onChange={(e) => {
                          let valor = e.target.value;
                          if (colId === 'cod') {
                            atualizarCelula(i, 'cod', valor);
                            if (valor === '') return limparLinha(i);
                            const produto = cardapio.find((p) => String(p.id) === String(valor));
                            if (produto) selecionarProduto(i, produto);
                            return;
                          }
                          if (colId === 'quant') {
                            if (valor === '0' || valor === '') return limparLinha(i);
                            const n = parseInt(valor, 10);
                            valor = isNaN(n) || n < 0 ? 1 : n;
                          }
                          atualizarCelula(i, colId, valor);
                        }}
                      />
                    )}
                  </CorpoCell>
                );
              })}
            </tr>
          ))}
        </Corpo>
      </TabelaEstilizada>
    </TabelaContainer>
  );
}

export default TabelaComanda;