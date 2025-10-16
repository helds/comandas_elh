import { useState, useMemo } from 'react';

export function useFiltroBusca(dadosIniciais) {

  const [termoBusca, setTermoBusca] = useState('');

  const resultadosFiltrados = useMemo(() => {
    if (!termoBusca) {
      return [];
    }

    // Função para remover acentos de uma string
    const removerAcentos = (texto) => {
      return texto
        .normalize("NFD") // Separa a letra do acento (ex: 'á' -> 'a' + '´')
        .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos (diacríticos)
    };

    // Converte o termo de busca para minúsculas e remove os acentos
    const termoBuscaNormalizado = removerAcentos(termoBusca.toLowerCase());

    // Filtra os dados comparando as versões normalizadas
    return dadosIniciais.filter(item => {
      const nomeItemNormalizado = removerAcentos(item.nome.toLowerCase());
      return nomeItemNormalizado.includes(termoBuscaNormalizado);
    });

  }, [termoBusca, dadosIniciais]); 

  return {
    termoBusca,
    setTermoBusca,
    resultadosFiltrados
  };
}