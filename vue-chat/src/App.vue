<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useChatStore } from './stores/chatStore';
import { socketService } from './services/socketService';

const chatStore = useChatStore();

const newMessage = ref('');

// CICLO DE VIDA 
onMounted(() => {
  socketService.connect();
});

onUnmounted(() => {
  socketService.disconnect();
});

// METODOS
const handleSend = () => {
  if (newMessage.value.trim() === '') return; // No vacios

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
    <p>
      Status: 
      <span v-if="chatStore.isConnected">☑ Conectado</span>
      <span v-else>☒ Desconectado</span>
    </p>

    <hr />

    <div class="messages-container">
      <div v-for="(msg, index) in chatStore.messages" :key="index">
        <strong>{{ msg.user }}:</strong> {{ msg.text }}
      </div>
      <div v-if="chatStore.messages.length === 0">
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
}
.messages-container {
  height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}
.input-area {
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>