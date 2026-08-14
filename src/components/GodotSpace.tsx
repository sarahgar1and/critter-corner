import React, { useEffect } from 'react';

interface GodotSpaceProps {
  onAvatarSit?: () => void;
}

export const GodotSpace: React.FC<GodotSpaceProps> = ({ onAvatarSit }) => {
  useEffect(() => {
    // Listen for events coming from Godot inside the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'AVATAR_SAT_DOWN') {
        if (onAvatarSit) onAvatarSit();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAvatarSit]);

  return (
    <div style={{
    width: '80vw',      // 80% of screen width
    height: '80vh',     // 80% of screen height
    position: 'relative',
    borderRadius: '16px',
    border: '5px solid #c1884e',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)'
  }}>
    <iframe
      id='critter-area'
      src="/critter-corner/godot/game.html"
      allow="autoplay"
    />
  </div>
  );
};