import { ClipboardEvent } from 'react';

export function useOnPaste(pasted: (text: string) => void) {
  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (const index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        e.preventDefault();
        const blob = item.getAsFile()!;
        const reader = new FileReader();
        // reader.onload = (ev) => setText((t) => `${t} ${ev.target!.result}`);
        reader.onload = (ev) => pasted((ev.target!.result ?? '') as string);
        reader.readAsDataURL(blob);
      }
    }
  };

  return { onPaste };
}
