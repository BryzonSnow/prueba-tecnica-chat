<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useChatStore } from './stores/chatStore';
import { socketService } from './services/socketService';

const chatStore = useChatStore();
const newMessage = ref('');

// Referencia al contenedor HTML de los mensajes para el Auto-scroll
const messagesContainer = ref<HTMLElement | null>(null);

// SCROLL AUTOMÁTICO
watch(() => chatStore.messages.length, async () => {
  await nextTick(); // Esperamos a que Vue actualice el DOM
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});

onMounted(() => {
  socketService.connect();
  // Hacemos scroll al inicio por si ya había mensajes en el localStorage
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});

onUnmounted(() => {
  socketService.disconnect();
});

const handleSend = () => {
  if (newMessage.value.trim() === '') return;

  socketService.sendMessage({
    user: chatStore.currentUser,
    text: newMessage.value
  });

  newMessage.value = '';
};
</script>

<template>
  <main>
    <h1>Chat Realtime</h1>
    <p class="status">
      Status: 
      <span v-if="chatStore.isConnected" class="online">☑ Conectado</span>
      <span v-else class="offline">☒ Desconectado</span>
    </p>

    <hr />

    <div class="messages-container" ref="messagesContainer">
      <div v-for="(msg, index) in chatStore.messages" :key="index" class="message-row">
        
        <img 
          :src="`https://api.dicebear.com/7.x/identicon/svg?seed=${msg.user}`" 
          alt="Avatar" 
          class="avatar"
        />
        
        <div class="message-content">
          <strong>{{ msg.user }}:</strong> {{ msg.text }}
        </div>
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
main {
  font-family: sans-serif;
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.status { font-weight: bold; }
.online { color: green; }
.offline { color: red; }

.messages-container {
  height: 350px;
  overflow-y: auto;
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
}

.message-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #e0e0e0;
}

.message-content {
  background-color: #f1f0f0;
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 0.95rem;
}

.empty-state {
  text-align: center;
  color: #888;
  margin-top: 2rem;
}

.input-area {
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.75rem 1.5rem;
  background-color: #42b883; /* Verde Vue */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
button:hover {
  background-color: #33a06f;
}
</style>