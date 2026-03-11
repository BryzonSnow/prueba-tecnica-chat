// react-chat/src/services/socketService.ts
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../store/chatStore';

class SocketService {
  private socket: Socket | null = null;

  public connect() {
    if (this.socket) return; 

    this.socket = io('http://localhost:3001');

    this.socket.on('connect', () => {
      console.log('React: Conectado al servidor de WebSockets');
      useChatStore.getState().setConnectionStatus(true);
    });

    this.socket.on('disconnect', () => {
      console.log('React: Desconectado del servidor');
      useChatStore.getState().setConnectionStatus(false);
    });

    this.socket.on('message', (msg: { user: string; text: string }) => {
      useChatStore.getState().addMessage(msg);
    });
  }

  public sendMessage(msg: { user: string; text: string }) {
    if (this.socket) {
      this.socket.emit('message', msg);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();