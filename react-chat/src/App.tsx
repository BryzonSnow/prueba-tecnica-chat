// react-chat/src/App.tsx
import { useEffect, useState, useRef } from 'react';
import { useChatStore } from './store/chatStore';
import { socketService } from './services/socketService';
import './App.css'; // Importamos los estilos

function App() {
  const messages = useChatStore((state) => state.messages);
  const isConnected = useChatStore((state) => state.isConnected);
  const currentUser = useChatStore((state) => state.currentUser);

  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        {messages.map((msg, index) => (
          <div key={index} className="message-row">
            {}
            <img
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${msg.user}`}
              alt={`Avatar de ${msg.user}`}
              className="avatar"
            />
            <div className="message-content">
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="empty-state">
            <em>No hay mensajes aún. ¡Escribe el primero!</em>
          </div>
        )}
        {}
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