import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AppRouter from './pages/Routes/Rotas';
import { BrowserRouter } from 'react-router-dom';
import { BackupProvider } from './BackupContext';
import Login from './pages/login/login';

function App() {
  // undefined = verificando sessão | null = não logado | objeto = logado
  const [usuario, setUsuario] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUsuario(u));
    return unsubscribe;
  }, []);

  // Verificando sessão — tela de carregamento
  if (usuario === undefined) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#0abf00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{
          fontFamily: "'League Spartan', sans-serif",
          color: '#fffef7',
          fontSize: '50pt',
          fontWeight: 700,
        }}>
          EL HONORATO
        </p>
      </div>
    );
  }

  // Não logado → tela de PIN
  if (!usuario) return <Login />;

  // Logado → app normal
  return (
    <BackupProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </BackupProvider>
  );
}

export default App;