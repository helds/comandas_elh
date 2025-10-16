import { Routes, Route } from 'react-router-dom';
import ComandaDetalhe from '../../ComandaDetalhe'; 
import Principal from '../principal';
import PaginaArquivos from '../../PaginaArquivos'; 
import TotalDias from '../../TotalDia';

function AppRouter() {
  return (
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/comanda/:id" element={<ComandaDetalhe />} /> 
        <Route path="/arquivos" element={<PaginaArquivos />} /> 
        <Route path="/total-dia" element={<TotalDias />} />
      </Routes>
  );
}

export default AppRouter;