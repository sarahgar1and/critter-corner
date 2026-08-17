import React, { useEffect } from 'react';

interface GodotSpaceProps {
  onAvatarSit?: () => void;
  onEnterSession: () => void;
  inSession : boolean;
  hidden?: boolean;
  focused?: boolean;
}

export const GodotSpace: React.FC<GodotSpaceProps> = ({ onAvatarSit, onEnterSession, inSession, hidden, focused }) => {
  useEffect(() => {
    // Listen for events coming from Godot inside the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'AVATAR_SAT_DOWN') {
        if (onAvatarSit) onAvatarSit();
      }
      else if (event.data?.type === 'ENTER_ROOM'){
        if (onEnterSession) onEnterSession();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAvatarSit, onEnterSession]);

  return (
    <div
      className={`canvas-container ${inSession ? 'in-session' : ''} ${
        focused ? 'room-stage' : ''
      } ${hidden ? 'godot-hidden' : ''}`}
    >
      <iframe
        id='canvas'
        src="/critter-corner/godot/game.html"
        allow="autoplay"
      />
    </div>
  );
};