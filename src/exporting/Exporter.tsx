import { useMemo, useState } from 'react';
import { Modal } from '../components/modal/Modal';
import { play } from '../audio/audio';
import { copyToClipboard } from './copy-to-clipboard';

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
        <pre
          style={{
            height: '16rem',
            width: '100%',
            overflow: 'scroll',
            fontFamily: 'monospace',
            background: 'rgba(0, 0, 0, 0.05)',
            textAlign: 'left',
          }}
        >
          {content}
        </pre>
        <button style={{ width: '80%' }} onClick={onCopy}>
          COPY
        </button>
      </Modal>
      <button onClick={() => setShow(true)}>Exporter</button>
    </>
  );
};
