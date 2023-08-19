import { useMemo, useState } from 'react';
import { Modal } from '../../../components/modal/Modal';
import { play } from '../../../audio/audio';
import { copyToClipboard } from './copy-to-clipboard';
import { CodeBlock } from '../../../components/codeblock/CodeBlock';
import { toast } from 'react-toastify';

type Props = {
  items: object[];
};

export const Exporter = (props: Props) => {
  const [show, setShow] = useState(false);

  const content = useMemo(() => JSON.stringify({ items: props.items }, null, 2), [props.items]);
  const contentSizeInKb = useMemo(() => Math.round(content.length / 1024), [content]);

  const onCopy = () => {
    play('CHECK');
    copyToClipboard(content)
      .then(() => {
        toast.success('Exported items copied to clipboard');
        console.log('Bloco: exported content to clipboard.', `(${contentSizeInKb} KB)`);
      })
      .catch((err) => {
        console.error(err);
        console.log('Bloco: could not copy content to clipboard.', `(${contentSizeInKb} KB)`);
        toast.error('Could not copy to clipboard, please copy the contents manually');
      });
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
