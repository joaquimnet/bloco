import { FC } from 'react';
import classNames from 'classnames';

import styles from './OptionsMenu.module.css';

type Props = {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  reverse: boolean;
  setReverse: React.Dispatch<React.SetStateAction<boolean>>;
  showOnlyUnchecked: boolean;
  setShowOnlyUnchecked: React.Dispatch<React.SetStateAction<boolean>>;
  pickRandomly: () => void;
  onClearFilter: () => void;
};

export const OptionsMenu: FC<Props> = ({
  filter,
  setFilter,
  reverse,
  setReverse,
  showOnlyUnchecked,
  setShowOnlyUnchecked,
  pickRandomly,
  onClearFilter,
}) => {
  return (
    <div className={styles.OptionsMenu}>
      <input
        type="text"
        onChange={(e) => setFilter(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClearFilter();
          }
        }}
        value={filter}
        className={styles.FilterInput}
        placeholder="filter items here..."
      />
      <div>
        <button
          className={classNames(styles.Button, { [styles.active]: reverse })}
          onClick={() => setReverse((r) => !r)}
        >
          ▲▼
        </button>
        <button
          className={classNames(styles.Button, { [styles.active]: showOnlyUnchecked })}
          onClick={() => setShowOnlyUnchecked((r) => !r)}
        >
          ☑️
        </button>
        <button className={styles.Button} onClick={pickRandomly}>
          🎲
        </button>
      </div>
    </div>
  );
};
