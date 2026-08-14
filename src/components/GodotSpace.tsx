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
    <iframe
    id='critter-area'
    src="public/godot/game.html"
    allow="autoplay"
    style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '56.25%',
        border: 'none',
        zIndex: 1000,
    }} 
    />
  );
};