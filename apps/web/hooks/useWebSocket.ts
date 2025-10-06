'use client';

import { useEffect, useState, useRef } from 'react';

interface EvolutionEvent {
  type: string;
  timestamp: number;
  [key: string]: any;
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<EvolutionEvent[]>([]);
  const [latency, setLatency] = useState<number>(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('🔌 Connected to EvoForge API');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Calculate latency for ping/pong
        if (data.type === 'pong') {
          const now = Date.now();
          setLatency(now - data.timestamp);
          return;
        }

        // Add event to history
        setEvents((prev) => [...prev, data]);
        
        console.log('📨 Evolution event:', data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('🔌 Disconnected from EvoForge API');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    // Send ping every 5 seconds
    const pingInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 5000);

    // Cleanup
    return () => {
      clearInterval(pingInterval);
      ws.current?.close();
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  };

  const subscribe = (evolutionId: string) => {
    sendMessage({ type: 'subscribe', evolutionId });
  };

  return {
    isConnected,
    events,
    latency,
    sendMessage,
    subscribe,
  };
}
