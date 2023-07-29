import { useMemo, useState } from 'react';
import { Modal } from '../components/modal/Modal';
import { play } from '../audio/audio';
import { copyToClipboard } from './copy-to-clipboard';
import { CodeBlock } from './CodeBlock';

type Props = {
  items: object[];
};

export const Exporter = (props: Props) => {
  const [show, setShow] = useState(false);

  const content = useMemo(() => JSON.stringify({ items: props.items }, null, 2), [props.items]);

  const onCopy = () => {
    play('CHECK');
    copyToClipboard(content);
  };

  return (
    <>
      <Modal show={show} onClose={() => setShow(false)}>
        <CodeBlock>{content}</CodeBlock>
        <button style={{ width: '80%' }} onClick={onCopy}>
          COPY
        </button>
      </Modal>
      <button onClick={() => setShow(true)}>Exporter</button>
    </>
  );
};
