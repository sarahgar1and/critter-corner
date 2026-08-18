import { useState } from 'react';
import { CATS, catImage, type Profile } from '../profile';

interface ProfileSetupProps {
  onDone: (profile: Profile) => void;
  onBack: () => void;
  initial?: Profile | null;
  /** 'edit' reopens the form over a live session, so it reads as a change rather than onboarding */
  mode?: 'create' | 'edit';
}

const NAME_MAX = 16;

export const ProfileSetup = ({ onDone, onBack, initial, mode = 'create' }: ProfileSetupProps) => {
  const [name, setName] = useState<string>(initial?.name ?? '');
  const [cat, setCat] = useState<string>(initial?.cat ?? CATS[0]);
  const [studying, setStudying] = useState<string>(initial?.studying ?? '');

  const trimmed = name.trim();

  const submit = (event: React.SubmitEvent) => {
    event.preventDefault();
    if (!trimmed) return;
    onDone({ name: trimmed, cat, studying: studying.trim() });
  };

  const editing = mode === 'edit';

  return (
    <div className={`screen ${editing ? 'screen-overlay' : ''}`}>
      <form className="screen-panel profile-panel" onSubmit={submit}>
        <h2 className="pixel-font screen-title profile-title">
          {editing ? 'edit your critter' : 'make your critter'}
        </h2>

        <div className="profile-preview">
          <img className="cat-sprite preview-cat" src={catImage(cat)} alt={`${cat} cat`} />
          <span className="pixel-font preview-name">{trimmed || 'unnamed'}</span>
        </div>

        <label className="field">
          <span className="pixel-font field-label">name</span>
          <input
            className="pixel-font field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={NAME_MAX}
            placeholder="critter"
            autoFocus
          />
        </label>

        <fieldset className="field cat-field">
          <legend className="pixel-font field-label">pick a critter</legend>
          <div className="cat-grid">
            {CATS.map((option) => (
              <button
                key={option}
                type="button"
                className={`cat-swatch ${option === cat ? 'selected' : ''}`}
                onClick={() => setCat(option)}
                aria-label={option}
                aria-pressed={option === cat}
              >
                <img className="cat-sprite" src={catImage(option)} alt="" />
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span className="pixel-font field-label">studying (optional)</span>
          <input
            className="pixel-font field-input"
            value={studying}
            onChange={(e) => setStudying(e.target.value)}
            maxLength={32}
            placeholder="orgo problem set"
          />
        </label>

        <div className="screen-actions">
          <button className="pixel-font big-button" type="submit" disabled={!trimmed}>
            {editing ? 'save changes' : 'enter the corner'}
          </button>
          <button className="pixel-font text-button" type="button" onClick={onBack}>
            {editing ? 'cancel' : 'back'}
          </button>
        </div>
      </form>
    </div>
  );
};
