// react-chat/src/App.tsx
import { useEffect, useState, useRef } from 'react';
import { useChatStore } from './store/chatStore';
import { socketService } from './services/socketService';
import './App.css'; // Importamos los estilos

function App() {
  const messages = useChatStore((state) => state.messages);
  const isConnected = useChatStore((state) => state.isConnected);
  const currentUser = useChatStore((state) => state.currentUser);
  const hasJoined = useChatStore((state) => state.hasJoined);

  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const setCurrentUser = useChatStore((state) => state.setCurrentUser);
  const setHasJoined = useChatStore((state) => state.setHasJoined);

  // CICLO DE VIDA 
  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []); 

  //Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // METODOS
  const handleSend = () => {
    if (newMessage.trim() === '') return;

    socketService.sendMessage({
      user: currentUser,
      text: newMessage,
    });

    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!hasJoined) {
    return (
      <div className="join-screen">
        <div className="join-card">
          <h2>¡Bienvenido al Chat!</h2>
          <p>Ingresa tu nombre o usa el generado al azar:</p>
          
          <img 
            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser}`} 
            alt="Tu Avatar" 
            className="avatar-preview"
          />
          
          <input 
            type="text"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setHasJoined(true)}
            className="join-input"
          />
          <button onClick={() => setHasJoined(true)} className="join-button">
            Entrar al Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="chat-container">
      <h1>Chat Realtime (React)</h1>
      <p className="status">
        Status:{' '}
        {isConnected ? (
          <span className="online">☑ Conectado</span>
        ) : (
          <span className="offline">☒ Desconectado</span>
        )}
      </p>

      <hr />

      <div className="messages-container">
{messages.map((msg, index) => {
          // Determinamos si el mensaje es del usuario actual
          const isMine = msg.user === currentUser;
          
          return (
            <div key={index} className={`message-row ${isMine ? 'mine' : 'other'}`}>
              {!isMine && (
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${msg.user}`}
                  alt="Avatar"
                  className="avatar"
                />
              )}
              
              <div className="message-content">
                <strong>{isMine ? 'Tú' : msg.user}:</strong> {msg.text}
              </div>

              {isMine && (
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${msg.user}`}
                  alt="Avatar"
                  className="avatar"
                />
              )}
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="empty-state">
            <em>No hay mensajes aún. ¡Escribe el primero!</em>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <hr />

      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="[ escribir mensaje ]"
        />
        <button onClick={handleSend}>[ enviar ]</button>
      </div>
    </main>
  );
}

export default App;