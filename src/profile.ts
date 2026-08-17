export interface Profile {
  name: string;
  cat: string;
  studying: string;
}

/** Avatar frames extracted from the Tiny Cat spritesheets into public/cats. */
export const CATS = [
  'orange',
  'black',
  'brown',
  'calico',
  'creme',
  'grey',
  'tan',
  'white',
  'greyscale',
  'hairless',
  'cottoncandy',
  'retrogreen',
  'ghost',
] as const;

export const catImage = (cat: string) => `${import.meta.env.BASE_URL}cats/${cat}.png`;

const STORAGE_KEY = 'critter-corner:profile';

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Profile>;
    if (!parsed.name || !parsed.cat) return null;
    return { name: parsed.name, cat: parsed.cat, studying: parsed.studying ?? '' };
  } catch {
    // Corrupt or unavailable storage should just look like a first visit
    return null;
  }
}

export function saveProfile(profile: Profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Profile is nice-to-have; keep the session going without it
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
