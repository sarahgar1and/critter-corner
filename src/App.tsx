import { useState } from 'react';
import "@fontsource/silkscreen";
import { GodotSpace } from './components/GodotSpace';
import { SessionRoom } from './components/SessionRoom'
import { StartScreen } from './components/StartScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { catImage, clearProfile, loadProfile, saveProfile, type Profile } from './profile';

type Stage = 'start' | 'profile' | 'space';
// 'streams': video grid fills the room, Godot in the corner
// 'room': Godot centered as the stage, video streams in a side column
export type SessionLayout = 'streams' | 'room';

export default function App() {
  const [saved] = useState<Profile | null>(() => loadProfile());
  const [profile, setProfile] = useState<Profile | null>(saved);
  const [stage, setStage] = useState<Stage>('start');
  const [inSession, setInSession] = useState<boolean>(false);
  // Hidden with CSS rather than unmounted, so the game keeps its state
  const [godotVisible, setGodotVisible] = useState<boolean>(true);
  const [layout, setLayout] = useState<SessionLayout>('streams');
  // Edits open over the space so the Godot iframe and camera stream keep running
  const [editing, setEditing] = useState<boolean>(false);

  const startFresh = () => {
    clearProfile();
    setProfile(null);
    setStage('profile');
  };

  const finishProfile = (next: Profile) => {
    saveProfile(next);
    setProfile(next);
    setStage('space');
  };

  const saveEdit = (next: Profile) => {
    saveProfile(next);
    setProfile(next);
    setEditing(false);
  };

  if (stage === 'start') {
    return (
      <StartScreen
        onStart={startFresh}
        returningName={saved?.name}
        onContinue={saved ? () => setStage('space') : undefined}
      />
    );
  }

  if (stage === 'profile') {
    return (
      <ProfileSetup
        onDone={finishProfile}
        onBack={() => setStage('start')}
        initial={profile}
      />
    );
  }

  return (
    <>
      <header className="app-header">
        <h1 className="pixel-font center-text">Critter Corner</h1>
        {profile ? (
          <button
            className="pixel-font profile-chip"
            onClick={() => setEditing(true)}
            aria-label={`Edit profile for ${profile.name}`}
          >
            <img className="cat-sprite chip-cat" src={catImage(profile.cat)} alt="" />
            <span className="chip-name">{profile.name}</span>
            <span className="chip-edit">edit</span>
          </button>
        ) : null}
      </header>
      <main>
        { inSession ?
            <SessionRoom
              profile={profile}
              onLeave={() => setInSession(false)}
              onEditProfile={() => setEditing(true)}
              godotVisible={godotVisible}
              onToggleGodot={() => setGodotVisible((visible) => !visible)}
              layout={layout}
              onToggleLayout={() =>
                setLayout((current) => (current === 'room' ? 'streams' : 'room'))
              }
            /> : null
          }
          <GodotSpace
            onEnterSession={() => setInSession(true)}
            cat={profile?.cat}
            inSession = {inSession}
            hidden={inSession && !godotVisible}
            focused={inSession && godotVisible && layout === 'room'}
          />
          
      </main>
      { editing ?
        <ProfileSetup
          mode="edit"
          initial={profile}
          onDone={saveEdit}
          onBack={() => setEditing(false)}
        /> : null
      }
    </>
  );
}
