import AppRouter from './pages/Routes/Rotas';
import { BrowserRouter } from 'react-router-dom';
import { BackupProvider } from './BackupContext';

function App() {
  return (
    <BackupProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </BackupProvider>
  );
}

export default App;