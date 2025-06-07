import { useState, useEffect } from 'react';
import { MESSAGE_TYPES, RECONNECT_BASE_DELAY_MS, RECONNECT_MAX_DELAY_MS } from './constants/constants';
import type { WSMessage, StatusMap } from './types';
// import './App.css'

function App() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [reconnecting, setReconnecting] = useState<boolean>(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusMap | null>(null)
  
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    let reconnectTimeout: NodeJS.Timeout | null = null
    let closedByUser = false;

    /**
     * Establishes a WebSocket connection to the server and set up event handlers.
     */
    function connect() {
      const isProduction = process.env.NODE_ENV === 'production';
      const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
      const wsUrl = isProduction ? `${wsProtocol}//${window.location.hostname}:8080` : 'ws://localhost:8080';

      ws = new WebSocket(wsUrl);
      setReconnecting(false);

      ws.onopen = () => {
        setWsError(null);
        reconnectAttempts = 0;
      }

      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);
          if (msg.type === MESSAGE_TYPES.STATUS_UPDATE) {
            setStatus(msg.payload);
            console.log(msg.payload)
            setLastUpdated(new Date());
          }
        } catch (err) {
          setWsError('Invalid message format received from server');
          console.error('Error parsing WebSocket message:', err);
        }
      }

      ws.onerror = () => {
        setWsError('WebSocket connection error');
      }

      ws.onclose = () => { 
        if (!closedByUser) {
          setWsError("WebSocket connection closed unexpectedly");
          setReconnecting(true);
          // Exponential backoff for reconnection attempts
          const delay = Math.min(RECONNECT_BASE_DELAY_MS * 2 ** reconnectAttempts, RECONNECT_MAX_DELAY_MS);
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
  

  return (
    <div className="app">
      <h1>Region Status Dashboard</h1>
      {/* Last Updated Timestamp */}
      {lastUpdated && (
        <div className="lastUpdated">
          Last Updated: {lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  )
}

export default App
