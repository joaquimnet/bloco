import React from 'react';
import { Item } from '../interface/Item.interface';
import { Exporter } from './exporter/Exporter';
import { Importer } from './importer/Importer';

import styles from './ImportExportButtons.module.css';

type Props = {
  items: object[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

export const ImportExportButtons = (props: Props) => {
  return (
    <div className={styles.ImportExportButtons}>
      <Importer setItems={props.setItems} />
      <Exporter items={props.items} />
    </div>
  );
};
