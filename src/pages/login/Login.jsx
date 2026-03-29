// Login.jsx — Tela de autenticação por PIN
import { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const EMAIL_COMANDAS = 'comandas@elhonorato.com';

const Login = () => {
  const [pin, setPin] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const inputRef = useRef(null);

  // Devolve o foco ao input oculto após clicar nos botões
  const focarInput = () => inputRef.current?.focus();

  const entrar = async () => {
    if (pin.trim() === '') return;
    setCarregando(true);
    setErro('');
    try {
      await signInWithEmailAndPassword(auth, EMAIL_COMANDAS, pin);
    } catch {
      setErro('PIN incorreto. Tente novamente.');
      setPin('');
      setTimeout(focarInput, 50);
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') entrar();
  };

  const apertarBotao = (valor) => {
    if (valor === '⌫') {
      setPin((p) => p.slice(0, -1));
    } else {
      setPin((p) => (p.length < 8 ? p + valor : p));
    }
    setErro('');
    // Devolve foco ao input para continuar digitando pelo teclado físico
    setTimeout(focarInput, 10);
  };

  const botoes = ['1','2','3','4','5','6','7','8','9','⌫','0','✓'];

  return (
    <Fundo onClick={focarInput}>
      <Card>
        <Logo>EL HONORATO</Logo>
        <Subtitulo>SISTEMA DE COMANDAS</Subtitulo>

        <PinDisplay>
          {Array.from({ length: 6 }).map((_, i) => (
            <PinPonto key={i} preenchido={i < pin.length} />
          ))}
        </PinDisplay>

        {erro && <MensagemErro key={erro}>{erro}</MensagemErro>}

        <Teclado>
          {botoes.map((b) => (
            <BotaoTeclado
              key={b}
              confirmar={b === '✓'}
              apagar={b === '⌫'}
              onClick={() => b === '✓' ? entrar() : apertarBotao(b)}
              disabled={carregando}
            >
              {carregando && b === '✓' ? '...' : b}
            </BotaoTeclado>
          ))}
        </Teclado>

        {/* Input oculto — captura o teclado físico */}
        <InputOculto
          ref={inputRef}
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => { setPin(e.target.value.slice(0, 8)); setErro(''); }}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </Card>
    </Fundo>
  );
};

export default Login;

// ─── Animações ────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-5px); }
  80%       { transform: translateX(5px); }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const Fundo = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0abf00;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background-color: #fffef7;
  border-radius: 30px;
  padding: 50px 40px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 0.4s ease;
  width: 360px;
`;

const Logo = styled.h1`
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  font-size: 36pt;
  color: #0abf00;
  margin: 0;
  letter-spacing: -1px;
  text-align: center;
`;

const Subtitulo = styled.p`
  font-family: 'League Spartan', sans-serif;
  font-weight: 600;
  font-size: 11pt;
  color: #888;
  margin: -12px 0 0;
  letter-spacing: 2px;
`;

const PinDisplay = styled.div`
  display: flex;
  gap: 14px;
  margin: 10px 0 0;
`;

const PinPonto = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(p) => (p.preenchido ? '#0abf00' : '#ddd')};
  transition: background-color 0.15s ease;
`;

const MensagemErro = styled.p`
  font-family: 'League Spartan', sans-serif;
  color: #cc0000;
  font-size: 13pt;
  margin: -10px 0 0;
  animation: ${shake} 0.4s ease;
`;

const Teclado = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
`;

const BotaoTeclado = styled.button`
  height: 64px;
  border-radius: 14px;
  border: none;
  font-family: 'League Spartan', sans-serif;
  font-size: ${(p) => (p.confirmar || p.apagar ? '22pt' : '26pt')};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  background-color: ${(p) =>
    p.confirmar ? '#0abf00' : p.apagar ? '#f0f0e8' : '#f7f7f0'};
  color: ${(p) => (p.confirmar ? '#fffef7' : '#222')};
  box-shadow: ${(p) =>
    p.confirmar ? '0 4px 12px rgba(10,191,0,0.3)' : '0 2px 4px rgba(0,0,0,0.08)'};

  &:hover:not(:disabled) {
    transform: scale(1.05);
    background-color: ${(p) =>
      p.confirmar ? '#079100' : p.apagar ? '#e8e8e0' : '#efefea'};
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InputOculto = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
`;