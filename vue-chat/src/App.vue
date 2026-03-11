<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useChatStore } from './stores/chatStore';
import { socketService } from './services/socketService';

const chatStore = useChatStore();
const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

// --- BONUS: SCROLL AUTOMÁTICO ---
watch(() => chatStore.messages.length, async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});

// --- CICLO DE VIDA ---
onMounted(() => {
  socketService.connect();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});

onUnmounted(() => {
  socketService.disconnect();
});

// --- MÉTODOS ---
const handleSend = () => {
  if (newMessage.value.trim() === '') return;

  socketService.sendMessage({
    user: chatStore.currentUser,
    text: newMessage.value
  });

  newMessage.value = '';
};
</script> <template>
  <div v-if="!chatStore.hasJoined" class="join-screen">
    <div class="join-card">
      <h2>¡Bienvenido al Chat!</h2>
      <p>Ingresa tu nombre o usa el generado al azar:</p>
      
      <img 
        :src="`https://api.dicebear.com/7.x/identicon/svg?seed=${chatStore.currentUser}`" 
        alt="Tu Avatar" 
        class="avatar-preview"
      />
      
      <input 
        :value="chatStore.currentUser"
        @input="e => chatStore.setCurrentUser((e.target as HTMLInputElement).value)"
        @keyup.enter="chatStore.setHasJoined(true)"
        placeholder="Tu nombre..."
        class="join-input"
      />
      <button @click="chatStore.setHasJoined(true)" class="join-button">
        Entrar al Chat
      </button>
    </div>
  </div>

  <main v-else class="chat-container">
    <h1>Chat Realtime (Vue 3)</h1>
    <p class="status">
      Status: 
      <span v-if="chatStore.isConnected" class="online">☑ Conectado</span>
      <span v-else class="offline">☒ Desconectado</span>
    </p>

    <hr />

    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="(msg, index) in chatStore.messages" 
        :key="index" 
        :class="['message-row', msg.user === chatStore.currentUser ? 'mine' : 'other']"
      >
        <img 
          v-if="msg.user !== chatStore.currentUser"
          :src="`https://api.dicebear.com/7.x/identicon/svg?seed=${msg.user}`" 
          alt="Avatar" 
          class="avatar"
        />
        
        <div class="message-content">
          <strong>{{ msg.user === chatStore.currentUser ? 'Tú' : msg.user }}:</strong> {{ msg.text }}
        </div>

        <img 
          v-if="msg.user === chatStore.currentUser"
          :src="`https://api.dicebear.com/7.x/identicon/svg?seed=${msg.user}`" 
          alt="Avatar" 
          class="avatar"
        />
      </div>
      
      <div v-if="chatStore.messages.length === 0" class="empty-state">
        <em>No hay mensajes aún. ¡Escribe el primero!</em>
      </div>
    </div>

    <hr />

    <div class="input-area">
      <input 
        v-model="newMessage" 
        @keyup.enter="handleSend" 
        placeholder="[ escribir mensaje ]" 
      />
      <button @click="handleSend">[ enviar ]</button>
    </div>
  </main>
</template>

<style>
/* react-chat/src/App.css */

.input-area input:focus {
  border-color: #42b883; /* Verde Vue */
}
.input-area button {
  background-color: #42b883;
  color: white;
}
.chat-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.status { font-weight: 600; font-size: 0.9rem; }
.online { color: #25D366; } /* Verde WhatsApp */
.offline { color: #dc3545; }

.messages-container {
  height: 400px;
  overflow-y: auto;
  margin: 1rem 0;
  padding: 1.5rem;
  background-color: #e5ded8; /* Fondo clásico de chat */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Lógica visual de alineación */
.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
}

.message-row.mine {
  justify-content: flex-end;
}

.message-row.other {
  justify-content: flex-start;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.message-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.95rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
  word-wrap: break-word;
}

.message-row.mine .message-content {
  background-color: #dcf8c6; /* Burbuja verde claro */
  border-bottom-right-radius: 4px;
}

.message-row.other .message-content {
  background-color: #ffffff; /* Burbuja blanca */
  border-bottom-left-radius: 4px;
}

.message-content strong {
  display: block;
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 2px;
}

/* Input area */
.input-area {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.input-area input {
  flex: 1;
  padding: 0.85rem 1rem;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-area input:focus {
  border-color: #61dafb; /* Azul React */
}

.input-area button {
  padding: 0 1.5rem;
  background-color: #61dafb;
  color: #282c34;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.1s, background-color 0.2s;
}

.input-area button:active { transform: scale(0.95); }

.join-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5; /* Fondo gris claro tipo WhatsApp/Facebook */
  margin: -2rem; /* Por si el body tiene un padding por defecto */
}

.join-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 350px;
  width: 100%;
}

.join-card h2 {
  margin: 0;
  color: #333;
}

.join-card p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: 3px solid #ccc;
}

.join-input {
  padding: 0.75rem;
  font-size: 1.1rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
}

.join-input:focus {
  border-color: #333;
}

.join-button {
  padding: 0.75rem;
  font-size: 1.1rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: bold;
}

.join-button:hover {
  background-color: #555;
}
</style>