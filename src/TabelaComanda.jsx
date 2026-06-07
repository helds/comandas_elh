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

const TrLinha = styled.tr`
  position: relative;
  opacity: ${(props) => (props.$pago ? 0.38 : 1)};
  transition: opacity 0.2s ease;
  z-index: ${(props) => (props.$ativa ? 5 : 'auto')};
`;

const CorpoCell = styled.td`
  padding: 10px 6px;
  border-right: 3px solid #03941b;
  text-align: center;
  font-size: 23pt;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: inherit;

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

const CellValorTotal = styled(CorpoCell)`
  position: relative;
`;

const TextoValorTotal = styled.span`
  text-decoration: ${(props) => (props.$pago ? 'line-through' : 'none')};
`;

const BotaoPago = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  padding: 2px 4px;
  line-height: 1;
  border-radius: 4px;
  animation: fadeIn 0.2s ease forwards;
  transition: transform 0.15s ease, background-color 0.15s ease;
  filter: none;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-50%) scale(0.7); }
    to   { opacity: 1; transform: translateY(-50%) scale(1); }
  }

  &:hover {
    transform: translateY(-50%) scale(1.3);
    background-color: rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(-50%) scale(1.1);
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
  max-height: 238px;
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

function TabelaComanda({ comandaId, linhasCompartilhadas, setLinhasEPersistir }) {
  const linhaVazia = { cod: '', quant: '', produto: '', valorUnit: '', pago: false };

  // 2. APAGUE o useTabelaComandaSync daqui e use as linhas do componente pai:
  const linhas = linhasCompartilhadas;

  const [linhaAtivaIndex, setLinhaAtivaIndex]             = useState(null);
  const [editingCell, setEditingCell]                     = useState(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [linhaHover, setLinhaHover]                       = useState(null);

  const { termoBusca, setTermoBusca, resultadosFiltrados } = useFiltroBusca(cardapio);

  const inputRef       = useRef(null);
  const sugestoesRef   = useRef(null);
  const blurTimeoutRef = useRef(null);

  // 3. O useEffect que calculava o Total foi removido daqui! 
  // O componente pai (ComandaDetalhe) já está fazendo esse cálculo.

  useEffect(() => { setSelectedSuggestionIndex(0); }, [resultadosFiltrados]);

  useEffect(() => {
    if (sugestoesRef.current && resultadosFiltrados.length > 0) {
      const selectedElement = sugestoesRef.current.children[selectedSuggestionIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedSuggestionIndex, resultadosFiltrados]);

  // ── Teclado no autocomplete ───────────────────────────────────────────────
  const handleKeyDown = (e, i) => {
    if (linhaAtivaIndex === i && resultadosFiltrados.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => (prev + 1) % resultadosFiltrados.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => (prev - 1 + resultadosFiltrados.length) % resultadosFiltrados.length);
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

  // ── Ações nas linhas ──────────────────────────────────────────────────────
  
  // 4. Substitua "setLinhas" por "setLinhasEPersistir" em todas as funções abaixo:
  
  const limparLinha = (i) => {
    setLinhasEPersistir((old) => old.map((l, idx) => (idx === i ? { ...linhaVazia } : l)));
    if (linhaAtivaIndex === i) setTermoBusca('');
    setLinhaAtivaIndex(i);
  };

  const atualizarCelula = (i, campo, valor) => {
    setLinhasEPersistir((old) => old.map((l, idx) => (idx === i ? { ...l, [campo]: valor } : l)));
  };

  const selecionarProduto = (i, produto) => {
    setLinhasEPersistir((old) =>
      old.map((l, idx) =>
        idx === i
          ? { ...l, produto: produto.nome, cod: produto.id, valorUnit: produto.preco, quant: l.quant || 1 }
          : l
      )
    );
    setTermoBusca('');
    setLinhaAtivaIndex(null);
    setSelectedSuggestionIndex(0);
  };

  const togglePago = (i) => {
    setLinhasEPersistir((old) =>
      old.map((l, idx) => (idx === i ? { ...l, pago: !l.pago } : l))
    );
  };

  // ── Colunas ───────────────────────────────────────────────────────────────
  const colunas = useMemo(
    () => [
      { accessorKey: 'cod',       header: 'CÓD.',        size: '8%' },
      { accessorKey: 'quant',     header: 'QUANT.',      size: '10%' },
      { accessorKey: 'produto',   header: 'PRODUTO',     size: '50%' },
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <TabelaContainer>
      <TabelaEstilizada>
        <Cabecalho>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <CabecalhoCell key={header.id} style={{ width: header.column.columnDef.size }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </CabecalhoCell>
              ))}
            </tr>
          ))}
        </Cabecalho>

        <Corpo>
          {table.getRowModel().rows.map((row, i) => {
            const linha = linhas[i];
            const temProduto = !!linha.produto;
            const mostrarBotao = linhaHover === i && temProduto;

            return (
              <TrLinha
                key={row.id}
                $pago={linha.pago}
                $ativa={linhaAtivaIndex === i}
                onMouseEnter={() => setLinhaHover(i)}
                onMouseLeave={() => setLinhaHover(null)}
              >
                {row.getVisibleCells().map((cell) => {
                  const colId  = cell.column.id;
                  const isTotal   = colId === 'valorTotal';
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
                              clearTimeout(blurTimeoutRef.current);
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
                            onBlur={() => {
                              blurTimeoutRef.current = setTimeout(() => {
                                setLinhaAtivaIndex(null);
                              }, 150);
                            }}
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

                  if (isTotal) {
                    return (
                      <CellValorTotal key={cell.id}>
                        <TextoValorTotal $pago={linha.pago}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TextoValorTotal>

                        {mostrarBotao && (
                          <BotaoPago
                            title={linha.pago ? 'Desmarcar como pago' : 'Marcar como pago'}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              togglePago(i);
                            }}
                          >
                            {linha.pago ? '↩️' : '✅'}
                          </BotaoPago>
                        )}
                      </CellValorTotal>
                    );
                  }

                  return (
                    <CorpoCell key={cell.id}>
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
                    </CorpoCell>
                  );
                })}
              </TrLinha>
            );
          })}
        </Corpo>
      </TabelaEstilizada>
    </TabelaContainer>
  );
}

export default TabelaComanda;