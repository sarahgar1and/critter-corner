import { useState } from 'react';
import { GodotSpace } from './components/GodotSpace';
import "@fontsource/silkscreen";

export default function App() {
  const [isFocusing, setIsFocusing] = useState(false);

  return (
    <>
      <h1 className="pixel-font center-text">Critter Corner</h1>
      <main>
        <GodotSpace onAvatarSit={() => console.log('Avatar sat down in 2D world!')} />
      </main>
    </>
  );
}