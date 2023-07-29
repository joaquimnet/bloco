import { useMemo, useState } from 'react';
import { Modal } from '../components/modal/Modal';
import { play } from '../audio/audio';
import { Item } from '../interface/Item';
import { ImportTextArea } from './ImportTextArea';

type Props = {
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

export const Importer = (props: Props) => {
  const [content, setContent] = useState('');
  const [show, setShow] = useState(false);

  const parsedContent = useMemo<{ items: Item[] } | null>(() => {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }, [content]);

  const isValid = useMemo(() => !!parsedContent?.items?.length, [parsedContent]);

  const onImport = () => {
    play('DING');
    props.setItems((items) => {
      const newItems = [...items];

      for (const importingItem of parsedContent!.items) {
        if (newItems.some((it) => it.id === importingItem.id)) {
          continue;
        }
        const newItem: Item = {
          id: importingItem.id || Date.now(),
          checked: importingItem.checked ?? false,
          text: importingItem.text,
          createdAt: importingItem.createdAt || new Date().toISOString(),
        };
        newItems.push(newItem);
      }

      return newItems;
    });
  };

  return (
    <>
      <Modal show={show} onClose={() => setShow(false)}>
        <ImportTextArea value={content} setContent={setContent} />
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            background: isValid ? 'rgba(50,50,255,0.1)' : 'rgba(255,50,50,0.1)',
          }}
        >
          {isValid ? `Ready to import ${parsedContent?.items.length} items` : 'Format invalid or nothing to import'}
        </div>
        <button style={{ width: '80%' }} onClick={onImport} disabled={!isValid}>
          IMPORT
        </button>
      </Modal>
      <button onClick={() => setShow(true)}>Importer</button>
    </>
  );
};
