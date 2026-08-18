import React, { useEffect, useRef, useState } from 'react';

interface GodotSpaceProps {
  onAvatarSit?: () => void;
  onEnterSession: () => void;
  inSession : boolean;
  hidden?: boolean;
  focused?: boolean;
  /** Which cat spritesheet the avatar should wear, from the saved profile */
  cat?: string;
}

export const GodotSpace: React.FC<GodotSpaceProps> = ({ onAvatarSit, onEnterSession, inSession, hidden, focused, cat }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // The WASM build boots well after the iframe mounts, so wait for Godot to say hello
  const [godotReady, setGodotReady] = useState<boolean>(false);

  useEffect(() => {
    // Listen for events coming from Godot inside the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'AVATAR_SAT_DOWN') {
        if (onAvatarSit) onAvatarSit();
      }
      else if (event.data?.type === 'ENTER_ROOM'){
        if (onEnterSession) onEnterSession();
      }
      else if (event.data?.type === 'GODOT_READY'){
        setGodotReady(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAvatarSit, onEnterSession]);

  useEffect(() => {
    if (!godotReady || !cat) return;
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_CHARACTER', cat }, '*');
  }, [godotReady, cat]);

  return (
    <div
      className={`canvas-container ${inSession ? 'in-session' : ''} ${
        focused ? 'room-stage' : ''
      } ${hidden ? 'godot-hidden' : ''}`}
    >
      <iframe
        id='canvas'
        ref={iframeRef}
        src="/critter-corner/godot/game.html"
        allow="autoplay"
      />
    </div>
  );
};