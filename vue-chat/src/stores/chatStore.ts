// vue-chat/src/stores/chatStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Message {
  user: string;
  text: string;
}

export const useChatStore = defineStore('chat', () => {
  // ESTADO (State)
  const messages = ref<Message[]>([]);
  const isConnected = ref<boolean>(false);
  const currentUser = ref<string>('Bryzon'); //mi firma

  // ACCIONES (Actions)
  
  // Agregar un nuevo mensaje al historial
  const addMessage = (message: Message) => {
    messages.value.push(message);
  };

  // Actualizar el estado de la conexión
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