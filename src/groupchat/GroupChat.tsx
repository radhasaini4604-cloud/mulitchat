import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { RoomView } from './components/RoomView/RoomView';
import './GroupChat.css';

export default function GroupChat() {
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('room');
  });

  // Listen to popstate changes to support browser back/forward buttons
  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveRoomCode(params.get('room'));
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const handleJoinRoom = (code: string) => {
    setActiveRoomCode(code);
    window.history.pushState({}, '', `/groupchat?room=${code}`);
  };

  const handleLeaveRoom = () => {
    setActiveRoomCode(null);
    window.history.pushState({}, '', '/groupchat');
  };

  if (activeRoomCode) {
    return <RoomView roomCode={activeRoomCode} onLeave={handleLeaveRoom} />;
  }

  return <Dashboard onJoinRoom={handleJoinRoom} />;
}
