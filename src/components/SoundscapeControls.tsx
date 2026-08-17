import { useEffect, useRef, useState } from 'react';

// Playback isn't wired up yet — these only track which soundscape is selected
const SOUNDSCAPES = [
  { id: 'rain', icon: '🌧️', label: 'rain' },
  { id: 'forest', icon: '🌲', label: 'forest' },
  { id: 'cafe', icon: '☕', label: 'cafe' },
  { id: 'waves', icon: '🌊', label: 'waves' },
];

export const SoundscapeControls = () => {
  const [active, setActive] = useState<string | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selected = SOUNDSCAPES.find((sound) => sound.id === active);
  const playing = selected && !muted;

  return (
    <div className="sound-menu" ref={wrapperRef}>
      {open ? (
        <div className="sound-popup">
          {SOUNDSCAPES.map((sound) => (
            <button
              key={sound.id}
              className={`pixel-font sound-option ${
                active === sound.id ? 'control-button-active' : ''
              }`}
              onClick={() => setActive((current) => (current === sound.id ? null : sound.id))}
              aria-pressed={active === sound.id}
            >
              <span className="sound-icon">{sound.icon}</span>
              {sound.label}
            </button>
          ))}

          <button
            className="pixel-font sound-option"
            onClick={() => setMuted((isMuted) => !isMuted)}
            aria-pressed={muted}
          >
            <span className="sound-icon">{muted ? '🔇' : '🔊'}</span>
            {muted ? 'unmute' : 'mute'}
          </button>
        </div>
      ) : null}

      <button
        className={`pixel-font control-button ${playing ? 'control-button-active' : ''}`}
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {playing ? `${selected.icon} ${selected.label}` : 'sounds'} ▴
      </button>
    </div>
  );
};
