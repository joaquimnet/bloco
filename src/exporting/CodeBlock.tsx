import React from 'react';

import styles from './CodeBlock.module.css';

type Props = {
  children: React.ReactNode;
};

export const CodeBlock = (props: Props) => {
  return <pre className={styles.CodeBlock}>{props.children}</pre>;
};
