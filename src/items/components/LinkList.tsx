import { FC } from 'react';

type Props = {
  links: string[];
};

export const LinkList: FC<Props> = ({ links }) => {
  if (!links.length) {
    return null;
  }

  return (
    <>
      {links.map((l, i) => (
        <span key={`link-${i}-${l.length}`}>
          🔗
          <a href={l} target="_blank" onClick={(e) => e.stopPropagation()} onContextMenu={(e) => e.stopPropagation()}>
            {l.replace(/(https?:\/\/|www\.)/g, '').substring(0, 25)}...
          </a>
          <br />
        </span>
      ))}
    </>
  );
};
