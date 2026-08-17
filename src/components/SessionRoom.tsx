import { useState } from 'react';
import { UserVideoInput } from './UserVideoInput';
import { StudyTimer } from './StudyTimer';
import { SoundscapeControls } from './SoundscapeControls';
import { catImage, type Profile } from '../profile';
import type { SessionLayout } from '../App';

interface Participant {
  id: string;
  name: string;
  critter: string;
}

// Placeholder roster until real peer connections exist
const PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'mossy', critter: '🐈' },
  { id: 'p2', name: 'pebble', critter: '🐈‍⬛' },
  { id: 'p3', name: 'juniper', critter: '🐿️' },
  { id: 'p4', name: 'clover', critter: '🐇' },
  { id: 'p5', name: 'acorn', critter: '🦔' },
  { id: 'p6', name: 'willow', critter: '🦉' },
  { id: 'p7', name: 'birch', critter: '🐢' },
  { id: 'p8', name: 'fern', critter: '🦊' },
];

// Counts include the user's own tile, which always holds the first slot
const MIN_VISIBLE = 2;
const MAX_VISIBLE = PARTICIPANTS.length + 1;

interface SessionRoomProps {
  onLeave: () => void;
  profile: Profile | null;
  onEditProfile: () => void;
  godotVisible: boolean;
  onToggleGodot: () => void;
  layout: SessionLayout;
  onToggleLayout: () => void;
}

export const SessionRoom = ({
  onLeave,
  profile,
  onEditProfile,
  godotVisible,
  onToggleGodot,
  layout,
  onToggleLayout,
}: SessionRoomProps) => {
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [page, setPage] = useState<number>(0);
  // Unmounting UserVideoInput releases the camera, so the hardware light goes out
  const [cameraOn, setCameraOn] = useState<boolean>(true);

  const perPage = visibleCount - 1;
  const pageCount = Math.ceil(PARTICIPANTS.length / perPage);
  // Clamp in case visibleCount grew and left us past the last page
  const currentPage = Math.min(page, pageCount - 1);
  const start = currentPage * perPage;
  const shown = PARTICIPANTS.slice(start, start + perPage);

  // Square-ish grid so tiles stay large at low counts; a single column
  // when the streams are stacked beside the centered Godot stage
  const roomFocused = layout === 'room' && godotVisible;
  const columns = roomFocused ? 1 : Math.ceil(Math.sqrt(visibleCount));
  // minmax(0, ...) rather than a bare 1fr: 1fr keeps an automatic minimum,
  // so the camera's intrinsic size would stretch its track and leave the
  // self tile taller than the placeholders
  const gridColumns = `repeat(${columns}, minmax(0, 1fr))`;

  const changeVisible = (delta: number) => {
    const next = Math.min(MAX_VISIBLE, Math.max(MIN_VISIBLE, visibleCount + delta));
    setVisibleCount(next);
    setPage(0);
  };

  return (
    <div
      className={`session-room ${godotVisible ? '' : 'no-godot'} ${
        roomFocused ? 'room-focus' : ''
      }`}
    >
      <StudyTimer />

      <div
        className="stream-grid"
        style={{ gridTemplateColumns: gridColumns }}
      >
        <div className="stream-tile self-tile">
          {cameraOn ? (
            <UserVideoInput className="tile-video" />
          ) : (
            <div className="pixel-font camera-off-placeholder">camera off</div>
          )}
          {profile ? (
            <button
              className="self-tag"
              onClick={onEditProfile}
              aria-label={`Edit profile for ${profile.name}`}
            >
              <img className="cat-sprite self-cat" src={catImage(profile.cat)} alt="" />
              <span className="pixel-font self-name">{profile.name}</span>
              {profile.studying ? (
                <span className="pixel-font self-studying">{profile.studying}</span>
              ) : null}
              <span className="pixel-font chip-edit">edit</span>
            </button>
          ) : null}
        </div>

        {shown.map((participant) => (
          <div className="stream-tile" key={participant.id}>
            <span className="stream-critter">{participant.critter}</span>
            <span className="pixel-font stream-name">{participant.name}</span>
          </div>
        ))}
      </div>

      <div className="control-bar stream-bar">
        <div className="control-group">
          <span className="pixel-font control-label">streams</span>
          <button
            className="pixel-font control-button"
            onClick={() => changeVisible(-1)}
            disabled={visibleCount <= MIN_VISIBLE}
            aria-label="Show fewer streams"
          >
            −
          </button>
          <span className="pixel-font control-count">{visibleCount}</span>
          <button
            className="pixel-font control-button"
            onClick={() => changeVisible(1)}
            disabled={visibleCount >= MAX_VISIBLE}
            aria-label="Show more streams"
          >
            +
          </button>
        </div>

        <div className="control-group">
          <button
            className="pixel-font control-button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 0}
            aria-label="Previous page of streams"
          >
            ‹
          </button>
          <span className="pixel-font control-count">
            {currentPage + 1}/{pageCount}
          </span>
          <button
            className="pixel-font control-button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
            aria-label="Next page of streams"
          >
            ›
          </button>
        </div>

        <div className="control-group">
          <button
            className={`pixel-font control-button ${godotVisible ? '' : 'control-button-off'}`}
            onClick={onToggleGodot}
            aria-pressed={godotVisible}
          >
            {godotVisible ? 'hide room' : 'show room'}
          </button>
          <button
            className={`pixel-font control-button ${roomFocused ? 'control-button-active' : ''}`}
            onClick={onToggleLayout}
            disabled={!godotVisible}
            title={godotVisible ? undefined : 'Show the room first'}
            aria-pressed={roomFocused}
          >
            {roomFocused ? 'center streams' : 'center room'}
          </button>
          <button
            className={`pixel-font control-button ${cameraOn ? '' : 'control-button-off'}`}
            onClick={() => setCameraOn((on) => !on)}
            aria-pressed={cameraOn}
          >
            {cameraOn ? 'camera off' : 'camera on'}
          </button>
        </div>

        <SoundscapeControls />

        <button className="pixel-font control-button leave-button" onClick={onLeave}>
          return
        </button>
      </div>
    </div>
  );
};
