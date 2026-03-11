// vue-chat/src/services/socketService.ts
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../stores/chatStore';

class SocketService {
  private socket: Socket | null = null;

  public connect() {
    // Nos conectamos al servidor que dejamos corriendo en el puerto 3001
    this.socket = io('http://localhost:3001');

    // Instanciamos el store de Pinia
    const chatStore = useChatStore();

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de WebSockets');
      chatStore.setConnectionStatus(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      chatStore.setConnectionStatus(false);
    });

    this.socket.on('message', (msg: { user: string; text: string }) => {
      chatStore.addMessage(msg);
    });
  }

  public sendMessage(msg: { user: string; text: string }) {
    if (this.socket) {
      this.socket.emit('message', msg);
    }
  }

  // para limpiar la conexión 
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();