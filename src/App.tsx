import { ChangeEvent, ClipboardEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import Lightbox from 'yet-another-react-lightbox';
import Twemoji from 'react-twemoji';

import './App.css';
import { useLocalStorage } from './use-local-storage.hook';
import { play } from './audio/audio';
import { Tips } from './components/tips/Tips';
import { Item } from './interface/Item';
import { ImportExportButtons } from './exporting/ImportExportButtons';

const EMOJI_SUBSTITUTIONS = {
  'note: ': '📝 ',
  'bloco: ': '⬛ ',
  'idea: ': '💡',
};

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

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const onSubmit = (e: any) => {
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

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (const index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        e.preventDefault();
        const blob = item.getAsFile()!;
        const reader = new FileReader();
        reader.onload = (ev) => setText((t) => `${t} ${ev.target!.result}`);
        reader.readAsDataURL(blob);
      }
    }
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

  return (
    <div id="container">
      <h1>Bloco</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          onPaste={onPaste}
          onKeyDown={(e) => {
            if (editItem && e.key === 'Escape') {
              setEditItem(null);
              play('DING');
            }
          }}
          value={editItem ? editItem.text : text}
          ref={inputRef}
          className="item-input"
        />
      </form>
      <div className="options-menu">
        <input
          type="text"
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setFilter('');
            }
          }}
          value={filter}
          className="filter-input"
          placeholder="filter items here..."
        />
        <div>
          <button
            className={classNames({ active: reverse })}
            style={{ margin: '0 0.25rem' }}
            onClick={() => setReverse((r) => !r)}
          >
            ▲▼
          </button>
          <button
            className={classNames({ active: showOnlyUnchecked })}
            style={{ margin: '0 0.25rem' }}
            onClick={() => setShowOnlyUnchecked((r) => !r)}
          >
            ☑️
          </button>
          <button
            style={{ margin: '0 0.25rem' }}
            onClick={() => {
              if (itemsEligibleForRandomSelection.length) {
                setRandomlySelectedItem(
                  itemsEligibleForRandomSelection[Math.floor(Math.random() * itemsEligibleForRandomSelection.length)],
                );
              }
              play('DING');
            }}
          >
            🎲
          </button>
        </div>
      </div>
      <hr />
      <div className="items">
        {sortedItems.map((item, i) => {
          const { text, links, images } = placeEmbeds(item.text);
          return (
            <div
              key={item.id}
              className={classNames('item', {
                checked: item.checked,
                editing: item.id === editItem?.id,
                random: item.id === randomlySelectedItem?.id,
              })}
              onClick={onItemCheck(item)}
              onContextMenu={onItemRemove(item)}
            >
              <Twemoji options={{ className: 'twemoji' }}>
                <span>➜ {applySubstitutions(text)}</span>
              </Twemoji>
              {!!links.length &&
                links.map((l, ii) => (
                  <span key={`item-${i}-link-${ii}`}>
                    🔗
                    <a
                      href={l}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      onContextMenu={(e) => e.stopPropagation()}
                    >
                      {l.replace(/(https?:\/\/|www\.)/g, '').substring(0, 25)}...
                    </a>
                    <br />
                  </span>
                ))}
              {!!images.length &&
                images.map((img, ii) => (
                  <span key={`item-${i}-img-${ii}`}>
                    <img
                      src={img}
                      onContextMenu={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        setLightboxSlides([{ src: img }]);
                      }}
                    />
                  </span>
                ))}
            </div>
          );
        })}
      </div>
      <Lightbox
        open={Number(lightboxSlides?.length) > 0}
        close={() => setLightboxSlides(null)}
        slides={lightboxSlides!}
      />
      <ImportExportButtons items={sortedItems} setItems={setItems} />
      <Tips items={items} text={text} />
    </div>
  );
}

const urlRegex = /(https?:\/\/[^\s]+)/g;
const base64Regex = /data:image[^\s]+/g;

function placeEmbeds(text: string) {
  const linkSet = new Set<string>();
  const imageSet = new Set<string>();

  const newText = text
    .replace(urlRegex, (match) => {
      linkSet.add(match);
      return '[LINK]';
    })
    .replace(base64Regex, (match) => {
      imageSet.add(match);
      return '';
    })
    .trim();

  return { text: newText, links: [...linkSet], images: [...imageSet] };
}

function applySubstitutions(text: string) {
  let newText = text;

  for (const sub of Object.keys(EMOJI_SUBSTITUTIONS)) {
    newText = newText.replace(new RegExp(sub, 'i'), EMOJI_SUBSTITUTIONS[sub as keyof typeof EMOJI_SUBSTITUTIONS]);
  }

  return newText;
}

export default App;
