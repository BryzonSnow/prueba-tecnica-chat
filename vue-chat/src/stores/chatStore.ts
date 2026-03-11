import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface Message {
  user: string;
  text: string;
}

export const useChatStore = defineStore('chat', () => {
  const savedMessages = localStorage.getItem('chat_messages');
  const messages = ref<Message[]>(savedMessages ? JSON.parse(savedMessages) : []);
  
  const isConnected = ref<boolean>(false);
  
  const currentUser = ref<string>(`Invitado_${Math.floor(Math.random() * 1000)}`);
  const hasJoined = ref<boolean>(false);

  watch(messages, (newMessages) => {
    localStorage.setItem('chat_messages', JSON.stringify(newMessages));
  }, { deep: true });

  const addMessage = (message: Message) => {
    messages.value.push(message);
  };

  const setConnectionStatus = (status: boolean) => {
    isConnected.value = status;
  };

  const setCurrentUser = (name: string) => {
    currentUser.value = name;
  };

  const setHasJoined = (status: boolean) => {
    hasJoined.value = status;
  };

  return {
    messages,
    isConnected,
    currentUser,
    hasJoined,
    addMessage,
    setConnectionStatus,
    setCurrentUser,
    setHasJoined
  };
});