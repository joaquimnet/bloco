import { FC } from 'react';
import classNames from 'classnames';
import Twemoji from 'react-twemoji';

import { applySubstitutions } from '../content-processing/substitutions';
import { Item } from '../interface/Item.interface';
import { extractEmbeds } from '../content-processing/embeds';
import { LinkList } from './LinkList';
import { ImageList } from './ImageList';
import styles from './ItemList.module.css';

type Props = {
  items: Item[];
  editItem?: Item | null;
  randomlySelectedItem: Item | null;
  onItemCheck: (item: Item) => (e: any) => void;
  onItemRemove: (item: Item) => (e: any) => void;
  onImageClicked: (src: string) => void;
};

export const ItemList: FC<Props> = ({
  items,
  editItem,
  randomlySelectedItem,
  onItemCheck,
  onItemRemove,
  onImageClicked,
}) => {
  return (
    <div className={styles.Items}>
      {items.map((item) => {
        const { text, links, images } = extractEmbeds(item.text);
        return (
          <div
            key={item.id}
            className={classNames(styles.Item, {
              [styles.checked]: item.checked,
              [styles.editing]: item.id === editItem?.id,
              [styles.random]: item.id === randomlySelectedItem?.id,
            })}
            onClick={onItemCheck(item)}
            onContextMenu={onItemRemove(item)}
          >
            <Twemoji options={{ className: styles.Twemoji }}>
              <span>➜ {applySubstitutions(text)}</span>
            </Twemoji>
            <LinkList links={links} />
            <ImageList images={images} onImageClicked={onImageClicked} />
          </div>
        );
      })}
    </div>
  );
};
