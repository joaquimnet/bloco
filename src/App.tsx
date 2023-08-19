import { ChangeEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';

import { play } from './audio/audio';
import { Tips } from './components/tips/Tips';
import { Layout } from './components/layout/Layout';
import { useLocalStorage } from './hooks/use-local-storage.hook';
import { useOnPaste } from './hooks/use-on-paste.hoot';
import { Item } from './items/interface/Item.interface';
import { ImportExportButtons } from './items/exporting/ImportExportButtons';
import { ItemList } from './items/components/ItemList';
import { OptionsMenu } from './items/components/OptionsMenu';
import { ItemInput } from './items/components/ItemInput';

function App() {
  const [text, setText] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [reverse, setReverse] = useState(true);
  const { load, save } = useLocalStorage('bloco');
  const [firstLoadFinished, setFirstLoadFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editItem, setEditItem] = useState<Item | null>();
  const [filter, setFilter] = useState('');
  const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[] | null>(null);
  const [randomlySelectedItem, setRandomlySelectedItem] = useState<Item | null>(null);
  const [showOnlyUnchecked, setShowOnlyUnchecked] = useState(false);
  const { onPaste } = useOnPaste((pastedText) => setText((previous) => `${previous} ${pastedText}`));

  // first render, load items and focus on the text box
  useEffect(() => {
    setItems(load()?.items ?? []);
    setFirstLoadFinished(true);
    inputRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (firstLoadFinished) {
      save({ items });
    }
  }, [items]);

  useEffect(() => {
    if (randomlySelectedItem) {
      setRandomlySelectedItem(null);
    }
  }, [text, reverse]);

  const onItemInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editItem) {
      setItems((tt) => {
        const newItems = tt.map((ttt) => {
          if (ttt.id !== editItem.id) {
            return ttt;
          }
          return { ...ttt, text: e.target.value };
        });

        return newItems;
      });
      (setEditItem as any)((ei: Item) => ({ ...ei, text: e.target.value }));
      return;
    }
    setText(e.target.value);
  };

  const onItemAdded = (e: any) => {
    if (editItem) {
      setEditItem(null);
      play('DING');
      e.preventDefault();
      return;
    }

    setItems((previousItems) => [
      ...previousItems,
      { id: Date.now(), text, checked: false, createdAt: new Date().toISOString() },
    ]);
    e.preventDefault();
    setText('');
    play('DING');
  };

  const onItemCheck = (item: Item) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    play('CHECK');

    if (e.shiftKey) {
      inputRef?.current?.focus();
      setEditItem(item);
      return;
    }

    setItems((it) => it.map((itt) => (itt.id === item.id ? { ...itt, checked: !itt.checked } : itt)));
  };

  const onItemRemove = (item: Item) => (e: any) => {
    e.preventDefault();
    play('REMOVE');
    setItems((it) => it.filter((itt) => itt.id !== item.id));
  };

  const onItemEditingFinished = () => {
    setEditItem(null);
    play('DING');
  };

  const onImageClicked = (src: string) => {
    setLightboxSlides([{ src }]);
  };

  const sortedItems = useMemo(() => {
    let arr = reverse ? [...items].reverse() : items;
    if (filter?.length) {
      arr = arr.filter((item) => item.text.toLowerCase().includes(filter.toLowerCase()));
    }
    if (showOnlyUnchecked) {
      arr = arr.filter((item) => !item.checked);
    }
    return arr;
  }, [reverse, items, filter, showOnlyUnchecked]);

  const itemsEligibleForRandomSelection = useMemo(() => {
    return sortedItems.filter((item) => !item.checked);
  }, [sortedItems]);

  const pickRandomly = () => {
    if (itemsEligibleForRandomSelection.length) {
      setRandomlySelectedItem(
        itemsEligibleForRandomSelection[Math.floor(Math.random() * itemsEligibleForRandomSelection.length)],
      );
    }
    play('DING');
  };

  const onClearFilter = () => {
    setFilter('');
  };

  return (
    <Layout>
      <ItemInput
        value={editItem ? editItem.text : text}
        onChange={onItemInputChange}
        onPaste={onPaste}
        onItemAdded={onItemAdded}
        isEditing={!!editItem}
        onItemEditingFinished={onItemEditingFinished}
        inputRef={inputRef}
      />
      <OptionsMenu
        filter={filter}
        setFilter={setFilter}
        reverse={reverse}
        setReverse={setReverse}
        showOnlyUnchecked={showOnlyUnchecked}
        setShowOnlyUnchecked={setShowOnlyUnchecked}
        pickRandomly={pickRandomly}
        onClearFilter={onClearFilter}
      />
      <hr />
      <ItemList
        items={sortedItems}
        editItem={editItem}
        randomlySelectedItem={randomlySelectedItem}
        onItemCheck={onItemCheck}
        onItemRemove={onItemRemove}
        onImageClicked={onImageClicked}
      />
      <Lightbox
        open={Number(lightboxSlides?.length) > 0}
        close={() => setLightboxSlides(null)}
        slides={lightboxSlides!}
      />
      <ImportExportButtons items={sortedItems} setItems={setItems} />
      <Tips items={items} text={text} />
    </Layout>
  );
}

export default App;
