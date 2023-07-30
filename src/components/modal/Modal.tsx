import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';
import { Backdrop } from '../backdrop/Backdrop';

type Props = {
  children?: React.ReactNode;
  show: boolean;
  onClose: () => void;
};

export const Modal = (props: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.show) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [props.show]);

  if (!props.show) {
    return null;
  }

  return (
    <Backdrop onClick={props.onClose}>
      <div
        ref={modalRef}
        className={styles.Modal}
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            props.onClose();
          }
        }}
      >
        {props.children}
      </div>
    </Backdrop>
  );
};
