import React from 'react';
import styles from './Modal.module.css';
import { Backdrop } from '../backdrop/Backdrop';

type Props = {
  children?: React.ReactNode;
  show: boolean;
  onClose: () => void;
};

export const Modal = (props: Props) => {
  if (!props.show) {
    return null;
  }
  return (
    <Backdrop onClick={props.onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </Backdrop>
  );
};
