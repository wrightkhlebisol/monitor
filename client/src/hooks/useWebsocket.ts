import { useEffect, useState } from 'react';
import type { WebSocketState, WSMessage } from '../types';
import { MESSAGE_TYPES, RECONNECT_BASE_DELAY_MS, RECONNECT_MAX_DELAY_MS } from '../constants';

export function useWebsocket(): WebSocketState {
  const [state, setState] = useState<WebSocketState>({
    status: null,
    error: null,
    lastUpdated: null,
    isReconnecting: false,
  })

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let closedByUser = false;

    /**
     * Establishes a WebSocket connection to the server and set up event handlers.
     */
    function connect(): void {
      const isProduction = process.env.NODE_ENV === 'production';
      const wsUrl = isProduction ? `${process.env.HOST}/ws` : 'ws://localhost:8080';

      ws = new WebSocket(wsUrl);

      setState(prev => ({
        ...prev,
        isReconnecting: false
      }))

      ws.onopen = () => {
        setState(prev => ({
          ...prev,
          error: null,
        }));
        reconnectAttempts = 0;
      }

      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);
          if (msg.type === MESSAGE_TYPES.STATUS_UPDATE) {
            setState(prev => ({
              ...prev,
              status: msg.payload,
              lastUpdated: new Date()
            }))
            console.log(msg.payload);
          }
        } catch (err) {
          setState(prev => ({
            ...prev,
            error: 'Invalid message format received from server',
          }))
          console.error('Error parsing WebSocket message:', err);
        }
      }

      ws.onerror = () => {
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error'
        }));
      }

      ws.onclose = () => {
        if (!closedByUser) {
          setState(prev => ({
            ...prev,
            error: 'WebSocket connection closed unexpectedly',
            isReconnecting: true,
          }))

          // Exponential backoff for reconnection attempts
          const delay = Math.min(
            RECONNECT_BASE_DELAY_MS * 2 ** reconnectAttempts, RECONNECT_MAX_DELAY_MS
          );

          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++;
            connect();
          }, delay);
        }
      }
    }

    connect();

    return () => {
      closedByUser = true;
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
    }
  }, [])

  return state;
}