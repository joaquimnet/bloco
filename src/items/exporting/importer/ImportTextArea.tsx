import React from 'react';

import styles from './ImportTextArea.module.css';

type Props = {
  value: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

export const ImportTextArea = (props: Props) => {
  return (
    <textarea
      className={styles.ImportTextArea}
      value={props.value}
      onChange={(e) => props.setContent(e.target.value)}
    />
  );
};
