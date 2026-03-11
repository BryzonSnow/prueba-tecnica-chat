// react-chat/src/store/chatStore.ts
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
  addMessage: (message: Message) => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isConnected: false,
      currentUser: 'Usernam3',

      addMessage: (message) => 
        set((state) => ({ messages: [...state.messages, message] })),
        
      setConnectionStatus: (status) => 
        set({ isConnected: status }),
    }),
    {
      name: 'chat_messages_react', 
      partialize: (state) => ({ messages: state.messages }), 
    }
  )
);