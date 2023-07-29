import styles from './Backdrop.module.css';

interface Props {
  onClick: () => void;
  children?: React.ReactNode;
}

export const Backdrop = (props: Props) => {
  return (
    <div className={styles.Backdrop} onClick={props.onClick}>
      {props.children}
    </div>
  );
};
