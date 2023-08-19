import React, { FC } from 'react';

import styles from './ItemInput.module.css';

type Props = {
  onItemAdded: (e: any) => void;
  isEditing: boolean;
  onItemEditingFinished: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
};

export const ItemInput: FC<Props> = ({
  value,
  onChange,
  onItemAdded,
  isEditing,
  onItemEditingFinished,
  inputRef,
  onPaste,
}) => {
  return (
    <form onSubmit={onItemAdded}>
      <input
        type="text"
        onChange={onChange}
        onPaste={onPaste}
        onKeyDown={(e) => {
          if (isEditing && e.key === 'Escape') {
            onItemEditingFinished();
          }
        }}
        value={value}
        ref={inputRef}
        className={styles.ItemInput}
      />
    </form>
  );
};
