import { useState } from 'react';
import { GodotSpace } from './components/GodotSpace';

export default function App() {
  const [isFocusing, setIsFocusing] = useState(false);

  return (
    <div>
      <main>
        <GodotSpace onAvatarSit={() => console.log('Avatar sat down in 2D world!')} />
      </main>
      
    </div>
  );
}