import { useEffect, useState } from 'react';

const PRESETS = [
  { label: 'focus', minutes: 25 },
  { label: 'deep', minutes: 50 },
  { label: 'break', minutes: 5 },
];

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const StudyTimer = () => {
  const [duration, setDuration] = useState<number>(PRESETS[0].minutes * 60);
  const [remaining, setRemaining] = useState<number>(PRESETS[0].minutes * 60);
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!running) return;

    // Track a deadline instead of decrementing, so a throttled
    // background tab doesn't make the timer drift
    const deadline = Date.now() + remaining * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) setRunning(false);
    }, 250);

    return () => clearInterval(id);
    // `remaining` is read once when the run starts; re-running on every
    // tick would reset the deadline
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const selectPreset = (minutes: number) => {
    setRunning(false);
    setDuration(minutes * 60);
    setRemaining(minutes * 60);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(duration);
  };

  const finished = remaining === 0;

  return (
    <div className="control-bar timer-bar">
      <span className={`pixel-font timer-readout ${finished ? 'timer-done' : ''}`}>
        {formatTime(remaining)}
      </span>

      <div className="control-group">
        <button
          className="pixel-font control-button"
          onClick={() => setRunning((isRunning) => !isRunning)}
          disabled={finished}
        >
          {running ? 'pause' : 'start'}
        </button>

        <button
          className="pixel-font control-button"
          onClick={reset}
          disabled={!finished && remaining === duration}
        >
          reset
        </button>
      </div>

      <div className="control-group">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            className={`pixel-font control-button ${
              duration === preset.minutes * 60 ? 'control-button-active' : ''
            }`}
            onClick={() => selectPreset(preset.minutes)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};
