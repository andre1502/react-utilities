import { useEffect, useRef, useState } from 'react';

type WebSocketRef = WebSocket | null;

interface WebSocketOutput {
  isConnected: boolean;
  isError: boolean;
  connect: (url: string) => void;
  messages: string[];
  clearMessages: () => void;
}

const useWebSocket = (): WebSocketOutput => {
  const pingInterval = 30000; // Default ping every 30 seconds
  const [url, setUrl] = useState('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocketRef>(null);
  const heartbeatIntervalRef = useRef<number>(undefined);

  const connect = (newUrl: string) => {
    if (newUrl && url !== newUrl) {
      setUrl(newUrl);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Connect WebSocket after login
  useEffect(() => {
    if (url) {
      // Open WebSocket connection
      if (socketRef.current === null) {
        socketRef.current = new WebSocket(url);
      } else if (socketRef.current.url !== url) {
        socketRef.current.close();
        socketRef.current = new WebSocket(url);
      }

      socketRef.current.onopen = (event: Event) => {
        // console.log('WebSocket onopen', 'event', event);

        setIsError(false);
        setIsConnected(true);

        heartbeatIntervalRef.current = window.setInterval(() => {
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current?.send('ping');
          }
        }, pingInterval);
      };

      socketRef.current.onmessage = (event: MessageEvent) => {
        console.log('WebSocket onmessage', 'event.data', event.data);

        if (event.data === 'ping') {
          socketRef.current?.send('pong');
          return;
        }

        setTimeout(() => {
          setMessages((prev) => {
            if (!prev.includes(event.data)) {
              prev.push(event.data);
            }

            return prev;
          });
        }, 1000);
      };

      socketRef.current.onerror = (error: Event) => {
        console.error('WebSocket onerror:', 'error', error);

        setIsError(true);
        setIsConnected(false);
      };

      socketRef.current.onclose = (event: CloseEvent) => {
        // console.log('WebSocket onclose', 'event', event);

        if (event.wasClean) {
          // console.log(
          //   `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
          // );
        } else {
          // e.g. server process killed or network down, event.code is usually 1006 in this case
          console.warn(
            `[close] Connection died, code=${event.code} reason=${event.reason}`,
          );

          setIsError(true);
        }

        setIsConnected(false);
      };
    }

    // Cleanup on unmount or logout
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      clearInterval(heartbeatIntervalRef.current);
    };
  }, [url]);

  return { isConnected, isError, connect, messages, clearMessages };
};

export default useWebSocket;
