import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

type SocketType = ReturnType<typeof io>;

interface WebSocketContextType {
  socket: SocketType | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socketInstance = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 