import { useEffect, useState } from 'react';
import { useLocalStorage } from '../../hooks/use-local-storage.hook';
import { toast } from 'react-toastify';

interface AllTips {
  pressEnter: boolean;
  checkItem: boolean;
  removeItem: boolean;
  pasteLinks: boolean;
  pasteImages: boolean;
  shiftClickToEdit: boolean;
}

const initialState = {
  pressEnter: false,
  checkItem: false,
  removeItem: false,
  pasteLinks: false,
  pasteImages: false,
  shiftClickToEdit: false,
};

interface Props {
  items: object[];
  text: string;
}

const TIP_COOLDOWN = 5000;

export const Tips = ({ items, text }: Props) => {
  const { save, load } = useLocalStorage('bloco-tips');
  const [tips, setTips] = useState<AllTips>();
  const [lastTipTime, setLastTipTime] = useState(Date.now() - TIP_COOLDOWN);
  const [firstLoadFinished, setFirstLoadFinished] = useState(false);

  useEffect(() => {
    const existing = load();

    if (existing) {
      setTips(existing);
    } else {
      setTips(initialState);
    }
    setFirstLoadFinished(true);
  }, []);

  useEffect(() => {
    if (firstLoadFinished) {
      save(tips || {});
    }
  }, [tips]);

  const runTip = (check: () => boolean, tip: keyof AllTips, text: string) => {
    if (!check()) return false;
    toast(text, { icon: '💡', position: 'top-right', autoClose: 10000 });
    console.log(text);
    (setTips as any)((tt: any) => ({ ...tt, [tip]: true }));
    setLastTipTime(Date.now());
    return true;
  };

  useEffect(() => {
    if (Date.now() - lastTipTime < TIP_COOLDOWN) {
      return;
    }

    if (
      runTip(() => !!(text?.length && !tips?.pressEnter), 'pressEnter', 'Press ENTER to add a new item to the list.')
    ) {
      return;
    }

    if (
      runTip(
        () => !!(tips?.pressEnter && items.length && !tips?.checkItem),
        'checkItem',
        'Click on an item to check it off.',
      )
    ) {
      return;
    }

    if (
      runTip(
        () => !!(tips?.pressEnter && items.length && !tips?.removeItem),
        'removeItem',
        'You can right click an item to remove it.',
      )
    ) {
      return;
    }

    if (
      runTip(
        () => !!(tips?.pressEnter && tips?.removeItem && items.length && !tips?.shiftClickToEdit),
        'shiftClickToEdit',
        'You can SHIFT+click an item to edit it.',
      )
    ) {
      return;
    }

    if (
      runTip(
        () => !!(tips?.pressEnter && items.length && !tips?.pasteLinks),
        'pasteLinks',
        'If you paste a link it will be listed under the item.',
      )
    ) {
      return;
    }

    if (
      runTip(
        () => !!(tips?.pressEnter && items.length && !tips?.pasteImages),
        'pasteImages',
        'If you paste an image it will appear under the item.',
      )
    ) {
      return;
    }
  }, [text, items]);

  return null;
};
