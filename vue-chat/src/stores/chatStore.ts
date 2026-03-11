// vue-chat/src/stores/chatStore.ts
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface Message {
  user: string;
  text: string;
}

export const useChatStore = defineStore('chat', () => {
  // PERSISTENCIA
  // Intentamos recuperar el historial guardado, si no hay, empezamos vacío
  const savedMessages = localStorage.getItem('chat_messages');
  const messages = ref<Message[]>(savedMessages ? JSON.parse(savedMessages) : []);
  
  const isConnected = ref<boolean>(false);
  const currentUser = ref<string>('Bryzon');

  watch(messages, (newMessages) => {
    localStorage.setItem('chat_messages', JSON.stringify(newMessages));
  }, { deep: true });

  const addMessage = (message: Message) => {
    messages.value.push(message);
  };

  const setConnectionStatus = (status: boolean) => {
    isConnected.value = status;
  };

  return {
    messages,
    isConnected,
    currentUser,
    addMessage,
    setConnectionStatus
  };
});