import { Routes, Route } from 'react-router-dom';
import ComandaDetalhe from '../../ComandaDetalhe'; 
import Principal from '../principal';
import PaginaArquivos from '../../PaginaArquivos'; 
import TotalDias from '../../TotalDia';

function AppRouter() {
  return (
      <Routes>
        <Route path="/comandas_elh" element={<Principal />} />
        <Route path="/comandas_elh/comanda/:id" element={<ComandaDetalhe />} /> 
        <Route path="/comandas_elh/arquivos" element={<PaginaArquivos />} /> 
        <Route path="/comandas_elh/total-dia" element={<TotalDias />} />
      </Routes>
  );
}

export default AppRouter;