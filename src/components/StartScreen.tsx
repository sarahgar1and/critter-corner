import { CATS, catImage } from '../profile';

interface StartScreenProps {
  onStart: () => void;
  /** Present when a profile already exists, so returning critters can walk straight in */
  returningName?: string;
  onContinue?: () => void;
}

const PARADE = ['orange', 'black', 'calico', 'grey', 'creme'];

const BLURBS = [
  ['camera on', 'quiet accountability, no small talk'],
  ['your corner', 'wander a soft pixel study space'],
  ['stay put', 'timers, soundscapes, and nothing else'],
];

export const StartScreen = ({ onStart, returningName, onContinue }: StartScreenProps) => (
  <div className="screen">
    <div className="screen-panel start-panel">
      <p className="pixel-font screen-kicker">a quiet place to study together</p>
      <h1 className="pixel-font screen-title">Critter Corner</h1>

      <div className="cat-parade">
        {PARADE.map((cat) => (
          <img key={cat} className="cat-sprite parade-cat" src={catImage(cat)} alt="" />
        ))}
      </div>

      <ul className="blurb-list">
        {BLURBS.map(([heading, detail]) => (
          <li key={heading} className="blurb">
            <span className="pixel-font blurb-heading">{heading}</span>
            <span className="pixel-font blurb-detail">{detail}</span>
          </li>
        ))}
      </ul>

      <div className="screen-actions">
        {returningName && onContinue ? (
          <>
            <button className="pixel-font big-button" onClick={onContinue}>
              welcome back, {returningName}
            </button>
            <button className="pixel-font text-button" onClick={onStart}>
              start over
            </button>
          </>
        ) : (
          <button className="pixel-font big-button" onClick={onStart}>
            start demo
          </button>
        )}
      </div>

      <p className="pixel-font screen-footnote">
        {CATS.length} critters to choose from · arrow keys to roam
      </p>
    </div>
  </div>
);
