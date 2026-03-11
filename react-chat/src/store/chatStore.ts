import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  user: string;
  text: string;
}

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  currentUser: string;
  hasJoined: boolean;
  addMessage: (message: Message) => void;
  setConnectionStatus: (status: boolean) => void;
  setCurrentUser: (name: string) => void;
  setHasJoined: (status: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      // ESTADO INICIAL
      messages: [],
      isConnected: false,
      currentUser: `Invitado_${Math.floor(Math.random() * 1000)}`,
      hasJoined: false,

      // ACCIONES 
      addMessage: (message) => 
        set((state) => ({ messages: [...state.messages, message] })),
        
      setConnectionStatus: (status) => 
        set({ isConnected: status }),
        
      setCurrentUser: (name) => 
        set({ currentUser: name }),
        
      setHasJoined: (status) => 
        set({ hasJoined: status }),
    }),
    {
      name: 'chat_messages_react',
      partialize: (state) => ({ messages: state.messages }), 
    }
  )
);